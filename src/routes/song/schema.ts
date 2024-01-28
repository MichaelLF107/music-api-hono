import { z } from "zod";

const songSchema = z.object({
  title: z.string(),
  cover: z.string().optional(),
  artistId: z.number(),
  genreId: z.number(),
}).strict();

export default songSchema;
