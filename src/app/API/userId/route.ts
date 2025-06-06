"use server";

import { DecodeToken } from "@/actions";
import { cookies } from "next/headers";

const api_URL = "http:localhost:3000"; // change URL to env variable

export async function userById(userId: number) {
  const token = (await cookies()).get("auth_token")?.value;

  if (token) {
    const decoded = await DecodeToken(token);

    try {
      const userInfo = await fetch(`${api_URL}/api/users/${decoded.sub}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const answer = userInfo;

      console.log(answer);
    } catch (err) {
      console.error("Signup failed: ", err);
      return {
        success: false,
        message: "Unexpected error.",
      };
    }
  }
}
