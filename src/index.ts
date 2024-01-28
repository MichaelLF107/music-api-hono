import { Hono } from "hono";
import { logger } from "hono/logger";
import { authentication } from "./middleware/auth";
import type { DecodedToken } from "./middleware/types";

import routes from "./routes";

declare module "hono" {
  interface ContextVariableMap {
    user: DecodedToken;
  }
}

const app = new Hono();

app.use("*", logger());
app.use("*", authentication);

for (const route of routes) {
  app.route(route.path, route.router);
}

export default app;
