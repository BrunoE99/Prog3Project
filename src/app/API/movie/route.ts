import { cookies } from "next/headers";
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

export async function getAllMovies(
  pagination: number,
  rating?: string | null,
  alphabetic?: string | null
) {
  const params = new URLSearchParams({
    page: pagination.toString(),
  });

  if (rating) params.append("rating", rating);
  if (alphabetic) params.append("alphabetic", alphabetic);

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
      return {
        movies: responseJson,
        currentPage: pagination,
        hasMovies: true,
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
        message: responseJson.message || "No se encontraron peliculas",
      };
    } else {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Unexpected error",
      };
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

export async function movieByGenre(
  genre: string,
  pagination: number,
  rating?: string | null,
  alphabetic?: string | null
) {
  const params = new URLSearchParams({
    page: pagination.toString(),
  });

  if (rating) params.append("rating", rating);
  if (alphabetic) params.append("alphabetic", alphabetic);

  try {
    const request = await fetch(
      `${api_URL}/generos/${genre}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = request;
    const responseJson = await request.json();

    if (response.status === 200) {
      return {
        movies: responseJson,
        currentPage: pagination,
        hasMovies: true,
      };
    } else if (response.status === 400) {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Bad request",
        movies: [],
      };
    } else if (response.status === 404) {
      return {
        status: response.status,
        currentPage: pagination,
        hasMovies: false,
        message: responseJson.message || "No se encontraron peliculas",
        movies: [],
      };
    } else {
      return {
        status: response.status,
        hasMovies: false,
        message: responseJson.message || "Unexpected error",
        movies: [],
      };
    }
  } catch (err) {
    console.error("Signup failed: ", err);
    return {
      success: false,
      message: "Unexpected error.",
    };
  }
}

export async function deleteMovie(movieId: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const answer = request;
    const answerJson = await request.json();

    if (answer.status == 201) {
      return {
        status: answer.status,
        body: answerJson,
      };
    } else {
      return {
        status: answer.status,
        message: answerJson.message || "An unexpected error ocurred",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function movieUpdate(
  id: number,
  movieDto: {
    nombre?: string;
    sinopsis?: string;
    genero?: string;
    fechaEstreno?: Date;
    duracion?: number;
    calificacion?: number;
  }
) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(movieDto),
    });

    const answer = request;
    const answerJson = await request.json();

    if (answer.status == 200) {
      return {
        status: answer.status,
        body: answerJson,
      };
    } else {
      return {
        status: answer.status,
        error: answerJson.message || "An unexpected error ocurred",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}
