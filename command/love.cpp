#include "love.hpp"

namespace command
{
  std::string LoveCommand::name() const
  {
    utils::Logger::instance().debug("LoveCommand::name() called");
    return "love";
  }
  std::vector<std::string> LoveCommand::alternatives() const
  {
    utils::Logger::instance().debug("LoveCommand::alternatives() called");
    return {"i love you", "i love u", "i love you mwah", "i love u mwah"};
  }
  std::string LoveCommand::permission() const
  {
    utils::Logger::instance().debug("LoveCommand::permission() called");
    return "bot.command.love";
  }
  dpp::message LoveCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    utils::Logger::instance().debug("LoveCommand::execute called with cmd: " + cmd);
    utils::Logger::instance().info("Sending love message to channel: " + std::to_string(event.msg.channel_id));
    return dpp::message(event.msg.channel_id, "i love u too mwah");
  }
}

extern "C" command::CommandBase *create_love_command()
{
  utils::Logger::instance().debug("create_love_command() called");
  return new command::LoveCommand();
}
