import { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { DecodedToken } from "./types";

const tokenSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  admin: z.boolean(),
});

export const authentication: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization) {
    return c.json({ error: "Authorization header is required" }, 401);
  }

  const token = authorization.replace("Bearer ", "");

  let decoded: DecodedToken | undefined;

  try {
    decoded = jwt.verify(token, Bun.env.SECRET_KEY as string) as DecodedToken;
    tokenSchema.parse(decoded);
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
  c.set("user", decoded);
  await next();
};
