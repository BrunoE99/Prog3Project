"use server";

import {
  deleteComment,
  getAllCommentsForReview,
  postComment,
} from "../API/comment/route";
import { reviewDelete, reviewUpdate } from "../API/reviews/route";
import { commentSchema, reviewEditSchema } from "../lib/definitions";

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

export async function eraseComment(commentId: number) {
  const response = await deleteComment(commentId);

  return response;
}

export async function findAllCommentsForReview(
  reviewId: number,
  page: number = 0
) {
  const response = await getAllCommentsForReview(reviewId, page);

  return response.body;
}

export async function createComment(reviewId: number, texto: string) {
  const validateFields = commentSchema.safeParse({
    texto: texto,
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const response = await postComment(reviewId, texto);

  return response;
}
