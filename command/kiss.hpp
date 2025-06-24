#ifndef KISS_HPP
#define KISS_HPP

#include <dpp/dpp.h>
#include "command_metadata.hpp"
#include "../registry/command_base.hpp"
#include "../factory/ping_factory.hpp"
#include "../factory/direct_message_factory.hpp"

namespace command
{
  /**
   * Represents the Kiss command.
   * Sends a kiss message to a tagged user.
   */
  class KissCommand : public CommandBase
  {
  public:
    std::string name() const override;
    std::vector<std::string> alternatives() const override;
    std::string permission() const override;
    /**
     * Execute the command logic.
     * @param bot The DPP cluster.
     * @param command The command string.
     * @param event The message event.
     * @return The response message.
     */
    dpp::message execute(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event) override;
  };
}

#endif // KISS_HPP
