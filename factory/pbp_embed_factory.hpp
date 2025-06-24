#ifndef PBP_EMBED_FACTORY_HPP
#define PBP_EMBED_FACTORY_HPP

#include "embed_factory.hpp"
#include <string>
#include <dpp/dpp.h>
#include <functional>

namespace factory
{
  /**
   * Factory for paginated embed messages (PBP).
   */
  class PBPEmbedFactory : public EmbedFactory
  {
    int current_page = 0;
    int total_pages = 1;
    std::string page_id;

  public:
    /**
     * Type for generating page content.
     */
    using PageContentGenerator = std::function<void(dpp::message &, int page)>;

    /**
     * Set the current page, total pages, and page id.
     */
    PBPEmbedFactory &set_page(int page, int total, const std::string &id);
    /**
     * Add navigation buttons to the message.
     */
    void add_page_buttons(dpp::message &msg) const;
    /**
     * Set up pagination with total pages and a content generator callback.
     */
    PBPEmbedFactory &set_pagination(int total_pages, PageContentGenerator generator);
    /**
     * Send the paginated message and handle button navigation.
     */
    void send_paginated(const dpp::message_create_t &event, dpp::cluster *bot);

  private:
    PageContentGenerator content_generator;
  };
}

#endif // PBP_EMBED_FACTORY_HPP
