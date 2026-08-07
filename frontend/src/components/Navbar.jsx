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
  Zap,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  BookOpen
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
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'PnL Calendar', icon: Calendar },
    { id: 'playbook', label: 'Playbook & Notes', icon: BookOpen },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#070A14]/95 border-b border-white/15 px-3 sm:px-6 py-2.5 shadow-2xl transition-all relative">
      {/* Glowing Bottom Border Gradient Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>

      <div 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[1850px] mx-auto flex items-center justify-between gap-2 relative"
      >

        {/* 1. Brand Identity */}
        <div className="flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-[2px] overflow-hidden shadow-lg shadow-emerald-500/30 group/orb shrink-0">
              <div 
                className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #06b6d4 270deg, #10b981 320deg, #f59e0b 360deg)'
                }}
              />
              <div className="relative w-full h-full bg-[#070A12] rounded-full flex items-center justify-center group-hover/orb:bg-transparent transition-colors">
                <TrendingUp className="w-4 h-4 text-emerald-400 group-hover/orb:text-slate-950 font-black transition-colors stroke-[2.2]" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base sm:text-lg tracking-wider text-white font-mono">
                  Trade<span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Track</span>
                </span>

                <div className="relative p-[1px] rounded-full overflow-hidden shadow-sm shadow-emerald-500/20">
                  <div 
                    className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 200deg, #06b6d4 260deg, #10b981 310deg, #f59e0b 360deg)'
                    }}
                  />
                  <span className="relative px-1.5 py-0.5 text-[8.5px] font-black tracking-widest bg-[#070A12] text-emerald-300 rounded-full font-mono uppercase block">
                    PRO
                  </span>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 hidden lg:flex items-center gap-1 font-mono font-medium whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
                <span>Trading Journal & Analytics</span>
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons (+ Log & Hamburger Toggle) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <button
              onClick={() => onOpenTradeModal()}
              className="h-8 px-3 flex items-center gap-1 rounded-full text-[11px] font-mono font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/20 shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>+ Log</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8.5 w-8.5 flex items-center justify-center rounded-xl bg-[#121824] border border-white/15 text-emerald-400 active:scale-95 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Mobile Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5 text-emerald-400" /> : <Menu className="w-4.5 h-4.5 text-emerald-400" />}
            </button>
          </div>

        </div>

        {/* 2. Desktop Navigation Tab Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#070A12]/90 p-1 rounded-full border border-white/10 shadow-inner shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`h-8 px-3 flex items-center gap-1.5 rounded-full text-[11.5px] font-mono font-bold leading-none transition-all whitespace-nowrap cursor-pointer shrink-0 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/30 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. Right Action Buttons (Desktop MD+ Only) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="h-9 px-3.5 flex items-center gap-1.5 rounded-full text-xs font-mono font-bold bg-[#140F24] hover:bg-[#1C1533] text-amber-300 border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                <span className="text-amber-200">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20 shrink-0" />
                <span className="text-slate-700">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenStrategyModal}
            className="h-9 flex items-center gap-1.5 px-3.5 rounded-full text-xs font-mono font-bold text-purple-200 bg-[#120D22] hover:bg-purple-950/60 hover:text-purple-100 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Strategies</span>
          </button>

          <button
            onClick={() => onOpenTradeModal()}
            className="h-9 flex items-center gap-1.5 px-4 rounded-full text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:scale-105 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer border border-emerald-300/40 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
            <span>+ Log Trade</span>
          </button>

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

      {/* 4. Mobile Glassmorphic Hamburger Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-3 top-20 z-50 animate-fadeIn">
          <div className="bg-[#090D16]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl space-y-4 shadow-emerald-500/10">
            
            {/* User Profile Card Header */}
            {currentUser && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F1420] border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] flex items-center justify-center">
                    <div className="w-full h-full bg-[#090D16] rounded-full flex items-center justify-center text-emerald-300 font-bold uppercase text-xs">
                      {currentUser.username ? currentUser.username.charAt(0) : 'U'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-white">{currentUser.username}</p>
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Security Mode Active
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Nav Options */}
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 tracking-wider">Navigation Menu</p>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-600'}`} />
                  </button>
                );
              })}

              {/* Strategies Option */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenStrategyModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono font-bold text-purple-200 hover:bg-purple-950/40 transition-all border border-purple-500/20 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Strategies Manager</span>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-500" />
              </button>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTradeModal();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>+ Log New Trade</span>
              </button>

              <button
                onClick={onToggleTheme}
                className="p-2.5 rounded-xl bg-[#140F24] border border-purple-500/30 text-amber-300 flex items-center justify-center cursor-pointer"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
