#ifndef PING_FACTORY_HPP
#define PING_FACTORY_HPP

#include <string>
#include <optional>

/**
 * Parses a command like "kiss <@123456789>" and returns the user id and message.
 */
struct PingParseResult
{
  std::optional<std::string> user_id;
  std::string message;
};

class PingFactory
{
public:
  /**
   * Parses a ping command and extracts the user id and message.
   * @param cmd The command string.
   * @return The parse result.
   */
  static PingParseResult parse_ping(const std::string &cmd);
};

#endif // PING_FACTORY_HPP
