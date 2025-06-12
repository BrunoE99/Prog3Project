"use server";

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
  const response = await postComment(reviewId, texto);

  return response;
}
