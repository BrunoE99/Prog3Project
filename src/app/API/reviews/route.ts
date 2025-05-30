import { cookies } from "next/headers";
import "server-only";

const api_URL = "http:localhost:3000/api/reviews";

export async function reviewGetAll(pelicula_id: number) {
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

export async function reviewPost(
  puntuacion: number,
  texto: string,
  pelicula_id: number
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
        grupoId: undefined,
      }),
    });

    const answer = request;
    const answerJson = await request.json();

    if (answer.status == 201) {
      return {
        status: answer.status,
        body: answerJson,
      };
    } else if (answer.status == 400) {
      return {
        status: answer.status,
        message: answerJson.message || "Bad Request",
      };
    } else if (answer.status === 401) {
      return {
        status: answer.status,
        message: answerJson.message || "Expired token",
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
