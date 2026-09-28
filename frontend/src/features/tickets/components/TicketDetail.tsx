import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import { ticketApi } from "@/lib/api/tickets"
import type { TicketResponse } from "@/types/api"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { Select } from "@/components/ui/select"

export function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  
  const [noteContent, setNoteContent] = useState('')
  const [activeTab, setActiveTab] = useState<'THREAD' | 'INTERNAL'>('THREAD')

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['tickets', id],
    queryFn: async () => {
      const res = await apiClient.get(`/tickets/${id}`)
      return res.data as TicketResponse
    }
  })

  const { data: notes = [], isLoading: notesLoading } = useQuery({
    queryKey: ['tickets', id, 'notes'],
    queryFn: async () => ticketApi.getTicketNotes(id as string)
  })

  const noteMutation = useMutation({
    mutationFn: (note: string) => ticketApi.addTicketNote(id as string, { note }),
    onSuccess: () => {
      setNoteContent('')
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'notes'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (updates: any) => ticketApi.updateTicket(id as string, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  })

  if (isLoading) return <div className="text-on-surface-variant animate-pulse">Loading ticket details...</div>
  if (error || !ticket) return <div className="text-error">Ticket not found or failed to load.</div>

  const isCustomer = user?.role === 'CUSTOMER'
  
  // Logic for valid status transitions
  const validTransitions: Record<string, string[]> = {
    'OPEN': ['IN_PROGRESS', 'CLOSED'],
    'IN_PROGRESS': ['WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'],
    'WAITING_FOR_CUSTOMER': ['IN_PROGRESS', 'CLOSED'],
    'RESOLVED': ['OPEN', 'CLOSED'],
    'CLOSED': ['OPEN']
  }
  const allowedNextStatuses = validTransitions[ticket.status] || []

  return (
    <div className="flex flex-col gap-4 w-full animate-in slide-in-from-right-8 duration-500">
      
      {/* Drawer Top Action Strip */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {!isCustomer ? (
            <Select 
              value={ticket.priority}
              onChange={(val) => updateMutation.mutate({ priority: val })}
              disabled={updateMutation.isPending}
              className={cn(
                "px-2 py-0.5 rounded-full font-mono text-[11px] font-bold cursor-pointer border-0 ring-0 focus:ring-0 bg-transparent",
                ticket.priority === 'URGENT' ? "bg-error/20 text-error" :
                ticket.priority === 'HIGH' ? "bg-tertiary/20 text-tertiary" :
                ticket.priority === 'MEDIUM' ? "bg-surface-container-highest text-on-surface-variant" :
                "bg-surface-container-highest text-outline"
              )}
              options={[
                { value: 'LOW', label: 'LOW PRIORITY' },
                { value: 'MEDIUM', label: 'MEDIUM PRIORITY' },
                { value: 'HIGH', label: 'HIGH PRIORITY' },
                { value: 'URGENT', label: 'URGENT PRIORITY' }
              ]}
            />
          ) : (
            <span className={cn(
              "px-2 py-0.5 rounded-full font-mono text-[11px] font-bold",
              ticket.priority === 'URGENT' ? "bg-error/20 text-error" :
              ticket.priority === 'HIGH' ? "bg-tertiary/20 text-tertiary" :
              ticket.priority === 'MEDIUM' ? "bg-surface-container-highest text-on-surface-variant" :
              "bg-surface-container-highest text-outline"
            )}>
              {ticket.priority} PRIORITY
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-mono text-[11px]">#{ticket.id}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigate('/dashboard/tickets')}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors" 
            title="Dismiss drawer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      {/* Subject Title & Metadata Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-on-surface leading-tight">{ticket.title}</h2>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
          {/* Use customer.id fallback since DTO currently doesn't provide nested UserDto but flat fields */}
          <span>Customer: <strong className="text-on-surface">{(ticket as any).customerName || ticket.customer?.firstName || `User #${(ticket as any).customerId}`}</strong></span>
          <span className="text-outline">·</span>
          <span>Category: <code className="text-tertiary-fixed font-mono bg-surface-container px-1 py-0.5 rounded">{ticket.category}</code></span>
        </div>
      </div>

      {/* Status Card */}
      <div className="grid grid-cols-2 gap-3 bg-surface-container p-3 rounded-xl mt-2">
        <div className="flex flex-col relative w-full">
          <span className="text-xs text-outline mb-1 uppercase tracking-wider">Status</span>
          
          {!isCustomer ? (
            <Select
              value={ticket.status}
              onChange={(val) => updateMutation.mutate({ status: val })}
              disabled={updateMutation.isPending}
              className={cn(
                "font-mono font-bold text-lg bg-transparent border-0 px-0 py-0 ring-0 focus:ring-0 w-full",
                ticket.status === 'OPEN' ? "text-primary" :
                ticket.status === 'IN_PROGRESS' ? "text-tertiary" :
                ticket.status === 'WAITING_FOR_CUSTOMER' ? "text-secondary" :
                "text-on-surface-variant"
              )}
              options={[
                { value: ticket.status, label: ticket.status },
                ...allowedNextStatuses.map(s => ({ value: s, label: s }))
              ]}
            />
          ) : (
            <span className={cn(
              "font-mono font-bold text-lg",
              ticket.status === 'OPEN' ? "text-primary" :
              ticket.status === 'IN_PROGRESS' ? "text-tertiary" :
              ticket.status === 'WAITING_FOR_CUSTOMER' ? "text-secondary" :
              "text-on-surface-variant"
            )}>{ticket.status}</span>
          )}
          {updateMutation.isPending && <span className="absolute right-2 top-6 text-xs text-outline animate-pulse">Updating...</span>}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-outline mb-1 uppercase tracking-wider">Created</span>
          <span className="font-mono font-bold text-sm text-on-surface mt-1">{new Date(ticket.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Tabbed Communication Stream */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex items-center gap-2 border-b-0 bg-surface-container p-1 rounded-lg self-start">
          <button 
            onClick={() => setActiveTab('THREAD')}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors",
              activeTab === 'THREAD' ? "bg-surface-container-high text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            Thread
          </button>
          <button 
            onClick={() => setActiveTab('INTERNAL')}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2",
              activeTab === 'INTERNAL' ? "bg-surface-container-high text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span>Internal Notes</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </button>
        </div>

        {/* Customer Initial Request */}
        <div className="flex items-start gap-3 mt-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-xs shrink-0">
            {((ticket as any).customerName || ticket.customer?.firstName || 'U')[0]}
          </div>
          <div className="flex flex-col gap-2 bg-surface-container p-3 rounded-xl rounded-tl-none w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-on-surface">{(ticket as any).customerName || ticket.customer?.firstName}</span>
              <span className="text-xs text-outline">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{ticket.description}</p>
          </div>
        </div>

        {/* Real Notes Display */}
        {notesLoading ? (
          <div className="text-center text-xs text-outline py-2">Loading notes...</div>
        ) : notes.map((note) => (
          <div key={note.id} className="flex items-start gap-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-on-secondary text-xs shrink-0">
              {note.authorName?.[0] || 'A'}
            </div>
            <div className="flex flex-col gap-2 bg-surface-container-high p-3 rounded-xl rounded-tl-none w-full border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{note.authorName || 'Support Agent'}</span>
                <span className="text-xs text-outline">{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-on-surface whitespace-pre-wrap">{note.note}</p>
            </div>
          </div>
        ))}

        {/* Reply Box */}
        <div className="flex flex-col gap-2 bg-surface-container p-3 rounded-xl mt-4">
          <textarea 
            className="w-full bg-surface-container-low p-3 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors resize-none" 
            placeholder="Write a reply..." 
            rows={3}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          {noteMutation.isError && (
             <span className="text-error text-xs font-medium">Failed to send note. Unauthorized or server error.</span>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-outline">
              <button className="p-1.5 rounded hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Attach file">
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={!noteContent || noteMutation.isPending}
                onClick={() => noteMutation.mutate(noteContent)}
                className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-95 shadow-sm transition-all disabled:opacity-50"
              >
                {noteMutation.isPending ? "Sending..." : "Send Note"}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
