#ifndef LANGUAGE_TRANSFER_HPP
#define LANGUAGE_TRANSFER_HPP

#include "../registry/command_base.hpp"
#include "../factory/embed_factory.hpp"
#include "command_metadata.hpp"

namespace command
{
  /**
   * Represents the Language Transfer command.
   */
  class LanguageTransferCommand : public CommandBase
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

#endif // LANGUAGE_TRANSFER_HPP
