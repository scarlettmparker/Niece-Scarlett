#include "hug.hpp"
#include <dpp/dpp.h>

namespace command {
  std::string HugCommand::name() const { return "hug"; }
  std::vector<std::string> HugCommand::alternatives() const { return {"can i have a hug", "i want a hug", "hug please", "where my hug at"}; }
  std::string HugCommand::permission() const { return "command.hug"; }
  dpp::message HugCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event) {
    std::string user_mention = "<@" + std::to_string(event.msg.author.id) + ">";
    std::string hug_message = "🤗💞✨ *big hug for you* " + user_mention + "!! ✨💖🤗💞\n";
    hug_message += "🌸💗🫂💖✨💞 *you're awesome!!* 💞✨💖🫂💗🌸";
    return dpp::message(event.msg.channel_id, hug_message);
  }
}

extern "C" command::CommandBase *create_hug_command() {
  return new command::HugCommand();
}
