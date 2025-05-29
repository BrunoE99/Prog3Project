"use server";

import { reviewGetAll, reviewPost } from "@/app/API/reviews/route";
import { reviewFormSchema } from "@/app/lib/definitions";
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  return authToken;
}

export async function getAllReviewsByMovie(pelicula_id: number) {
  const response = await reviewGetAll(pelicula_id);

  return response.body;
}

export async function createReview(_: any, formData: FormData) {
  const score = formData.get("score") as string;
  const content = formData.get("content") as string;
  const pelicula_id = formData.get("pelicula_id") as string;

  const validateFields = reviewFormSchema.safeParse({
    score: score,
    content: content,
    pelicula_id: pelicula_id,
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await reviewPost(
    Number(score),
    content,
    Number(pelicula_id)
  );

  console.log(response);

  if (response.status === 201) {
    return {
      success: true,
      message: response.message || "Review created successfully",
    };
  } else {
    return {
      status: response.status,
      error: response.message || "An unexpected error occurred",
    };
  }
}
