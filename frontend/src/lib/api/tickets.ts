import { apiClient } from './client';
import type { 
  TicketResponse, 
  TicketCreateRequest, 
  TicketUpdateRequest, 
  TicketNoteRequest, 
  TicketNoteResponse 
} from '@/types/api';

export const ticketApi = {
  getTickets: async (): Promise<TicketResponse[]> => {
    const res = await apiClient.get('/tickets');
    return res.data;
  },
  
  getTicket: async (id: string | number): Promise<TicketResponse> => {
    const res = await apiClient.get(`/tickets/${id}`);
    return res.data;
  },

  createTicket: async (data: TicketCreateRequest): Promise<TicketResponse> => {
    const res = await apiClient.post('/tickets', data);
    return res.data;
  },

  updateTicket: async (id: string | number, data: TicketUpdateRequest): Promise<TicketResponse> => {
    const res = await apiClient.patch(`/tickets/${id}`, data);
    return res.data;
  },

  addTicketNote: async (id: string | number, data: TicketNoteRequest): Promise<TicketNoteResponse> => {
    const res = await apiClient.post(`/tickets/${id}/notes`, data);
    return res.data;
  },

  getTicketNotes: async (id: string | number): Promise<TicketNoteResponse[]> => {
    const res = await apiClient.get(`/tickets/${id}/notes`);
    return res.data;
  }
};
