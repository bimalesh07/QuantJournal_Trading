import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Activity, Sparkles } from 'lucide-react';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    // Ultra-Fast Instant Laser Sync (150ms total transition)
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 35;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center min-h-[45vh] relative overflow-hidden font-mono select-none">
      
      {/* Top High-Speed Laser Beam Pulse */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#060913]">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-300 shadow-[0_0_20px_rgba(6,182,212,0.9)] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Cybernetic Telemetry Badge */}
      <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
        
        {/* Animated Japanese Candlestick Pulsing Orb */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/25 via-cyan-500/25 to-teal-400/25 p-[1.5px] shadow-xl shadow-cyan-500/30 relative group">
          <div className="w-full h-full bg-[#080C16] rounded-2xl flex items-center justify-center gap-1.5 px-2 border border-cyan-500/40 overflow-hidden">
            {/* Candle 1: Red Dip */}
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-0.5 h-2 bg-rose-500 opacity-70"></div>
              <div className="w-2.5 h-5 bg-rose-500 rounded-xs shadow-sm"></div>
            </div>

            {/* Candle 2: Green Bullish Surge */}
            <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '0.9s' }}>
              <div className="w-0.5 h-3 bg-emerald-400 opacity-90"></div>
              <div className="w-3 h-7 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-xs shadow-lg shadow-emerald-500/50"></div>
            </div>

            {/* Candle 3: Cyan Push */}
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-0.5 h-2 bg-cyan-400 opacity-70"></div>
              <div className="w-2.5 h-6 bg-cyan-400 rounded-xs shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Sync Text */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-white font-sans">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Instant Terminal Telemetry Sync</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Synchronizing encrypted execution logs & PnL expectancy engine...
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AES-256 Quantum Security Active • 100% Ready</span>
        </div>

      </div>

    </div>
  );
}
