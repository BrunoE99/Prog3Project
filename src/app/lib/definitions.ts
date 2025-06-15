import { z } from "zod";

export const groupJoinSchema = z.object({
  id: z.coerce
    .number()
    .int({ message: "Grupo ID must be an integer" })
    .positive({ message: "Grupo ID must be a positive number" }),
});

export const MeetingFormSchema = z.object({
  fecha: z
    .string()
    .datetime({ message: "Debe ser un dia y tiempo valido" })
    .trim(),
  link: z
    .string()
    .url({
      message: "Debe ser un formate de url valido Ej: https://example.com/abc",
    })
    .trim(),
});

export const reviewFormSchema = z.object({
  puntuacion: z.coerce
    .number()
    .gte(1, { message: "Score must be at least 1" })
    .lte(10, { message: "Score must be at most 10" }),
  texto: z.string().min(1, "Review content must not be empty").trim(),
  pelicula_id: z.coerce
    .number()
    .int({ message: "Pelicula ID must be an integer" })
    .positive({ message: "Pelicula ID must be a positive number" }),
  grupo_id: z
    .number()
    .int({ message: "Grupo ID must be an integer" })
    .positive({ message: "Grupo ID must be a positive number" })
    .optional(),
});

export const reviewEditSchema = z.object({
  puntuacion: z.coerce
    .number()
    .gte(1, { message: "Score must be at least 1" })
    .lte(10, { message: "Score must be at most 10" })
    .optional(),
  texto: z
    .string()
    .min(1, "Review content must not be empty")
    .trim()
    .optional(),
});

export const SignupFormSchema = z.object({
  username: z.string().min(3, { message: "Minimo 3 caracteres." }).trim(),
  email: z
    .string()
    .email({ message: "Porfavor ingrese un email valido. " })
    .min(1, { message: "Debe tener mas caracteres" })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Minimo 8 caracteres" })
    .regex(/[a-zA-Z]/, { message: "Por lo menos 1 letra." })
    .regex(/[0-9]/, { message: "Por lo menos un numero." })
    .trim(),
});

export const LogInFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Ingrese un formato de email valido." })
    .trim(),
  password: z
    .string()
    .min(6, { message: "La password tiene que tener minimo 6 caracteres" })
    .trim(),
});

export const groupEditSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .trim()
    .optional(),
  descripcion: z.string().optional(),
});

export const groupCreateSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .trim(),
  descripcion: z.string().optional(),
});

export const commentSchema = z.object({
  texto: z
    .string()
    .min(1, { message: "El texto debe tener al menos 1 caracter" })
    .trim(),
});

export const movieEditSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre debe tener al menos 1 caracter" })
    .trim()
    .optional(),
  sinopsis: z
    .string()
    .min(1, { message: "La sinopsis debe tener al menos 1 caracter" })
    .trim()
    .optional(),
  genero: z
    .string()
    .min(1, { message: "El genero debe tener al menos 1 caracter" })
    .trim()
    .optional(),
  fechaEstreno: z
    .date({
      message: "La fecha de estreno debe ser una fecha valida. Ej: 01/01/2020",
    })
    .optional(),
  duracion: z
    .number({ message: "La duracion debe ser un numero" })
    .int({ message: "La duracion debe ser un entero" })
    .optional(),
  calificacion: z
    .number({ message: "La calificacion debe ser un numero" })
    .int({ message: "La caliicacioon debe ser un entero" })
    .optional(),
});

export type FormState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
