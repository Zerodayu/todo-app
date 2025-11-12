"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

export async function LoginAction(formData: FormData) {
  const cookiesStore = await cookies();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data.success && response.data.data) {
      // Store token in httpOnly cookie (more secure than localStorage)
      cookiesStore.set("token", response.data.data.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Store user data in a separate cookie (not httpOnly so it's accessible client-side)
      cookiesStore.set("user", JSON.stringify(response.data.data.user), {
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      redirect("/");
    }

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      errors: response.data.errors,
    };
  } catch (error: any) {
    if ((error)) {
      throw error;
    }

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      errors: error.response?.data?.errors,
    };
  }
}