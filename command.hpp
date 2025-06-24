#ifndef COMMAND_HPP
#define COMMAND_HPP

#include "api/annotation.hpp"
#include "factory/faq_factory.hpp"
#include <dpp/dpp.h>
#include <string>
#include <map>
#include <nlohmann/json.hpp>
#include <iostream>
#include <regex>

namespace command
{
  void send_annotation_message(const dpp::message_create_t &event, nlohmann::json annotations_data);
  void send_language_transfer_embed(const dpp::message_create_t &event);
  void handle_annotation_command(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event, const std::string &annotation_command);
  dpp::message handle_love_command(dpp::cluster &bot, const std::map<std::string, std::string> &filtered_command, const std::string &command, const dpp::message_create_t &event);
  std::map<std::string, std::string> filter_command(std::string &command);
  dpp::message registered_command(dpp::cluster &bot, std::string &command, const dpp::message_create_t &event);
}

#endif // COMMAND_HPP