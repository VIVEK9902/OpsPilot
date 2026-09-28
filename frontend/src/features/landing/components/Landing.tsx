import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Play, CheckCircle2, User, Headset, Shield, 
  Ticket, Package, Sparkles, BookOpen, Activity, Lock, 
  Link as LinkIcon, Server, Monitor, Database, Cloud, 
  Check, LayoutDashboard, ShoppingCart, Users, Settings, 
  Search, ChevronDown
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-on-surface font-sans flex flex-col items-center overflow-x-hidden">
      
      {/* Hero Section Wrapper with Background */}
      <div className="relative w-full min-h-screen bg-[#050B14] bg-[url('/background.png')] bg-cover bg-center bg-no-repeat overflow-hidden flex flex-col pb-32">
         {/* Top Header */}
         <nav className="relative z-50 w-full px-6 md:px-12 py-3 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-2 cursor-pointer relative w-48 h-10" onClick={() => navigate('/')}>
               <img src="/logo.png" alt="OpsPilot Logo" className="h-20 md:h-20 object-contain absolute top-1/2 left-0 -translate-y-1/2" />
            </div>
            
            <div className="hidden md:flex items-center gap-8 xl:gap-10 text-[13px] font-medium text-white/80">
               <a href="#" className="hover:text-white transition-colors">Product</a>
               <a href="#" className="hover:text-white transition-colors">Features</a>
               <a href="#" className="hover:text-white transition-colors">Solutions</a>
               <a href="#" className="hover:text-white transition-colors">Architecture</a>
               <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>

            <div className="flex items-center gap-6 text-[13px]">
               <button 
                  onClick={() => navigate('/login')}
                  className="font-medium text-white hover:text-white/80 transition-colors"
               >
                  Sign in
               </button>
               <button 
                  onClick={() => navigate('/register')}
                  className="font-bold text-white px-6 py-2.5 bg-gradient-to-r from-[#38BDF8] to-[#A855F7] hover:opacity-90 rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2"
               >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
               </button>
            </div>
         </nav>

         {/* Main Hero Content */}
         <main className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 pt-2 md:pt-4 pb-40 flex flex-col lg:flex-row items-center gap-8 flex-1">
            <div className="flex-[0.9] flex flex-col items-start text-left relative z-20">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-[#0A0F1A]/40 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-white/50" /> AI-Powered Support & Operations Platform
               </div>
               
               <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1] text-white">
                  Smarter Support.<br />
                  Smoother Operations.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#A855F7]">Happier Customers.</span>
               </h1>
               
               <p className="text-white/60 text-base max-w-xl mb-6 leading-relaxed font-medium">
                  OpsPilot combines the power of AI, automation, and human expertise to help businesses resolve issues faster, manage operations efficiently, and deliver exceptional customer experiences.
               </p>

               <div className="flex flex-wrap items-center gap-4 mb-6">
                  <button
                     onClick={() => navigate('/register')}
                     className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#38BDF8] to-[#A855F7] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] text-sm"
                  >
                     Try OpsPilot Free <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#0A0F1A]/50 hover:bg-[#0A0F1A]/80 border border-white/10 backdrop-blur-md transition-all text-sm">
                     <Play className="w-4 h-4" /> Watch Demo
                  </button>
               </div>

               <div className="flex flex-wrap items-center gap-6 text-xs text-white/70 font-medium">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-transparent fill-none stroke-[#A855F7]" /> Easy Setup</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-transparent fill-none stroke-[#A855F7]" /> Secure by Design</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-transparent fill-none stroke-[#A855F7]" /> Built for Teams</span>
               </div>
            </div>

            {/* Dashboard Visual (3D Interactive Component) */}
            <div className="flex-[1.1] w-full relative group flex justify-end" style={{ perspective: '1500px' }}>
               <style>{`
                  @keyframes dash { to { stroke-dashoffset: 0; } }
                  @keyframes fade { to { opacity: 0.2; } }
               `}</style>
               
               <div 
                  className="relative bg-[#0F1623]/95 backdrop-blur-3xl rounded-[2rem] border border-white/5 p-0 overflow-hidden shadow-2xl transition-all duration-700 ease-out flex w-full max-w-[750px]"
                  style={{ 
                     transformStyle: 'preserve-3d', 
                     transform: 'rotateY(-12deg) rotateX(4deg) rotateZ(1deg) scale(0.95)',
                     height: '500px',
                     boxShadow: '-40px 50px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                  onMouseOver={(e) => {
                     e.currentTarget.style.transform = 'rotateY(-4deg) rotateX(2deg) scale(1.02)';
                  }}
                  onMouseOut={(e) => {
                     e.currentTarget.style.transform = 'rotateY(-12deg) rotateX(4deg) rotateZ(1deg) scale(0.95)';
                  }}
               >
                  {/* Sidebar */}
                  <div className="w-56 bg-[#050B14]/60 border-r border-white/5 flex flex-col pt-8 pb-6" style={{ transform: 'translateZ(10px)' }}>
                     <div className="px-6 mb-10 flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="h-6 object-contain" />
                     </div>
                     
                     <div className="flex flex-col px-4 gap-1.5 flex-1">
                        {/* Active Item */}
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#2563EB]/40 to-transparent text-white rounded-xl font-bold text-[13px] border border-[#2563EB]/30">
                           <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </div>
                        {/* Inactive Items */}
                        {[
                           { icon: ShoppingCart, label: 'Orders' },
                           { icon: Ticket, label: 'Tickets' },
                           { icon: BookOpen, label: 'Knowledge' },
                           { icon: Sparkles, label: 'AI Assistant' },
                           { icon: Shield, label: 'Audit Logs' },
                           { icon: Users, label: 'Users' },
                           { icon: Settings, label: 'Settings' },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white/80 transition-colors rounded-xl font-medium text-[13px]">
                              <item.icon className="w-4 h-4" /> {item.label}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col bg-transparent" style={{ transform: 'translateZ(20px)' }}>
                     {/* Header */}
                     <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
                        <div className="relative w-72">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                           <input type="text" placeholder="Search anything..." disabled className="w-full h-8 bg-white/5 border border-white/5 rounded-full pl-9 text-[11px] text-white/50 placeholder:text-white/20 focus:outline-none cursor-not-allowed" />
                        </div>
                        <div className="flex items-center gap-4 text-white/50">
                           <Activity className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                           <div className="w-px h-4 bg-white/10"></div>
                           <div className="flex items-center gap-2 cursor-pointer group">
                              <div className="w-7 h-7 rounded-full bg-[#050B14] border border-white/10 flex items-center justify-center text-[11px] text-white font-bold">A</div>
                              <span className="text-[11px] group-hover:text-white transition-colors">Alex</span>
                              <ChevronDown className="w-3 h-3" />
                           </div>
                        </div>
                     </div>
                     
                     {/* Scrollable Content */}
                     <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
                        {/* Welcome */}
                        <div style={{ transform: 'translateZ(10px)' }}>
                           <h2 className="text-xl font-display font-bold text-white mb-1 drop-shadow-lg flex items-center gap-2">Good morning, Alex <span className="text-2xl">👋</span></h2>
                           <p className="text-[11px] text-white/50">Here's what's happening with your operations today.</p>
                        </div>
                        
                        {/* 4 Cards */}
                        <div className="grid grid-cols-4 gap-4" style={{ transform: 'translateZ(20px)' }}>
                           {[
                              { title: 'Total Orders', value: '1,248', trend: '↑ 12%', trendColor: 'text-emerald-400', icon: ShoppingCart },
                              { title: 'Open Tickets', value: '24', trend: '↓ 8%', trendColor: 'text-red-400', icon: Ticket },
                              { title: 'Resolution Rate', value: '96.3%', trend: '↑ 4.5%', trendColor: 'text-[#38BDF8]', icon: Activity },
                              { title: 'AI Assisted', value: '342', trend: '↑ 28%', trendColor: 'text-[#A855F7]', icon: Sparkles },
                           ].map((card, i) => (
                              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                                 <div className="flex justify-between items-start mb-3">
                                    <div className="text-[10px] font-medium text-white/40">{card.title}</div>
                                    <card.icon className="w-3.5 h-3.5 text-white/20" />
                                 </div>
                                 <div className="text-2xl font-display font-bold text-white mb-1.5">{card.value}</div>
                                 <div className={`text-[10px] font-bold ${card.trendColor}`}>{card.trend}</div>
                              </div>
                           ))}
                        </div>
                        
                        {/* Bottom Split */}
                        <div className="flex gap-4 flex-1 mt-2" style={{ transform: 'translateZ(25px)' }}>
                           {/* Chart Area Mock */}
                           <div className="flex-[1.2] bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col relative overflow-hidden">
                              <div className="flex justify-between items-center mb-6 relative z-10">
                                 <div className="text-xs font-semibold text-white/80">Ticket Volume</div>
                                 <div className="flex items-center gap-1 text-[10px] bg-white/5 px-3 py-1.5 rounded-lg text-white/50 border border-white/5 cursor-pointer">
                                    Last 7 days <ChevronDown className="w-3 h-3" />
                                 </div>
                              </div>
                              <div className="absolute inset-x-0 bottom-0 top-16 flex items-end justify-between px-6 pb-6 gap-3">
                                 {[30, 45, 60, 40, 80, 50, 45].map((h, i) => (
                                    <div key={i} className="w-full relative group">
                                       <div className={`w-full rounded-t-lg bg-gradient-to-t ${i === 4 ? 'from-[#A855F7] to-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.5)]' : 'from-[#2563EB]/20 to-[#2563EB]/60'} hover:opacity-100 transition-all cursor-pointer`} style={{ height: `${h}%` }}></div>
                                    </div>
                                 ))}
                              </div>
                              <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[8px] text-white/30 font-mono">
                                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                              </div>
                           </div>
                           
                           {/* Recent Tickets */}
                           <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                 <div className="text-xs font-semibold text-white/80">Recent Tickets</div>
                                 <div className="text-[10px] text-white/40 flex items-center gap-1">View all <ArrowRight className="w-2.5 h-2.5" /></div>
                              </div>
                              <div className="flex flex-col gap-2 flex-1 justify-center mt-2">
                                 {[
                                    { id: '#T-1024', title: 'Payment failed', status: 'OPEN', sColor: 'bg-indigo-500/20 text-indigo-400', time: '2m ago' },
                                    { id: '#T-1023', title: 'Order Cancel', status: 'IN_PROGRESS', sColor: 'bg-[#A855F7]/20 text-[#A855F7]', time: '12m ago' },
                                    { id: '#T-1022', title: 'Delivery status', status: 'WAITING', sColor: 'bg-amber-500/20 text-amber-400', time: '1h ago' },
                                    { id: '#T-1021', title: 'Account access', status: 'RESOLVED', sColor: 'bg-[#38BDF8]/20 text-[#38BDF8]', time: '2h ago' },
                                 ].map((t, i) => (
                                    <div key={i} className="flex items-center justify-between group hover:bg-white/10 p-2 -mx-2 rounded-xl transition-colors cursor-default">
                                       <div className="flex items-center gap-2.5">
                                          <span className="text-[9px] font-mono text-white/30 w-10">{t.id}</span>
                                          <span className="text-[10px] text-white/80 w-24 truncate">{t.title}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded ${t.sColor}`}>{t.status}</span>
                                          <span className="text-[8px] text-white/30 w-8 text-right">{t.time}</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Floating Elements around Laptop */}
               <div className="absolute right-[-40px] top-[15%] hidden lg:flex flex-col items-center transform rotate-[15deg] z-30 opacity-90">
                  <div className="font-['Caveat',_cursive] text-white/70 text-2xl leading-tight text-center">Real Insights<br/>Faster Decisions</div>
                  <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-[140deg] stroke-white/50 mt-1">
                     <path d="M5 5 C 20 40, 40 50, 55 55 M 45 55 L 55 55 L 50 45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>

               <div className="absolute right-[-20px] bottom-[-30px] hidden lg:flex z-30">
                  <div className="bg-[#1e293b]/70 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(56,189,248,0.2)] transform rotate-[-8deg] hover:rotate-0 hover:-translate-y-2 transition-all duration-500 w-56 h-56 flex items-center justify-center">
                     <div className="font-['Caveat',_cursive] text-white/90 text-[28px] text-center leading-[1.1]">
                        All Your<br/>Operations<br/>in One Place.
                     </div>
                  </div>
               </div>

            </div>
         </main>

         {/* Floating Glass Stats Bar */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[85rem] z-40 hidden md:block">
            <div className="bg-[#050B14]/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-wrap justify-between items-center gap-6">
               <div className="flex items-center gap-4 lg:gap-6 group cursor-default flex-1 justify-center border-r border-white/10 last:border-0 pr-6 lg:pr-8 last:pr-0">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#C084FC] group-hover:bg-[#A855F7]/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                     <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-left">
                     <div className="text-sm lg:text-[15px] font-bold text-white mb-0.5">Higher Productivity</div>
                     <div className="text-xs text-white/50">Get more done, faster</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 lg:gap-6 group cursor-default flex-1 justify-center border-r border-white/10 last:border-0 pr-6 lg:pr-8 last:pr-0">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#C084FC] group-hover:bg-[#A855F7]/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                     <Users className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-left">
                     <div className="text-sm lg:text-[15px] font-bold text-white mb-0.5">Better Collaboration</div>
                     <div className="text-xs text-white/50">Teams that work as one</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 lg:gap-6 group cursor-default flex-1 justify-center border-r border-white/10 last:border-0 pr-6 lg:pr-8 last:pr-0">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#38BDF8]/10 flex items-center justify-center text-[#7DD3FC] group-hover:bg-[#38BDF8]/20 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                     <Shield className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-left">
                     <div className="text-sm lg:text-[15px] font-bold text-white mb-0.5">More Reliable Support</div>
                     <div className="text-xs text-white/50">Secure, scalable, always on</div>
                  </div>
               </div>

               <div className="flex items-center gap-4 lg:gap-6 group cursor-default flex-1 justify-center border-r border-white/10 last:border-0">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-[#38BDF8]/10 flex items-center justify-center text-[#7DD3FC] group-hover:bg-[#38BDF8]/20 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                     <Activity className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-left">
                     <div className="text-sm lg:text-[15px] font-bold text-white mb-0.5">Data-Driven Growth</div>
                     <div className="text-xs text-white/50">Turn insights into impact</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stakeholders / Roles Section */}
      <section className="w-full relative overflow-hidden py-32 bg-[#050B14]">
         {/* Background Orbs */}
         <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-[#0EA5E9] rounded-full blur-[120px] opacity-20 mix-blend-screen pointer-events-none"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-[#F59E0B] rounded-full blur-[120px] opacity-10 mix-blend-screen pointer-events-none"></div>
         <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-[#A855F7] rounded-full blur-[120px] opacity-15 mix-blend-screen pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/70 tracking-[0.2em] uppercase mb-6 shadow-lg backdrop-blur-md">
               <Activity className="w-3.5 h-3.5 text-[#0EA5E9]" /> Built for Every Stakeholder
            </div>
            
            <h2 className="text-4xl md:text-[3.5rem] leading-tight font-bold mb-6 font-display text-white">
               One Platform. <span className="text-[#0EA5E9]">Every Team.</span>
            </h2>
            
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-20">
               Whether you're a customer, support agent, or administrator, OpsPilot provides role-focused tools to get work done efficiently.
            </p>

            {/* Hand-drawn annotations (Absolute positioned) */}
            <div className="absolute left-[-6%] top-[30%] hidden xl:flex flex-col items-end transform -rotate-6 z-30">
               <div className="font-['Caveat',_cursive] text-[#0EA5E9] text-2xl mb-2 ml-4">Happier<br/>Customers</div>
               <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 stroke-[#0EA5E9]">
                  <path d="M5 5 C 20 40, 40 50, 55 55 M 45 55 L 55 55 L 50 45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            
            <div className="absolute right-[-6%] top-[35%] hidden xl:flex flex-col items-start transform rotate-6 z-30">
               <div className="font-['Caveat',_cursive] text-[#A855F7] text-2xl mb-2">Smarter<br/>Support</div>
               <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-100 stroke-[#A855F7]">
                  <path d="M5 5 C 20 40, 40 50, 55 55 M 45 55 L 55 55 L 50 45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>

            <div className="absolute right-[-2%] bottom-[12%] hidden xl:flex flex-col items-center transform -rotate-3 z-30">
               <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-[#F59E0B] transform rotate-180 -scale-y-100 mb-2">
                  <path d="M5 5 C 20 40, 40 50, 55 55 M 45 55 L 55 55 L 50 45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               <div className="font-['Caveat',_cursive] text-[#F59E0B] text-2xl text-center leading-tight">More Control<br/>Stronger Teams</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-20 relative z-20">
               {/* Customers */}
               <div className="bg-[#0A0F1A]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#0EA5E9]/30 flex flex-col relative overflow-hidden group shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:shadow-[0_0_80px_rgba(14,165,233,0.4)] hover:-translate-y-3 transition-all duration-500 ease-out">
                  <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0EA5E9]/20 to-transparent opacity-50 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white shadow-[0_10px_20px_rgba(14,165,233,0.4)]">
                        <User className="w-7 h-7" />
                     </div>
                     <div className="px-3 py-1 rounded-full border border-[#0EA5E9]/40 text-[#0EA5E9] text-[9px] font-bold tracking-widest uppercase bg-[#0EA5E9]/10">
                        CUSTOMER
                     </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-3 text-white relative z-10">For Customers</h3>
                  <p className="text-sm text-white/50 mb-8 leading-relaxed h-[60px] relative z-10">Track orders, raise and manage tickets, find answers instantly, and get support with the help of AI.</p>
                  
                  <div className="flex flex-col gap-3.5 mb-10 flex-1 text-[13px] text-white/80 font-medium relative z-10">
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#0EA5E9] fill-[#0EA5E9]/20" /> Order tracking & management</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#0EA5E9] fill-[#0EA5E9]/20" /> Self-service knowledge base</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#0EA5E9] fill-[#0EA5E9]/20" /> AI-powered assistance</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#0EA5E9] fill-[#0EA5E9]/20" /> Faster resolutions</span>
                  </div>
                  <button className="relative z-10 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                     Explore Customer Experience <ArrowRight className="w-4 h-4" />
                  </button>
               </div>

               {/* Support Agents */}
               <div className="bg-[#0A0F1A]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#A855F7]/30 flex flex-col relative overflow-hidden group shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_80px_rgba(168,85,247,0.4)] hover:-translate-y-3 transition-all duration-500 ease-out">
                  <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#A855F7]/20 to-transparent opacity-50 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#A855F7] to-[#7E22CE] flex items-center justify-center text-white shadow-[0_10px_20px_rgba(168,85,247,0.4)]">
                        <Headset className="w-7 h-7" />
                     </div>
                     <div className="px-3 py-1 rounded-full border border-[#A855F7]/40 text-[#A855F7] text-[9px] font-bold tracking-widest uppercase bg-[#A855F7]/10">
                        SUPPORT AGENT
                     </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-3 text-white relative z-10">For Support Agents</h3>
                  <p className="text-sm text-white/50 mb-8 leading-relaxed h-[60px] relative z-10">Manage tickets efficiently, access customer context, and leverage AI to resolve issues faster.</p>
                  
                  <div className="flex flex-col gap-3.5 mb-10 flex-1 text-[13px] text-white/80 font-medium relative z-10">
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#A855F7] fill-[#A855F7]/20" /> Unified ticket workspace</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#A855F7] fill-[#A855F7]/20" /> Customer & order lookup</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#A855F7] fill-[#A855F7]/20" /> AI suggestions and summaries</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#A855F7] fill-[#A855F7]/20" /> Team collaboration</span>
                  </div>
                  <button className="relative z-10 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                     Explore Agent Experience <ArrowRight className="w-4 h-4" />
                  </button>
               </div>

               {/* Administrators */}
               <div className="bg-[#0A0F1A]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#F59E0B]/30 flex flex-col relative overflow-hidden group shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_80px_rgba(245,158,11,0.4)] hover:-translate-y-3 transition-all duration-500 ease-out">
                  <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#F59E0B]/20 to-transparent opacity-50 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white shadow-[0_10px_20px_rgba(245,158,11,0.4)]">
                        <Shield className="w-7 h-7" />
                     </div>
                     <div className="px-3 py-1 rounded-full border border-[#F59E0B]/40 text-[#F59E0B] text-[9px] font-bold tracking-widest uppercase bg-[#F59E0B]/10">
                        ADMINISTRATOR
                     </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold mb-3 text-white relative z-10">For Administrators</h3>
                  <p className="text-sm text-white/50 mb-8 leading-relaxed h-[60px] relative z-10">Maintain control, ensure compliance, manage knowledge, and monitor system health.</p>
                  
                  <div className="flex flex-col gap-3.5 mb-10 flex-1 text-[13px] text-white/80 font-medium relative z-10">
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" /> User & access management</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" /> Audit logs & observability</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" /> Knowledge management</span>
                     <span className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" /> Operational insights</span>
                  </div>
                  <button className="relative z-10 w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-[#78350F] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                     Explore Admin Experience <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Bottom Info Row */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 pt-8 border-t border-white/5 relative z-20">
               <div className="flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9]/20 transition-colors">
                     <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-white mb-0.5">Higher Productivity</div>
                     <div className="text-[11px] text-white/50">Get more done, faster</div>
                  </div>
               </div>
               <div className="hidden md:block w-px h-8 bg-white/10"></div>
               <div className="flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-full bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] group-hover:bg-[#A855F7]/20 transition-colors">
                     <Users className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-white mb-0.5">Better Collaboration</div>
                     <div className="text-[11px] text-white/50">Teams that work as one</div>
                  </div>
               </div>
               <div className="hidden md:block w-px h-8 bg-white/10"></div>
               <div className="flex items-center gap-4 text-left group">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] group-hover:bg-[#F59E0B]/20 transition-colors">
                     <Shield className="w-5 h-5" />
                  </div>
                  <div>
                     <div className="text-sm font-bold text-white mb-0.5">More Reliable Support</div>
                     <div className="text-[11px] text-white/50">Secure, scalable, always on</div>
                  </div>
               </div>
            </div>
            
         </div>
      </section>

      {/* Capabilities Section */}
      <section className="w-full bg-surface-dim border-y border-outline py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <div className="inline-block px-3 py-1 rounded bg-surface border border-outline text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">
                  Key Capabilities
               </div>
               <h2 className="text-3xl md:text-4xl font-bold font-display">Everything You Need for Modern Operations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: "Support Ticketing", desc: "End-to-end ticket management with SLAs", icon: Ticket, color: "text-amber-500", bg: "bg-amber-500/10" },
                 { title: "Order Management", desc: "Track, update, and cancel orders safely", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
                 { title: "AI Assistant", desc: "RAG + tool calling for real actions", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
                 { title: "Knowledge Base", desc: "Find accurate answers from your documentation", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                 { title: "Audit & Observability", desc: "Complete traceability and logs", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                 { title: "Secure & Compliant", desc: "JWT, RBAC, and defense in depth", icon: Lock, color: "text-teal-500", bg: "bg-teal-500/10" },
                 { title: "Integrations Ready", desc: "Connect with your tools and workflows", icon: LinkIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
                 { title: "Scalable Architecture", desc: "Built for growth with modern technologies", icon: Server, color: "text-orange-500", bg: "bg-orange-500/10" },
               ].map((feature, i) => (
                 <div key={i} className="flex flex-col p-6 glass rounded-xl hover:bg-surface transition-colors cursor-default">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${feature.bg} ${feature.color}`}>
                       <feature.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Metrics Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl flex flex-col items-start">
               <div className="text-3xl font-display font-bold mb-1">2.4h</div>
               <div className="text-sm font-medium mb-3">Avg. Resolution Time</div>
               <div className="text-xs text-status-success font-semibold px-2 py-1 bg-status-success/10 rounded flex items-center gap-1"><ArrowRight className="w-3 h-3 -rotate-90" /> 35% faster</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-start">
               <div className="text-3xl font-display font-bold mb-1">98%</div>
               <div className="text-sm font-medium mb-3">Customer Satisfaction</div>
               <div className="text-xs text-status-success font-semibold px-2 py-1 bg-status-success/10 rounded flex items-center gap-1"><ArrowRight className="w-3 h-3 -rotate-45" /> Higher retention</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-start">
               <div className="text-3xl font-display font-bold mb-1">60%</div>
               <div className="text-sm font-medium mb-3">Agent Productivity</div>
               <div className="text-xs text-status-success font-semibold px-2 py-1 bg-status-success/10 rounded flex items-center gap-1"><ArrowRight className="w-3 h-3 -rotate-45" /> More tickets resolved</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-start">
               <div className="text-3xl font-display font-bold mb-1">99.9%</div>
               <div className="text-sm font-medium mb-3">System Uptime</div>
               <div className="text-xs text-on-surface-variant font-semibold px-2 py-1 bg-surface rounded">Reliable & Secure</div>
            </div>
         </div>
      </section>

      {/* Architecture Section */}
      <section className="w-full bg-surface-dim border-y border-outline py-24">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 text-left">
               <div className="inline-block px-3 py-1 rounded bg-surface border border-outline text-[10px] font-bold text-secondary tracking-widest uppercase mb-4">
                  Modern Architecture
               </div>
               <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">Built with Best-in-Class Technology</h2>
               <p className="text-on-surface-variant leading-relaxed mb-8">
                  A modular, secure, and scalable architecture designed for real-world enterprise use. Combining Spring Boot, PostgreSQL, PGVector, and modern AI tooling.
               </p>
               <button className="px-6 py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2">
                  View Architecture Docs <ArrowRight className="w-4 h-4" />
               </button>
            </div>
            
            {/* Architecture Diagram Mock */}
            <div className="flex-1 w-full max-w-lg glass p-8 rounded-3xl relative">
               <div className="flex flex-col gap-8">
                  {/* Top Row */}
                  <div className="flex justify-between items-center relative">
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg">
                        <Monitor className="w-6 h-6 text-primary mb-2" />
                        <span className="text-xs font-bold">Frontend</span>
                        <span className="text-[9px] text-on-surface-variant">React + TypeScript</span>
                     </div>
                     <div className="h-0.5 bg-outline flex-1 mx-2 relative">
                        <div className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-outline border-b-4 border-b-transparent"></div>
                     </div>
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg border-t-2 border-t-status-success">
                        <Server className="w-6 h-6 text-status-success mb-2" />
                        <span className="text-xs font-bold">REST API</span>
                        <span className="text-[9px] text-on-surface-variant">Spring Boot</span>
                     </div>
                     <div className="h-0.5 bg-outline flex-1 mx-2 relative">
                        <div className="absolute right-0 -top-1 w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-outline border-b-4 border-b-transparent"></div>
                     </div>
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg border-t-2 border-t-tertiary">
                        <Sparkles className="w-6 h-6 text-tertiary mb-2" />
                        <span className="text-xs font-bold">AI Layer</span>
                        <span className="text-[9px] text-on-surface-variant">Spring AI + OpenAI</span>
                     </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex justify-between items-center relative mt-4">
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg border-b-2 border-b-secondary">
                        <Database className="w-6 h-6 text-secondary mb-2" />
                        <span className="text-xs font-bold">PostgreSQL</span>
                        <span className="text-[9px] text-on-surface-variant">+ PGVector</span>
                     </div>
                     
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg">
                        <Activity className="w-6 h-6 text-on-surface-variant mb-2" />
                        <span className="text-xs font-bold">Audit & Obs.</span>
                        <span className="text-[9px] text-on-surface-variant">Micrometer</span>
                     </div>
                     
                     <div className="flex flex-col items-center justify-center w-28 h-24 bg-surface border border-outline rounded-xl z-10 shadow-lg">
                        <Cloud className="w-6 h-6 text-primary mb-2" />
                        <span className="text-xs font-bold">Docker & CI/CD</span>
                        <span className="text-[9px] text-on-surface-variant">GitHub Actions</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
         <div className="inline-block px-3 py-1 rounded bg-surface border border-outline text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">
            What Users Say
         </div>
         <h2 className="text-3xl md:text-4xl font-bold font-display mb-16">Trusted by Teams Building the Future</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="glass p-8 rounded-2xl">
               <p className="text-sm leading-relaxed mb-6 italic text-on-surface-variant">"OpsPilot has completely changed how we handle support. Our customers get faster answers and our team is more productive."</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">P</div>
                  <div>
                     <div className="font-bold text-sm">Priya S.</div>
                     <div className="text-xs text-on-surface-variant">Support Team Lead</div>
                  </div>
               </div>
            </div>
            <div className="glass p-8 rounded-2xl">
               <p className="text-sm leading-relaxed mb-6 italic text-on-surface-variant">"The AI assistant is a game changer. It understands our documentation and actually takes action when needed."</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center font-bold">R</div>
                  <div>
                     <div className="font-bold text-sm">Rahul Mehta</div>
                     <div className="text-xs text-on-surface-variant">Engineering Manager</div>
                  </div>
               </div>
            </div>
            <div className="glass p-8 rounded-2xl">
               <p className="text-sm leading-relaxed mb-6 italic text-on-surface-variant">"A clean, modern platform that's secure, scalable, and easy to use. Exactly what we needed."</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold">S</div>
                  <div>
                     <div className="font-bold text-sm">Sneha K.</div>
                     <div className="text-xs text-on-surface-variant">Product Owner</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 mb-20 relative">
         <div className="absolute inset-0 bg-gradient-vibrant opacity-10 rounded-[3rem] blur-xl"></div>
         <div className="relative glass p-12 md:p-16 rounded-[3rem] text-center flex flex-col items-center">
            <div className="text-xs font-bold tracking-widest text-primary uppercase mb-4">Ready to Transform Your Operations?</div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Get Started with OpsPilot Today</h2>
            <p className="text-on-surface-variant mb-10">Set up in minutes. No credit card required.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
               <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-2">
                  Start for Free <ArrowRight className="w-4 h-4" />
               </button>
               <button className="px-8 py-4 rounded-xl font-bold text-white bg-surface hover:bg-surface/80 border border-outline transition-all">
                  Contact Us
               </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-on-surface-variant">
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Quick setup</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Role-based access</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> AI-powered from day one</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Secure and compliant</span>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-outline bg-surface-dim pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
               <div className="flex items-center gap-2 mb-6 relative w-32 h-8">
                  <img src="/logo.png" alt="OpsPilot Logo" className="h-32 object-contain grayscale opacity-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               <p className="text-sm text-on-surface-variant max-w-xs mb-6">
                  Smarter support. Smoother operations. Happier customers.
               </p>
               <div className="flex gap-4 text-on-surface-variant">
                  <span>GitHub</span>
                  <span>LinkedIn</span>
                  <span>YouTube</span>
               </div>
            </div>
            <div>
               <h4 className="font-bold mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Solutions</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Architecture</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Resources</h4>
               <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li><a href="#" className="hover:text-primary transition-colors">Docs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-on-surface-variant">
                  <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 border-t border-outline pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-on-surface-variant">© 2026 OpsPilot. All rights reserved.</p>
            <p className="text-xs text-on-surface-variant">Built with ❤️ for a more efficient tomorrow.</p>
         </div>
      </footer>
    </div>
  );
};
