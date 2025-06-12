"use server";

import { commentSchema } from "@/app/lib/definitions";
import { deleteComment, getAllCommentsForReview, postComment } from "./route";

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

  console.log(response);

  return response;
}
