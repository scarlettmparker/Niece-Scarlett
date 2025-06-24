#include "command_registry.hpp"

namespace command
{

  CommandRegistry &CommandRegistry::instance()
  {
    static CommandRegistry inst;
    return inst;
  }

  void CommandRegistry::register_command(std::unique_ptr<CommandBase> cmd)
  {
    utils::Logger::instance().debug("Registering command: " + cmd->name());
    std::string main_name = cmd->name();
    alias_map_[main_name] = cmd.get();
    for (const auto &alt : cmd->alternatives())
    {
      utils::Logger::instance().debug("Registering alias: " + alt + " for command: " + main_name);
      alias_map_[alt] = cmd.get();
    }
    commands_[main_name] = std::move(cmd);
    utils::Logger::instance().debug("Command registered: " + main_name);
  }

  CommandBase *CommandRegistry::get_command(const std::string &name)
  {
    utils::Logger::instance().debug("Looking up command: " + name);
    auto it = alias_map_.find(name);
    if (it != alias_map_.end())
      return it->second;
    utils::Logger::instance().info("Command not found: " + name);
    return nullptr;
  }

  // Find the best matching command for the input (longest prefix match)
  CommandBase *CommandRegistry::find_matching_command(const std::string &input, std::string &matched_alias) const
  {
    utils::Logger::instance().debug("Finding matching command for input: " + input);
    std::string input_lower = input;
    std::transform(input_lower.begin(), input_lower.end(), input_lower.begin(), ::tolower);
    size_t best_len = 0;
    CommandBase *best_cmd = nullptr;
    for (const auto &pair : alias_map_)
    {
      std::string alias_lower = pair.first;
      std::transform(alias_lower.begin(), alias_lower.end(), alias_lower.begin(), ::tolower);
      if (input_lower.rfind(alias_lower, 0) == 0) // input starts with alias (case-insensitive)
      {
        if (alias_lower.length() > best_len)
        {
          best_len = alias_lower.length();
          best_cmd = pair.second;
          matched_alias = pair.first;
        }
      }
    }
    if (best_cmd)
      utils::Logger::instance().debug("Matched alias: " + matched_alias);
    else
      utils::Logger::instance().info("No matching command found for input: " + input);
    return best_cmd;
  }

  void CommandRegistry::build_from_plugins()
  {
    utils::Logger::instance().info("Building commands from plugins");
    std::string plugin_dir = "../command/plugins";
    for (const auto &entry : std::filesystem::directory_iterator(plugin_dir))
    {
      if (entry.path().extension() != ".so")
        continue;
      std::string lib_path = entry.path().string();
      utils::Logger::instance().debug("Loading plugin: " + lib_path);
      void *lib_handle = dlopen(lib_path.c_str(), RTLD_LAZY);
      if (!lib_handle)
      {
        utils::Logger::instance().error(std::string("dlopen failed: ") + dlerror());
        continue;
      }
      std::string stem = entry.path().stem().string();
      if (stem.rfind("lib", 0) == 0)
        stem = stem.substr(3);
      std::string create_func_name = "create_" + stem + "_command";
      using create_func_t = CommandBase *(*)();
      create_func_t create_func = reinterpret_cast<create_func_t>(dlsym(lib_handle, create_func_name.c_str()));
      if (!create_func)
      {
        utils::Logger::instance().error("dlsym failed for " + create_func_name + ": " + dlerror());
        dlclose(lib_handle);
        continue;
      }
      std::unique_ptr<CommandBase> cmd_ptr(create_func());
      std::string main_name = cmd_ptr->name();
      utils::Logger::instance().info("Registering plugin command: " + main_name);
      alias_map_[main_name] = cmd_ptr.get();
      for (const auto &alt : cmd_ptr->alternatives())
      {
        utils::Logger::instance().debug("Registering plugin alias: " + alt + " for command: " + main_name);
        alias_map_[alt] = cmd_ptr.get();
      }
      commands_[main_name] = std::move(cmd_ptr);
      utils::Logger::instance().info("Registered command: " + main_name);
    }
  }

} // namespace command
