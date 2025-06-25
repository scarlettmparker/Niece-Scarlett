#include "level.hpp"

namespace api::level
{
  void get_user_roles(dpp::cluster &bot, dpp::snowflake guild_id, dpp::snowflake user_id,
                      std::function<void(std::vector<dpp::snowflake>)> callback)
  {
    bot.guild_get_member(guild_id, user_id, [user_id, callback](const dpp::confirmation_callback_t &cb)
                         {
      if (cb.is_error()) {
        utils::Logger::instance().error("Failed to fetch guild member: " + cb.get_error().message);
        callback({});
        return;
      }

      const auto &member = std::get<dpp::guild_member>(cb.value);
      std::vector<dpp::snowflake> role_ids = member.get_roles();

      callback(role_ids); });
  }

  void update_user_levels_in_db(const std::string &discord_id, const std::vector<std::string> &roles)
  {
    if (roles.empty())
    {
      utils::Logger::instance().info("Skipping DB update: roles list is empty for user " + discord_id);
      return;
    }

    try
    {
      postgres::ConnectionPool &pool = postgres::get_connection_pool();
      auto txn = postgres::begin_transaction(pool);

      std::string levels_array = utils::to_pg_array_string(roles);
      txn->exec_prepared("update_user_levels", discord_id, levels_array);
      txn->commit();

      utils::Logger::instance().info("Successfully updated levels for Discord ID " + discord_id);
    }
    catch (const std::exception &e)
    {
      utils::Logger::instance().error("Failed to update user levels: " + std::string(e.what()));
    }
  }

  void update_user_levels_from_roles(dpp::cluster &bot, dpp::snowflake guild_id, dpp::snowflake user_id)
  {
    get_user_roles(bot, guild_id, user_id, [user_id](const std::vector<dpp::snowflake> &roles)
                   { 
                     std::vector<std::string> role_ids_str;
                     for (const auto& id : roles) {
                       role_ids_str.push_back(id.str());
                     }
                     update_user_levels_in_db(user_id.str(), role_ids_str); });
  }
} // namespace api::level
