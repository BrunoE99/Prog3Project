import "server-only";

const api_URL = "http:localhost:3000/api/generos";

export async function getAllGenres() {
  try {
    const request = await fetch(`${api_URL}`, {
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
