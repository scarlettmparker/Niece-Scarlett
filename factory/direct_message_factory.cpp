#include "direct_message_factory.hpp"

void DirectMessageFactory::send_dm(dpp::cluster &bot, dpp::snowflake user_id, const std::string &content, std::function<void(bool)> callback)
{
  utils::Logger::instance().debug("Sending DM to user_id: " + std::to_string(user_id) + ", content: " + content);
  bot.direct_message_create(user_id, dpp::message(content),
                            [&bot, cb = std::move(callback), user_id](const dpp::confirmation_callback_t &result) mutable
                            {
                              if (result.is_error())
                              {
                                utils::Logger::instance().error("Failed to send DM to user_id: " + std::to_string(user_id) + ", error: " + result.get_error().message);
                              }
                              else
                              {
                                utils::Logger::instance().debug("Successfully sent DM to user_id: " + std::to_string(user_id));
                              }
                              cb(!result.is_error());
                            });
}
