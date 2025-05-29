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

    const duki = await logInPost(email, password);

    // this needs to redirect to the profile page maybe?
    // i need to add a message when the login is successfull

    if (duki.success == true) {
        redirect('/');
    } else {
        return {
            errors: duki.message,
        }
    }

}