#include "pbp_embed_factory.hpp"

namespace factory
{
  PBPEmbedFactory &PBPEmbedFactory::set_page(int page, int total, const std::string &id)
  {
    utils::Logger::instance().debug("Setting page: " + std::to_string(page) + ", total: " + std::to_string(total) + ", id: " + id);
    current_page = page;
    total_pages = total;
    page_id = id;
    return *this;
  }

  void PBPEmbedFactory::add_page_buttons(dpp::message &msg) const
  {
    utils::Logger::instance().debug("Adding page buttons for current_page: " + std::to_string(current_page) + ", total_pages: " + std::to_string(total_pages));
    dpp::component action_row;
    dpp::component prev_button;
    prev_button.set_label("Previous")
        .set_type(dpp::cot_button)
        .set_style(dpp::cos_primary)
        .set_id("prev_" + page_id);
    if (current_page == 0)
      prev_button.set_disabled(true);

    dpp::component page_label;
    page_label.set_label("Page " + std::to_string(current_page + 1) + " of " + std::to_string(total_pages))
        .set_type(dpp::cot_button)
        .set_style(dpp::cos_secondary)
        .set_id("page_label_" + page_id)
        .set_disabled(true);

    dpp::component next_button;
    next_button.set_label("Next")
        .set_type(dpp::cot_button)
        .set_style(dpp::cos_primary)
        .set_id("next_" + page_id);
    if (current_page == total_pages - 1)
      next_button.set_disabled(true);

    action_row.add_component(prev_button)
        .add_component(page_label)
        .add_component(next_button);
    msg.add_component(action_row);
  }

  PBPEmbedFactory &PBPEmbedFactory::set_pagination(int total, PageContentGenerator generator)
  {
    utils::Logger::instance().debug("Setting pagination: total pages = " + std::to_string(total));
    total_pages = total;
    content_generator = generator;
    return *this;
  }

  void PBPEmbedFactory::send_paginated(const dpp::message_create_t &event, dpp::cluster *bot)
  {
    utils::Logger::instance().debug("send_paginated called");
    struct PagingState
    {
      int total_pages;
      PageContentGenerator content_generator;
      std::shared_ptr<int> current_page;
      std::shared_ptr<dpp::snowflake> message_id;
      std::string page_id_base;
      dpp::snowflake channel_id;
    };
    // Define the static map ONCE, shared by all calls
    static std::unordered_map<dpp::snowflake, std::shared_ptr<PagingState>> paging_states;

    auto state = std::make_shared<PagingState>();
    state->total_pages = total_pages;
    state->content_generator = content_generator;
    state->current_page = std::make_shared<int>(0);
    state->message_id = std::make_shared<dpp::snowflake>(0);
    state->page_id_base = std::to_string(event.msg.id) + "_" + std::to_string(event.msg.channel_id);
    state->channel_id = event.msg.channel_id;

    auto send_page = [state, bot](int page, bool update = false)
    {
      utils::Logger::instance().debug("send_page called for page: " + std::to_string(page) + ", update: " + (update ? "true" : "false"));
      *state->current_page = page;
      dpp::message msg;
      msg.set_channel_id(state->channel_id);
      if (state->content_generator)
      {
        utils::Logger::instance().debug("Calling content_generator for page: " + std::to_string(page));
        state->content_generator(msg, page);
      }
      PBPEmbedFactory navFactory;
      navFactory.set_page(page, state->total_pages, state->page_id_base);
      navFactory.add_page_buttons(msg);
      if (update && *state->message_id != 0)
      {
        msg.id = *state->message_id;
        utils::Logger::instance().debug("Editing message id: " + std::to_string(*state->message_id) + " to page: " + std::to_string(page));
        bot->message_edit(msg, [page](const dpp::confirmation_callback_t &cb)
                          {
          if (cb.is_error()) {
            utils::Logger::instance().error("Failed to edit message: " + cb.get_error().message);
          } else {
            utils::Logger::instance().debug("Successfully edited message to page: " + std::to_string(page));
          } });
      }
      else
      {
        utils::Logger::instance().debug("Creating new paginated message for page: " + std::to_string(page));
        bot->message_create(msg, [state](const dpp::confirmation_callback_t &cb)
                            {
          if (!cb.is_error()) {
            *state->message_id = std::get<dpp::message>(cb.value).id;
            paging_states[*state->message_id] = state; // Store state by message_id
            utils::Logger::instance().debug("Created message with id: " + std::to_string(*state->message_id) + " for page: " + std::to_string(*state->current_page));
          } else {
            utils::Logger::instance().error("Failed to create paginated message: " + cb.get_error().message);
          } });
      }
    };

    static bool handler_registered = false;
    if (!handler_registered)
    {
      utils::Logger::instance().debug("Registering button click handler for pagination");
      // Capture a pointer to the static map
      auto paging_states_ptr = &paging_states;
      bot->on_button_click([bot, paging_states_ptr](const dpp::button_click_t &button_event)
                           {
        utils::Logger::instance().debug("Button click event received: custom_id=" + button_event.custom_id);
        auto it = paging_states_ptr->find(button_event.command.message_id);
        if (it == paging_states_ptr->end()) {
          utils::Logger::instance().debug("Button event ignored: message_id not tracked");
          return;
        }
        auto state = it->second;
        utils::Logger::instance().debug("Button clicked: custom_id=" + button_event.custom_id + ", message_id=" + std::to_string(button_event.command.message_id));
        int new_page = *state->current_page;
        if (button_event.custom_id.find("prev_") == 0 && *state->current_page > 0)
          new_page--;
        else if (button_event.custom_id.find("next_") == 0 && *state->current_page < state->total_pages - 1)
          new_page++;
        utils::Logger::instance().debug("Current page: " + std::to_string(*state->current_page) + ", new page: " + std::to_string(new_page));
        if (new_page != *state->current_page) {
          utils::Logger::instance().debug("Page change detected, updating message");
          auto send_page = [state, bot](int page, bool update = false) {
            *state->current_page = page;
            dpp::message msg;
            msg.set_channel_id(state->channel_id);
            if (state->content_generator) {
              state->content_generator(msg, page);
            }
            PBPEmbedFactory navFactory;
            navFactory.set_page(page, state->total_pages, state->page_id_base);
            navFactory.add_page_buttons(msg);
            if (update && *state->message_id != 0) {
              msg.id = *state->message_id;
              bot->message_edit(msg);
            } else {
              bot->message_create(msg, [state, page](const dpp::confirmation_callback_t &cb) {
                if (!cb.is_error()) {
                  *state->message_id = std::get<dpp::message>(cb.value).id;
                }
              });
            }
          };
          send_page(new_page, true);
        } else {
          utils::Logger::instance().debug("No page change, not updating message");
        }
        bot->interaction_response_create(button_event.command.id, button_event.command.token, dpp::interaction_response(dpp::ir_deferred_update_message)); });
      handler_registered = true;
    }

    utils::Logger::instance().debug("Sending initial page for pagination");
    send_page(*state->current_page);
  }
}
