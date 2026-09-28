import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { TicketResponse } from "@/types/api"
import { Link, Outlet, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { TicketCreateModal } from "./TicketCreateModal"
import { Select } from "@/components/ui/select"

export function TicketList() {
  const { id } = useParams()
  const isDetailOpen = !!id
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await apiClient.get('/tickets')
      return res.data as TicketResponse[]
    }
  })

  const filteredTickets = useMemo(() => {
    if (!tickets) return []
    return tickets.filter(t => {
      const matchStatus = statusFilter ? t.status === statusFilter : true
      const searchMatch = searchQuery 
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.id.toString().includes(searchQuery)
        : true
      return matchStatus && searchMatch
    })
  }, [tickets, statusFilter, searchQuery])

  const counts = useMemo(() => {
    const c = { ALL: 0, OPEN: 0, IN_PROGRESS: 0, WAITING_FOR_CUSTOMER: 0, RESOLVED: 0, CLOSED: 0 }
    if (!tickets) return c
    c.ALL = tickets.length
    tickets.forEach(t => {
      if (t.status in c) {
        c[t.status as keyof typeof c]++
      }
    })
    return c
  }, [tickets])

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Tickets</h1>
          <p className="text-on-surface-variant text-sm">Manage and track customer support requests.</p>
        </div>
      </div>

      {/* Control Bar: Status Filter Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setStatusFilter('')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
              statusFilter === '' ? "bg-surface-container-high text-on-surface font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            )}
          >
            <span>All</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-mono text-[11px]">{counts.ALL}</span>
          </button>
          
          {['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
                statusFilter === status ? "bg-surface-container-high text-on-surface font-semibold shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              )}
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                status === 'OPEN' ? "bg-primary" : 
                status === 'IN_PROGRESS' ? "bg-tertiary" : 
                status === 'WAITING_FOR_CUSTOMER' ? "bg-secondary" : 
                "bg-outline"
              )}></span>
              <span>{status}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-mono text-[11px]">{counts[status as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
           <button 
             onClick={() => setIsCreateModalOpen(true)}
             className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:opacity-95 shadow-md shadow-primary-container/20 transition-all"
           >
             <span className="material-symbols-outlined text-[18px]">add</span>
             <span>Create Ticket</span>
           </button>
        </div>
      </div>

      {/* Filter Controls Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-container-low p-3 rounded-xl shadow-sm">
        <div className="md:col-span-5 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors" 
            placeholder="Search tickets by ID or subject..." 
          />
        </div>
        <div className="md:col-span-7 flex items-center gap-3">
          <Select 
            value=""
            onChange={() => {}}
            options={[{ value: '', label: 'Category: All' }]}
            className="flex-1"
          />
          <Select 
            value=""
            onChange={() => {}}
            options={[{ value: '', label: 'Priority: All' }]}
            className="flex-1"
          />
        </div>
      </div>

      {/* Workdesk Split Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Main Data Table Viewport */}
        <div className={cn(
          "flex flex-col gap-3 bg-surface-container-lowest p-4 rounded-2xl shadow-xl overflow-hidden",
          isDetailOpen ? "xl:col-span-7 hidden xl:flex" : "xl:col-span-12"
        )}>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-outline uppercase tracking-wider bg-surface-container-low/80">
                  <th className="py-3 px-3 rounded-l-lg">Ticket ID</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 space-y-1">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center p-8 text-on-surface-variant">Loading tickets...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="text-center p-8 text-error">Failed to load tickets.</td></tr>
                ) : filteredTickets.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8 text-on-surface-variant">No tickets found.</td></tr>
                ) : (
                  filteredTickets.map(t => (
                    <tr 
                      key={t.id} 
                      className={cn(
                        "group cursor-pointer transition-all hover:bg-surface-container-highest text-on-surface",
                        id === t.id.toString() ? "bg-surface-container-high shadow-md" : "hover:bg-surface-container bg-surface-container/30"
                      )}
                    >
                      <td className="py-3 px-3 rounded-l-xl font-mono text-[13px] whitespace-nowrap">
                        <Link to={`/dashboard/tickets/${t.id}`} className="hover:underline text-primary">#{t.id}</Link>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
                          t.priority === 'URGENT' ? "bg-error-container text-error" :
                          t.priority === 'HIGH' ? "bg-surface-container-high text-tertiary" :
                          t.priority === 'MEDIUM' ? "bg-surface-container-high text-on-surface-variant" :
                          "bg-surface-container-low text-outline"
                        )}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 min-w-[200px]">
                        <div className="flex flex-col">
                          <Link to={`/dashboard/tickets/${t.id}`} className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                            {t.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] text-tertiary-fixed font-mono">{t.category}</span>
                            <span className="text-outline text-[11px]">{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-on-surface">{t.customer?.firstName} {t.customer?.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          t.status === 'OPEN' ? "bg-surface-container text-primary" :
                          t.status === 'IN_PROGRESS' ? "bg-surface-container text-tertiary-fixed" :
                          t.status === 'WAITING_FOR_CUSTOMER' ? "bg-surface-container text-secondary" :
                          "bg-surface-container-low text-outline"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            t.status === 'OPEN' ? "bg-primary" :
                            t.status === 'IN_PROGRESS' ? "bg-tertiary" :
                            t.status === 'WAITING_FOR_CUSTOMER' ? "bg-secondary" :
                            "bg-outline"
                          )}></span>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 rounded-r-xl text-right whitespace-nowrap">
                        <Link to={`/dashboard/tickets/${t.id}`} className="p-1 rounded text-primary hover:bg-surface-container transition-colors inline-block">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Drawer */}
        {isDetailOpen && (
          <div className="xl:col-span-5 flex flex-col gap-4 bg-surface-container-low p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-primary to-tertiary"></div>
            <Outlet />
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <TicketCreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  )
}
