import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import "server-only";

const api_URL = "http:localhost:3000";

type JwtBody = {
  sub: number;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

export async function reviewPost(
  score: number,
  content: string,
  pelicula_id: number
  //user_id: number
) {
  try {
    // Need to implement getting the user ID
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    if (!token) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }

    let userId = null;
    const claims = jwtDecode<JwtBody>(token);
    userId = claims.sub;
    const request = await fetch(`${api_URL}/api/reviews/${pelicula_id}`, {
      method: "POST",
      headers: {
        contentType: "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        score: score,
        content: content,
        user_id: userId,
        grupo_id: null,
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
