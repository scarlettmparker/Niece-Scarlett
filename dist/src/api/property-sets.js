"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPropertySet = fetchPropertySet;
const graphql_1 = require("./graphql");
const PROPERTY_SET = `
  query propertySet($ownerKey: String!, $name: String!, $entry: String) {
    gaiaQueries {
      propertySet(ownerKey: $ownerKey, name: $name, entry: $entry)
    }
  }
`;
/**
 * Fetches a property-set entry's values, or null when the entry is missing.
 *
 * @param ownerKey the owner key
 * @param name the property set name
 * @param entry the entry name, or all entries when omitted
 */
async function fetchPropertySet(ownerKey, name, entry) {
    const data = await (0, graphql_1.executeOperation)(PROPERTY_SET, { ownerKey, name, entry });
    return data?.gaiaQueries.propertySet ?? null;
}
