"use server";

import { db } from "@/db/drizzle";
import { usersTable, InsertUser } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUsers() {
  try {
    const allUsers = await db.select().from(usersTable);
    return allUsers;

  } catch (error) {
    console.error("Error fetching users:", error);
    return error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const getUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return getUser[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return error;
  }
}

export async function createUser(InsertUserData: InsertUser) {
  try {
    const newUser = await db.insert(usersTable).values(InsertUserData);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return error;
  }
}