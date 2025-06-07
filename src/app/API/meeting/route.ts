"use server";

import { cookies } from "next/headers";

const api_URL = "http:localhost:3000/api/reuniones";

export async function meetingGet() {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;
    const request = await fetch(`${api_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    return await request.json();
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
}

export async function meetingPost(fecha: Date, link: string) {
  try {
    const userCookie = await cookies();
    const token = userCookie.get("auth_token")?.value;

    const request = await fetch(`${api_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fecha: fecha,
        link: link,
      }),
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
