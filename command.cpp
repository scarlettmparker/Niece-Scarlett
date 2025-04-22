#include "command.hpp"

namespace command
{
  /**
   * Select annotations data from the database. This will return the annotation ID,
   * annotation description, dislikes, likes, creation date and author data of the annotations,
   * along with the text snippet that the annotation is attached to (calculated through a sanitized
   * version of the text).
   *
   * @param text_id ID of the text to select annotations from.
   * @param verbose Whether to print messages to stdout.
   *
   * @return JSON of annotation data.
   */
  nlohmann::json select_annotations_data(std::string text_id, bool verbose)
  {
    nlohmann::json annotations_data = nlohmann::json::array();
    try
    {
      postgres::ConnectionPool & pool = postgres::get_connection_pool();
      pqxx::work & txn = postgres::begin_transaction(pool);

      pqxx::result r = txn.exec_prepared(
        "select_annotations_data", text_id
      );

      if (r.empty() || r[0][0].is_null())
      {
        verbose && std::cout << "No annotations found" << std::endl;
        return annotations_data;
      }

      annotations_data = nlohmann::json::parse(r[0][0].as<std::string>());
    }
    catch (const std::exception & e)
    {
      verbose && std::cerr << "Error executing query: " << e.what() << std::endl;
    }
    catch (...)
    {
      verbose && std::cerr << "Unknown error while executing query" << std::endl;
    }
    return annotations_data;
  }

  /**
   * Send an annotation message to the channel. This message will contain all
   * annotations for a given text ID.
   *
   * @param event Message create event that triggered the command.
   * @param annotations_data Annotations data to send in the message.
   */
  void send_annotation_message(const dpp::message_create_t & event, nlohmann::json annotations_data)
  {
    const int embed_limit = 10;
    int current_page = 0;

    auto send_page = [&](int page)
    {
      dpp::message msg;
      msg.set_channel_id(event.msg.channel_id);

      for (size_t i = page * embed_limit; i < std::min((size_t)((page + 1) * embed_limit), annotations_data.size()); i++)
      {
        auto annotation = annotations_data[i];

        // extract annotation data and build the embed
        std::string title = annotation["annotation"]["text_snippet"];
        std::string description = annotation["annotation"]["description"];
        std::string username = annotation["author"]["username"];
        int likes = annotation["annotation"]["likes"];
        int dislikes = annotation["annotation"]["dislikes"];

        // create the embed
        dpp::embed embed;
        embed.set_title(title);
        embed.set_footer(dpp::embed_footer().set_text("Annotation by: " + username));

        // check if the description contains an image and add it
        std::regex img_regex(R"(\!\[.*\]\((https?://[^\s]+)\))");  // image markdown
        std::smatch img_match;
        if (std::regex_search(description, img_match, img_regex))
        {
          std::string image_url = img_match[1].str();
          embed.set_image(image_url);

          // remove image link and update description removing new lines etc
          description = std::regex_replace(description, img_regex, "");
          description = std::regex_replace(description, std::regex(R"(\n+)"), std::string("\n"));
          description = description.substr(0, description.find_last_not_of("\n") + 1);
        }

        embed.set_description(description + "\n\n**Likes**: " + std::to_string(likes) + "  |  **Dislikes**: " + std::to_string(dislikes));
        msg.add_embed(embed);
      }

      event.from()->creator->message_create(msg);
    };

    send_page(current_page);
  }

  void send_language_transfer_embed(const dpp::message_create_t& event)
  {
    dpp::embed embed;
    embed.set_title("**What is Language Transfer?**");
    embed.set_description(
      "Language Transfer is an audio series that teaches the basics of Modern Greek in a natural and easy-to-comprehend manner. "
      "It focuses on grammar and teaches useful vocabulary to prepare you for everyday conversations.\n\n"
      "It's highly encouraged to check it out, as it will help you build a very solid foundation to communicate in Greek.\n\n"
      "**The complete series can be found on:**\n"
      "- [YouTube](https://www.youtube.com/watch?v=dHsgJkV9J30&list=PLeA5t3dWTWvtWkl4oOV8J9SMB7L9N9Ogt)\n"
      "- [SoundCloud](https://soundcloud.com/languagetransfer/sets/complete-greek-more-audios)\n"
      "- [Transcript (PDF)](https://static1.squarespace.com/static/5c69bfa4f4e531370e74fa44/t/5d03d32873f6f10001a364b5/1560531782855/COMPLETE+GREEK+-+Transcripts_LT.pdf)\n\n"
      "The audio series follows the teacher (Mihalis) as he teaches a student useful grammatical constructions and how to form sentences naturally, "
      "allowing you to follow along by putting yourself in the student’s shoes.\n\n"
      "More useful resources can be found in [the resources channel](https://discord.com/channels/350234668680871946/359578025228107776/1132288734738522112), "
      "notably in the pins, to help you advance your Greek level after Language Transfer.\n\n"
    );

    dpp::message msg(event.msg.channel_id, "");
    msg.add_embed(embed);
    event.from()->creator->message_create(msg);
  }

  /**
   *
   */
  void handle_annotation_command(dpp::cluster& bot, const std::string& command, const dpp::message_create_t& event, const std::string& annotation_command)
  {
    size_t start = annotation_command.length();
    while (start < command.length() && command[start] == ' ') ++start;

    std::string number_str;
    while (start < command.length() && std::isdigit(command[start]))
      number_str += command[start++];

    if (number_str.empty())
    {
      bot.message_create(dpp::message(event.msg.channel_id, "bro enter a nubmer"));
      return;
    }

    bot.message_create(dpp::message(
      event.msg.channel_id, "bleep bloop :robot: finding annotations for text with id " + number_str
    ));

    nlohmann::json annotations_data = select_annotations_data(number_str, true);
    send_annotation_message(event, annotations_data);
  }

  /**
   */
  dpp::message handle_love_command(dpp::cluster& bot, const std::map<std::string, std::string>& filtered_command, const std::string& command, const dpp::message_create_t& event)
  {
    if (filtered_command.count("tagged"))
    {
      dpp::snowflake user = std::stoull(filtered_command.at("tagged").substr(2, filtered_command.at("tagged").size() - 3));

      if (filtered_command.at("prefix") == "kiss")
      {
        bot.direct_message_create(user, dpp::message(
          "✨ 💫 💗 🧚‍♀️ 💖 HEEEEY !! 💖 ✨ 🌸 💞\n"
          "... 🫦 mwah 💋 💖 🌟 ✨ 🫃 🫃 🫃\n"
        ), [channel_id = event.msg.channel_id, &bot](const dpp::confirmation_callback_t& callback)
        {
          if (callback.is_error())
          {
            bot.message_create(dpp::message(channel_id, "😢 💔 sorry bb i can't message this person 😢"));
          }
          else
          {
            bot.message_create(dpp::message(channel_id, "💋 kissed!!! 💖 🫃"));
          }
        });
        // Empty message to short-circuit registered_command
        return dpp::message(event.msg.channel_id, "<handled>");
      }
    }

    if (command == "i love you")
    {
      return dpp::message(event.msg.channel_id, "i love u too mwah");
    }

    // No matching love command found
    return dpp::message(event.msg.channel_id, "<handled>");
  }

  /**
   * Filter a bot command. This will separate the @ of the user from the command
   * itself. This is used to send direct messages to users.
   *
   * @param command Command to filter.
   * @return Filtered command separated by command and tagged user ID.
   */
  std::map<std::string, std::string> filter_command(std::string & command)
  {
    std::map<std::string, std::string> result;
    size_t start = command.find("<@");
    
    if (start == std::string::npos)
    {
      result["prefix"] = command;
      return result;
    }

    size_t end = start + 2; // search after the "<@"
    while (end < command.size() && std::isdigit(command[end]))
    {
      ++end;
    }

    if (end >= command.size() || command[end] != '>')
    {
      result["prefix"] = command;
      return result;
    }

    // remove any trailing spaces from the command
    size_t prefix_end = start;
    while (prefix_end > 0 && std::isspace(command[prefix_end - 1]))
    {
      --prefix_end;
    }

    result["prefix"] = command.substr(0, prefix_end);
    result["tagged"] = command.substr(start, end - start + 1);

    return result;
  }

  /**
   * Handle a registered command. This will check if the command is valid and
   * execute the command if it is.
   *
   * @param bot Bot to send messages with.
   * @param command Command to handle.
   * @param event Message create event that triggered the command.
   *
   * @return Message to send as a response.
   * @todo Move logic out of this function so most of the function is simply
   * checking the command and returning a message.
   */
  dpp::message registered_command(dpp::cluster & bot, std::string & command, const dpp::message_create_t & event)
  {
    std::string unknown_command = "i don't know this command :(";

    if (command.empty())
    {
      return dpp::message(event.msg.channel_id, unknown_command);
    }

    // split the command by command and pinged user
    std::map<std::string, std::string> filtered_command = filter_command(command);

    const std::vector<std::string> lt_commands = {
      "language transfer", "lt", "what is language transfer", "what is lt", "explain language transfer", "explain lt"
    };

    const std::vector<std::string> love_commands = {
      "i love you", "i love u", "i love you mwah", "i love u mwah"
    };

    const std::string annotation_command = "give me annotations for text";

    if (std::any_of(love_commands.begin(), love_commands.end(), [&](const std::string& c)
      { 
        return command == c; 
      }
    ))
    {
      return dpp::message(event.msg.channel_id, "i love u too mwah");
    }
    else if (std::any_of(lt_commands.begin(), lt_commands.end(), [&](const std::string& c)
      { 
        return command == c; 
      }
    ))
    {
      send_language_transfer_embed(event);
      return dpp::message();
    }
    else if (command.rfind(annotation_command, 0) == 0)
    {
      handle_annotation_command(bot, command, event, annotation_command);
      return dpp::message();
    }
    else if (filtered_command.count("prefix") && filtered_command.at("prefix") == "kiss")
    {
      dpp::message love_response = handle_love_command(bot, filtered_command, command, event);
      if (!love_response.content.empty() || !love_response.embeds.empty())
      {
        if (love_response.content == "<handled>") {
            return dpp::message();
        }
        return love_response;
      }
    }
    else
    {
      return dpp::message(event.msg.channel_id, unknown_command);
    }
  }
}