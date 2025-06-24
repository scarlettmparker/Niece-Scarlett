#include "pbp_embed_factory.hpp"
#include <string>
#include <memory>

namespace factory
{
  PBPEmbedFactory &PBPEmbedFactory::set_page(int page, int total, const std::string &id)
  {
    current_page = page;
    total_pages = total;
    page_id = id;
    return *this;
  }

  void PBPEmbedFactory::add_page_buttons(dpp::message &msg) const
  {
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
    total_pages = total;
    content_generator = generator;
    return *this;
  }

  void PBPEmbedFactory::send_paginated(const dpp::message_create_t &event, dpp::cluster *bot)
  {
    struct PagingState
    {
      int total_pages;
      PageContentGenerator content_generator;
      std::shared_ptr<int> current_page;
      std::shared_ptr<dpp::snowflake> message_id;
      std::string page_id_base;
    };
    auto state = std::make_shared<PagingState>();
    state->total_pages = total_pages;
    state->content_generator = content_generator;
    state->current_page = std::make_shared<int>(0);
    state->message_id = std::make_shared<dpp::snowflake>(0);
    state->page_id_base = std::to_string(event.msg.id) + "_" + std::to_string(event.msg.channel_id);

    auto send_page = [state, bot, &event](int page, bool update = false)
    {
      *state->current_page = page;
      dpp::message msg;
      msg.set_channel_id(event.msg.channel_id);
      if (state->content_generator)
      {
        state->content_generator(msg, page);
      }
      PBPEmbedFactory navFactory;
      navFactory.set_page(page, state->total_pages, state->page_id_base);
      navFactory.add_page_buttons(msg);
      if (update && *state->message_id != 0)
      {
        msg.id = *state->message_id;
        bot->message_edit(msg, nullptr);
      }
      else
      {
        bot->message_create(msg, [state](const dpp::confirmation_callback_t &cb)
                            {
          if (!cb.is_error()) {
            *state->message_id = std::get<dpp::message>(cb.value).id;
          } });
      }
    };

    auto button_handler = [state, send_page, bot](const dpp::button_click_t &button_event)
    {
      if (button_event.command.message_id != *state->message_id)
      {
        return;
      }
      int new_page = *state->current_page;
      if (button_event.custom_id.find("prev_") == 0 && *state->current_page > 0)
        new_page--;
      else if (button_event.custom_id.find("next_") == 0 && *state->current_page < state->total_pages - 1)
        new_page++;
      if (new_page != *state->current_page)
        send_page(new_page, true);
      bot->interaction_response_create(button_event.command.id, button_event.command.token, dpp::interaction_response(dpp::ir_deferred_update_message));
    };

    bot->on_button_click(button_handler);
    send_page(*state->current_page);
  }
}
