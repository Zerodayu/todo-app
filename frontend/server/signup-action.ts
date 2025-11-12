"use server";

import { api } from "@/lib/axios";
import { redirect } from "next/navigation";

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