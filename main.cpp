#include <iostream>
#include <string>
#include <thread>
#include <dpp/dpp.h>
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
    utils::Logger::instance().debug("Received message: " + message);
    if (message.length() >= prefix.length() && std::equal(prefix.begin(), prefix.end(), message.begin(), [](char a, char b)
    { 
      return std::tolower(a) == std::tolower(b);
    }))
    {
      std::string command = message.substr(prefix.length());
      utils::Logger::instance().info("Command received: " + command);
      bot.message_create(command::registered_command(bot, command, event));
    } });

  // bot.on_guild_member_update([&bot](const dpp::guild_member_update_t &event)
  //                            {
  //   const auto guild_id = event.updating_guild.id;
  //   const auto user_id = event.updated.user_id;

  //   bot.guild_auditlog_get(guild_id, 0,
  //     static_cast<uint32_t>(dpp::audit_type::aut_member_role_update),
  //     0, 0, 1, [user_id](const dpp::confirmation_callback_t & callback)
  //     {
  //       if (callback.is_error())
  //       {
  //         std::cerr << "Error: Failed to retrieve audit log - "
  //           << callback.get_error().message << '\n';
  //         return;
  //       }

  //       const auto & audit_log = std::get<dpp::auditlog>(callback.value);
  //       if (audit_log.entries.empty())
  //       {
  //         return;
  //       }

  //       const auto & entry = audit_log.entries.front();
  //       for (const auto& change : entry.changes)
  //       {
  //         std::cout << "Member " << user_id << ' ';

  //         if (change.key == "$add")
  //         {
  //           /* user has been added a role, send the server side event here */
  //           /* e.g. socket.send_message("role has been added")*/
  //         }
  //         else if (change.key == "$remove")
  //         {
  //           /* user has been removed a role, send the server side event here */
  //           /* e.g. socket.send_message("role has been removed")*/
  //         }
  //         else
  //         {
  //           continue;
  //         }
  //         std::cout << " role " << change.new_value << '\n';
  //       }
  //     }
  //   ); });

  utils::Logger::instance().info("Starting bot...");
  bot.on_ready([](const dpp::ready_t &event)
               { utils::Logger::instance().info("Bot is ready!"); });

  bot.start(dpp::st_wait);
  return 0;
}