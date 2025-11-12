"use server";

import { api } from "@/lib/axios";
import { redirect } from "next/navigation";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupResponse = {
  success: boolean;
  message: string;
  data?: {
    email: string;
    name?: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

export async function SignupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  // Validate input with Zod
  const validationResult = signupSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  }

  try {
    const response = await api.post<SignupResponse>("/auth/create", {
      name,
      email,
      password,
    });

    if (response.data.success) {
      redirect("/auth/login");
    }

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      errors: response.data.errors,
    };
  } catch (error: any) {
    if (error) {
      throw error;
    }

    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
      errors: error.response?.data?.errors,
    };
  }
}