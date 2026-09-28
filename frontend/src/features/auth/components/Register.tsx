import { useState } from "react"
import { apiClient } from "@/lib/api/client"
import { useNavigate, Link } from "react-router-dom"
import { 
  ArrowRight, CheckCircle2, MessageSquare, Folder, 
  BookOpen, Sparkles, Activity, Lock, EyeOff
} from "lucide-react"

export function Register() {
  const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password
      }
      await apiClient.post('/auth/register', payload)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#0B0F19] text-white font-sans overflow-hidden">
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-[45%] flex flex-col relative z-10 p-8 md:p-12 border-r border-white/5">
        
        {/* Top-left Branding */}
        <div className="flex items-center gap-6 mb-auto cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-40 h-10">
            <img src="/logo.png" alt="OpsPilot Logo" className="h-24 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="h-5 w-px bg-white/20"></div>
          <div className="text-[9px] font-bold tracking-widest text-white/50 uppercase whitespace-nowrap">
            AI-POWERED SUPPORT & OPERATIONS PLATFORM
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto pt-12 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight font-display">
            Create your <br/>
            <span className="text-primary">OpsPilot</span> account
          </h1>
          <p className="text-sm text-white/60 mb-10 leading-relaxed max-w-sm">
            Set up your workspace and start managing support operations with AI.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg">{error}</div>}
            
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/90">First Name</label>
                <div className="relative">
                  <input 
                    required 
                    value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})} 
                    placeholder="John" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-10 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/30"
                  />
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/90">Last Name</label>
                <div className="relative">
                  <input 
                    required 
                    value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})} 
                    placeholder="Doe" 
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-10 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/30"
                  />
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/90">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  placeholder="you@company.com" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-10 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/30"
                />
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/90">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  placeholder="Create a secure password" 
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-10 text-sm focus:outline-none focus:border-primary focus:bg-white/10 transition-colors placeholder:text-white/30"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Password Rules */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> At least 8 characters
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Include a number and a letter
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Use a strong, unique password
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="mt-4 w-full h-14 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex justify-center items-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-sm font-medium text-white/60 mt-4">
              Already have an account? <Link to="/login" className="text-primary hover:text-blue-400 transition-colors">Sign in</Link>
            </div>
          </form>
        </div>
        
        {/* Empty footer space to push center content up */}
        <div className="mt-auto"></div>
      </div>

      {/* Right Panel - Value Prop */}
      <div className="hidden lg:flex w-[55%] relative flex-col bg-[#0F1623] p-12 overflow-y-auto">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Right Nav */}
        <div className="flex justify-end items-center mb-20 z-10">
          <div className="text-sm text-white/60 mr-4">Already have an account?</div>
          <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium flex items-center gap-2">
            Sign in <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-2xl mx-auto flex flex-col z-10 flex-1">
          <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-4">
            TURN SUPPORT INTO PROGRESS
          </div>
          <h2 className="text-5xl font-display font-bold leading-tight mb-6">
            Build smarter <br />
            support <span className="text-indigo-400">operations.</span>
          </h2>
          <p className="text-lg text-white/60 mb-12 max-w-xl">
            Manage tickets, orders, knowledge, and AI-assisted support from one platform.
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Support Ticketing */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Support Ticketing</span>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">↑ 27%</div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold font-display tracking-tight">1,248</span>
                <span className="text-[10px] text-white/50 mb-1">Resolved this month</span>
              </div>
              <Sparkline color="var(--color-primary)" className="mt-auto opacity-70" />
            </div>

            {/* Order Operations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Folder className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Order Operations</span>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">↑ 18%</div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold font-display tracking-tight">892</span>
                <span className="text-[10px] text-white/50 mb-1">Orders processed</span>
              </div>
              <Sparkline color="#06b6d4" className="mt-auto opacity-70" />
            </div>

            {/* Knowledge Base */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">Knowledge Base</span>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">↑ 32%</div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold font-display tracking-tight">256</span>
                <span className="text-[10px] text-white/50 mb-1">Articles accessed</span>
              </div>
              <Sparkline color="#10b981" className="mt-auto opacity-70" />
            </div>

            {/* AI Assistant */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">AI Assistant</span>
                </div>
                <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md">↑ 41%</div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold font-display tracking-tight">3,420</span>
                <span className="text-[10px] text-white/50 mb-1">Questions answered</span>
              </div>
              <Sparkline color="#a855f7" className="mt-auto opacity-70" />
            </div>
          </div>

          {/* AI Helping Badge */}
          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between mb-auto">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">AI assistant helping customers 24/7</h4>
                <p className="text-xs text-white/50">Faster resolutions. Happier customers.</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live
            </div>
          </div>

          {/* Bottom Footer Strip */}
          <div className="w-full border-t border-white/10 pt-6 mt-8">
            <div className="text-[9px] font-bold tracking-widest text-white/40 uppercase mb-4">
              BUILT FOR MODERN SUPPORT OPERATIONS
            </div>
            <div className="flex items-center gap-6 text-[9px] font-bold tracking-wider text-white/70">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-purple-500"></div> AI ASSISTANT</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-blue-500"></div> TICKET MANAGEMENT</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-indigo-500"></div> ORDER OPERATIONS</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-emerald-500 border border-white"></div> AUDIT & OBSERVABILITY</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Simple sparkline SVG component to match the visual
function Sparkline({ color, className }: { color: string, className?: string }) {
  return (
    <svg className={`w-full h-8 ${className}`} preserveAspectRatio="none" viewBox="0 0 100 20">
      <path d="M0,15 Q10,10 20,12 T40,8 T60,10 T80,5 L100,2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0,15 Q10,10 20,12 T40,8 T60,10 T80,5 L100,2 L100,20 L0,20 Z" fill={`url(#grad-${color.replace('#','')})`} opacity="0.2" />
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
