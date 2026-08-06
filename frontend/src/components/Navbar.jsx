import React, { useState, useRef } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  BarChart3, 
  Calendar, 
  ListFilter, 
  PieChart, 
  Layers, 
  User,
  LogOut,
  Sun,
  Moon,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenTradeModal, 
  onOpenStrategyModal,
  currentUser,
  onLogout,
  theme = 'dark',
  onToggleTheme
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'trades', label: 'Trade Log', icon: ListFilter },
    { id: 'analytics', label: 'Analytics Engine', icon: BarChart3 },
    { id: 'calendar', label: 'PnL Calendar', icon: Calendar },
  ];

  // 3D Parallax Tilt State for floating capsule
  const navRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -5;
    const rY = ((x - centerX) / centerX) * 5;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <header className="sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-3 transition-all">
      <div 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: isHovered 
            ? 'transform 0.08s ease-out, box-shadow 0.3s ease' 
            : 'transform 0.5s ease-out, box-shadow 0.5s ease',
        }}
        className="w-full max-w-[1550px] mx-auto aerogel-surface rounded-full px-4 sm:px-6 py-2.5 border border-white/10 shadow-2xl backdrop-blur-2xl bg-[#090D16]/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3 relative overflow-hidden group"
      >
        {/* Diamond-cut edge shimmer */}
        <div className="shimmer-edge"></div>

        {/* 1. Brand Identity & 3D Glass Orb Logo */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            
            {/* 3D Polished Glass Orb Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/30 group/orb cursor-pointer relative overflow-hidden">
              <div className="w-full h-full bg-[#070A12] rounded-full flex items-center justify-center group-hover/orb:bg-transparent transition-colors">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400 group-hover/orb:text-slate-950 font-black transition-colors stroke-[2.2]" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg sm:text-xl tracking-wider text-white font-mono">
                  Trade<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Track</span>
                </span>

                {/* 3D Faceted Crystal PRO Badge */}
                <span className="px-2.5 py-0.5 text-[10px] font-black tracking-widest bg-gradient-to-r from-purple-500/20 via-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/40 rounded-full font-mono uppercase shadow-sm">
                  PRO
                </span>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono font-medium whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.9)]"></span>
                <span>Trading Journal & Analytics</span>
              </p>
            </div>

          </div>
        </div>

        {/* 2. Center Inner Frosted-Glass Capsule Navigation Pills */}
        <nav className="flex items-center gap-1 bg-[#070A12]/90 p-1.5 rounded-full border border-white/10 shadow-inner overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-8.5 px-4 flex items-center gap-2 rounded-full text-xs font-mono font-bold leading-none transition-all whitespace-nowrap cursor-pointer shrink-0 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Right Sculpted Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Sculpted Amethyst-Purple Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="h-9 px-3.5 flex items-center gap-1.5 rounded-full text-xs font-mono font-bold bg-[#140F24] hover:bg-[#1C1533] text-amber-300 border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                <span className="text-amber-200 hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 shrink-0" />
                <span className="text-slate-700 hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Strategies Button */}
          <button
            onClick={onOpenStrategyModal}
            className="h-9 flex items-center gap-1.5 px-3.5 rounded-full text-xs font-mono font-bold text-purple-200 bg-[#120D22] hover:bg-purple-950/60 hover:text-purple-100 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Strategies</span>
          </button>

          {/* Sleek High-Contrast + Log Trade Button */}
          <button
            onClick={() => onOpenTradeModal()}
            className="h-9 flex items-center gap-1.5 px-4 rounded-full text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:scale-105 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer border border-emerald-300/40 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
            <span>+ Log Trade</span>
          </button>

          {/* Translucent Glass Profile & Logout Ring */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E121B] border border-white/10 text-xs font-mono font-bold text-slate-200 shadow-sm hover:border-emerald-500/40 transition-all">
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold uppercase text-[10px]">
                  {currentUser.username ? currentUser.username.charAt(0) : 'U'}
                </div>
                <span className="text-slate-300">{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="h-8.5 w-8.5 flex items-center justify-center text-slate-400 hover:text-rose-400 bg-[#0E121B] hover:bg-rose-500/10 rounded-full border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                title="Lock System & Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
