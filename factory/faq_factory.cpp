#include "faq_factory.hpp"

namespace factory
{
  FaqFactory &FaqFactory::set_command(const std::string &command_name)
  {
    this->command = command_name;
    return *this;
  }

  FaqFactory &FaqFactory::set_title(const std::string &title_text)
  {
    this->title = title_text;
    return *this;
  }

  FaqFactory &FaqFactory::add_heading(const std::string &heading_text)
  {
    this->description += "**" + heading_text + "**\n\n";
    return *this;
  }

  FaqFactory &FaqFactory::add_paragraph(const std::string &paragraph_text)
  {
    this->description += paragraph_text + "\n\n";
    return *this;
  }

  FaqFactory &FaqFactory::set_footer(const std::string &text)
  {
    this->footer.set_text(text);
    return *this;
  }

  dpp::embed FaqFactory::build()
  {
    dpp::embed embed;
    embed.set_title(this->title);
    embed.set_description(this->description);
    if (!this->footer.text.empty())
    {
      embed.set_footer(this->footer);
    }
    return embed;
  }

  void FaqFactory::send(const dpp::message_create_t &event)
  {
    dpp::message msg(event.msg.channel_id, "");
    msg.add_embed(this->build());
    event.from()->creator->message_create(msg);
  }
}