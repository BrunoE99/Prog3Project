'use server'

import { redirect } from 'next/navigation';
import { LogInFormSchema } from '@/app/lib/definitions';
import { logInPost } from '@/app/API/login/route';

export async function logIn(_: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validateFields = LogInFormSchema.safeParse({
        email: email,
        password: password,
    })

    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
        }
    }

    // I need to call a function which encrypts the password

    const duki = await logInPost(email, password);

    console.log(duki);

    redirect('/');
}