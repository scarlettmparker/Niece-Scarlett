#ifndef UTILS_HPP
#define UTILS_HPP

#include <string>
#include <optional>

namespace utils
{
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
}

#endif // UTILS_HPP
