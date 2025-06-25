#include "utils.hpp"

namespace utils
{
  std::string to_pg_array_string(const std::vector<std::string> &items)
  {
    std::ostringstream oss;
    oss << '{';
    for (size_t i = 0; i < items.size(); ++i)
    {
      if (i > 0)
      {
        oss << ',';
      }
      oss << items[i];
    }
    oss << '}';
    return oss.str();
  }

  std::optional<std::string> extract_markdown_image_url(const std::string &markdown)
  {
    std::regex img_regex(R"(\!\[.*\]\((https?://[^\s]+)\))");
    std::smatch img_match;
    if (std::regex_search(markdown, img_match, img_regex))
    {
      return img_match[1].str();
    }
    return std::nullopt;
  }

  // Logger implementation
  Logger &Logger::instance()
  {
    static Logger logger_instance;
    return logger_instance;
  }

  Logger::Logger() : level_(LogLevel::Info) {}

  void Logger::set_level(LogLevel level)
  {
    std::lock_guard<std::mutex> lock(mutex_);
    level_ = level;
  }

  LogLevel Logger::get_level() const
  {
    return level_;
  }

  void Logger::error(const std::string &msg)
  {
    if (static_cast<int>(level_) >= static_cast<int>(LogLevel::Error))
    {
      std::lock_guard<std::mutex> lock(mutex_);
      std::cerr << "[ERROR] " << msg << std::endl;
    }
  }

  void Logger::info(const std::string &msg)
  {
    if (static_cast<int>(level_) >= static_cast<int>(LogLevel::Info))
    {
      std::lock_guard<std::mutex> lock(mutex_);
      std::cout << "[INFO] " << msg << std::endl;
    }
  }

  void Logger::debug(const std::string &msg)
  {
    if (static_cast<int>(level_) >= static_cast<int>(LogLevel::Debug))
    {
      std::lock_guard<std::mutex> lock(mutex_);
      std::cout << "[DEBUG] " << msg << std::endl;
    }
  }

  void Logger::initialize_from_env()
  {
    std::string value = BOT_LOG_LEVEL;
    std::cout << "Initializing logger with level: " << value << std::endl;
    std::transform(value.begin(), value.end(), value.begin(), ::tolower);
    if (value == "error")
      set_level(LogLevel::Error);
    else if (value == "info")
      set_level(LogLevel::Info);
    else if (value == "debug")
      set_level(LogLevel::Debug);
  }
}
