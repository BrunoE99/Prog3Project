import { z } from "zod";

export const reviewFormSchema = z.object({
  puntuacion: z.coerce
    .number()
    .gte(1, { message: "Score must be at least 1" })
    .lte(10, { message: "Score must be at most 10" }),
  texto: z.string().min(1, "Review content must not be empty"),
  pelicula_id: z.coerce
    .number()
    .int({ message: "Pelicula ID must be an integer" })
    .positive({ message: "Pelicula ID must be a positive number" }),
});
