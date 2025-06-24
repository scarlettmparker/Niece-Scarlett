#include "love.hpp"

namespace command
{
  std::string LoveCommand::name() const { return "love"; }
  std::vector<std::string> LoveCommand::alternatives() const { return {"i love you", "i love u", "i love you mwah", "i love u mwah"}; }
  std::string LoveCommand::permission() const { return "command.love"; }
  dpp::message LoveCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    return dpp::message(event.msg.channel_id, "i love u too mwah");
  }
}

extern "C" command::CommandBase *create_love_command()
{
  return new command::LoveCommand();
}
