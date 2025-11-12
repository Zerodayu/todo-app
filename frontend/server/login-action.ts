"use server";

import { api } from "@/lib/axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

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

  // Validate input
  const validationResult = loginSchema.safeParse({ email, password });

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => ({
      field: err.path[0] as string,
      message: err.message,
    }));

    return {
      success: false,
      message: "Validation failed",
      errors,
    };
  }

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
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      errors: error.response?.data?.errors,
    };
  }
}