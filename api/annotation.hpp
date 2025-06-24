#ifndef API_ANNOTATIONS_HPP
#define API_ANNOTATIONS_HPP

#include "../postgres.hpp"
#include <iostream>
#include <pqxx/pqxx>
#include <nlohmann/json.hpp>
#include <string_view>

namespace api::annotation
{
  /**
   * Selects annotations data from the database. This will return the annotation ID,
   * annotation description, dislikes, likes, creation date and author data of the annotations,
   * along with the text snippet that the annotation is attached to.
   *
   * @param text_id ID of the text to select annotations from.
   * @param verbose Whether to print messages to stdout.
   *
   * @return JSON of annotation data.
   */
  nlohmann::json select_annotations_data(std::string_view text_id, bool verbose = false);
}

#endif // API_ANNOTATIONS_HPP