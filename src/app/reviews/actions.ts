"use server";

import { reviewDelete, reviewUpdate } from "../API/reviews/route";
import { reviewEditSchema } from "../lib/definitions";

export async function eraseReview(id: number) {
  const response = await reviewDelete(id);

  return response;
}

export async function reviewEdit(_: any, formData: FormData) {
  const puntuacion = formData.get("edit-score") as string;
  const texto = formData.get("edit-content") as string;
  const reviewId = formData.get("review_id") as string;
  const editedFields = formData.get("changedFields") as string;
  const [scoreChanged, contentChanged] = editedFields.split(",");

  const validateFields = reviewEditSchema.safeParse({
    puntuacion: scoreChanged === "true" ? puntuacion : undefined,
    texto: contentChanged === "true" ? texto : undefined,
  });

  if (!validateFields.success) {
    return {
      success: validateFields.success,
      status: 400,
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await reviewUpdate(
    Number(reviewId),
    Number(puntuacion),
    texto
  );

  return response;
}
