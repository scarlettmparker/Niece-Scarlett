#ifndef HUG_HPP
#define HUG_HPP

#include "../registry/command_base.hpp"
#include "../utils.hpp"
#include <dpp/dpp.h>

namespace command
{
  class HugCommand : public CommandBase
  {
  public:
    std::string name() const override;
    std::vector<std::string> alternatives() const override;
    std::string permission() const override;
    dpp::message execute(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event) override;
  };
}

#endif // HUG_HPP
