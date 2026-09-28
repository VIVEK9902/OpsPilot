import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Ticket, LogOut, Package, BookOpen, Shield, Bot, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { BackgroundAtmosphere } from "@/theme/BackgroundAtmosphere"

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLink = ({ to, icon: Icon, label, iconColor, isAi = false }: { to: string, icon: any, label: string, iconColor?: string, isAi?: boolean }) => {
    const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
    return (
      <Link 
        to={to} 
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
          active 
            ? isAi 
              ? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-[1.02]" 
              : "bg-surface-container text-primary border border-surface-container-highest shadow-sm scale-[1.02]" 
            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
          isAi && !active && "hover:text-primary"
        )}
      >
        <Icon className={cn("w-5 h-5", active && !isAi ? "text-primary" : (active && isAi ? "text-on-primary" : iconColor))} /> 
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden selection:bg-primary/20 relative">
      <BackgroundAtmosphere />
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-low border-b border-surface-container z-50 px-4 flex items-center justify-between">
         <div className="flex items-center gap-2 cursor-pointer relative h-14 w-44 ml-2">
            <img src="/logo.png" alt="OpsPilot" className="h-19 object-contain absolute left-0" />
         </div>
         <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           <Menu className="text-on-surface" />
         </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative md:flex flex-col w-72 h-[calc(100vh-2rem)] my-4 ml-4 bg-surface-container-lowest rounded-3xl z-40 transition-transform duration-300 ease-in-out border border-surface-container shadow-2xl",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"
      )}>
        <div className="h-20 flex items-center px-8">
          <div className="flex items-center gap-2 cursor-pointer relative h-14 w-48">
            <img src="/logo.png" alt="OpsPilot" className="h-19 object-contain absolute left-0" />
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" iconColor="text-blue-400" />
          <NavLink to="/dashboard/tickets" icon={Ticket} label="Tickets" iconColor="text-emerald-400" />
          {user?.role === 'CUSTOMER' && <NavLink to="/dashboard/orders" icon={Package} label="My Orders" iconColor="text-amber-400" />}
          
          {(user?.role === 'SUPPORT_AGENT' || user?.role === 'ADMIN') && (
            <div className="mt-4">
              <div className="text-xs font-bold text-outline uppercase tracking-wider mb-3 px-4">Workspace</div>
              <NavLink to="/dashboard/knowledge" icon={BookOpen} label="Knowledge Base" iconColor="text-purple-400" />
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <div className="mt-4">
              <div className="text-xs font-bold text-outline uppercase tracking-wider mb-3 px-4">System</div>
              <NavLink to="/dashboard/audit" icon={Shield} label="Audit Logs" iconColor="text-rose-400" />
            </div>
          )}
          <div className="mt-auto pt-6">
            <NavLink to="/dashboard/ai" icon={Bot} label="AI Assistant" iconColor="text-cyan-400" isAi />
          </div>
        </nav>
        
        <div className="p-4 m-4 rounded-2xl bg-surface-container border border-surface-container-highest shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col truncate pr-2">
              <span className="text-sm font-bold text-on-surface truncate">
                {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'Unknown User'}
              </span>
              <span className="text-xs text-on-surface-variant capitalize font-medium">{user?.role?.replace('_', ' ').toLowerCase()}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out" className="shrink-0 w-8 h-8 rounded-full text-outline hover:text-error hover:bg-error-container/30 transition-colors">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative md:pt-4 pt-20 px-4 md:px-8 pb-4">
        <header className="h-20 flex items-center justify-between rounded-3xl bg-surface-container-lowest px-8 mb-6 z-10 shrink-0 border border-surface-container shadow-sm">
          <h1 className="text-xl font-bold text-on-surface capitalize">
            {location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? 'Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-primary-container text-primary text-xs font-bold tracking-wide rounded-full border border-primary/20 shadow-sm">
              ENTERPRISE EDGE
            </span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <div className="max-w-7xl mx-auto pb-12 h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
