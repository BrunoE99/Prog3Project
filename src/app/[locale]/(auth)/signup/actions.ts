"use server";

import { redirect } from "next/navigation";
import { signUpPost } from "@/app/API/signup/route";
import { getSignupFormSchema } from "@/app/lib/definitions";

export async function signUp(_: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const SignupFormSchema = await getSignupFormSchema();

  const validateFields = SignupFormSchema.safeParse({
    username: username,
    email: email,
    password: password,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  // I need to call a function which encrypts the password

  const response = await signUpPost(username, email, password);

  if (response.status == 201 || response.status == 200) {
    redirect("/login?signup=success");
  } else if (response.status == 400) {
    return {
      success: false,
      message: "Already used",
    };
  } else {
    return {
      success: false,
      message: "Unknown error",
    };
  }
}
