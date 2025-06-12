"use server";

import { reviewDelete, reviewUpdate } from "../API/reviews/route";

export async function eraseReview(id: number) {
  const response = await reviewDelete(id);

  return response;
}

export async function reviewEdit(
  reviewId: number,
  texto?: string,
  puntuacion?: number
) {
  const response = await reviewUpdate(reviewId, puntuacion, texto);

  return response;
}
