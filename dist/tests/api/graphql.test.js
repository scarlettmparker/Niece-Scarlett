"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const graphql_1 = require("../../src/api/graphql");
const fetchMock = vitest_1.vi.fn();
function okResponse(data) {
    return { ok: true, status: 200, json: async () => data };
}
function failResponse(status) {
    return { ok: false, status, json: async () => ({}) };
}
(0, vitest_1.afterEach)(() => {
    vitest_1.vi.unstubAllGlobals();
    fetchMock.mockReset();
});
(0, vitest_1.describe)("executeOperation", () => {
    (0, vitest_1.it)("sends the app credentials and operation", async () => {
        fetchMock.mockResolvedValue(okResponse({ data: { ok: true } }));
        vitest_1.vi.stubGlobal("fetch", fetchMock);
        await (0, graphql_1.executeOperation)("query { x }", { a: 1 });
        (0, vitest_1.expect)(fetchMock).toHaveBeenCalledTimes(1);
        const [url, init] = fetchMock.mock.calls[0];
        (0, vitest_1.expect)(url).toBe("http://localhost:8083/graphql");
        (0, vitest_1.expect)(init.method).toBe("POST");
        (0, vitest_1.expect)(init.headers["X-Client-Id"]).toBe("niece-scarlett");
        (0, vitest_1.expect)(init.headers["Content-Type"]).toBe("application/json");
        const body = JSON.parse(init.body);
        (0, vitest_1.expect)(body.query).toBe("query { x }");
        (0, vitest_1.expect)(body.variables).toEqual({ a: 1 });
    });
    (0, vitest_1.it)("returns the operation data", async () => {
        fetchMock.mockResolvedValue(okResponse({ data: { texts: [] } }));
        vitest_1.vi.stubGlobal("fetch", fetchMock);
        const result = await (0, graphql_1.executeOperation)("query { x }");
        (0, vitest_1.expect)(result).toEqual({ texts: [] });
    });
    (0, vitest_1.it)("rejects on a non-ok response", async () => {
        fetchMock.mockResolvedValue(failResponse(500));
        vitest_1.vi.stubGlobal("fetch", fetchMock);
        await (0, vitest_1.expect)((0, graphql_1.executeOperation)("query { x }")).rejects.toThrow("HTTP 500");
    });
    (0, vitest_1.it)("rejects on GraphQL errors", async () => {
        fetchMock.mockResolvedValue(okResponse({ errors: [{ message: "boom" }] }));
        vitest_1.vi.stubGlobal("fetch", fetchMock);
        await (0, vitest_1.expect)((0, graphql_1.executeOperation)("query { x }")).rejects.toThrow("boom");
    });
    (0, vitest_1.it)("rejects when the response carries no data", async () => {
        fetchMock.mockResolvedValue(okResponse({}));
        vitest_1.vi.stubGlobal("fetch", fetchMock);
        await (0, vitest_1.expect)((0, graphql_1.executeOperation)("query { x }")).rejects.toThrow("no data");
    });
});
