import { cookies } from "next/headers";
import "server-only";

const api_URL = "http:localhost:3000/api/comentarios";

export async function postComment(reviewId: number, texto: string) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    const request = await fetch(`${api_URL}/${reviewId}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto: texto,
      }),
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function deleteComment(commentId: number) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    return await request.json();
  } catch (e) {
    console.error(e);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function getAllCommentsForReview(
  reviewId: number,
  page: number = 0
) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const params = new URLSearchParams({ page: String(page) });
    const request = await fetch(`${api_URL}/${reviewId}?${params}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
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
