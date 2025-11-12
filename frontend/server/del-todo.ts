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

export async function deleteTodo(id: number): Promise<{ message: string }> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await api.delete<{ message: string }>(
    `/todos/${id}`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    }
  );

  return response.data;
}