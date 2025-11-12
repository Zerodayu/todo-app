"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutAction() {
  const cookiesStore = await cookies();

  cookiesStore.delete("token");
  cookiesStore.delete("user");

  redirect("/");
}
