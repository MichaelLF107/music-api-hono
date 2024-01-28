import { Hono } from "hono";
import { ZodError } from "zod";
import songService from "../../services/song";
import songSchema from "./schema";

const songRouter = new Hono();

songRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    songSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const song = await songService.create(payload);

    return c.json(song, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Song already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

songRouter.get("/", async (c) => {
  const songs = await songService.findMany();
  return c.json(songs);
});

songRouter.get("/:id", async (c) => {
  const song = await songService.findOne(Number(c.req.param("id")));

  if (!song) {
    return c.json({ error: "Song not found" }, 404);
  }

  return c.json(song);
});

songRouter.get("/search/:title", async (c) => {
  const songs = await songService.search(c.req.param("title"));
  return c.json(songs);
});

songRouter.put("/:id", async (c) => {
  const payload = await c.req.json();
  try {
    songSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const song = await songService.update(Number(c.req.param("id")), payload);

    return c.json(song);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Song already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

songRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await songService.delete(Number(c.req.param("id")));

  return c.json({ message: "Song deleted" });
});

export default songRouter;
