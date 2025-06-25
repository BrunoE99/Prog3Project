"use server";

import {
  deleteMovie,
  getAllMoviesByName,
  getMovie,
  movieUpdate,
} from "@/app/API/movie/movieRoute";
import { reviewGetAllPaged, reviewPost } from "@/app/API/reviews/reviewsRoute";
import { getMovieEditSchema, getReviewFormSchema } from "@/app/lib/definitions";
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

export async function retrieveFilteredMovies(
  name: string,
  page: number = 0,
  alphabetic?: "asc" | "desc",
  rating?: "asc" | "desc"
) {
  const response = await getAllMoviesByName(name, page, alphabetic, rating);

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

  const reviewFormSchema = await getReviewFormSchema();

  const validateFields = reviewFormSchema.safeParse({
    puntuacion: score,
    texto: content,
    pelicula_id: pelicula_id,
    grupo_id: grupoId ? Number(grupoId) : undefined,
  });

  if (!validateFields.success) {
    return {
      success: false,
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

export async function eraseMovie(movieId: number) {
  const response = await deleteMovie(movieId);

  return response;
}

export async function editMovie(_: any, formData: FormData) {
  const id = formData.get("id") as string;
  const nombre = formData.get("movie-name") as string;
  const sinopsis = formData.get("movie-synopsis") as string;
  const genero = formData.get("movie-genre") as string;
  const fechaEstreno = formData.get("estreno") as string;
  const hours = formData.get("hours") as string;
  const minutes = formData.get("minutes") as string;
  const duracion = Number(hours) * 60 + Number(minutes);
  const calificacion = formData.get("calificacion") as string;
  const editedFields = formData.get("changedFields") as string;

  const fields = editedFields.replace("{", "").replace("}", "").split(",");
  const changed: boolean[] = fields.map((field) => {
    const values = field.split(":");
    return values[1] === "true";
  });

  const movieDto: {
    nombre?: string;
    sinopsis?: string;
    genero?: string;
    fechaEstreno?: Date;
    duracion?: number;
    calificacion?: number;
  } = {
    nombre: changed[0] ? nombre : undefined,
    sinopsis: changed[1] ? sinopsis : undefined,
    genero: changed[2] ? genero : undefined,
    fechaEstreno: changed[3] ? new Date(fechaEstreno) : undefined,
    duracion: changed[4] ? duracion : undefined,
    calificacion: changed[5] ? Number(calificacion) : undefined,
  };

  const movieEditSchema = await getMovieEditSchema();

  const validateFields = movieEditSchema.safeParse({
    nombre: movieDto.nombre,
    sinopsis: movieDto.sinopsis,
    genero: movieDto.genero,
    fechaEstreno: movieDto.fechaEstreno,
    duracion: movieDto.duracion,
    calificacion: movieDto.calificacion,
  });

  if (!validateFields.success) {
    return {
      success: false,
      status: 400,
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await movieUpdate(Number(id), movieDto);

  return response;
}
