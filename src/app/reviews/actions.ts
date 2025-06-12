"use server";

import { reviewDelete, reviewUpdate } from "../API/reviews/route";
import { reviewEditSchema } from "../lib/definitions";

export async function eraseReview(id: number) {
  const response = await reviewDelete(id);

  return response;
}

export async function reviewEdit(
  reviewId: number,
  texto?: string,
  puntuacion?: number
) {
  const validateFields = reviewEditSchema.safeParse({
    puntuacion: puntuacion,
    texto: texto,
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await reviewUpdate(reviewId, puntuacion, texto);

  return response;
}
