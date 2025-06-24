#include "direct_message_factory.hpp"
#include <functional>

void DirectMessageFactory::send_dm(dpp::cluster &bot, dpp::snowflake user_id, const std::string &content, std::function<void(bool)> callback)
{
  bot.direct_message_create(user_id, dpp::message(content),
                            [&bot, cb = std::move(callback)](const dpp::confirmation_callback_t &result) mutable
                            {
                              cb(!result.is_error());
                            });
}
