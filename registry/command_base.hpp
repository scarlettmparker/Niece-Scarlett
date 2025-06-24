#ifndef COMMAND_BASE_HPP
#define COMMAND_BASE_HPP

#include <string>
#include <vector>
#include <dpp/dpp.h>

namespace command
{

  /**
   * Abstract base class for all commands.
   */
  class CommandBase
  {
  public:
    virtual ~CommandBase() = default;
    /**
     * Get the name of the command.
     */
    virtual std::string name() const = 0;
    /**
     * Get alternative triggers for the command.
     */
    virtual std::vector<std::string> alternatives() const = 0;
    /**
     * Get the permission string for the command.
     */
    virtual std::string permission() const = 0;
    /**
     * Execute the command logic.
     * @param bot The DPP cluster.
     * @param command The command string.
     * @param event The message event.
     * @return The response message.
     */
    virtual dpp::message execute(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event) = 0;
  };

}

#endif // COMMAND_BASE_HPP
