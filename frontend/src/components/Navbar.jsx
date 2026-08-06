import React from 'react';
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
  Sparkles,
  Sun,
  Moon
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

  return (
    <header className="sticky top-0 z-30 bg-[#0B0E14]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Brand & Market Status */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1px] shadow-lg shadow-emerald-500/20 group cursor-pointer">
              <div className="w-full h-full bg-[#0F131C] rounded-[15px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:text-slate-950 font-bold transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-mono">
                  Trade<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Track</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono uppercase shadow-sm">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
                Quantitative Trading System & Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Scrollbar Hidden & Perfectly Fitted) */}
        <nav className="flex items-center gap-1 bg-[#121620]/90 p-1 rounded-xl border border-slate-800/80 shadow-inner overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-8 px-3 flex items-center gap-2 rounded-lg text-xs font-semibold leading-none transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Buttons & User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className="h-8.5 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl text-xs font-semibold bg-[#151921] hover:bg-slate-800 text-amber-400 border border-slate-700 transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                <span className="text-slate-200 hidden sm:inline font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20 shrink-0" />
                <span className="text-slate-700 hidden sm:inline font-mono">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenStrategyModal}
            className="h-8.5 flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold text-slate-200 bg-[#151921] hover:bg-purple-950/40 hover:text-purple-300 border border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Strategies</span>
          </button>
          
          <button
            onClick={() => onOpenTradeModal()}
            className="h-8.5 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
            <span>+ Log Trade</span>
          </button>

          {/* User Profile & Log Out */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800/80">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#151921] border border-slate-800 text-xs font-semibold text-slate-200 shadow-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold uppercase text-[11px]">
                  {currentUser.username ? currentUser.username.charAt(0) : 'U'}
                </div>
                <span className="font-mono text-slate-300">{currentUser.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="h-8.5 w-8.5 flex items-center justify-center text-slate-400 hover:text-rose-400 bg-[#151921] hover:bg-rose-500/10 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
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
