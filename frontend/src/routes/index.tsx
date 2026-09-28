import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/shared/AppLayout'
import { PublicLayout } from '@/components/shared/PublicLayout'
import { Landing } from '@/features/landing/components/Landing'
import { Login } from '@/features/auth/components/Login'
import { Register } from '@/features/auth/components/Register'
import { Dashboard } from '@/features/dashboard/components/Dashboard'
import { TicketList } from '@/features/tickets/components/TicketList'
import { TicketDetail } from '@/features/tickets/components/TicketDetail'
import { KnowledgeSearch } from '@/features/knowledge/components/KnowledgeSearch'
import { AuditLogs } from '@/features/admin/components/AuditLogs'
import { AiChat } from '@/features/ai/components/AiChat'
import { Orders } from '@/features/orders/components/Orders'
import { OrderDetail } from '@/features/orders/components/OrderDetail'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { 
        path: 'tickets', 
        element: <TicketList />,
        children: [
          { path: ':id', element: <TicketDetail /> }
        ]
      },
      { path: 'knowledge', element: <KnowledgeSearch /> },
      { path: 'audit', element: <AuditLogs /> },
      { path: 'ai', element: <AiChat /> },
      { 
        path: 'orders', 
        element: <Orders />,
        children: [
          { path: ':id', element: <OrderDetail /> }
        ]
      }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
])
