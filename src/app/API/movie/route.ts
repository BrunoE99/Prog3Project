import "server-only";

interface MovieComponents {
  id: number;
  nombre: string;
  sinopsis: string;
  genero: { id: number; nombre: string };
  fechaEstreno: string;
  duracion: number;
  urlImagen: string;
  calificacion: number;
}

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

export async function getAllMovies() {
  try {
    const movies: MovieComponents[] = [];
    let request = await fetch(`${api_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = request.status;
    let response: MovieComponents[] = await request.json();
    if (status === 200) {
      response.forEach((movie) => {
        movies.push(movie);
      });
    }

    let i = 1;
    while (request.status === 200) {
      const params = new URLSearchParams({ page: String(i) });

      request = await fetch(`${api_URL}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (request.status === 200) {
        response = await request.json();
        response.forEach((movie) => {
          movies.push(movie);
        });
      }
      i++;
    }

    return movies;
  } catch (e) {
    console.error(e);
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
