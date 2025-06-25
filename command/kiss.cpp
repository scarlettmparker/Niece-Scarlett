#include "kiss.hpp"

namespace command
{
  std::string KissCommand::name() const
  {
    utils::Logger::instance().debug("KissCommand::name() called");
    return "kiss";
  }
  std::vector<std::string> KissCommand::alternatives() const
  {
    utils::Logger::instance().debug("KissCommand::alternatives() called");
    return {"kiss"};
  }
  std::string KissCommand::permission() const
  {
    utils::Logger::instance().debug("KissCommand::permission() called");
    return "bot.command.kiss";
  }
  dpp::message KissCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    utils::Logger::instance().debug("KissCommand::execute called with cmd: " + cmd);
    auto result = PingFactory::parse_ping(cmd);
    if (!result.user_id.has_value())
    {
      utils::Logger::instance().info("No user tagged in kiss command");
      return dpp::message(event.msg.channel_id, "Please tag a user to kiss.");
    }
    dpp::snowflake user_id = std::stoull(result.user_id.value());
    utils::Logger::instance().info("Sending kiss DM to user_id: " + std::to_string(user_id));
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
  utils::Logger::instance().debug("create_kiss_command() called");
  return new command::KissCommand();
}
