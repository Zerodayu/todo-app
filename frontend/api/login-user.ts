import { api } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

type LoginCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
};

export function useLoginUser() {
  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      return api.post<LoginResponse>('/auth/login', credentials)
    },
    onSuccess: (response) => {
      if (response.data.success && response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
    },
  });

  return mutation;
}