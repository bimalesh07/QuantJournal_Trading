import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Sparkles,
  ArrowUpRight,
  Flame,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(8);
  const [pnlValue, setPnlValue] = useState(-150);
  const [breakoutStatus, setBreakoutStatus] = useState('IMBALANCE SWEEP');
  const [candleStep, setCandleStep] = useState(0);

  useEffect(() => {
    // 1. PnL Value Surge Animation: -$150 -> $0 -> +$450 -> +$1,280 -> +$2,450 PROFIT
    const pnlTimer = setInterval(() => {
      setPnlValue(prev => {
        if (prev >= 2450) {
          clearInterval(pnlTimer);
          return 2450;
        }
        const delta = prev < 0 ? 35 : (prev < 500 ? 85 : 145);
        return prev + delta;
      });
    }, 90);

    // 2. Progress Beam & Status Stage Updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 96) {
          clearInterval(interval);
          return 100;
        }
        const nextVal = prev + Math.floor(Math.random() * 12) + 10;
        
        if (nextVal > 75) {
          setBreakoutStatus('PROFIT EDGE CONFIRMED');
          setCandleStep(3);
        } else if (nextVal > 45) {
          setBreakoutStatus('BULLISH DISPLACEMENT RALLY');
          setCandleStep(2);
        } else if (nextVal > 20) {
          setBreakoutStatus('BUY TRIGGER EXECUTED');
          setCandleStep(1);
        }

        return nextVal > 98 ? 98 : nextVal;
      });
    }, 220);

    return () => {
      clearInterval(pnlTimer);
      clearInterval(interval);
    };
  }, []);

  const isProfitable = pnlValue >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#04060C] text-slate-100 font-mono flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      
      {/* Background Cybernetic Trading Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>

      {/* Radial Glow Halos */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl space-y-8 relative z-10 text-center">
        
        {/* Top Header System Status Ticker */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold text-slate-200 uppercase tracking-wider">TRADETRACK PRO • QUANT EXECUTIVE TERMINAL</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>ORDERFLOW BREAKOUT LIVE</span>
          </div>
        </div>

        {/* MAIN HERO STAGE: Dynamic PnL Surge Display & Bullish Displacement */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-xl">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>STATUS: {breakoutStatus}</span>
          </div>

          {/* Giant Ticking PnL Counter */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-sans uppercase tracking-widest block font-bold">
              PORTFOLIO CUMULATIVE PnL TRAJECTORY
            </span>
            <div className={`text-5xl sm:text-7xl font-black font-mono tracking-tight transition-all duration-300 ${
              isProfitable 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.6)]' 
                : 'text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]'
            }`}>
              {pnlValue >= 0 ? `+$${pnlValue.toLocaleString()}.00` : `-$${Math.abs(pnlValue)}.00`}
            </div>
          </div>
        </div>

        {/* FULL-STAGE ANIMATED BULLISH BREAKOUT CANDLESTICK RALLY STAGE */}
        <div className="relative h-48 sm:h-56 w-full rounded-2xl bg-[#070B14]/90 border border-white/15 p-6 shadow-2xl overflow-hidden flex flex-col justify-between">
          
          {/* Background Grid Horizontal Lines */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-25 pointer-events-none">
            <div className="border-b border-emerald-400 border-dashed text-[10px] text-emerald-400 font-bold text-right">+2,450.00 TAKE PROFIT 3</div>
            <div className="border-b border-cyan-400 border-dashed text-[10px] text-cyan-400 font-bold text-right">+1,280.00 TAKE PROFIT 2</div>
            <div className="border-b border-amber-400 border-dashed text-[10px] text-amber-400 font-bold text-right">+450.00 ENTRY CONFIRMED</div>
            <div className="border-b border-rose-500 border-dashed text-[10px] text-rose-500 font-bold text-right">-150.00 STOP LOSS</div>
          </div>

          {/* Live Price Trail Curve (SVG Laser Wave) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d="M 20 160 Q 180 150 280 130 T 480 80 T 700 40 L 900 20"
              fill="none"
              stroke="url(#glowGrad)"
              strokeWidth="4"
              className="drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"
            />
          </svg>

          {/* Animated Candlesticks Surge */}
          <div className="relative z-10 h-full flex items-end justify-around px-4">
            
            {/* Candle 1: Initial Dip */}
            <div className="flex flex-col items-center group">
              <span className="text-[9px] text-rose-400 font-bold mb-1">-$150</span>
              <div className="w-0.5 h-6 bg-rose-500"></div>
              <div className="w-6 sm:w-8 h-10 bg-rose-500 rounded-sm shadow-lg shadow-rose-500/30"></div>
            </div>

            {/* Candle 2: Rejection Sweep */}
            <div className="flex flex-col items-center group">
              <span className="text-[9px] text-amber-400 font-bold mb-1">SWEEP</span>
              <div className="w-0.5 h-10 bg-amber-400"></div>
              <div className="w-6 sm:w-8 h-6 bg-amber-500 rounded-sm"></div>
            </div>

            {/* Candle 3: Massive Bullish Displacement Candle 1 */}
            <div className="flex flex-col items-center group">
              <span className="text-[9px] text-emerald-400 font-bold mb-1">+$450</span>
              <div className="w-0.5 h-14 bg-emerald-400"></div>
              <div className="w-6 sm:w-10 h-24 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-sm shadow-xl shadow-emerald-500/40"></div>
            </div>

            {/* Candle 4: GOD CANDLE (Shooting to Top!) */}
            <div className="flex flex-col items-center group relative">
              <div className="absolute -top-7 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] shadow-lg shadow-emerald-500/50 animate-bounce flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                <span>+$2,450 MAX RALLY</span>
              </div>
              <div className="w-1 h-20 bg-emerald-300"></div>
              <div className="w-8 sm:w-12 h-36 bg-gradient-to-t from-emerald-500 via-teal-300 to-cyan-300 rounded-md shadow-[0_0_30px_rgba(16,185,129,0.8)] border border-emerald-200"></div>
            </div>

          </div>

        </div>

        {/* Quantitative HUD Telemetry Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#090E1A] border border-emerald-500/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">WIN RATE ACCURACY</span>
                <span className="text-emerald-400 font-bold text-sm">80.0% EXECUTION EDGE</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="p-4 rounded-2xl bg-[#090E1A] border border-cyan-500/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">RISK TO REWARD</span>
                <span className="text-cyan-400 font-bold text-sm">1 : 17.00 EXPECTANCY</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="p-4 rounded-2xl bg-[#090E1A] border border-purple-500/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-sans uppercase font-bold">EXECUTION LOGS</span>
                <span className="text-purple-400 font-bold text-sm">100% SYNCHRONIZED</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        {/* Sleek Progress Bar Beam */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>LAUNCHING TRADETRACK PRO TERMINAL...</span>
            </span>
            <span className="text-emerald-400 font-mono text-base font-black">{progress}%</span>
          </div>

          <div className="w-full h-4 rounded-full bg-[#090D18] border border-white/15 p-[2px] relative overflow-hidden shadow-inner">
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
