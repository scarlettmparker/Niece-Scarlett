#include "annotation.hpp"
#include "../utils.hpp"

namespace api::annotation
{
  int get_annotation_count(std::string_view text_id)
  {
    int count = 0;
    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      auto txn = postgres::begin_transaction(pool);

      pqxx::result r = txn->exec_prepared(
          "get_annotation_count", text_id);

      if (!r.empty())
      {
        count = r[0][0].as<int>();
      }
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error(std::string("Error getting annotation count: ") + e.what());
    }

    return count;
  }

  nlohmann::json select_annotations_data(std::string_view text_id, int page, int limit)
  {
    nlohmann::json annotations_data = nlohmann::json::array();
    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      auto txn = postgres::begin_transaction(pool);

      int offset = page * limit;

      pqxx::result r = txn->exec_prepared(
          "select_annotations_data",
          text_id, limit, offset);

      if (r.empty() || r[0][0].is_null())
      {
        utils::Logger::instance().info("No annotations found for text_id: " + std::string(text_id));
        return annotations_data;
      }

      annotations_data = nlohmann::json::parse(r[0][0].as<std::string>());
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error(std::string("Error executing query: ") + e.what());
    }
    catch (...)
    {
      utils::Logger::instance().error("Unknown error while executing query");
    }
    return annotations_data;
  }
}