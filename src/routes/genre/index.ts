import { Hono } from "hono";
import { ZodError } from "zod";
import genreService from "../../services/genre";
import genreSchema from "./schema";

const genreRouter = new Hono();

genreRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    genreSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const genre = await genreService.create(payload);

    return c.json(genre, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Genre already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

genreRouter.get("/", async (c) => {
  const genres = await genreService.findMany();
  return c.json(genres);
});

genreRouter.get("/:id", async (c) => {
  const genre = await genreService.findOne(Number(c.req.param("id")));

  if (!genre) {
    return c.json({ error: "Genre not found" }, 404);
  }

  return c.json(genre);
});

genreRouter.get("/search/:name", async (c) => {
  const genres = await genreService.search(c.req.param("name"));
  return c.json(genres);
});

genreRouter.put("/:id", async (c) => {
  const payload = await c.req.json();
  try {
    genreSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  const genre = await genreService.update(Number(c.req.param("id")), payload);

  return c.json(genre);
});

genreRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const genre = await genreService.delete(Number(c.req.param("id")));

  return c.json(genre);
});

export default genreRouter;
