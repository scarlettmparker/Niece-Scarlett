#ifndef DIRECT_MESSAGE_FACTORY_HPP
#define DIRECT_MESSAGE_FACTORY_HPP
#include <dpp/dpp.h>
#include <string>
#include <functional>

/**
 * Factory for sending direct messages.
 */
class DirectMessageFactory
{
public:
  /**
   * Sends a DM and calls the callback with true if successful, false otherwise.
   * @param bot The DPP cluster.
   * @param user_id The user to DM.
   * @param content The message content.
   * @param callback Callback for result.
   */
  static void send_dm(dpp::cluster &bot, dpp::snowflake user_id, const std::string &content, std::function<void(bool)> callback);
};

#endif // DIRECT_MESSAGE_FACTORY_HPP
