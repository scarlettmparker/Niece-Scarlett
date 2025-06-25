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
      std::string discord_id = std::to_string(event.msg.author.id);
      std::string required_perm = cmd->permission();

      api::role::PermissionStatus status = api::role::check_permission_status(discord_id, required_perm);

      switch (status)
      {
      case api::role::PermissionStatus::NO_ACCOUNT:
        return dpp::message(event.msg.channel_id,
                            "You are not registered to Guided Reader. Please register at https://reader.scarlettparker.co.uk");

      case api::role::PermissionStatus::BANNED:
        return dpp::message(event.msg.channel_id,
                            "You have been banned and are thereby restricted from using any commands.");

      case api::role::PermissionStatus::NOT_AUTHORISED:
        return dpp::message(event.msg.channel_id,
                            "😢 💔 you don't have permission to use this command 😢");

      case api::role::PermissionStatus::AUTHORISED:
        return cmd->execute(bot, command, event);
      }
    }

    // Do not send any message if command is not found
    utils::Logger::instance().info("No matching command found for: " + command);
    return dpp::message();
  }
}