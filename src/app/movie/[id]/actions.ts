"use server";

export async function createReview(_: any, formData: FormData) {
  const score = formData.get("score") as string;
  const content = formData.get("content") as string;

  console.log("Creating review with score:", score, "and content:", content);
}
