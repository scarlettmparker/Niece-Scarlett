#include "language_transfer.hpp"
#include "../utils.hpp"

namespace command
{
  std::string LanguageTransferCommand::name() const { return "language_transfer"; }
  std::vector<std::string> LanguageTransferCommand::alternatives() const { return {"lt", "what is language transfer", "what is lt", "explain language transfer", "explain lt"}; }
  std::string LanguageTransferCommand::permission() const { return "command.language_transfer"; }
  dpp::message LanguageTransferCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event)
  {
    utils::Logger::instance().debug("LanguageTransferCommand::execute called with cmd: " + cmd);

    factory::EmbedFactory()
        .set_command("lt")
        .set_title("What is Language Transfer?")
        .add_paragraph("Language Transfer is an audio series that teaches the basics of Modern Greek in a natural and easy-to-comprehend manner. It focuses on grammar and teaches useful vocabulary to prepare you for everyday conversations.")
        .add_paragraph("It's highly encouraged to check it out, as it will help you build a very solid foundation to communicate in Greek.")
        .add_heading("The complete series can be found on:")
        .add_paragraph("- [YouTube](https://www.youtube.com/watch?v=dHsgJkV9J30&list=PLeA5t3dWTWvtWkl4oOV8J9SMB7L9N9Ogt)\n- [SoundCloud](https://soundcloud.com/languagetransfer/sets/complete-greek-more-audios)\n- [Transcript (PDF)](https://static1.squarespace.com/static/5c69bfa4f4e531370e74fa44/t/5d03d32873f6f10001a364b5/1560531782855/COMPLETE+GREEK+-+Transcripts_LT.pdf)")
        .add_paragraph("The audio series follows the teacher (Mihalis) as he teaches a student useful grammatical constructions and how to form sentences naturally, allowing you to follow along by putting yourself in the student’s shoes.")
        .add_paragraph("More useful resources can be found in [the resources channel](https://discord.com/channels/350234668680871946/359578025228107776/1132288734738522112), notably in the pins, to help you advance your Greek level after Language Transfer.")
        .send(event);
    return dpp::message();
  }
}

extern "C" command::CommandBase *create_language_transfer_command()
{
  return new command::LanguageTransferCommand();
}
