import { describe, expect, it } from "vitest";
import { buildApp } from "~/server.js";
describe("server", () => {
    it("answers health checks", async () => {
        const app = buildApp();
        const response = await app.inject({ method: "GET", url: "/health" });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ ok: true });
        await app.close();
    });
    it("answers the page-data RPC for an unknown pattern", async () => {
        const app = buildApp();
        const response = await app.inject({
            method: "POST",
            url: "/__page-data",
            payload: { pattern: "unknown", params: {} },
        });
        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({ data: null });
        await app.close();
    });
});
