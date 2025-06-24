#ifndef EMBED_FACTORY_HPP
#define EMBED_FACTORY_HPP

#include "../utils.hpp"
#include <dpp/dpp.h>
#include <string>
#include <regex>

namespace factory
{
  /**
   * A factory class to build and send FAQ-style embeds.
   * It provides a fluent interface for easy construction.
   */
  class EmbedFactory
  {
  private:
    std::string command;
    std::string title;
    std::string description;
    dpp::embed_footer footer;
    std::string image_url;

  public:
    /**
     * Default constructor.
     */
    EmbedFactory() = default;

    /**
     * Sets the command name associated with this embed.
     *
     * @param command_name The name of the command.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &set_command(const std::string &command_name);

    /**
     * Sets the title of the embed.
     *
     * @param title_text The text for the title.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &set_title(const std::string &title_text);

    /**
     * Adds a bolded heading to the embed's description.
     *
     * @param heading_text The text for the heading.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &add_heading(const std::string &heading_text);

    /**
     * Adds a paragraph to the embed's description.
     *
     * @param paragraph_text The text for the paragraph.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &add_paragraph(const std::string &paragraph_text);

    /**
     * Adds a paragraph to the embed's description and sets image if markdown contains one.
     *
     * @param paragraph_text The text for the paragraph.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &add_paragraph_with_image(const std::string &paragraph_text);

    /**
     * Sets the footer text for the embed.
     *
     * @param text The text for the footer.
     * @return A reference to the current object for chaining.
     */
    EmbedFactory &set_footer(const std::string &text);

    /**
     * Builds the dpp::embed object from the configured data.
     *
     * @return The constructed dpp::embed.
     */
    dpp::embed build();

    /**
     * Sends the constructed embed to the channel from the event.
     *
     * @param event The message create event that triggered the command.
     */
    void send(const dpp::message_create_t &event);
  };
}

#endif // EMBED_FACTORY_HPP