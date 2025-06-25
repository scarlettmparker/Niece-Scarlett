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

  PermissionStatus check_permission_status(const std::string &discord_id, const std::string &required_permission)
  {
    utils::Logger::instance().debug("Checking permission status for: " + discord_id);

    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      auto txn = postgres::begin_transaction(pool);

      // First, check if the user exists and fetch their status
      pqxx::result user_status_res = txn->exec_prepared(
          "get_user_status_by_discord_id",
          discord_id);

      if (user_status_res.empty())
      {
        utils::Logger::instance().info("User not found in DB: " + discord_id);
        return PermissionStatus::NO_ACCOUNT;
      }

      std::string user_status = user_status_res[0][0].as<std::string>();
      if (user_status == "BANNED")
      {
        utils::Logger::instance().debug("User is banned: " + discord_id);
        return PermissionStatus::BANNED;
      }

      // Fetch permissions
      std::vector<std::string> permissions = get_user_permissions_by_discord_id(discord_id);

      // Check permission logic
      if (permissions.empty())
      {
        utils::Logger::instance().info("User has no permissions: " + discord_id);
        return PermissionStatus::NOT_AUTHORISED;
      }

      // Exact match
      if (std::find(permissions.begin(), permissions.end(), required_permission) != permissions.end())
        return PermissionStatus::AUTHORISED;

      // Wildcard match
      std::string prefix = required_permission;
      while (true)
      {
        size_t pos = prefix.rfind('.');
        if (pos == std::string::npos)
          break;

        prefix = prefix.substr(0, pos);
        std::string wildcard = prefix + ".*";
        if (std::find(permissions.begin(), permissions.end(), wildcard) != permissions.end())
          return PermissionStatus::AUTHORISED;
      }

      if (std::find(permissions.begin(), permissions.end(), "*") != permissions.end())
        return PermissionStatus::AUTHORISED;

      return PermissionStatus::NOT_AUTHORISED;
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error("Error during permission check: " + std::string(e.what()));
      return PermissionStatus::NOT_AUTHORISED;
    }
  }
}