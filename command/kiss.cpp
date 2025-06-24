#include "kiss.hpp"

namespace command
{
  std::string KissCommand::name() const { return "kiss"; }
  std::vector<std::string> KissCommand::alternatives() const { return {"kiss"}; }
  std::string KissCommand::permission() const { return "command.kiss"; }
  dpp::message KissCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    auto result = PingFactory::parse_ping(cmd);
    if (!result.user_id.has_value())
      return dpp::message(event.msg.channel_id, "Please tag a user to kiss.");
    dpp::snowflake user_id = std::stoull(result.user_id.value());
    DirectMessageFactory::send_dm(bot, user_id, "✨ 💫 💗 🧚‍♀️ 💖 HEEEEY !! 💖 ✨ 🌸 💞\n... 🫦 mwah 💋 💖 🌟 ✨ 🫃 🫃 🫃\n",
                                  [channel_id = event.msg.channel_id, &bot](bool success)
                                  {
                                    if (!success)
                                      bot.message_create(dpp::message(channel_id, "😢 💔 sorry bb i can't message this person 😢"));
                                    else
                                      bot.message_create(dpp::message(channel_id, "💋 kissed!!! 💖 🫃"));
                                  });
    return dpp::message();
  }
}

extern "C" command::CommandBase *create_kiss_command()
{
  return new command::KissCommand();
}
