#include "ping_factory.hpp"

PingParseResult PingFactory::parse_ping(const std::string &cmd)
{
  utils::Logger::instance().debug("Parsing ping command: " + cmd);
  size_t tag_start = cmd.find("<@");
  size_t tag_end = cmd.find('>', tag_start);
  if (tag_start == std::string::npos || tag_end == std::string::npos)
  {
    utils::Logger::instance().info("No user tag found in ping command");
    return {std::nullopt, cmd};
  }
  std::string user_id = cmd.substr(tag_start + 2, tag_end - tag_start - 2);
  std::string message = cmd.substr(tag_end + 1);
  utils::Logger::instance().debug("Parsed user_id: " + user_id + ", message: " + message);
  return {user_id, message};
}
