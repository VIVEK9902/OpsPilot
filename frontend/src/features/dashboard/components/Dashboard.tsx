import { useAuth } from "@/hooks/useAuth"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { TicketResponse, AuditLog } from "@/types/api"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [copilotInput, setCopilotInput] = useState("")
  
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await apiClient.get('/tickets')
      return res.data as TicketResponse[]
    }
  })

  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: async () => {
      const res = await apiClient.get('/audit')
      // Spring Data returns a Page<AuditLog> object with a 'content' array
      return (res.data.content || []) as AuditLog[]
    },
    enabled: user?.role === 'ADMIN'
  })

  const openTickets = tickets?.filter(t => t.status === 'OPEN') || []
  const resolvedTickets = tickets?.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED') || []
  const highPriorityOpen = openTickets.filter(t => t.priority === 'HIGH')
  
  const recentTickets = tickets?.slice(0, 5) || []

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (copilotInput.trim()) {
      navigate('/dashboard/ai', { state: { initialPrompt: copilotInput } })
    }
  }

  const handleActionClick = (prompt: string) => {
    navigate('/dashboard/ai', { state: { initialPrompt: prompt } })
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 md:p-8">
        
        {/* Executive Command Context Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low rounded-xl p-4 shadow-sm border border-surface-container">
          
          <div className="flex flex-col z-10 gap-1">
             <div className="flex items-center gap-2">
                <span className="text-xl text-on-surface font-extrabold tracking-tight">Welcome back, {user?.firstName || 'User'}</span>
             </div>
             <span className="text-sm text-on-surface-variant font-medium">
                {user?.role === 'ADMIN' ? 'Administrator Operations Overview' : 
                 user?.role === 'SUPPORT_AGENT' ? 'Support Operations Overview' : 
                 'Customer Operations Overview'}
             </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full border border-surface-container-highest shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-xs text-on-surface uppercase tracking-wider font-semibold">System Online</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-highest shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">admin_panel_settings</span>
              <span className="text-xs text-on-surface font-bold tracking-wide">{user?.role} VIEW</span>
            </div>
          </div>
        </div>

        {/* Top Metric Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden group hover:bg-surface-container transition-all border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-outline uppercase tracking-wider font-semibold">Active Ticket Volume</span>
                <span className="text-4xl text-on-surface font-extrabold tracking-tight leading-none mt-1">
                  {ticketsLoading ? '...' : openTickets.length}
                </span>
              </div>
              <span className="material-symbols-outlined text-blue-400 p-2 bg-blue-400/20 rounded-lg text-[22px]">confirmation_number</span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-primary font-bold">Pending action</span>
                 <span className="text-on-surface-variant font-medium">Auto-triaged</span>
               </div>
               <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                 <div className="bg-primary h-1.5 rounded-full w-[84%] transition-all duration-700"></div>
               </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden group hover:bg-surface-container transition-all border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-outline uppercase tracking-wider font-semibold">Tickets Resolved</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl text-emerald-400 font-extrabold tracking-tight leading-none">{ticketsLoading ? '...' : resolvedTickets.length}</span>
                </div>
              </div>
               <span className="material-symbols-outlined text-emerald-400 p-2 bg-emerald-400/20 rounded-lg text-[22px]">check_circle</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
               <div className="w-36 h-8 flex items-end gap-1">
                 <div className="w-1.5 bg-surface-container-highest rounded-t h-[40%]"></div>
                 <div className="w-1.5 bg-surface-container-highest rounded-t h-[60%]"></div>
                 <div className="w-1.5 bg-surface-container-highest rounded-t h-[75%]"></div>
                 <div className="w-1.5 bg-primary rounded-t h-[30%]"></div>
                 <div className="w-1.5 bg-primary rounded-t h-[20%]"></div>
                 <div className="w-1.5 bg-tertiary rounded-t h-[15%]"></div>
                 <div className="w-1.5 bg-tertiary rounded-t h-[12%]"></div>
               </div>
               <span className="text-xs text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded font-bold border border-tertiary/20">All time</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden group hover:bg-surface-container transition-all border border-surface-container">
             <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-outline uppercase tracking-wider font-semibold">System Status</span>
                <span className="text-4xl text-on-surface font-extrabold tracking-tight leading-none mt-1">OK</span>
              </div>
              <div className="relative w-12 h-12 flex items-center justify-center">
                 <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                   <path className="text-surface-container-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                   <path className="text-cyan-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeLinecap="round" strokeWidth="3.5"></path>
                 </svg>
                 <span className="absolute material-symbols-outlined text-[16px] text-cyan-400">cloud_done</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-outline font-semibold">SLO Target: 99.9%</span>
              <span className="text-secondary bg-secondary-container/20 px-2 py-0.5 rounded font-bold border border-secondary/20">Online</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col justify-between shadow-sm overflow-hidden group hover:bg-surface-container transition-all border border-surface-container">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-outline uppercase tracking-wider font-semibold">Pending High Priority</span>
                <span className="text-4xl text-rose-400 font-extrabold tracking-tight leading-none mt-1">
                  {ticketsLoading ? '...' : highPriorityOpen.length}
                </span>
              </div>
              <span className="material-symbols-outlined text-rose-400 p-2 bg-rose-400/20 rounded-lg text-[22px]">warning</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-error flex items-center font-bold">
                Requires escalation
              </span>
              <span className="text-outline font-semibold">Monitor actively</span>
            </div>
          </div>
          
        </div>

        {/* Main Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left 2/3: Live Stream / Feed */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-surface-container">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[22px]">{user?.role === 'ADMIN' ? 'security' : 'receipt_long'}</span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-on-surface">{user?.role === 'ADMIN' ? 'System Audit Logs' : 'Recent Support Tickets'}</span>
                    <span className="text-sm text-on-surface-variant">Real-time operational stream</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 font-mono text-sm">
                
                {user?.role === 'ADMIN' ? (
                  /* Admin Audit Log Stream */
                  auditLoading ? (
                    <div className="p-8 text-center text-outline font-sans">Syncing audit stream...</div>
                  ) : auditLogs?.length === 0 ? (
                    <div className="p-8 text-center text-outline font-sans">No recent audit events.</div>
                  ) : (
                    auditLogs?.slice(0, 6).map(log => (
                      <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors gap-2 border border-surface-container-highest shadow-sm">
                         <div className="flex items-center gap-3 min-w-0">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                              log.result === 'SUCCESS' ? 'bg-primary-container text-primary border-primary/20' : 'bg-error-container text-error border-error/20'
                           }`}>{log.action.toUpperCase()}</span>
                           <span className="text-on-surface truncate font-sans text-sm font-medium">{log.resource} <span className="text-on-surface-variant">by</span> {log.actor}</span>
                         </div>
                         <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                            <span className="text-xs text-outline font-sans">{new Date(log.timestamp).toLocaleTimeString()}</span>
                         </div>
                      </div>
                    ))
                  )
                ) : (
                  /* Support / Customer Ticket Stream */
                  ticketsLoading ? (
                    <div className="p-8 text-center text-outline font-sans">Loading tickets...</div>
                  ) : recentTickets?.length === 0 ? (
                     <div className="p-8 text-center text-outline font-sans">No recent tickets found.</div>
                  ) : (
                    recentTickets.map(ticket => (
                      <Link to={`/dashboard/tickets/${ticket.id}`} key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors gap-2 border border-surface-container-highest shadow-sm group">
                        <div className="flex items-center gap-3 min-w-0">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold font-sans border ${
                              ticket.status === 'OPEN' ? 'bg-secondary-container text-secondary border-secondary/20' : 'bg-surface-container-highest text-tertiary border-tertiary/20'
                           }`}>{ticket.status}</span>
                           <span className="text-on-surface font-sans text-sm font-semibold truncate group-hover:text-primary transition-colors">{ticket.title}</span>
                        </div>
                        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                           <span className="text-xs text-outline font-sans font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                           <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                      </Link>
                    ))
                  )
                )}
                
              </div>
            </div>

            {/* Knowledge RAG Summary */}
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-surface-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-400 text-[22px]">menu_book</span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-on-surface">Knowledge Base</span>
                    <span className="text-sm text-on-surface-variant">Search policies, FAQs and support guidance</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-surface-container p-4 rounded-lg flex items-center justify-between border border-surface-container-highest cursor-pointer hover:bg-surface-container-high transition-colors shadow-sm" onClick={() => navigate('/dashboard/knowledge')}>
                    <span className="text-on-surface font-semibold text-sm">Browse Articles</span>
                    <span className="material-symbols-outlined text-primary">search</span>
                 </div>
                 <div className="bg-surface-container p-4 rounded-lg flex items-center justify-between border border-surface-container-highest cursor-pointer hover:bg-surface-container-high transition-colors shadow-sm" onClick={() => handleActionClick("What are the cancellation policies?")}>
                    <span className="text-on-surface font-semibold text-sm">Ask AI Copilot</span>
                    <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
                 </div>
              </div>
            </div>
            
          </div>
          
          {/* Right 1/3: High-Priority Queue & AI Trigger Copilot */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Action Queue Panel */}
            {(user?.role === 'ADMIN' || user?.role === 'SUPPORT_AGENT') && (
              <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-surface-container">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-400 text-[22px]">notification_important</span>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-on-surface">Escalation Queue</span>
                      <span className="text-xs text-on-surface-variant font-medium">{highPriorityOpen.length} items pending clearance</span>
                    </div>
                  </div>
                  {highPriorityOpen.length > 0 && <span className="px-2 py-0.5 rounded-full bg-error-container text-error border border-error/20 text-xs font-bold">P1 Active</span>}
                </div>
                
                <div className="flex flex-col gap-3">
                  {highPriorityOpen.length === 0 ? (
                    <div className="p-4 text-center text-sm text-outline border border-surface-container-highest rounded-lg bg-surface-container font-medium shadow-sm">Queue is clear.</div>
                  ) : (
                    highPriorityOpen.slice(0, 3).map(ticket => (
                      <div key={ticket.id} className="bg-surface-container p-3 rounded-lg flex flex-col gap-2 border border-surface-container-highest hover:border-surface-container-high transition-colors shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[10px] font-bold tracking-wide">CRITICAL</span>
                            <span className="text-xs text-outline font-mono">#{ticket.id}</span>
                          </div>
                        </div>
                        <div className="text-sm text-on-surface font-bold leading-tight">{ticket.title}</div>
                        <div className="flex items-center gap-2 pt-2 mt-1 border-t border-surface-container-highest">
                           <button onClick={() => navigate(`/dashboard/tickets/${ticket.id}`)} className="flex-1 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm">
                              Inspect Ticket
                           </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* AI Copilot Quick Trigger Widget */}
            <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-surface-container">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-cyan-400 text-[22px]">auto_awesome</span>
                 <div className="flex flex-col">
                    <span className="text-lg font-bold text-on-surface">OpsPilot AI</span>
                    <span className="text-xs text-on-surface-variant font-medium">Autonomous Operations</span>
                 </div>
               </div>
               
               {/* Suggested Action Prompts */}
               <div className="flex flex-col gap-2">
                 <span className="text-[10px] text-outline uppercase tracking-wider font-bold">Suggested Actions</span>
                 
                 <button onClick={() => handleActionClick("Summarize my active tickets")} className="text-left p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-surface-container-highest shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="material-symbols-outlined text-[16px] text-tertiary">search_check</span>
                       <span className="text-sm text-on-surface font-medium truncate">Summarize tickets</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                 </button>
                 
                 <button onClick={() => handleActionClick("Check knowledge base for return policy")} className="text-left p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-surface-container-highest shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="material-symbols-outlined text-[16px] text-secondary">database</span>
                       <span className="text-sm text-on-surface font-medium truncate">Search policies</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                 </button>
                 
                 {(user?.role === 'SUPPORT_AGENT' || user?.role === 'ADMIN') && (
                   <button onClick={() => handleActionClick("Check orders eligible for cancellation")} className="text-left p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all flex items-center justify-between group border border-surface-container-highest shadow-sm">
                      <div className="flex items-center gap-2 min-w-0">
                         <span className="material-symbols-outlined text-[16px] text-primary">assessment</span>
                         <span className="text-sm text-on-surface font-medium truncate">Cancellable orders</span>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all">arrow_forward</span>
                   </button>
                 )}
               </div>

               {/* Quick Command Input */}
               <form onSubmit={handleCopilotSubmit} className="relative mt-2">
                 <input 
                   type="text"
                   value={copilotInput}
                   onChange={e => setCopilotInput(e.target.value)}
                   className="w-full bg-surface-container py-2.5 pl-3 pr-10 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest shadow-inner transition-shadow" 
                   placeholder="Prompt OpsPilot..."
                 />
                 <button type="submit" className="absolute right-1 top-1 bottom-1 px-2 rounded-md bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center">
                   <span className="material-symbols-outlined text-[16px]">send</span>
                 </button>
               </form>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  )
}
