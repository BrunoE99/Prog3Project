import 'server-only'
import { cookies } from 'next/headers'

const api_URL = 'http:localhost:3000'; // change URL to env variable

export async function signUpPost(username: string, userEmail: string, userPassword: string) {  // Password should already be encripted
    try {
        const signupRequest = await fetch(`${api_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: userEmail,
                password: userPassword
            })
        })


        const answer = signupRequest;
        const answerJson = await signupRequest.json();

        if (answer.status == 201) {
            return {
                status: answer.status,
                body: answerJson,
            }
        } else if (answer.status == 400) {
            return {
                status: answer.status,
                message: answerJson?.message || 'User already exists.',
            }
        } else {
            return {
                status: answer.status,
                message: answerJson?.message || 'Unkown error.'
            }
        }

    } catch (err) {
        console.error('Signup failed: ', err)
        return {
            success: false,
            message: 'Unexpected error.'
        }
    }
}