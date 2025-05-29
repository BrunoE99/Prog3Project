import { z } from "zod";

export const reviewFormSchema = z.object({
  score: z.coerce
    .number()
    .gte(1, { message: "Score must be at least 1" })
    .lte(10, { message: "Score must be at most 10" }),
  content: z.string(),
  pelicula_id: z.coerce
    .number()
    .int({ message: "Pelicula ID must be an integer" })
    .positive({ message: "Pelicula ID must be a positive number" }),
});
