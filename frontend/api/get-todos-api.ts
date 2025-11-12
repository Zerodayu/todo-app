import { api } from '@/lib/axios';
import { getSession } from '@/lib/session';

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export async function getTodos(): Promise<Todo[]> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await api.get<Todo[]>('/todos', {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  console.log('Todos response:', response.data);
  return response.data;
}