"use server";

import { db } from "@/db/drizzle";
import { todosTable, InsertTodo } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createTodo(InsertTodoData: InsertTodo) {
  try {
    const newTodo = await db.insert(todosTable).values(InsertTodoData);
    return newTodo;
  } catch (error) {
    console.error("Error creating todo:", error);
    return error;
  }
}

export async function getTodos(userId: number) {
  try {
    const userTodos = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.user_id, userId));
    return userTodos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return error;
  }
}

export async function getTodoById(id: number, userId: number) {
  try {
    const getTodo = await db
      .select()
      .from(todosTable)
      .where(eq(todosTable.id, id))
      .limit(1);

    if (getTodo[0] && getTodo[0].user_id !== userId) {
      return null;
    }

    return getTodo[0];
  } catch (error) {
    console.error("Error fetching todo by id:", error);
    return error;
  }
}

export async function updateTodoStatus(id: number, isDone: boolean, userId: number) {
  try {
    const todo = await getTodoById(id, userId);
    if (!todo) {
      return null;
    }

    const updatedTodo = await db
      .update(todosTable)
      .set({ is_done: isDone })
      .where(eq(todosTable.id, id));
    return updatedTodo;
  } catch (error) {
    console.error("Error updating todo status:", error);
    return error;
  }
}

export async function updateTodo(id: number, data: { title?: string; is_done?: boolean }, userId: number) {
  try {
    const todo = await getTodoById(id, userId);
    if (!todo) {
      return null;
    }

    const updatedTodo = await db
      .update(todosTable)
      .set(data)
      .where(eq(todosTable.id, id))
      .returning();
    return updatedTodo[0];
  } catch (error) {
    console.error("Error updating todo:", error);
    return error;
  }
}

export async function deleteTodo(id: number, userId: number) {
  try {
    const todo = await getTodoById(id, userId);
    if (!todo) {
      return null;
    }

    const deletedTodo = await db
      .delete(todosTable)
      .where(eq(todosTable.id, id));
    return deletedTodo;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return error;
  }
}