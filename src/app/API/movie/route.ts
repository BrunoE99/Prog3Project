import "server-only";

const api_URL = "http:localhost:3000/api/peliculas";

export async function getAllMoviesByName(name: string) {
  try {
    const params = new URLSearchParams({ q: name });
    const request = await fetch(`${api_URL}/search/name?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      error: "An unexpected error ocurred",
    };
  }
}


export async function getAllMovies(pagination: number, rating?: string | null, alphabetic?: string | null) {
  const params = new URLSearchParams({
    page: pagination.toString()
  });

  if (rating) params.append('rating', rating);
  if (alphabetic) params.append('alphabetic', alphabetic);

  // console.log(params.toString());

  try {
    const request = await fetch(`${api_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = request;
    const responseJson = await request.json();
    // console.log('response json: ', responseJson);

    if (response.status === 200) {
      return {
        movies: responseJson,
        currentPage: pagination,
        hasMovies: true
      };
    } else if (response.status === 400) {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Bad request",
      };
    } else if (response.status === 404) {
      return {
        status: response.status,
        currentPage: pagination,
        hasMovies: false,
        message: responseJson.message || "No se encontraron peliculas"
      }
    } else {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Unexpected error"
      }
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      hasMovies: false,
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

export async function movieByGenre(genre: string, pagination: number, rating?: string | null, alphabetic?: string | null) {
  const params = new URLSearchParams({
    page: pagination.toString()
  });

  if (rating) params.append('rating', rating);
  if (alphabetic) params.append('alphabetic', alphabetic);

  try {
    const request = await fetch(`${api_URL}/generos/${genre}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const response = request;
    const responseJson = await request.json()
    // return data;

    if (response.status === 200) {
      return {
        movies: responseJson,
        currentPage: pagination,
        hasMovies: true
      };
    } else if (response.status === 400) {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Bad request",
      };
    } else if (response.status === 404) {
      return {
        status: response.status,
        currentPage: pagination,
        hasMovies: false,
        message: responseJson.message || "No se encontraron peliculas"
      }
    } else {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Unexpected error"
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
