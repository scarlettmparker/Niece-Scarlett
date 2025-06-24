#ifndef COMMAND_HPP
#define COMMAND_HPP

#include "registry/command_registry.hpp"
#include <dpp/dpp.h>
#include <string>
#include <iostream>
#include <algorithm>
#include <cctype>

namespace command
{
  dpp::message registered_command(dpp::cluster &bot, std::string &command, const dpp::message_create_t &event);
}

#endif // COMMAND_HPP