#ifndef COMMAND_HPP
#define COMMAND_HPP

#include "postgres.hpp"
#include <dpp/dpp.h>
#include <string>
#include <iostream>
#include <map>
#include <regex>
#include <nlohmann/json.hpp>

namespace command
{
  nlohmann::json select_annotations_data(std::string_view text_id, bool verbose);
  void send_annotation_message(const dpp::message_create_t & event, nlohmann::json annotations_data);
  std::map<std::string, std::string> filter_command(std::string & command);
  dpp::message registered_command(dpp::cluster & bot, std::string & command, const dpp::message_create_t & event);
}
#endif