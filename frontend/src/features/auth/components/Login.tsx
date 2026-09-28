import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/lib/api/client"
import { useNavigate } from "react-router-dom"
import { 
  ArrowRight, Ticket, Package, BookOpen, Sparkles, 
  BarChart3, Mail, Check, Eye, EyeOff
} from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await apiClient.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen font-sans flex flex-col relative overflow-x-hidden bg-[#0a0f18] text-[#e2e8f0]">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer relative w-32 h-6" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="OpsPilot Logo" className="h-24 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-[#94a3b8]">
          <span className="hidden md:inline">Don't have an account?</span>
          <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white flex items-center gap-2">
            Create account <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-8 pt-28 pb-12 z-10">
        
        {/* Left Column */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-[380px] z-10">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[#64748b] uppercase mb-4 flex items-center gap-2">
            SUPPORT <span className="w-1 h-1 rounded-full bg-[#64748b]"></span> OPERATE <span className="w-1 h-1 rounded-full bg-[#64748b]"></span> GROW
          </div>
          <h1 className="text-[40px] font-display font-bold mb-4 leading-[1.1] text-white">
            One Platform <br />
            for Smarter <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]">Operations.</span>
          </h1>
          <p className="text-[13px] text-[#94a3b8] mb-12 leading-relaxed">
            Manage support tickets, orders and knowledge with the power of AI — built for modern teams.
          </p>

          <div className="flex flex-col gap-7 mb-12">
            <div className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[14px] bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#60a5fa] shrink-0 group-hover:bg-[#3b82f6]/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                <Ticket className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-white mb-0.5">Support Ticketing</h4>
                <p className="text-[11px] text-[#64748b]">Resolve issues faster</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[14px] bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#818cf8] shrink-0 group-hover:bg-[#6366f1]/20 transition-all shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Package className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-white mb-0.5">Order Management</h4>
                <p className="text-[11px] text-[#64748b]">Track, manage, and grow</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[14px] bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#22d3ee] shrink-0 group-hover:bg-[#06b6d4]/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-white mb-0.5">Knowledge Base</h4>
                <p className="text-[11px] text-[#64748b]">Find answers instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-11 h-11 rounded-[14px] bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-[#c084fc] shrink-0 group-hover:bg-[#a855f7]/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <Sparkles className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-[13px] text-white mb-0.5">AI Assistant</h4>
                <p className="text-[11px] text-[#64748b]">Get instant help, take action</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-8 border-t border-white/5">
            <BarChart3 className="w-5 h-5 text-[#64748b]" />
            <div className="text-[9px] font-bold tracking-[0.15em] text-[#64748b] uppercase leading-relaxed">
              HAPPIER CUSTOMERS. <br />
              MORE EFFICIENT TEAMS.
            </div>
          </div>
        </div>

        {/* Center Column - Login Form */}
        <div className="flex-none w-full max-w-[420px] relative z-20">
          {/* Intense Glow effect behind the card */}
          <div className="absolute inset-0 bg-[#3b82f6]/20 blur-[100px] rounded-[3rem] -z-10 transform scale-105"></div>
          
          <div className="bg-[#0f1629]/95 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] w-full shadow-[0_0_60px_rgba(59,130,246,0.15)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent"></div>
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative w-48 h-12 mb-6"><img src="/logo.png" alt="OpsPilot" className="h-16 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
              <div className="text-[9px] font-bold tracking-[0.2em] text-[#64748b] uppercase mb-2">WELCOME BACK</div>
              <h2 className="text-[26px] font-bold font-display mb-2 text-white leading-tight">Sign in to OpsPilot</h2>
              <p className="text-[13px] text-[#94a3b8]">Access your workspace and continue</p>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                type="button" 
                onClick={() => alert("Google OAuth is not implemented in V1")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[11px] font-semibold text-white shadow-inner"
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden p-0.5">
                   <svg viewBox="0 0 48 48" className="w-full h-full"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                </div>
                Continue with Google
              </button>
              <button 
                type="button" 
                onClick={() => alert("Microsoft OAuth is not implemented in V1")}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[11px] font-semibold text-white shadow-inner"
              >
                <div className="grid grid-cols-2 gap-[1px] w-3.5 h-3.5"><div className="bg-[#f25022]"></div><div className="bg-[#7fba00]"></div><div className="bg-[#00a4ef]"></div><div className="bg-[#ffb900]"></div></div>
                Continue with Microsoft
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-white/5 flex-1"></div>
              <span className="text-[9px] font-bold text-[#64748b] uppercase">OR</span>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-xl">{error}</div>}
              
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold text-[#94a3b8]">Email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="you@company.com"
                    className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-10 text-[13px] text-white placeholder:text-[#475569] focus:outline-none focus:border-[#3b82f6] focus:bg-black/40 transition-all shadow-inner"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] group-focus-within:text-[#3b82f6] transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-[#94a3b8]">Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Forgot Password is not implemented in V1"); }} className="text-[11px] text-[#60a5fa] hover:text-[#3b82f6] transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••••••"
                    className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-10 pr-10 text-[13px] text-white placeholder:text-[#475569] focus:outline-none focus:border-[#3b82f6] focus:bg-black/40 transition-all font-mono tracking-widest shadow-inner"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] group-focus-within:text-[#3b82f6] transition-colors" />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1 mb-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative w-4 h-4 rounded-[4px] border border-white/20 bg-black/20 group-hover:border-[#3b82f6] flex items-center justify-center transition-colors">
                     <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" defaultChecked />
                     <div className="absolute inset-0 bg-[#3b82f6] rounded-[3px] opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                     </div>
                  </div>
                  <span className="text-[12px] text-[#94a3b8] group-hover:text-white transition-colors">Keep me signed in</span>
                </label>
                <span className="text-[10px] text-[#475569]">This is a private device</span>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold bg-gradient-to-r from-[#4f46e5] to-[#3b82f6] hover:from-[#4338ca] hover:to-[#2563eb] text-white transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - 3D Dashboard Mockup */}
        <div className="hidden lg:flex flex-col justify-center flex-1 max-w-[400px] pl-10 relative z-10">
          
          <div className="relative w-full aspect-[4/3] mb-10 group" style={{ perspective: '1200px' }}>
             {/* Background glows for the mockup */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#3b82f6]/20 blur-[80px] rounded-full pointer-events-none"></div>
             
             {/* 3D Dashboard Container */}
             <div 
                className="relative w-full h-full rounded-2xl bg-[#0f1629]/80 backdrop-blur-md overflow-hidden flex flex-col shadow-[-20px_30px_60px_rgba(0,0,0,0.5)] border border-white/5 transition-transform duration-700 ease-out"
                style={{ transform: 'rotateY(-12deg) rotateX(8deg) translateZ(10px) scale(0.95)' }}
             >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent"></div>
                
                {/* Header */}
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                   </div>
                   <div className="w-24 h-2 bg-white/5 rounded-full"></div>
                   <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30"></div>
                </div>

                {/* Dashboard Body */}
                <div className="flex flex-1 p-3 gap-3">
                   {/* Sidebar */}
                   <div className="w-14 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-2 p-2 items-center pt-4">
                      <div className="w-7 h-7 rounded-lg bg-[#3b82f6]/20 border border-[#3b82f6]/30"></div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 mt-2"></div>
                      <div className="w-7 h-7 rounded-lg bg-white/5"></div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 mt-auto"></div>
                   </div>
                   
                   {/* Main Content */}
                   <div className="flex-1 flex flex-col gap-3">
                      {/* Top row cards */}
                      <div className="flex gap-2">
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-3">
                            <div className="w-10 h-2 bg-white/20 rounded-full mb-3"></div>
                            <div className="w-16 h-4 bg-white/80 rounded-full mb-2"></div>
                            <div className="w-12 h-1.5 bg-[#4ade80]/50 rounded-full"></div>
                         </div>
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-3">
                            <div className="w-10 h-2 bg-white/20 rounded-full mb-3"></div>
                            <div className="w-16 h-4 bg-white/80 rounded-full mb-2"></div>
                            <div className="w-12 h-1.5 bg-[#f87171]/50 rounded-full"></div>
                         </div>
                      </div>

                      {/* Chart Area */}
                      <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex flex-col">
                         <div className="p-3">
                            <div className="w-24 h-2 bg-white/20 rounded-full"></div>
                         </div>
                         <div className="mt-auto relative h-20 w-full opacity-80">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                              <defs>
                                <linearGradient id="mock-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d="M0,35 Q10,30 25,32 T50,15 T75,25 T100,5" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                              <path d="M0,35 Q10,30 25,32 T50,15 T75,25 T100,5 L100,40 L0,40 Z" fill="url(#mock-grad)" />
                            </svg>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Floating UI elements to add depth */}
             <div className="absolute top-[20%] -right-8 w-36 bg-[#0f1629]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl" style={{ transform: 'rotateY(-12deg) rotateX(8deg) translateZ(40px)' }}>
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-5 h-5 rounded-full bg-[#4ade80]/20 flex items-center justify-center"><Check className="w-3 h-3 text-[#4ade80]" /></div>
                   <div className="w-16 h-2 bg-white/60 rounded-full"></div>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-[#4ade80]"></div></div>
             </div>
          </div>

          <div className="text-[10px] font-bold tracking-[0.2em] text-[#64748b] uppercase mb-3">
            AI-POWERED OPERATIONS
          </div>
          <h2 className="text-[28px] font-bold font-display mb-8 leading-[1.2] text-white">
            Turn Support into <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-[#3b82f6]">Progress.</span>
          </h2>

          <div className="flex flex-col gap-4 mb-8 text-[13px] text-[#e2e8f0]">
             <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#60a5fa]" />
                <span>Resolve issues faster</span>
             </div>
             <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#60a5fa]" />
                <span>Automate routine tasks</span>
             </div>
             <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#60a5fa]" />
                <span>Deliver better customer experiences</span>
             </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
             <div className="text-4xl font-display text-[#3b82f6] opacity-30 absolute top-2 left-4 font-serif leading-none">"</div>
             <p className="text-[13px] italic text-[#94a3b8] mb-4 mt-3 relative z-10">"OpsPilot has transformed the way we handle customer support."</p>
             <div className="text-xs font-bold text-white relative z-10">Support Team</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#64748b] border-t border-white/5 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="OpsPilot Logo" className="h-6 object-contain grayscale opacity-40" />
          <span>© 2026 OpsPilot. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#94a3b8] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#94a3b8] transition-colors">Contact</a>
        </div>
      </div>

    </div>
  )
}

const Lock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
