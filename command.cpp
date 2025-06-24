#include "command.hpp"
#include <algorithm>
#include <cctype>

namespace command
{
  dpp::message registered_command(dpp::cluster &bot, std::string &command, const dpp::message_create_t &event)
  {
    static bool initialized = false;
    if (!initialized)
    {
      CommandRegistry::instance().build_from_plugins();
      initialized = true;
    }
    std::string matched_alias;
    CommandBase *cmd = CommandRegistry::instance().find_matching_command(command, matched_alias);
    if (cmd)
    {
      std::cout << "Permission required: " << cmd->permission() << std::endl;
      // TODO: Check permissions here if needed
      return cmd->execute(bot, command, event);
    }
    return dpp::message(event.msg.channel_id, "i don't know this command :(");
  }
}