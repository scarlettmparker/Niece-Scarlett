#ifndef ANNOTATION_HPP
#define ANNOTATION_HPP

#include "command_metadata.hpp"
#include "../utils.hpp"
#include "../registry/command_base.hpp"
#include "../api/annotation.hpp"
#include "../factory/pbp_embed_factory.hpp"
#include "../factory/embed_factory.hpp"
#include <dpp/dpp.h>
#include <string>

namespace command
{
  /**
   * Represents the Annotation command.
   */
  class AnnotationCommand : public CommandBase
  {
  public:
    std::string name() const override;
    std::vector<std::string> alternatives() const override;
    std::string permission() const override;
    /**
     * Execute the command logic.
     */
    dpp::message execute(dpp::cluster &bot, const std::string &command, const dpp::message_create_t &event) override;
  };
}

#endif // ANNOTATION_HPP
