import { useState, useMemo } from "react"
import { Link, Outlet, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useOrders } from "../api/getOrders"

export function Orders() {
  const { id } = useParams()
  const isDetailOpen = !!id
  const [searchQuery, setSearchQuery] = useState('')
  const { data: orders, isLoading } = useOrders()

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    return orders.filter(o => 
      o.id.toString().includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Orders</h1>
          <p className="text-on-surface-variant text-sm">Track orders, payments, shipments, and fulfillment status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-container-low/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-surface-container/50">
        <div className="md:col-span-5 relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">search</span>
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container/50 backdrop-blur-sm pl-10 pr-4 py-2 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-highest/80 transition-colors border border-surface-container-highest/50 focus:border-primary" 
            placeholder="Search orders by ID..." 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className={cn(
          "flex flex-col gap-3 bg-surface-container-lowest/80 backdrop-blur-md p-4 rounded-2xl shadow-xl overflow-hidden border border-surface-container/50",
          isDetailOpen ? "xl:col-span-7 hidden xl:flex" : "xl:col-span-12"
        )}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-outline uppercase tracking-wider bg-surface-container-low/80 border-b border-surface-container/50">
                  <th className="py-3 px-3 rounded-tl-lg">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Shipment</th>
                  <th className="py-3 px-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/50 bg-surface-container-lowest/50 backdrop-blur-sm">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center p-8 text-on-surface-variant">Loading orders...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-12 text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="material-symbols-outlined text-[48px] text-outline/50">inbox</span>
                        <span>No orders found.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(o => (
                    <tr 
                      key={o.id} 
                      className={cn(
                        "group cursor-pointer transition-all hover:bg-surface-container/50 text-on-surface",
                        id === o.id.toString() ? "bg-surface-container-high/80 shadow-inner" : "bg-transparent"
                      )}
                    >
                      <td className="py-3 px-3 font-mono text-[13px] whitespace-nowrap">
                        <Link to={`/dashboard/orders/${o.id}`} className="hover:underline text-primary">ORD-{o.id}</Link>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-sm text-on-surface-variant">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide",
                          o.status === 'DELIVERED' ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" :
                          o.status === 'SHIPPED' ? "bg-blue-400/10 text-blue-400 border border-blue-400/20" :
                          o.status === 'PROCESSING' ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" :
                          o.status === 'CANCELLED' ? "bg-rose-400/10 text-rose-400 border border-rose-400/20" :
                          "bg-surface-container-high/50 text-outline"
                        )}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            o.paymentStatus === 'PAID' ? "bg-emerald-400" :
                            o.paymentStatus === 'PENDING' ? "bg-amber-400" :
                            o.paymentStatus === 'REFUNDED' ? "bg-purple-400" :
                            "bg-rose-400"
                          )}></span>
                          <span className="text-on-surface-variant">{o.paymentStatus}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            o.shipmentStatus === 'DELIVERED' ? "bg-emerald-400" :
                            o.shipmentStatus === 'IN_TRANSIT' ? "bg-blue-400" :
                            "bg-outline"
                          )}></span>
                          <span className="text-on-surface-variant">{o.shipmentStatus.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Link to={`/dashboard/orders/${o.id}`} className="p-1 rounded text-primary hover:bg-surface-container-highest/80 transition-colors inline-block">
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isDetailOpen && (
          <div className="xl:col-span-5 flex flex-col gap-4 bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl relative overflow-hidden border border-surface-container/50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400"></div>
            <Outlet />
          </div>
        )}
      </div>
    </div>
  )
}
