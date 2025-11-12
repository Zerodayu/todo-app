"use server";

import { api } from '@/lib/axios';
import { getSession } from '@/lib/session';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export async function updateTodo(id: number, is_done: boolean): Promise<Todo> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await api.patch<{ message: string; data: Todo }>(
    `/todos/${id}/toggle`,
    { is_done },
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return response.data.data;
}