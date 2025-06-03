'use server'

import { DecodeToken } from "@/actions";
import { cookies } from "next/headers";

const api_URL = 'http:localhost:3000'; // change URL to env variable

export async function userById(userId: number) {
    const token = (await cookies()).get('auth_token')?.value;

    if (token) {
        try {
            const userInfo = await fetch(`${api_URL}/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const answer = await userInfo.json();
            return answer;
        } catch (err) {
            console.error('Signup failed: ', err)
            return {
                success: false,
                message: 'Unexpected error.'
            }
        }
    }
}

// export async function updateProfilePicture() {

// }