import 'server-only'
import { cookies } from 'next/headers'

const api_URL = 'http://localhost:3000';

export async function logInPost(userEmail: string, userPassword: string) { // Password should already be received encrypted
    const cookieStore = await cookies()

    try {
        const loginRequest = await fetch(`${api_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword
            })
        })

        const token = await loginRequest.json();

        if (!loginRequest.ok) {
            return {
                success: false,
                error: 'This failed.',
                message: token?.message || 'Login failed',
            }
        }

        if (!token) {
            return {
                success: false,
                message: 'Token was not found.',
            }
        }

        cookieStore.set('auth_token', token.access_token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            sameSite: 'strict',
            path: '/',
        })

        return {
            success: true,
            messsage: 'Login successful',
        }

    } catch (err) {
        console.error('Login failed: ', err)
        return {
            success: false,
            message: 'Unexpected error.'
        }
    }
}

export async function deleteCookie() {
    (await cookies()).delete('auth_token');
}