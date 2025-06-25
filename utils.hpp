#ifndef UTILS_HPP
#define UTILS_HPP

#include "config.h"
#include <string>
#include <optional>
#include <mutex>
#include <memory>
#include <iostream>
#include <regex>
#include <fstream>
#include <algorithm>
#include <cctype>

namespace utils
{
  /**
   * @brief Converts a vector of strings to a PostgreSQL array string format.
   * 
   * @param items Vector of strings to convert.
   * @return A string formatted as a PostgreSQL array, e.g., '{item1,item2,item3}'.
   */
  std::string to_pg_array_string(const std::vector<std::string> &items);
  /**
   * @brief Extracts the first image URL from markdown image syntax ![alt](url)
   *
   * This function searches the provided markdown text for the syntax used to
   * embed images and extracts the URL of the first image it finds.
   *
   * @param markdown The markdown text to search.
   * @return The extracted image URL, or std::nullopt if not found.
   */
  std::optional<std::string> extract_markdown_image_url(const std::string &markdown);

  /**
   * @brief Log levels for the Logger.
   */
  enum class LogLevel
  {
    Error = 0,
    Info = 1,
    Debug = 2
  };

  /**
   * @brief Simple thread-safe logger with log level control.
   *
   * Usage: utils::Logger::instance().info("message");
   */
  class Logger
  {
  public:
    static Logger &instance();
    void set_level(LogLevel level);
    LogLevel get_level() const;
    void error(const std::string &msg);
    void info(const std::string &msg);
    void debug(const std::string &msg);
    void initialize_from_env();

  private:
    Logger();
    LogLevel level_;
    std::mutex mutex_;
  };
}

#endif // UTILS_HPP
