import { Hono } from "hono";
import { ZodError } from "zod";
import artistService from "../../services/artist";
import artistSchema from "./schema";

const artistRouter = new Hono();

artistRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    artistSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const artist = await artistService.create(payload);

    return c.json(artist, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Artist already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

artistRouter.get("/", async (c) => {
  const artists = await artistService.findMany();
  return c.json(artists);
});

artistRouter.get("/:id", async (c) => {
  const artist = await artistService.findOne(Number(c.req.param("id")));

  if (!artist) {
    return c.json({ error: "Artist not found" }, 404);
  }

  return c.json(artist);
});

artistRouter.get("/search/:name", async (c) => {
  const artists = await artistService.search(c.req.param("name"));
  return c.json(artists);
});

artistRouter.put("/:id", async (c) => {
  const payload = await c.req.json();
  try {
    artistSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  const artist = await artistService.update(Number(c.req.param("id")), payload);

  return c.json(artist);
});

artistRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const artist = await artistService.delete(Number(c.req.param("id")));

  return c.json(artist);
});

export default artistRouter;
