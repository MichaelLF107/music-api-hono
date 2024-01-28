import { Hono } from "hono";
import { ZodError } from "zod";
import playlistService from "../../services/playlist";
import playlistSchema from "./schema";

const playlistRouter = new Hono();

playlistRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    playlistSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const playlist = await playlistService.create(payload);

    return c.json(playlist, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Playlist already exists" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

playlistRouter.get("/", async (c) => {
  const playlists = await playlistService.findMany();
  return c.json(playlists);
});

playlistRouter.get("/:id", async (c) => {
  const playlist = await playlistService.findOne(Number(c.req.param("id")));

  if (!playlist) {
    return c.json({ error: "Playlist not found" }, 404);
  }

  return c.json(playlist);
});

playlistRouter.get("/search/:name", async (c) => {
  const playlists = await playlistService.search(c.req.param("name"));
  return c.json(playlists);
});

playlistRouter.post("/add-song", async (c) => {
  const { playlistId, songId } = await c.req.json();

  if (!playlistId) {
    return c.json({ error: "Missing parameter: playlistId" }, 400);
  }

  if (!songId) {
    return c.json({ error: "Missing parameter: songId" }, 400);
  }

  const playlist = await playlistService.addSong(playlistId, songId);

  return c.json(playlist);
});

playlistRouter.post("/remove-song", async (c) => {
  const { playlistId, songId } = await c.req.json();

  if (!playlistId) {
    return c.json({ error: "Missing parameter: playlistId" }, 400);
  }

  if (!songId) {
    return c.json({ error: "Missing parameter: songId" }, 400);
  }

  const playlist = await playlistService.removeSong(playlistId, songId);

  return c.json(playlist);
});

playlistRouter.put("/:id", async (c) => {
  const payload = await c.req.json();
  try {
    playlistSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  const playlist = await playlistService.update(
    Number(c.req.param("id")),
    payload
  );

  return c.json(playlist);
});

playlistRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const playlist = await playlistService.delete(Number(c.req.param("id")));

  return c.json(playlist);
});

export default playlistRouter;
