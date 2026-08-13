"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTexts = listTexts;
exports.locateText = locateText;
const graphql_1 = require("./graphql");
const LIST_TEXTS = `
  query listTexts($pagination: PaginationInput) {
    hadesQueries {
      texts(pagination: $pagination) {
        items { id title language level status }
        pageInfo { page size totalPages totalCount hasNextPage hasPreviousPage }
      }
    }
  }
`;
const LOCATE_TEXT = `
  query locateText($id: ID!) {
    hadesQueries {
      text(id: $id) {
        id title content language level status
      }
    }
  }
`;
/**
 * Fetches a page of reader texts, filtered by title and level.
 */
async function listTexts(params = {}) {
    const filters = [];
    if (params.query) {
        filters.push({ field: "title", operator: "MATCHES", value: params.query });
    }
    if (params.level) {
        filters.push({ field: "level", operator: "IN", value: params.level });
    }
    const data = await (0, graphql_1.executeOperation)(LIST_TEXTS, {
        pagination: {
            page: params.page ?? 0,
            size: 10,
            sortBy: "level",
            sortDir: "ASC",
            filters: filters.length > 0 ? filters : undefined,
        },
    });
    const texts = data?.hadesQueries.texts;
    if (!texts) {
        throw new Error("Text listing was empty");
    }
    return texts;
}
/**
 * Fetches a text's full content by id, or null when unknown.
 */
async function locateText(id) {
    const data = await (0, graphql_1.executeOperation)(LOCATE_TEXT, { id });
    return data?.hadesQueries.text ?? null;
}
