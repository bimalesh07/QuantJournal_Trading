import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Terminal, 
  Activity,
  Lock,
  Database
} from 'lucide-react';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const loadingSteps = [
    { label: 'Initializing Quantum Cloud Handshake...', icon: Wifi },
    { label: 'Verifying 256-Bit Token Credentials...', icon: Lock },
    { label: 'Connecting to Neon PostgreSQL Database...', icon: Database },
    { label: 'Computing Cumulative PnL & Win Rate Engine...', icon: Cpu },
    { label: 'Terminal Synchronization Ready...', icon: ShieldCheck },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) {
          clearInterval(interval);
          return 96;
        }
        const stepInc = Math.floor(Math.random() * 14) + 8;
        const nextVal = prev + stepInc;
        
        if (nextVal > 75) setCurrentStepIndex(3);
        else if (nextVal > 50) setCurrentStepIndex(2);
        else if (nextVal > 25) setCurrentStepIndex(1);

        return nextVal > 95 ? 95 : nextVal;
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const CurrentStepIcon = loadingSteps[currentStepIndex].icon;

  return (
    <div className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden font-mono selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Terminal Loader Card with Animated Running Neon Border Beam */}
      <div className="w-full max-w-xl relative p-[2px] rounded-[28px] overflow-hidden shadow-2xl shadow-cyan-500/25 group">
        
        {/* Continuous Rotating Neon Laser Light Beam around Loader Box */}
        <div 
          className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 230deg, #06b6d4 280deg, #10b981 320deg, #f59e0b 360deg)'
          }}
        />

        {/* Outer Glow Edge Halo */}
        <div className="absolute inset-0 rounded-[28px] shadow-[0_0_40px_rgba(6,182,212,0.3)] pointer-events-none"></div>

        {/* Inner Card Screen */}
        <div className="relative p-8 sm:p-10 rounded-[26px] bg-[#070A14]/95 backdrop-blur-2xl space-y-8 text-center border border-white/10">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="ml-2 font-bold text-slate-300">TradeTrack PRO Terminal Sync</span>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
              <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              CONNECTING
            </span>
          </div>

          {/* Central Radar Hologram Scanner */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-4">
            
            {/* Outer Pulsing Concentric Radar Rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-30 pointer-events-none"></div>
            <div className="absolute -inset-3 rounded-full border border-emerald-500/20 animate-pulse pointer-events-none"></div>

            {/* Rotating Radar Scanner Sweep */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin-slow pointer-events-none"
              style={{ animationDuration: '6s' }}
            ></div>

            {/* Inner Center Glowing Logo Orb */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2px] shadow-2xl shadow-cyan-500/50 flex items-center justify-center relative group">
              <div className="w-full h-full bg-[#070A12] rounded-full flex items-center justify-center">
                <TrendingUp className="w-9 h-9 text-cyan-400 stroke-[2.5] animate-pulse" />
              </div>
            </div>
            
            {/* Floating Orbiting Particle */}
            <div className="absolute -top-1 right-2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-bounce"></div>
          </div>

          {/* Step Indicator & Status Message */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10">
              <CurrentStepIcon className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Step [{currentStepIndex + 1}/4]: {loadingSteps[currentStepIndex].label}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
              Connecting to secure cloud server backend. Synchronizing encrypted execution logs & analytics engine...
            </p>
          </div>

          {/* Futuristic Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                SYSTEM INITIALIZATION
              </span>
              <span className="text-cyan-400 font-mono text-sm">{progress}%</span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-3 rounded-full bg-[#0D1322] border border-white/10 p-[2px] relative overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Light Line inside Bar */}
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Bar Footer */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase">Latency</span>
              <span className="text-emerald-400 font-bold">14 ms</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase">Database</span>
              <span className="text-cyan-400 font-bold">Neon Cloud</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase">Security</span>
              <span className="text-purple-400 font-bold">AES-256</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
