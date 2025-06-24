#include "annotation.hpp"

namespace api::annotation
{
  nlohmann::json select_annotations_data(std::string_view text_id, bool verbose)
  {
    nlohmann::json annotations_data = nlohmann::json::array();
    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      pqxx::work &txn = postgres::begin_transaction(pool);

      pqxx::result r = txn.exec_prepared(
          "select_annotations_data",
          text_id);

      if (r.empty() || r[0][0].is_null())
      {
        verbose &&std::cout << "No annotations found for text_id: " << text_id << std::endl;
        return annotations_data;
      }

      annotations_data = nlohmann::json::parse(r[0][0].as<std::string>());
    }
    catch (const std::exception &e)
    {
      verbose &&std::cerr << "Error executing query: " << e.what() << std::endl;
    }
    catch (...)
    {
      verbose &&std::cerr << "Unknown error while executing query" << std::endl;
    }
    return annotations_data;
  }
}