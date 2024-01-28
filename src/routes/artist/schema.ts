import { z } from "zod";

const artistSchema = z.object({
  name: z.string(),
  picture: z.string().optional(),
}).strict();

export default artistSchema;
