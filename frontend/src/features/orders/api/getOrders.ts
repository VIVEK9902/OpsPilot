import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { OrderDetailsResponse } from '@/types/api';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await apiClient.get('/orders');
      return response.data as OrderDetailsResponse[];
    },
  });
};
