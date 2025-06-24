import { cookies } from "next/headers";
import "server-only";

const api_URL = `${process.env.api_URL}/api/reviews`;

export async function reviewGetAllPaged(pelicula_id: number, page: number = 0) {
  try {
    const params = new URLSearchParams({ page: String(page) });
    const request = await fetch(`${api_URL}/${pelicula_id}?${params}`, {
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

export async function reviewPost(
  puntuacion: number,
  texto: string,
  pelicula_id: number,
  grupo_id?: number
) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    if (!token) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }

    const request = await fetch(`${api_URL}/${pelicula_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        puntuacion: Number(puntuacion),
        texto: String(texto),
        grupoId: grupo_id,
      }),
    });

    const answer = request;
    const answerJson = await request.json();

    if (answer.status == 201) {
      return {
        status: answer.status,
        body: answerJson,
      };
    } else if (answer.status >= 400) {
      return {
        status: answer.status,
        message: answerJson.message,
      };
    } else {
      return {
        status: answer.status,
        message: "An unexpected error occurred",
      };
    }
  } catch (error) {
    console.error("Error in reviewPost:", error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function groupReviewsGetAllPaged(
  grupoId: number,
  page: number = 0
) {
  try {
    const params = new URLSearchParams({ page: String(page) });
    const request = await fetch(`${api_URL}/grupo/${grupoId}?${params}`, {
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

export async function reviewUpdate(
  id: number,
  puntuacion?: number,
  texto?: string
) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const body: { puntuacion?: number; texto?: string } = {};
    if (puntuacion !== undefined) body.puntuacion = puntuacion;
    if (texto !== undefined) body.texto = texto;

    const request = await fetch(`${api_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
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
      error: "Internal Server Error",
    };
  }
}

export async function reviewDelete(id: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const answer = request;

    if (answer.status == 200) {
      return {
        status: answer.status,
        success: true,
      };
    } else {
      const answerJson = await request.json();
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

export async function reviewByUserID(userId: number, pagination: number) {
  const params = new URLSearchParams({
    page: pagination.toString(),
  });

  try {
    const request = await fetch(
      `${api_URL}/user/${userId}?${params.toString()}`,
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
        status: response.status,
        reviews: responseJson,
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
        message: responseJson.message || "Reviews not found",
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
      message: "Internal server error",
    };
  }
}

export async function reviewsByMovieCount(movieId: number) {
  try {
    const request = await fetch(`${api_URL}/pelicula/${movieId}/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = request;
    const responseJson = await request.json();

    if (response.status === 200) {
      return responseJson.cantidad;
    } else if (response.status === 400) {
      return {
        status: response.status,
        message: responseJson.message || "Bad request",
      };
    } else if (response.status === 404) {
      return {
        status: response.status,
        message: responseJson.message || "Movie not found",
      };
    } else {
      return {
        status: response.status,
        message: responseJson.message || "Unexpected error",
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
