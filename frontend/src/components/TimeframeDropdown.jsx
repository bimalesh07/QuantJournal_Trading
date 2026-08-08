import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Check, 
  Zap, 
  Clock, 
  TrendingUp, 
  Sparkles,
  SlidersHorizontal,
  Activity
} from 'lucide-react';

const TIMEFRAME_OPTIONS = [
  {
    id: 'Today',
    label: 'Today',
    badge: '24H',
    desc: 'Intraday execution & immediate telemetry',
    icon: Zap,
    accentColor: 'text-amber-400',
    bgBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    gradientBg: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'This Week',
    label: 'This Week',
    badge: '7D',
    desc: 'Current trading week cycle metrics',
    icon: Clock,
    accentColor: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    gradientBg: 'from-cyan-500/20 via-teal-500/10 to-transparent'
  },
  {
    id: 'This Month',
    label: 'This Month',
    badge: '30D',
    desc: 'Monthly performance & monthly horizon',
    icon: Calendar,
    accentColor: 'text-teal-300',
    bgBadge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    gradientBg: 'from-teal-500/20 via-emerald-500/10 to-transparent'
  },
  {
    id: 'This Year',
    label: 'This Year',
    badge: 'YTD',
    desc: 'Year-to-date strategic performance',
    icon: TrendingUp,
    accentColor: 'text-purple-300',
    bgBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    gradientBg: 'from-purple-500/20 via-indigo-500/10 to-transparent'
  },
  {
    id: 'All Time',
    label: 'All Time',
    badge: 'MAX',
    desc: 'Full historical dataset & complete log',
    icon: Sparkles,
    accentColor: 'text-emerald-300',
    bgBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    gradientBg: 'from-cyan-500/20 via-emerald-500/15 to-teal-500/10'
  }
];

export default function TimeframeDropdown({
  activeTimeframe = 'All Time',
  onSelectTimeframe,
  tradeCount = null,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentOption = TIMEFRAME_OPTIONS.find(opt => opt.id === activeTimeframe) || TIMEFRAME_OPTIONS[4];
  const ActiveIcon = currentOption.icon;

  const handleOptionClick = (optionId) => {
    if (onSelectTimeframe) {
      onSelectTimeframe(optionId);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Sleek Glass Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-mono transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-2xl select-none ${
          isOpen
            ? 'bg-[#0E1528] border-cyan-400/60 text-white shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
            : 'bg-[#090D18]/90 hover:bg-[#0E1528]/95 border border-white/15 hover:border-cyan-400/40 text-slate-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* Glowing Icon Pill */}
        <div className={`flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br ${currentOption.gradientBg} border border-cyan-400/40 text-cyan-300 shadow-sm shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-200`}>
          <ActiveIcon className="w-3.5 h-3.5" />
        </div>

        {/* Label & Active Option Title */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold tracking-wider text-[11px] uppercase">Period:</span>
          <span className="font-bold text-cyan-300 tracking-wide">{currentOption.label}</span>
        </div>

        {/* Micro Scope Badge */}
        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${currentOption.bgBadge}`}>
          {currentOption.badge}
        </span>

        {/* Animated Chevron */}
        <ChevronDown 
          className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ml-1 ${
            isOpen ? 'transform rotate-180 text-cyan-300' : 'group-hover:translate-y-0.5'
          }`} 
        />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl bg-[#090D1A]/95 border border-cyan-500/35 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] z-50 overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{ transformOrigin: 'top left' }}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                Timeframe Horizon
              </span>
            </div>
            {tradeCount !== null && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" />
                {tradeCount} Trades
              </span>
            )}
          </div>

          {/* Options List */}
          <div className="p-1.5 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
            {TIMEFRAME_OPTIONS.map((option) => {
              const isSelected = activeTimeframe === option.id;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-r ${option.gradientBg} border border-cyan-400/40 shadow-lg shadow-cyan-500/10`
                      : 'hover:bg-white/[0.06] hover:translate-x-1 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon Container */}
                    <div className={`p-2 rounded-xl border transition-all duration-200 ${
                      isSelected 
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-500/30' 
                        : 'bg-slate-900/80 border-white/10 text-slate-400 group-hover:border-cyan-500/30 group-hover:text-slate-200'
                    }`}>
                      <OptionIcon className="w-4 h-4" />
                    </div>

                    {/* Label & Description */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${
                          isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {option.label}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${option.bgBadge}`}>
                          {option.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {option.desc}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40 shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Click any horizon to filter dataset</span>
            <span className="text-cyan-400/80">ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
