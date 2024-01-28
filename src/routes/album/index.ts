import { Hono } from "hono";
import { ZodError } from "zod";
import albumService from "../../services/album";
import albumSchema from "./schema";

const albumRouter = new Hono();

albumRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    albumSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const album = await albumService.create(payload);

    return c.json(album, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Album already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

albumRouter.get("/", async (c) => {
  const albums = await albumService.findMany();
  return c.json(albums);
});

albumRouter.get("/:id", async (c) => {
  const album = await albumService.findOne(Number(c.req.param("id")));

  if (!album) {
    return c.json({ error: "Album not found" }, 404);
  }

  return c.json(album);
});

albumRouter.get("/search/:title", async (c) => {
  const albums = await albumService.search(c.req.param("title"));
  return c.json(albums);
});

albumRouter.post("/add-song", async (c) => {
  const { albumId, songId } = await c.req.json();

  if (!albumId) {
    return c.json({ error: "Missing parameter: albumId" }, 400);
  }

  if (!songId) {
    return c.json({ error: "Missing parameter: songId" }, 400);
  }

  const album = await albumService.addSong(albumId, songId);

  return c.json(album);
});

albumRouter.post("/remove-song", async (c) => {
  const { albumId, songId } = await c.req.json();

  if (!albumId) {
    return c.json({ error: "Missing parameter: albumId" }, 400);
  }

  if (!songId) {
    return c.json({ error: "Missing parameter: songId" }, 400);
  }

  const album = await albumService.removeSong(albumId, songId);

  return c.json(album);
});

albumRouter.put("/:id", async (c) => {
  const payload = await c.req.json();
  try {
    const album = await albumService.update(Number(c.req.param("id")), payload);

    return c.json(album);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Album already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

albumRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const album = await albumService.delete(Number(c.req.param("id")));

  return c.json(album);
});

export default albumRouter;
