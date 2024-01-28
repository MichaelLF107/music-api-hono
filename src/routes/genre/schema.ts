import { z } from "zod";

const genreSchema = z.object({
  name: z.string(),
}).strict();

export default genreSchema;
