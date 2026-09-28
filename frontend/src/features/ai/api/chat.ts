import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
}

export const useChat = () => {
  return useMutation({
    mutationFn: async (request: ChatRequest) => {
      const response = await apiClient.post<ChatResponse>('/api/v1/ai/chat', request);
      return response.data;
    },
  });
};
