import { Hono } from "hono";
import { ZodError } from "zod";
import userService from "../../services/user";
import userSchema from "./schema";

const userRouter = new Hono();

userRouter.post("/create", async (c) => {
  const payload = await c.req.json();
  try {
    userSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const user = await userService.create(payload);

    return c.json(user, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Email already in use" }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.get("/", async (c) => {
  const users = await userService.findMany();
  return c.json(users);
});

userRouter.get("/:id", async (c) => {
  const user = await userService.findById(Number(c.req.param("id")));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

userRouter.get("/email/:email", async (c) => {
  const user = await userService.findByEmail(c.req.param("email"));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

userRouter.get("/search/:name", async (c) => {
  const users = await userService.search(c.req.param("name"));
  return c.json(users);
});

userRouter.post("/like-song/:songId", async (c) => {
  const songId = c.req.param("songId");
  const userId = c.get("user").id;

  try {
    await userService.likeSong(userId, Number(songId));
    return c.json({ message: "Song liked" }, 201);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Song not found" }, 404);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.post("/unlike-song/:songId", async (c) => {
  const songId = c.req.param("songId");
  const userId = c.get("user").id;

  try {
    await userService.unlikeSong(userId, Number(songId));
    return c.json({ message: "Song unliked" }, 201);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Song not found" }, 404);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.post("/like-album/:albumId", async (c) => {
  const albumId = c.req.param("albumId");
  const userId = c.get("user").id;

  try {
    await userService.likeAlbum(userId, Number(albumId));
    return c.json({ message: "Album liked" }, 201);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Album not found" }, 404);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.post("/unlike-album/:albumId", async (c) => {
  const albumId = c.req.param("albumId");
  const userId = c.get("user").id;

  try {
    await userService.unlikeAlbum(userId, Number(albumId));
    return c.json({ message: "Album unliked" }, 201);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Album not found" }, 404);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.put("/:id", async (c) => {
  const userId = Number(c.req.param("id"));
  const payload = await c.req.json();

  try {
    userSchema.parse(payload);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }

  try {
    const user = await userService.findById(userId);
    if (user?.id !== c.get("user").id && !c.get("user").admin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const updatedUser = await userService.update(userId, payload);
    return c.json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "User not found" }, 404);
    }
    console.log(error);
    return c.json({ error: "Unexpected error" }, 500);
  }
});

userRouter.delete("/:id", async (c) => {
  if (!c.get("user").admin) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = Number(c.req.param("id"));
  userService.delete(userId);
  return c.json({ message: "User deleted" });
});

export default userRouter;
