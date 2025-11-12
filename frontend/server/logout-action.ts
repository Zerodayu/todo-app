"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutAction() {
  const cookiesStore = await cookies();

  // Delete the authentication cookies
  cookiesStore.delete("token");
  cookiesStore.delete("user");

  // Redirect to login page
  redirect("/");
}
