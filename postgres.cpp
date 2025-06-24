#include "postgres.hpp"

namespace postgres
{
  static ConnectionPool *global_pool = nullptr;
  std::unordered_map<pqxx::connection *, ConnectionMetadata> connection_metadata;
  thread_local std::shared_ptr<pqxx::connection> cached_connection;
  thread_local std::chrono::steady_clock::time_point last_used;
  thread_local std::unique_ptr<pqxx::work> current_txn;

  /**
   * Create a new connection for the connection pool.
   * @return New connection.
   */
  pqxx::connection *ConnectionPool::create_new_connection()
  {
    auto c = new pqxx::connection(
        "user=" + std::string(BOT_DB_USERNAME) +
        " password=" + std::string(BOT_DB_PASSWORD) +
        " host=" + std::string(BOT_DB_HOST) +
        " port=" + std::string(BOT_DB_PORT) +
        " dbname=" + std::string(BOT_DB_NAME) +
        " target_session_attrs=read-write" +
        " keepalives=1" +
        " keepalives_idle=30");

    if (!c->is_open())
    {
      utils::Logger::instance().error("Failed to open PostgreSQL connection!");
      delete c;
      throw std::runtime_error("Failed to open PostgreSQL connection!");
    }

    pqxx::work txn(*c);

    txn.conn().prepare("get_annotation_count",
                       "SELECT COUNT(*) FROM public.\"Annotation\" WHERE text_id = $1");

    txn.conn().prepare("select_annotations_data",
                       "SELECT array_to_json(array_agg(row_to_json(t))) "
                       "FROM ("
                       "  SELECT json_build_object("
                       "           'id', a.id::integer,"
                       "           'description', a.description::text,"
                       "           'created_at', a.created_at,"
                       "           'likes', COALESCE(SUM(CASE WHEN uai.type = 'LIKE' THEN 1 ELSE 0 END), 0),"
                       "           'dislikes', COALESCE(SUM(CASE WHEN uai.type = 'DISLIKE' THEN 1 ELSE 0 END), 0),"
                       "           'username', u.username,"
                       "           'text_snippet', "
                       "             SUBSTRING("
                       "               REGEXP_REPLACE(t.text, '<[^>]*>', '', 'g') "
                       "               FROM a.start + 1 FOR (a.\"end\" - a.start)"
                       "             )"
                       "         ) as annotation,"
                       "         json_build_object("
                       "           'id', u.id,"
                       "           'username', u.username"
                       "         ) as author "
                       "  FROM public.\"Annotation\" a"
                       "  LEFT JOIN public.\"User\" u ON a.user_id = u.id"
                       "  LEFT JOIN public.\"UserAnnotationInteraction\" uai ON a.id = uai.annotation_id"
                       "  LEFT JOIN public.\"Text\" t ON a.text_id = t.id"
                       "  WHERE a.text_id = $1 "
                       "  GROUP BY a.id, a.start, a.\"end\", a.text_id, a.description, a.created_at, u.id, u.username, t.text"
                       "  ORDER BY a.start ASC"
                       "  LIMIT $2 OFFSET $3"
                       ") t");

    txn.commit();
    return c;
  }

  /**
   * Create a new connection pool with a given size.
   * @param size Size of the connection pool.
   */
  ConnectionPool::ConnectionPool(int size) : max_size(size)
  {
    for (int i = 0; i < size; ++i)
    {
      pool.push(create_new_connection());
    }
    utils::Logger::instance().info("Connection pool created");
  }

  /**
   * Destroy the connection pool and free all connections.
   */
  ConnectionPool::~ConnectionPool()
  {
    utils::Logger::instance().info("Destroying connection pool");
    std::lock_guard<std::mutex> lock(pool_mutex);
    while (!pool.empty())
    {
      auto c = pool.front();
      pool.pop();
      delete c;
    }
    connection_metadata.clear();
    utils::Logger::instance().info("Connection pool destroyed");
  }

  /**
   * Validate a connection by executing a simple query.
   * @param conn Connection to validate.
   */
  int ConnectionPool::validate_connection(pqxx::connection *c)
  {
    try
    {
      return c->is_open();
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error(std::string("Exception during connection validation: ") + e.what());
      return false;
    }
    catch (...)
    {
      utils::Logger::instance().error("Unknown exception during connection validation");
      return false;
    }
  }

  /**
   * Acquire a connection from the pool. This function will block until a connection is available.
   * If a connection is not used for more than 1 minute, it will be released.
   *
   * @return Connection from the pool.
   */
  pqxx::connection *ConnectionPool::acquire()
  {
    utils::Logger::instance().debug("Acquiring connection from pool");
    pqxx::connection *c = nullptr;
    auto now = std::chrono::steady_clock::now();

    {
      std::unique_lock<std::mutex> lock(pool_mutex);
      bool got_connection = pool_cv.wait_for(
          lock, std::chrono::milliseconds(ACQUIRE_TIMEOUT_MS), [this]
          { return !pool.empty(); });

      if (!got_connection)
      {
        failed_acquires++;
        utils::Logger::instance().error("Connection pool timeout");
        throw std::runtime_error("Connection pool timeout");
      }

      c = pool.front();
      pool.pop();
      active_connections++;
    }

    for (int retry = 0; retry < MAX_RETRIES; retry++)
    {
      // ... health check ...
      ConnectionMetadata &metadata = connection_metadata[c];
      const auto connection_age = std::chrono::duration_cast<std::chrono::minutes>(
                                      now - metadata.last_used)
                                      .count();
      const auto last_health_check = std::chrono::duration_cast<std::chrono::seconds>(
                                         now - metadata.last_checked)
                                         .count();

      if (connection_age > CONNECTION_LIFETIME_MIN || last_health_check > HEALTH_CHECK_INTERVAL_SEC)
      {
        metadata.is_healthy = validate_connection(c);
        metadata.last_checked = now;

        if (!metadata.is_healthy)
        {
          utils::Logger::instance().error("Connection not healthy, recreating");
          delete c;
          try
          {
            // ... attempt to create a new connection ...
            c = create_new_connection();
            connection_metadata[c] = {now, now, true};
            utils::Logger::instance().info("Recreated unhealthy connection");
            return c;
          }
          catch (const std::exception &e)
          {
            utils::Logger::instance().error(std::string("Failed to recreate connection: ") + e.what());
            if (retry == MAX_RETRIES - 1)
            {
              active_connections--;
              throw;
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(100 * (retry + 1)));
            continue;
          }
        }
      }
      metadata.last_used = now;
      utils::Logger::instance().debug("Connection acquired from pool");
      return c;
    }

    active_connections--;
    utils::Logger::instance().error("Failed to acquire connection after retries");
    throw std::runtime_error("Failed to acquire connection");
  }

  /**
   * Release a connection back to the pool.
   * @param c Connection to release.
   */
  void ConnectionPool::release(pqxx::connection *c)
  {
    utils::Logger::instance().debug("Releasing connection back to pool");
    std::lock_guard<std::mutex> lock(pool_mutex);
    if (active_connections > 0)
    {
      active_connections--;
    }
    pool.push(c);
    pool_cv.notify_one();
    utils::Logger::instance().debug("Connection released");
  }

  /**
   * Initialize the global connection pool.
   */
  void init_connection()
  {
    if (!global_pool)
    {
      global_pool = new ConnectionPool(std::max(2u, std::thread::hardware_concurrency()));
    }
    utils::Logger::instance().info("Postgres connection pool initialized with " + std::to_string(global_pool->max_size) + " connections.");
  }

  /**
   * Get the global connection pool.
   * @return Global connection pool.
   */
  ConnectionPool &get_connection_pool()
  {
    if (!global_pool)
    {
      utils::Logger::instance().error("Connection pool not initialized. Call init_connection first.");
      throw std::runtime_error("Connection pool not initialized. Call init_connection first.");
    }
    return *global_pool;
  }

  /**
   * Begin a transaction with the database.
   * This function will create a new connection if one does not exist or if the current connection is stale.
   * @param pool Connection pool to get a connection from.
   * @return Transaction object for the database.
   */
  std::unique_ptr<pqxx::work> begin_transaction(postgres::ConnectionPool &pool)
  {
    utils::Logger::instance().debug("Beginning new transaction");
    std::shared_ptr<pqxx::connection> conn(pool.acquire(), [&pool](pqxx::connection *c)
                                           { pool.release(c); });
    return std::make_unique<pqxx::work>(*conn);
  }
}