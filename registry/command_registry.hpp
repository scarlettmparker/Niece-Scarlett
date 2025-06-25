#ifndef COMMAND_REGISTRY_HPP
#define COMMAND_REGISTRY_HPP

#include "../utils.hpp"
#include "command_base.hpp"
#include <string>
#include <map>
#include <memory>
#include <algorithm>
#include <iostream>
#include <dlfcn.h>
#include <filesystem>
#include <cctype>

namespace command
{
  /**
   * Singleton registry for all commands.
   */
  class CommandRegistry
  {
  public:
    /**
     * Get the singleton instance of the registry.
     * @return Reference to the CommandRegistry instance.
     */
    static CommandRegistry &instance();
    /**
     * Register a new command.
     * @param cmd The command to register.
     */
    void register_command(std::unique_ptr<CommandBase> cmd);
    /**
     * Get a command by name or alias.
     * @param name The command name or alias.
     * @return Pointer to the command, or nullptr if not found.
     */
    CommandBase *get_command(const std::string &name);
    /**
     * Build the registry from plugin libraries.
     */
    void build_from_plugins();
    /**
     * Find the best matching command for the input (longest prefix match).
     * @param input The input string.
     * @param matched_alias The matched alias string (output).
     * @return Pointer to the best matching command, or nullptr if not found.
     */
    CommandBase *find_matching_command(const std::string &input, std::string &matched_alias) const;

  private:
    std::map<std::string, std::unique_ptr<CommandBase>> commands_;
    std::map<std::string, CommandBase *> alias_map_;
  };
}

#endif // COMMAND_REGISTRY_HPP
