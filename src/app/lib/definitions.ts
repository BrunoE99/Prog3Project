import "server-only";

import { getTranslations } from "next-intl/server";
import { z } from "zod";

export async function getGroupJoinSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    id: z.coerce
      .number({ message: t("group-join-id-number") })
      .int({ message: t("group-join-id-int") })
      .positive({ message: t("group-join-id-positive") }),
  });
}

export async function getMeetingFormSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    fecha: z
      .string()
      .datetime({ message: t("meeting-form-date") })
      .trim(),
    link: z
      .string()
      .url({
        message: t("meeting-form-link"),
      })
      .trim(),
  });
}

export async function getReviewFormSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    puntuacion: z.coerce.number().gte(1).lte(10),
    texto: z
      .string({ message: t("review-form-content-string") })
      .min(1, { message: t("review-form-content-length") })
      .trim(),
    pelicula_id: z.coerce
      .number({ message: t("review-form-id-number") })
      .int({ message: t("review-form-id-int") })
      .positive({ message: t("review-form-id-positive") }),
    grupo_id: z
      .number({ message: t("group-join-id-number") })
      .int({ message: t("group-join-id-int") })
      .positive({ message: t("group-join-id-positive") })
      .optional(),
  });
}

export async function getReviewEditSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    puntuacion: z.coerce.number().gte(1).lte(10).optional(),
    texto: z
      .string({ message: t("review-form-content-string") })
      .min(1, { message: t("review-form-content-length") })
      .trim()
      .optional(),
  });
}

export async function getSignupFormSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    username: z
      .string({ message: t("signup-form-username-string") })
      .min(3, { message: t("signup-form-username-length") })
      .trim(),
    email: z
      .string({ message: t("signup-form-email-string") })
      .email({ message: t("signup-form-email-format") })
      .min(1, { message: t("signup-form-email-length") })
      .trim(),
    password: z
      .string({ message: t("signup-form-password-string") })
      .min(8, { message: t("signup-form-password-length") })
      .regex(/[a-zA-Z]/, { message: t("signup-form-password-letter") })
      .regex(/[0-9]/, { message: t("signup-form-password-number") })
      .trim(),
  });
}

export async function getLoginFormSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    email: z
      .string({ message: t("signup-form-email-string") })
      .email({ message: t("signup-form-email-format") })
      .trim(),
    password: z
      .string({ message: t("signup-form-password-string") })
      .min(8, { message: t("signup-form-password-length") })
      .trim(),
  });
}

export async function getGroupEditSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    nombre: z
      .string({ message: t("group-edit-name-string") })
      .min(3, { message: t("group-edit-name-length") })
      .trim()
      .optional(),
    descripcion: z
      .string({ message: t("group-edit-description-string") })
      .optional(),
  });
}

export async function getGroupCreateSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    nombre: z
      .string({ message: t("group-edit-name-string") })
      .min(3, { message: t("group-edit-name-length") })
      .trim(),
    descripcion: z
      .string({ message: t("group-edit-description-string") })
      .optional(),
  });
}

export async function getCommentSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    texto: z
      .string({ message: t("comment-form-content-string") })
      .min(1, { message: t("comment-form-content-length") })
      .trim(),
  });
}

export async function getMovieEditSchema() {
  const t = await getTranslations("Validation");
  return z.object({
    nombre: z
      .string({ message: t("movie-edit-name-string") })
      .min(1, { message: t("movie-edit-name-length") })
      .trim()
      .optional(),
    sinopsis: z
      .string({ message: t("movie-edit-synopsis-string") })
      .min(1, { message: t("movie-edit-synopsis-length") })
      .trim()
      .optional(),
    genero: z
      .string({ message: t("movie-edit-genre-string") })
      .min(1, { message: t("movie-edit-genre-length") })
      .trim()
      .optional(),
    fechaEstreno: z
      .date({
        message: t("move-edit-date-format"),
      })
      .optional(),
    duracion: z
      .number({ message: t("movie-edit-length-number") })
      .int({ message: t("movie-edit-length-int") })
      .positive({ message: t("movie-edit-length-positive") })
      .optional(),
    calificacion: z
      .number({ message: t("movie-edit-score-number") })
      .int({ message: t("movie-edit-score-int") })
      .positive({ message: t("movie-edit-score-positive") })
      .optional(),
  });
}

export type FormState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
};
