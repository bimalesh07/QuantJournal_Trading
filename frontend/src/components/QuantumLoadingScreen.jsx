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
  Database,
  BarChart2,
  TrendingDown
} from 'lucide-react';
import TradingCandleBackground from './TradingCandleBackground';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [livePrice, setLivePrice] = useState(68450.00);

  const loadingSteps = [
    { label: 'Initializing Quantum Orderflow Handshake...', icon: Wifi },
    { label: 'Verifying 256-Bit Token Credentials...', icon: Lock },
    { label: 'Connecting to Neon Cloud Database...', icon: Database },
    { label: 'Computing Cumulative PnL & Win Rate Engine...', icon: Cpu },
    { label: 'Terminal Telemetry Synchronized & Ready...', icon: ShieldCheck },
  ];

  // Simulating live ticks during loading
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setLivePrice(prev => prev + (Math.random() > 0.45 ? Math.random() * 12.5 : -Math.random() * 10.2));
    }, 180);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 98;
        }
        const stepInc = Math.floor(Math.random() * 14) + 8;
        const nextVal = prev + stepInc;
        
        if (nextVal > 75) setCurrentStepIndex(3);
        else if (nextVal > 50) setCurrentStepIndex(2);
        else if (nextVal > 25) setCurrentStepIndex(1);

        return nextVal > 95 ? 95 : nextVal;
      });
    }, 280);

    return () => {
      clearInterval(tickInterval);
      clearInterval(interval);
    };
  }, []);

  const CurrentStepIcon = loadingSteps[currentStepIndex].icon;

  // Animated Candlestick Data Simulation
  const candleSim = [
    { h: 'h-12', color: 'bg-emerald-500', wick: 'h-16', change: '+1.2%' },
    { h: 'h-8', color: 'bg-rose-500', wick: 'h-12', change: '-0.4%' },
    { h: 'h-16', color: 'bg-emerald-500', wick: 'h-20', change: '+2.1%' },
    { h: 'h-10', color: 'bg-emerald-400', wick: 'h-14', change: '+0.8%' },
    { h: 'h-6', color: 'bg-rose-400', wick: 'h-10', change: '-0.3%' },
    { h: 'h-20', color: 'bg-emerald-400 animate-pulse', wick: 'h-24', change: '+3.4%' }
  ];

  return (
    <div className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center min-h-[65vh] relative overflow-hidden font-mono selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Dynamic Floating Candlesticks Background Canvas */}
      <TradingCandleBackground />

      {/* Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Main Terminal Loader Card with Animated Laser Border Beam */}
      <div className="w-full max-w-2xl relative p-[2px] rounded-[30px] overflow-hidden shadow-2xl shadow-cyan-500/30 group z-10">
        
        {/* Laser Light Beam */}
        <div 
          className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 230deg, #06b6d4 280deg, #10b981 320deg, #f59e0b 360deg)'
          }}
        />

        {/* Inner Card Screen */}
        <div className="relative p-6 sm:p-10 rounded-[28px] bg-[#070A14]/95 backdrop-blur-2xl space-y-7 text-center border border-white/10">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="ml-2 font-bold text-slate-200">TradeTrack PRO Executive Terminal Sync</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                TELEMETRY LIVE
              </span>
            </div>
          </div>

          {/* Holographic Candlestick Execution Radar HUD */}
          <div className="p-5 rounded-2xl bg-[#090E1A] border border-cyan-500/30 space-y-4 shadow-inner relative overflow-hidden">
            
            {/* Live Ticker Banner */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>INSTITUTIONAL LIQUIDITY FEED</span>
              </span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                BTC/USD ${livePrice.toFixed(2)}
              </span>
            </div>

            {/* Live Animated Candlesticks Chart HUD */}
            <div className="h-28 flex items-end justify-center gap-4 pt-4 border-b border-white/10 pb-2 relative">
              {/* Background Price Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
                <div className="border-b border-cyan-400 border-dashed"></div>
                <div className="border-b border-emerald-400 border-dashed"></div>
                <div className="border-b border-cyan-400 border-dashed"></div>
              </div>

              {candleSim.map((c, idx) => (
                <div key={idx} className="flex flex-col items-center group relative z-10">
                  <div className={`w-0.5 ${c.wick} ${c.color} opacity-60 mb-0.5`}></div>
                  <div className={`w-5 sm:w-7 ${c.h} ${c.color} rounded-sm shadow-lg shadow-emerald-500/20 transition-all duration-300`}></div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1">{c.change}</span>
                </div>
              ))}
            </div>

            {/* Sub-line Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans pt-1">
              <span className="flex items-center gap-1 text-cyan-400 font-mono font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Orderflow Engine: Synchronizing 1,000+ Execution Logs</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">100% SECURE</span>
            </div>
          </div>

          {/* Step Indicator & Status Message */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10">
              <CurrentStepIcon className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Step [{currentStepIndex + 1}/5]: {loadingSteps[currentStepIndex].label}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>TERMINAL SYNCHRONIZATION</span>
              </span>
              <span className="text-cyan-400 font-mono text-sm">{progress}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full h-3.5 rounded-full bg-[#0D1322] border border-white/10 p-[2px] relative overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">LATENCY</span>
              <span className="text-emerald-400 font-bold font-mono">12 ms</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">DATABASE</span>
              <span className="text-cyan-400 font-bold font-mono">Neon PostgreSQL</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0D1220] border border-white/5 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">ENCRYPTION</span>
              <span className="text-purple-400 font-bold font-mono">AES-256 GCM</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
