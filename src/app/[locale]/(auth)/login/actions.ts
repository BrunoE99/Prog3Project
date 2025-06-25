"use server";

import { redirect } from "next/navigation";
import { logInPost } from "@/app/API/login/loginRoute";
import { getLoginFormSchema } from "@/app/lib/definitions";

export async function logIn(_: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const LogInFormSchema = await getLoginFormSchema();

  const validateFields = LogInFormSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    };
  }

  const duki = await logInPost(email, password);

  // this needs to redirect to the profile page maybe?
  // i need to add a message when the login is successfull

  if (duki.success == true) {
    redirect("/?login=success");
  } else {
    return {
      errors: duki.message,
    };
  }
}
