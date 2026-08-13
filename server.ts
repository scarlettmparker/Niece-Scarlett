/**
 * @fileoverview Main entry point: starts the Fastify server, then boots the
 * Discord client.
 */
import { bootClient } from "./src/index.js";
import { startServer } from "./src/server.js";

await startServer();
await bootClient();
