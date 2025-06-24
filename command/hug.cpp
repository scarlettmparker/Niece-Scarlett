#include "hug.hpp"
#include <dpp/dpp.h>
#include "../utils.hpp"

namespace command {
  std::string HugCommand::name() const { return "hug"; }
  std::vector<std::string> HugCommand::alternatives() const { return {"can i have a hug", "i want a hug", "hug please", "where my hug at"}; }
  std::string HugCommand::permission() const { return "command.hug"; }
  dpp::message HugCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event) {
    utils::Logger::instance().debug("HugCommand::execute called with cmd: " + cmd);
    std::string hug_message = "🤗💞✨ big hug for you!! ✨💖🤗💞\n";
    hug_message += "🌸💗🫂💖✨💞 you're wonderful!! wow 💞✨💖🫂💗🌸";
    return dpp::message(event.msg.channel_id, hug_message);
  }
}

extern "C" command::CommandBase *create_hug_command() {
  return new command::HugCommand();
}
