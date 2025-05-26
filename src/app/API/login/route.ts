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

        if (!loginRequest.ok) {
            const err = await loginRequest.json();
            return {
                success: false,
                error: 'This failed.',
                message: err?.message || 'Login failed',
            }
        }

        const token = await loginRequest.json();

        if (!token) {
            return {
                success: false,
                message: 'Token was not found.',
            }
        }

        cookieStore.set('auth_token', token, {
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