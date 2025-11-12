"use server";

import { api } from '@/lib/axios';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

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

  // Basic validation
  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }
  
  if (title.length > 255) {
    throw new Error("Title must be less than 255 characters");
  }

  const response = await api.post<{ message: string; data: Todo }>(
    '/todos',
    { title: title.trim(), is_done },
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  revalidatePath('/');
  return response.data.data;
}