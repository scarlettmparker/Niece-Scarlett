#include "utils.hpp"
#include <regex>

namespace utils
{
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
}
