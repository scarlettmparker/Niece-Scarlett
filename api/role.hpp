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
   * @brief Retrieves a list of permissions associated with a user based on their Discord ID.
   *
   * This function performs a PostgreSQL query using the provided Discord ID
   * to look up the user's roles and their associated permissions.
   *
   * @param discord_id The Discord user ID as a string.
   * @return A vector of permission strings associated with the user's roles.
   */
  std::vector<std::string> get_user_permissions_by_discord_id(const std::string& discord_id);

  /**
   * @brief Checks if a user has the required permission.
   *
   * Supports exact match as well as hierarchical wildcard checks.
   * For example, if the required permission is "bot.command.language_transfer",
   * this function will return true if any of the following are in the user's permissions:
   * - "bot.command.language_transfer"
   * - "bot.command.*"
   * - "bot.*"
   * - "*"
   *
   * @param user_permissions A list of permission strings the user possesses.
   * @param required_permission The permission required to perform an action.
   * @return true if the user has the required permission (directly or via wildcard), false otherwise.
   */
  bool has_permission(const std::vector<std::string>& user_permissions, const std::string& required_permission);
}
