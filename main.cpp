#include <iostream>
#include <string>
#include <thread>
#include <dpp/dpp.h>
#include "api/level.hpp"
#include "config.h"
#include "command.hpp"
#include "postgres.hpp"
#include "utils.hpp"

int main()
{
  utils::Logger::instance().initialize_from_env();
  utils::Logger::instance().info("Logger initialized from environment");
  const std::string_view prefix = "niece scarlett ";
  postgres::init_connection();
  utils::Logger::instance().info("Postgres connection initialized");
  std::cout << BOT_BOT_TOKEN << std::endl;
  dpp::cluster bot(BOT_BOT_TOKEN, dpp::i_message_content | dpp::i_default_intents | dpp::i_guild_members);

  /**
   *
   */
  bot.on_message_create([&prefix, &bot](const dpp::message_create_t &event)
                        {
    std::string message = event.msg.content;
    if (message.length() >= prefix.length() && std::equal(prefix.begin(), prefix.end(), message.begin(), [](char a, char b)
    { 
      return std::tolower(a) == std::tolower(b);
    }))
    {
      std::string command = message.substr(prefix.length());
      utils::Logger::instance().info("Command received: " + command);
      bot.message_create(command::registered_command(bot, command, event));
    } });

  /**
   *
   */
  bot.on_guild_member_update([&bot](const dpp::guild_member_update_t &event)
                             { api::level::update_user_levels_from_roles(bot, event.updating_guild.id, event.updated.user_id); });

  utils::Logger::instance().info("Starting bot...");
  bot.on_ready([](const dpp::ready_t &event)
               { utils::Logger::instance().info("Bot is ready!"); });

  bot.start(dpp::st_wait);
  return 0;
}