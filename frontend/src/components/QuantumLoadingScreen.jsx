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
        
        {/* Pulsing Orb Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-teal-400/20 p-[1.5px] shadow-xl shadow-cyan-500/20 relative group animate-pulse">
          <div className="w-full h-full bg-[#080C16] rounded-2xl flex items-center justify-center border border-cyan-500/30">
            <Zap className="w-7 h-7 text-cyan-400 stroke-[2.5]" />
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
