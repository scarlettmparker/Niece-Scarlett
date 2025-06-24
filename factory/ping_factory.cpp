#include "ping_factory.hpp"

PingParseResult PingFactory::parse_ping(const std::string &cmd)
{
  size_t tag_start = cmd.find("<@");
  size_t tag_end = cmd.find('>', tag_start);
  if (tag_start == std::string::npos || tag_end == std::string::npos)
    return {std::nullopt, cmd};
  std::string user_id = cmd.substr(tag_start + 2, tag_end - tag_start - 2);
  std::string message = cmd.substr(tag_end + 1);
  return {user_id, message};
}
