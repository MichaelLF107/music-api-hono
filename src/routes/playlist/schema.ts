import { z } from "zod";

const playlistSchema = z.object({
  name: z.string(),
  cover: z.string().optional(),
}).strict();

export default playlistSchema;
