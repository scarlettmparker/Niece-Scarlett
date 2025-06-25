#pragma once

#include "../postgres.hpp"
#include "../utils.hpp"
#include <pqxx/pqxx>
#include <dpp/dpp.h>
#include <vector>
#include <string>

namespace api::level
{

  /**
   * Gets the role IDs of a user from a guild.
   * @param bot The Discord bot cluster.
   * @param guild_id The guild ID.
   * @param user_id The user ID.
   * @param callback A function called with the role IDs on success.
   */
  void get_user_roles(const dpp::cluster &bot, dpp::snowflake guild_id, dpp::snowflake user_id,
                           std::function<void(std::vector<std::string>)> callback);

  /**
   * Updates the "levels" field in the User table with the given roles.
   * @param discord_id The Discord user ID.
   * @param roles A list of role names to set in the "levels" column.
   */
  void update_user_levels_in_db(const std::string &discord_id, const std::vector<std::string> &roles);

  /**
   * Convenience function: Gets roles for a user and updates their levels in DB.
   * @param bot The Discord bot cluster.
   * @param guild_id The guild ID.
   * @param user_id The user ID.
   */
  void update_user_levels_from_roles(dpp::cluster &bot, dpp::snowflake guild_id, dpp::snowflake user_id);
}
