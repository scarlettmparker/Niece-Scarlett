#pragma once

#include <string>
#include <vector>
#include <algorithm>
#include <pqxx/pqxx>
#include "../postgres.hpp"
#include "../utils.hpp"

namespace api::role
{
  /**
   * @brief Enum representing the user's permission status.
   */
  enum class PermissionStatus
  {
    NO_ACCOUNT = 0,     ///< Discord ID not found in database
    AUTHORISED = 1,     ///< User has the required permission
    NOT_AUTHORISED = 2, ///< User exists but lacks required permission
    BANNED = 3          ///< User is banned
  };

  /**
   * @brief Retrieves a list of permissions associated with a user based on their Discord ID.
   *
   * This function performs a PostgreSQL query using the provided Discord ID
   * to look up the user's roles and their associated permissions.
   *
   * @param discord_id The Discord user ID as a string.
   * @return A vector of permission strings associated with the user's roles.
   */
  std::vector<std::string> get_user_permissions_by_discord_id(const std::string &discord_id);

  /**
   * @brief Checks the user's permission status based on their Discord ID and required permission.
   *
   * Supports exact match as well as hierarchical wildcard checks.
   * For example, if the required permission is "bot.command.language_transfer",
   * this function will return true if any of the following are in the user's permissions:
   * - "bot.command.language_transfer"
   * - "bot.command.*"
   * - "bot.*"
   * - "*"
   *
   * @param discord_id The user's Discord ID.
   * @param required_permission The permission string to check.
   * @return The status as a PermissionStatus enum value.
   */
  PermissionStatus check_permission_status(const std::string &discord_id, const std::string &required_permission);
}
