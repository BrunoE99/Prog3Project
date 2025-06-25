"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const api_URL = `${process.env.api_URL}/api/users/`; // change URL to env variable

export async function userById(userId: number) {
  const token = (await cookies()).get("auth_token")?.value;

  if (token) {
    try {
      const userInfo = await fetch(`${api_URL}${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const answer = await userInfo.json();
      return answer;
    } catch (err) {
      console.error("Signup failed: ", err);
      return {
        success: false,
        message: "Unexpected error.",
      };
    }
  }
}

export async function updateProfilePicture(file: File): Promise<any> {
  const token = (await cookies()).get("auth_token")?.value;
  const formData = new FormData();
  formData.append("file", file);

  if (token) {
    try {
      const success = await fetch(`${api_URL}profile-image`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (success.ok) {
        revalidatePath("/profile");
      }

      return success.json();
    } catch (err) {
      console.error("Upload failed: ", err);
      return err;
    }
  }
}
