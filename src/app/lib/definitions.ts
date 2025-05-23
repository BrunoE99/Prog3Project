import { z } from 'zod'

export const SignupFormSchema = z.object({
    email: z.string().email({ message: 'Porfavor ingrese un email valido.'}).min(1, { message: 'Debe tener mas caracteres' }).trim(),
    password: z.string()
    .min(8, { message: 'La password tiene que tener minimo 8 caracteres' })
    .regex(/[a-zA-Z]/, { message: 'Debe contener por lo menos 1 letra.' })
    .regex(/[0-9]/, { message: 'Debe contener por lo menos un numero.' })
    .trim(),
})

export const LogInFormSchema = z.object({
    email: z.string().email({ message: 'Ingrese un formato de email valido.' }).trim(),
    password: z.string().trim(),
})

export type FormState = {
    errors?: {
        email?: string[]
        password?: string[]
    }
    message?: string
}