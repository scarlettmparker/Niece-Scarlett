#include "role.hpp"
#include "../utils.hpp"

namespace api::role
{
  std::vector<std::string> get_user_permissions_by_discord_id(const std::string &discord_id)
  {
    utils::Logger::instance().debug("Fetching permissions for discord_id: " + discord_id);
    std::vector<std::string> permissions;
    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      auto txn = postgres::begin_transaction(pool);

      pqxx::result r = txn->exec_prepared("get_user_permissions_by_discord_id", discord_id);

      for (const auto &row : r)
      {
        permissions.emplace_back(row[0].as<std::string>());
        utils::Logger::instance().debug("Fetched permission: " + permissions.back());
      }
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error("Error getting user permissions: " + std::string(e.what()));
    }
    utils::Logger::instance().debug("Total permissions fetched: " + std::to_string(permissions.size()));
    return permissions;
  }

  bool has_permission(const std::vector<std::string> &user_permissions, const std::string &required_permission)
  {
    utils::Logger::instance().debug("Checking permission: " + required_permission);
    if (user_permissions.empty())
    {
      utils::Logger::instance().info("User has no permissions");
      return false;
    }

    // Exact match
    if (std::find(user_permissions.begin(), user_permissions.end(), required_permission) != user_permissions.end())
    {
      utils::Logger::instance().debug("Permission granted by exact match: " + required_permission);
      return true;
    }

    // Check wildcard hierarchy
    std::string permission_prefix = required_permission;
    while (true)
    {
      size_t pos = permission_prefix.rfind('.');
      if (pos == std::string::npos)
        break;

      permission_prefix = permission_prefix.substr(0, pos);
      std::string wildcard = permission_prefix + ".*";
      if (std::find(user_permissions.begin(), user_permissions.end(), wildcard) != user_permissions.end())
      {
        utils::Logger::instance().debug("Permission granted by wildcard: " + wildcard);
        return true;
      }
    }

    // Check top-level *
    if (std::find(user_permissions.begin(), user_permissions.end(), "*") != user_permissions.end())
    {
      utils::Logger::instance().debug("Permission granted by top-level wildcard");
      return true;
    }

    utils::Logger::instance().info("Permission denied: " + required_permission);
    return false;
  }
}