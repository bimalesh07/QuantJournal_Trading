import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(12);
  const [pnlValue, setPnlValue] = useState(0);
  const [breakoutStatus, setBreakoutStatus] = useState('Synchronizing Liquidity Feed...');

  useEffect(() => {
    // 1. PnL Value Surge Animation: $0 -> +$450 -> +$1,280 -> +$2,450 Profit
    const pnlTimer = setInterval(() => {
      setPnlValue(prev => {
        if (prev >= 2450) {
          clearInterval(pnlTimer);
          return 2450;
        }
        return prev + 85;
      });
    }, 70);

    // 2. Progress Beam & Status Stage Updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        const nextVal = prev + Math.floor(Math.random() * 10) + 8;
        
        if (nextVal > 75) {
          setBreakoutStatus('Verified Execution Edge • Ready');
        } else if (nextVal > 45) {
          setBreakoutStatus('Computing Risk & Win Rate Expectancy...');
        } else if (nextVal > 20) {
          setBreakoutStatus('Syncing Trade History & Playbook Notes...');
        }

        return nextVal > 98 ? 98 : nextVal;
      });
    }, 200);

    return () => {
      clearInterval(pnlTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#04060C] text-slate-100 font-sans flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      
      {/* Background Cybernetic Trading Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>

      {/* Radial Glow Halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="w-full max-w-4xl space-y-7 relative z-10 text-center">
        
        {/* Top Header Status Pill */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-slate-200 tracking-wide">TradeTrack PRO Terminal Sync</span>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-md">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Institutional Telemetry Live</span>
          </div>
        </div>

        {/* Hero Section: Title & Giant PnL Counter */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{breakoutStatus}</span>
          </div>

          {/* Giant Ticking PnL Counter in Clean Title Font */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-sans tracking-wide block font-semibold">
              Portfolio Growth Trajectory
            </span>
            <div className="text-5xl sm:text-7xl font-extrabold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              +${pnlValue.toLocaleString()}.00
            </div>
          </div>
        </div>

        {/* FULL-SCREEN ANIMATED CANDLESTICK & ORDERFLOW RALLY STAGE */}
        <div className="relative h-48 sm:h-56 w-full rounded-2xl bg-[#070B14]/90 border border-white/15 p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
          
          {/* Background Price Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 pointer-events-none font-sans text-xs">
            <div className="border-b border-emerald-400 border-dashed text-emerald-400 font-semibold text-right">+$2,450 Take Profit Target 3</div>
            <div className="border-b border-cyan-400 border-dashed text-cyan-400 font-semibold text-right">+$1,280 Take Profit Target 2</div>
            <div className="border-b border-amber-400 border-dashed text-amber-400 font-semibold text-right">+$450 Entry Confirmation Trigger</div>
          </div>

          {/* SVG Price Trail Wave */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M 20 150 Q 180 140 280 120 T 480 70 T 700 35 L 900 15"
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="4"
              className="drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"
            />
          </svg>

          {/* Animated Candlesticks Surge */}
          <div className="relative z-10 h-full flex items-end justify-around px-4">
            
            {/* Candle 1: Entry Sweep */}
            <div className="flex flex-col items-center group">
              <span className="text-[10px] text-emerald-400 font-bold mb-1">+$150</span>
              <div className="w-0.5 h-6 bg-emerald-400 opacity-60"></div>
              <div className="w-6 sm:w-8 h-10 bg-emerald-500/80 rounded-sm shadow-md"></div>
            </div>

            {/* Candle 2: Confirmation */}
            <div className="flex flex-col items-center group">
              <span className="text-[10px] text-amber-400 font-bold mb-1">FVG Retest</span>
              <div className="w-0.5 h-10 bg-amber-400 opacity-60"></div>
              <div className="w-6 sm:w-8 h-8 bg-amber-500/80 rounded-sm"></div>
            </div>

            {/* Candle 3: Bullish Displacement */}
            <div className="flex flex-col items-center group">
              <span className="text-[10px] text-emerald-400 font-bold mb-1">+$450</span>
              <div className="w-0.5 h-14 bg-emerald-400 opacity-60"></div>
              <div className="w-6 sm:w-10 h-24 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-sm shadow-xl shadow-emerald-500/30"></div>
            </div>

            {/* Candle 4: God Candle Peak */}
            <div className="flex flex-col items-center group relative">
              <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px] shadow-lg shadow-emerald-500/50 animate-bounce flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                <span>+$2,450 Profit Peak</span>
              </div>
              <div className="w-1 h-20 bg-emerald-300 opacity-70"></div>
              <div className="w-8 sm:w-12 h-36 bg-gradient-to-t from-emerald-500 via-teal-300 to-cyan-300 rounded-md shadow-[0_0_30px_rgba(16,185,129,0.7)] border border-emerald-200"></div>
            </div>

          </div>

        </div>

        {/* Clean Executive Telemetry Cards (Title Case Fonts!) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-[#090E1A] border border-emerald-500/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[11px]">Win Rate Accuracy</span>
                <span className="text-emerald-400 font-bold text-sm">80.0% Execution Edge</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-4 rounded-2xl bg-[#090E1A] border border-cyan-500/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[11px]">Risk to Reward Ratio</span>
                <span className="text-cyan-400 font-bold text-sm">1 : 17.00 Expectancy</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="p-4 rounded-2xl bg-[#090E1A] border border-purple-500/30 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[11px]">Database Encryption</span>
                <span className="text-purple-400 font-bold text-sm">256-Bit Active</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        {/* Progress Beam Footer */}
        <div className="space-y-2 pt-1 font-sans">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Launching TradeTrack PRO Terminal...</span>
            <span className="text-emerald-400 font-mono text-base font-bold">{progress}%</span>
          </div>

          <div className="w-full h-3.5 rounded-full bg-[#090D18] border border-white/10 p-[2px] relative overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
