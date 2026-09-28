import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ticketApi } from "@/lib/api/tickets"
import type { TicketCreateRequest } from "@/types/api"
import { cn } from "@/lib/utils"
import { Select } from "@/components/ui/select"

interface TicketCreateModalProps {
  onClose: () => void;
}

export function TicketCreateModal({ onClose }: TicketCreateModalProps) {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<TicketCreateRequest>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'GENERAL'
  })

  const { mutate, isPending, error } = useMutation({
    mutationFn: ticketApi.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      onClose()
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-surface-container-low border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-container/30 rounded-t-2xl">
          <h3 className="text-xl font-bold text-on-surface">Create Ticket</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {error && (
            <div className="p-3 rounded bg-error-container text-error text-sm font-medium">
              Failed to create ticket. Please verify your inputs.
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-outline">Subject</label>
            <input 
              required
              autoFocus
              className="w-full bg-surface-container border border-white/5 px-3 py-2 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors" 
              placeholder="Brief summary of the issue..."
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-outline">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-surface-container border border-white/5 px-3 py-2 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest transition-colors resize-none" 
              placeholder="Provide detailed information..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-20">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-outline">Category</label>
              <Select 
                value={formData.category}
                onChange={val => setFormData({ ...formData, category: val as any })}
                options={[
                  { value: 'GENERAL', label: 'General' },
                  { value: 'ACCOUNT', label: 'Account' },
                  { value: 'BILLING', label: 'Billing' },
                  { value: 'TECHNICAL', label: 'Technical' }
                ]}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-outline">Priority</label>
              <Select 
                value={formData.priority}
                onChange={val => setFormData({ ...formData, priority: val as any })}
                options={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'URGENT', label: 'Urgent' }
                ]}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 relative z-10">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className={cn(
                "px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition-all",
                isPending ? "bg-surface-container-highest text-outline opacity-70" : "bg-primary-container text-on-primary-container hover:opacity-95 shadow-primary-container/20"
              )}
            >
              {isPending ? "Creating..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
