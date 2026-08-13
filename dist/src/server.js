import Fastify from "fastify";
import { pageDataRpcHandler } from "@sun/ssr";
import { mutationPostHandler } from "@sun/ssr/server";
import { host, port } from "~/config.js";
import { registerAll } from "~/registrations.js";
/**
 * Builds the Fastify app exposing the page-data and mutation RPC routes.
 */
export function buildApp() {
    const app = Fastify({ logger: false });
    app.get("/health", async () => ({ ok: true }));
    app.post("/__page-data", pageDataRpcHandler());
    app.route({ method: "POST", url: "/*", handler: mutationPostHandler() });
    return app;
}
/**
 * Registers the loaders and starts the Fastify server.
 *
 * @return the address the server is listening on
 */
export async function startServer() {
    registerAll();
    const app = buildApp();
    const address = await app.listen({ port, host });
    console.log(`Server started at ${address}`);
    return address;
}
