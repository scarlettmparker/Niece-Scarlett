#include "command.hpp"

namespace command
{
  dpp::message registered_command(dpp::cluster &bot, std::string &command, const dpp::message_create_t &event)
  {
    static bool initialized = false;
    if (!initialized)
    {
      utils::Logger::instance().info("Initializing command registry from plugins");
      CommandRegistry::instance().build_from_plugins();
      initialized = true;
      utils::Logger::instance().info("Command registry initialized");
    }
    std::string matched_alias;
    CommandBase *cmd = CommandRegistry::instance().find_matching_command(command, matched_alias);
    if (cmd)
    {
      utils::Logger::instance().info("Matched command: " + matched_alias + ", permission required: " + cmd->permission());
      // TODO: Check permissions here if needed
      return cmd->execute(bot, command, event);
    }
    utils::Logger::instance().info("No matching command found for: " + command);
    // Do not send any message if command is not found
    return dpp::message();
  }
}