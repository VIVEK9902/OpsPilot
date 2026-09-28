export type Role = 'CUSTOMER' | 'SUPPORT_AGENT' | 'ADMIN';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ACCOUNT' | 'BILLING' | 'TECHNICAL' | 'GENERAL';
}

export interface TicketUpdateRequest {
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  category?: 'ACCOUNT' | 'BILLING' | 'TECHNICAL' | 'GENERAL';
  assignedAgentId?: number;
}

export interface TicketNoteRequest {
  note: string;
}

export interface TicketResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  customer: UserDto;
  assignee?: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface TicketNoteResponse {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface OrderDetailsResponse {
  id: number;
  customerId: number;
  customerName: string;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shipmentStatus: 'NOT_SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
  createdAt: string;
  updatedAt: string;
  cancellationEligible: boolean;
  mockPaymentSummary?: {
    orderId: number;
    gatewayTransactionId: string;
    paymentMethod: string;
    status: string;
    processedAt: string;
  };
}

export interface KnowledgeSearchResponse {
  documents: {
    id: string;
    title: string;
    content: string;
    sourceType: string;
    score: number;
  }[];
}

export interface ChatResponse {
  message: string;
  role: 'assistant';
  sources?: any[];
  toolCalls?: any[];
}

export interface AuditLog {
  id: number;
  action: string;
  actor: string;
  resource: string;
  result: string;
  reason?: string;
  timestamp: string;
  correlationId?: string;
  details?: string;
}
