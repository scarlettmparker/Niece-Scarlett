#include "hug.hpp"

namespace command
{
  std::string HugCommand::name() const
  {
    utils::Logger::instance().debug("HugCommand::name() called");
    return "hug";
  }
  std::vector<std::string> HugCommand::alternatives() const
  {
    utils::Logger::instance().debug("HugCommand::alternatives() called");
    return {"can i have a hug", "i want a hug", "hug please", "where my hug at"};
  }
  std::string HugCommand::permission() const
  {
    utils::Logger::instance().debug("HugCommand::permission() called");
    return "bot.command.hug";
  }
  dpp::message HugCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    utils::Logger::instance().debug("HugCommand::execute called with cmd: " + cmd);
    std::string hug_message = "🤗💞✨ big hug for you!! ✨💖🤗💞\n";
    hug_message += "🌸💗🫂💖✨💞 you're wonderful!! wow 💞✨💖🫂💗🌸";
    utils::Logger::instance().info("Sending hug message to channel: " + std::to_string(event.msg.channel_id));
    return dpp::message(event.msg.channel_id, hug_message);
  }
}

extern "C" command::CommandBase *create_hug_command()
{
  utils::Logger::instance().debug("create_hug_command() called");
  return new command::HugCommand();
}
