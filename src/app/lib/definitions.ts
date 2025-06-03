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

export const SignupFormSchema = z.object({
    username: z.string().min(3, { message: 'Minimo 3 caracteres.' }).trim(),
    email: z.string().email({ message: 'Porfavor ingrese un email valido. '}).min(1, { message: 'Debe tener mas caracteres' }).trim(),
    password: z.string()
    .min(8, { message: 'Minimo 8 caracteres' })
    .regex(/[a-zA-Z]/, { message: 'Por lo menos 1 letra.' })
    .regex(/[0-9]/, { message: 'Por lo menos un numero.' })
    .trim(),
})

export const LogInFormSchema = z.object({
    email: z.string().email({ message: 'Ingrese un formato de email valido.' }).trim(),
    password: z.string().min(6, { message: 'La password tiene que tener minimo 6 caracteres' }).trim(),
})

export type FormState = {
    errors?: {
        username?: string[]
        email?: string[]
        password?: string[]
    }
    message?: string
}
