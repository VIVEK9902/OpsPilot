import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"
import type { AuditLog } from "@/types/api"
import { Filter, ShieldCheck, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['audit'],
    queryFn: async () => {
      const res = await apiClient.get('/audit')
      // Spring Data returns a Page<AuditLog> object with a 'content' array
      return (res.data.content || []) as AuditLog[]
    }
  })

  const filteredLogs = logs?.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Audit Logs</h1>
          <p className="text-on-surface-variant text-sm">Security console and system activity trail.</p>
        </div>
      </div>

      {/* Filter Controls Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-container-low p-3 rounded-xl shadow-sm">
        <div className="md:col-span-8 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container pl-10 pr-4 py-2 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors" 
            placeholder="Search logs by actor, action, or resource..." 
          />
        </div>
        <div className="md:col-span-4 flex items-center gap-3">
           <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-highest transition-colors border border-surface-container-highest">
             <Filter className="w-4 h-4 text-outline" /> Action
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-surface-container rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-highest transition-colors border border-surface-container-highest">
             <Filter className="w-4 h-4 text-outline" /> Actor
           </button>
        </div>
      </div>

      {/* Main Data Table Viewport */}
      <div className="flex flex-col gap-3 bg-surface-container-lowest p-4 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-outline uppercase tracking-wider bg-surface-container-low/80">
                <th className="py-3 px-3 rounded-l-lg">Timestamp</th>
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Target Resource</th>
                <th className="py-3 px-3 rounded-r-lg text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 space-y-1">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-8 text-on-surface-variant">Loading audit logs...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center p-8 text-error">
                      <ShieldAlert className="w-8 h-8 mb-2 opacity-80" />
                      <span className="font-semibold">Access Denied or Failed to Load</span>
                      <span className="text-sm opacity-80 mt-1">Only ADMIN role can view the security console.</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-on-surface-variant">No audit logs found.</td></tr>
              ) : (
                filteredLogs.map(log => (
                  <tr 
                    key={log.id} 
                    className="group transition-all hover:bg-surface-container bg-surface-container/30 text-on-surface"
                  >
                    <td className="py-3 px-3 rounded-l-xl text-[13px] whitespace-nowrap text-on-surface-variant">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-xs whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-sm font-semibold text-on-surface">{log.action}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-xs text-on-surface-variant">
                      {log.resource}
                    </td>
                    <td className="py-3 px-3 rounded-r-xl text-right whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm",
                        log.result === 'SUCCESS' ? "bg-primary-container text-primary border border-primary/20" : "bg-error-container text-error border border-error/20"
                      )}>
                        {log.result === 'SUCCESS' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
