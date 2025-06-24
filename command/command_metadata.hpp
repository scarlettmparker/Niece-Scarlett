#pragma once
#include <string>
#include <vector>

namespace command {
/**
 * Metadata for a command, including name, alternate names, and permission.
 */
struct CommandMetadata {
    std::string name;
    std::vector<std::string> alternate_names;
    std::string permission;
};
}

extern "C" command::CommandMetadata get_command_metadata();
