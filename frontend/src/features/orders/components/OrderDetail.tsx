import { useParams, Link, useNavigate } from "react-router-dom"
import { useOrder } from "../api/getOrder"
import { CheckCircle2, Truck, Package, CreditCard, Ban } from "lucide-react"

export function OrderDetail() {
  const { id } = useParams()
  const { data: order, isLoading, isError } = useOrder(id)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4 text-center">
        <span className="material-symbols-outlined text-[48px] text-outline/50 animate-spin">sync</span>
        <div className="text-on-surface-variant font-medium">Loading details...</div>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4 text-center">
        <span className="material-symbols-outlined text-[48px] text-rose-400/50">search_off</span>
        <div className="text-on-surface font-bold text-lg">Order not found.</div>
        <Link to="/dashboard/orders" className="mt-2 text-primary hover:underline text-sm font-semibold">
          Return to Orders
        </Link>
      </div>
    )
  }

  const getStepStatus = (orderStatus: string, stepIndex: number) => {
    if (orderStatus === 'CANCELLED') {
      return 'cancelled'
    }
    const statuses = ['PROCESSING', 'SHIPPED', 'DELIVERED']
    const currentIndex = statuses.indexOf(orderStatus)
    if (currentIndex >= stepIndex) return 'completed'
    if (currentIndex === stepIndex - 1) return 'current'
    return 'pending'
  }

  const steps = [
    { label: 'Processing', icon: Package },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: CheckCircle2 }
  ]

  const handleCancelClick = () => {
    // Navigate to AI chat with a prefilled request to cancel the order
    // In OpsPilot, the AI Assistant handles secure cancellation confirmation.
    navigate(`/dashboard/ai`, { state: { initialPrompt: `Cancel order ${order.id}` } })
    // Optionally we could pass state or query params if the AI chat supported it,
    // but the user will naturally just chat "cancel order 1024".
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-on-surface tracking-tight">Order #{order.id}</h3>
        <Link to="/dashboard/orders" className="p-2 rounded-full bg-surface-container-low/80 hover:bg-surface-container/80 backdrop-blur-sm border border-surface-container/50 transition-colors text-outline">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </Link>
      </div>

      {/* High Level Summary */}
      <div className="flex flex-col gap-2 bg-surface-container/80 backdrop-blur-md p-5 rounded-xl border border-surface-container/50 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant text-sm font-medium">Placed On</span>
          <span className="text-on-surface font-semibold text-sm bg-surface-container-lowest/80 backdrop-blur-sm px-2 py-1 rounded-md border border-surface-container/50">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant text-sm font-medium">Customer</span>
          <span className="text-on-surface font-semibold text-sm">{order.customerName}</span>
        </div>
      </div>

      {/* Fulfillment Timeline */}
      <div className="flex flex-col gap-4 bg-surface-container/80 backdrop-blur-md p-6 rounded-xl border border-surface-container/50 shadow-sm">
        <h4 className="text-sm font-bold text-outline uppercase tracking-wider mb-2">Fulfillment Status</h4>
        
        {order.status === 'CANCELLED' ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-rose-400/10 border border-rose-400/20">
            <Ban className="w-8 h-8 text-rose-400" />
            <div className="flex flex-col">
              <span className="text-rose-400 font-bold text-lg">Order Cancelled</span>
              <span className="text-rose-400/70 text-sm font-medium">This order was cancelled and will not be fulfilled.</span>
            </div>
          </div>
        ) : (
          <div className="flex items-start w-full mt-2">
            {steps.map((step, idx) => {
              const stepState = getStepStatus(order.status, idx)
              const isLast = idx === steps.length - 1
              
              return (
                <div key={step.label} className={`flex items-start ${isLast ? '' : 'flex-1'}`}>
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-surface-container-lowest/80 backdrop-blur-sm shadow-sm transition-colors ${
                      stepState === 'completed' ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10' :
                      stepState === 'current' ? 'border-blue-400 text-blue-400 bg-blue-400/10 shadow-[0_0_15px_rgba(96,165,250,0.3)]' :
                      'border-surface-container-highest text-outline/40'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] uppercase tracking-wider mt-3 font-bold whitespace-nowrap ${
                      stepState === 'completed' ? 'text-emerald-400' :
                      stepState === 'current' ? 'text-blue-400' :
                      'text-outline/40'
                    }`}>{step.label}</span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-1 mt-5 mx-2 rounded-full ${
                      stepState === 'completed' ? 'bg-emerald-400' : 'bg-surface-container-highest/80'
                    }`}></div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Payment & Shipment Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 bg-surface-container/80 backdrop-blur-md p-4 rounded-xl border border-surface-container/50">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Payment</span>
          <div className="flex items-center gap-2 mt-1">
            <CreditCard className={`w-5 h-5 ${
              order.paymentStatus === 'PAID' ? 'text-emerald-400' :
              order.paymentStatus === 'PENDING' ? 'text-amber-400' :
              order.paymentStatus === 'REFUNDED' ? 'text-purple-400' : 'text-rose-400'
            }`} />
            <span className="text-on-surface font-bold text-sm tracking-wide">{order.paymentStatus}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 bg-surface-container/80 backdrop-blur-md p-4 rounded-xl border border-surface-container/50">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Shipment</span>
          <div className="flex items-center gap-2 mt-1">
            <Truck className={`w-5 h-5 ${
              order.shipmentStatus === 'DELIVERED' ? 'text-emerald-400' :
              order.shipmentStatus === 'IN_TRANSIT' ? 'text-blue-400' : 'text-outline'
            }`} />
            <span className="text-on-surface font-bold text-sm tracking-wide">{order.shipmentStatus.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex justify-end gap-3 mt-2">
        {order.cancellationEligible && (
          <button 
            onClick={handleCancelClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-400/10 border border-rose-400/20 text-rose-400 text-sm font-bold hover:bg-rose-400 hover:text-white hover:border-rose-400 transition-all shadow-sm"
          >
            <Ban className="w-4 h-4" />
            Request Cancellation
          </button>
        )}
      </div>
    </div>
  )
}
