"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeOperation = executeOperation;
const config_1 = __importDefault(require("~/config"));
/**
 * Posts a GraphQL operation to the gateway with the app credentials.
 *
 * @param operation the query or mutation document
 * @param variables the operation variables
 * @return the operation data, or null when the field resolved to null
 */
async function executeOperation(operation, variables) {
    const response = await fetch(config_1.default.graphqlEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Client-Id": config_1.default.clientId,
            "X-Client-Secret": config_1.default.clientSecret,
            "X-Api-Key": config_1.default.apiKey,
        },
        body: JSON.stringify({ query: operation, variables: variables ?? {} }),
    });
    if (!response.ok) {
        throw new Error(`GraphQL request failed with HTTP ${response.status}`);
    }
    const body = (await response.json());
    if (body.errors && body.errors.length > 0) {
        throw new Error(body.errors.map((error) => error.message).join("; "));
    }
    if (body.data === undefined) {
        throw new Error("GraphQL response carried no data");
    }
    return body.data;
}
