"use server";

import { api } from '@/lib/axios';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const addTodoSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
  is_done: z.boolean().default(false),
});

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export async function addTodo(title: string, is_done: boolean = false): Promise<Todo | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Validate input
  const validatedData = addTodoSchema.safeParse({ title, is_done });

  const response = await api.post<{ message: string; data: Todo }>(
    '/todos',
    validatedData,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  revalidatePath('/');
  return response.data.data;
}