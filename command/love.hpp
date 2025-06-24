#ifndef LOVE_HPP
#define LOVE_HPP

#include "../registry/command_base.hpp"
#include "../utils.hpp"
#include "command_metadata.hpp"
#include <dpp/dpp.h>

namespace command
{
  /**
   * Represents the Love command.
   * Responds to expressions of love with a message.
   */
  class LoveCommand : public CommandBase
  {
  public:
    std::string name() const override;
    std::vector<std::string> alternatives() const override;
    std::string permission() const override;
    /**
     * Execute the command logic.
     */
    dpp::message execute(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event) override;
  };
}

#endif // LOVE_HPP
