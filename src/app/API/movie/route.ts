import "server-only";

const api_URL = "http:localhost:3000/api/peliculas";


export async function getAllMovies(pagination: number) {
  const params = new URLSearchParams ({
    page: pagination.toString(),
  });

  try {
    const request = await fetch(`${api_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = request;
    const responseJson = await request.json();

    if (response.status === 200) {
      return responseJson;
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: responseJson.message || "Bad request",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}


export async function getMovie(pelicula_id: number) {
  try {
    const request = await fetch(`${api_URL}/${pelicula_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = request;
    const responseJson = await request.json();

    if (response.status === 200) {
      return {
        status: response.status,
        body: responseJson,
      };
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: responseJson.message || "Bad request",
      };
    } else {
      return {
        status: response.status,
        message: "An unexpected error ocurred",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

export async function movieByGenre(genre: string) {
  const pagination = 0;

    try {
        const userInfo = await fetch(`${api_URL}/generos/${genre}?page=${pagination}`, {
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