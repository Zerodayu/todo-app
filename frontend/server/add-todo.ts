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

  const response = await api.post<{ message: string; data: Todo }>(
    '/todos',
    {
      title,
      is_done,
    },
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  revalidatePath('/');
  return response.data.data;
}