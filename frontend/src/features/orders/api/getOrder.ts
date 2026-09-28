import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { OrderDetailsResponse } from '@/types/api';

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data as OrderDetailsResponse;
    },
    enabled: !!id,
  });
};
