'use server'

const api_URL = 'http://localhost:3000'; // change URL to env variable

export async function movieByGenre(genre: string) {
    try {
        const userInfo = await fetch(`${api_URL}/api/peliculas/generos/${genre}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        
        const data = await userInfo.json();
        return data;

    } catch (err) {
        console.error('Signup failed: ', err)
        return {
            success: false,
            message: 'Unexpected error.'
        }
    }
}