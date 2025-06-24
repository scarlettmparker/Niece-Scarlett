#include "embed_factory.hpp"

namespace factory
{
  EmbedFactory &EmbedFactory::set_command(const std::string &command_name)
  {
    utils::Logger::instance().debug("Setting command for embed: " + command_name);
    this->command = command_name;
    return *this;
  }

  EmbedFactory &EmbedFactory::set_title(const std::string &title_text)
  {
    utils::Logger::instance().debug("Setting title for embed: " + title_text);
    this->title = title_text;
    return *this;
  }

  EmbedFactory &EmbedFactory::add_heading(const std::string &heading_text)
  {
    utils::Logger::instance().debug("Adding heading to embed: " + heading_text);
    this->description += "**" + heading_text + "**\n\n";
    return *this;
  }

  EmbedFactory &EmbedFactory::add_paragraph(const std::string &paragraph_text)
  {
    utils::Logger::instance().debug("Adding paragraph to embed");
    this->description += paragraph_text + "\n\n";
    return *this;
  }

  EmbedFactory &EmbedFactory::set_footer(const std::string &text)
  {
    utils::Logger::instance().debug("Setting footer for embed: " + text);
    this->footer.set_text(text);
    return *this;
  }

  EmbedFactory &EmbedFactory::add_paragraph_with_image(const std::string &paragraph_text)
  {
    utils::Logger::instance().debug("Adding paragraph with image to embed");
    // Extract image from markdown and set image_url if found
    auto img_url = utils::extract_markdown_image_url(paragraph_text);
    if (img_url)
    {
      utils::Logger::instance().debug("Image URL extracted: " + *img_url);
      this->image_url = *img_url;
    }
    // Remove image markdown from paragraph for description
    std::string clean_paragraph = paragraph_text;
    if (img_url)
    {
      std::regex img_regex(R"(\!\[.*\]\((https?://[^\s]+)\))");
      clean_paragraph = std::regex_replace(clean_paragraph, img_regex, "");
      clean_paragraph = std::regex_replace(clean_paragraph, std::regex(R"(\n+)"), "\n");
      if (!clean_paragraph.empty())
      {
        clean_paragraph = clean_paragraph.substr(0, clean_paragraph.find_last_not_of("\n") + 1);
      }
    }
    this->description += clean_paragraph + "\n\n";
    return *this;
  }

  dpp::embed EmbedFactory::build()
  {
    utils::Logger::instance().debug("Building embed");
    dpp::embed embed;
    embed.set_title(this->title);
    embed.set_description(this->description);
    if (!this->footer.text.empty())
    {
      embed.set_footer(this->footer);
    }
    if (!this->image_url.empty())
    {
      embed.set_image(this->image_url);
    }
    return embed;
  }

  void EmbedFactory::send(const dpp::message_create_t &event)
  {
    utils::Logger::instance().debug("Sending embed message");
    dpp::message msg(event.msg.channel_id, "");
    msg.add_embed(this->build());
    event.from()->creator->message_create(msg);
  }
}