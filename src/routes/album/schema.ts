import { z } from "zod";

const albumSchema = z.object({
  title: z.string(),
  cover: z.string().optional(),
  artistId: z.number(),
  genreId: z.number(),
}).strict();

export default albumSchema;
