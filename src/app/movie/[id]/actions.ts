"use server";

import { getAllMoviesByName, getMovie } from "@/app/API/movie/route";
import { reviewGetAllPaged, reviewPost } from "@/app/API/reviews/route";
import { reviewFormSchema } from "@/app/lib/definitions";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

type JwtBody = {
  sub: number;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

export async function getAuthToken() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  return authToken;
}

export async function getDecodedToken() {
  const token = await getAuthToken();
  if (!token) return undefined;
  const decoded = jwtDecode<JwtBody>(token);

  return decoded;
}

export async function retrieveFilteredMovies(name: string) {
  const response = await getAllMoviesByName(name);

  return response;
}

export async function getMovieById(pelicula_id: number) {
  const response = await getMovie(pelicula_id);

  return response.body;
}

export async function getFeaturedReviews(pelicula_id: number) {
  const allReviews = await reviewGetAllPaged(pelicula_id);
  const featuredReviews = [];
  if (!allReviews.body) {
    return [];
  }
  const numberOfReviews: number =
    2 > allReviews.body.length ? allReviews.body.length : 2;
  for (let i = 0; i < numberOfReviews; i++) {
    featuredReviews.push(allReviews.body[i]);
  }

  return featuredReviews;
}

export async function getAllReviewsByMovie(pelicula_id: number, page: number) {
  const response = await reviewGetAllPaged(pelicula_id, page);
  if (response.body) {
    return response.body;
  }

  return [];
}

export async function createReview(_: any, formData: FormData) {
  const score = formData.get("score") as string;
  const content = formData.get("content") as string;
  const pelicula_id = formData.get("pelicula_id") as string;
  const grupoId = formData.get("grupo_id") as string;

  const validateFields = reviewFormSchema.safeParse({
    puntuacion: score,
    texto: content,
    pelicula_id: pelicula_id,
    grupo_id: grupoId ? Number(grupoId) : undefined,
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await reviewPost(
    Number(score),
    content,
    Number(pelicula_id),
    grupoId ? Number(grupoId) : undefined
  );

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
