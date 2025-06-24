#include "annotation.hpp"

namespace command {
  std::string AnnotationCommand::name() const { return "annotation"; }
  std::vector<std::string> AnnotationCommand::alternatives() const { return {"give me annotations for text"}; }
  std::string AnnotationCommand::permission() const { return "command.annotation"; }
  dpp::message AnnotationCommand::execute(dpp::cluster &bot, const std::string &cmd, const dpp::message_create_t &event) {
    std::string prefix = "give me annotations for text";
    size_t pos = cmd.find(prefix);
    if (pos != 0) {
      return dpp::message(event.msg.channel_id, "Invalid annotation command.");
    }
    std::string text_id = cmd.substr(prefix.size());
    while (!text_id.empty() && text_id[0] == ' ')
      text_id.erase(0, 1);
    if (text_id.empty()) {
      return dpp::message(event.msg.channel_id, "Please provide a text id.");
    }
    int embed_limit = 5;
    int total_annotations = api::annotation::get_annotation_count(text_id);
    int total_pages = (total_annotations + embed_limit - 1) / embed_limit;
    factory::PBPEmbedFactory()
        .set_pagination(total_pages, [=](dpp::message &msg, int page) {
            auto annotations_data = api::annotation::select_annotations_data(text_id, page, embed_limit);
            for (auto &annotation : annotations_data) {
                std::string title = annotation["annotation"]["text_snippet"];
                std::string description = annotation["annotation"]["description"];
                std::string username = annotation["author"]["username"];
                int likes = annotation["annotation"]["likes"];
                int dislikes = annotation["annotation"]["dislikes"];
                factory::EmbedFactory embedFactory;
                embedFactory.set_title(title)
                    .set_footer("Annotation by: " + username)
                    .add_paragraph_with_image(description + "\n\n**Likes**: " + std::to_string(likes) + " | **Dislikes**: " + std::to_string(dislikes));
                msg.add_embed(embedFactory.build());
            } })
        .send_paginated(event, &bot);
    return dpp::message();
  }
}

extern "C" command::CommandBase *create_annotation_command() {
  return new command::AnnotationCommand();
}
