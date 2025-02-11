import { loginFormSchema, FormState } from "@/lib/definitions";
import { redirect } from "next/navigation";
  export async function login(state: FormState, formData: FormData) {
  if (!formData) {
    console.error("formData is undefined");
    return { errors: { email: ["Form data is missing"] } };
  }

  console.log("FormData received:", Object.fromEntries(formData.entries()));

  // Validate form fields
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  redirect('/otp-verification')


}
