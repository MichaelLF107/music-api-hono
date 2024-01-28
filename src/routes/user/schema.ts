import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().optional(),
}).strict();

export default userSchema;
