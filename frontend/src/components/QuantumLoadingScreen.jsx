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
  Sparkles
} from 'lucide-react';
import TradingCandleBackground from './TradingCandleBackground';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [livePrice, setLivePrice] = useState(68450.00);
  const [terminalLogs, setTerminalLogs] = useState([
    'SYSTEM :: Initializing 256-Bit Quantum Security Cluster...',
    'NET :: Connecting to Neon PostgreSQL Cloud Database...',
  ]);

  const loadingSteps = [
    { label: 'Initializing Quantum Cloud Handshake...', icon: Wifi },
    { label: 'Verifying Encrypted Token Credentials...', icon: Lock },
    { label: 'Connecting to High-Frequency Database...', icon: Database },
    { label: 'Computing Cumulative PnL & Win Rate Engine...', icon: Cpu },
    { label: 'Executive Terminal Telemetry Ready...', icon: ShieldCheck },
  ];

  useEffect(() => {
    // 1. Live Ticker Simulation
    const tickInterval = setInterval(() => {
      setLivePrice(prev => prev + (Math.random() > 0.45 ? Math.random() * 14.5 : -Math.random() * 11.2));
    }, 160);

    // 2. Terminal Log Stream Simulation
    const logInterval = setInterval(() => {
      const logs = [
        'EXEC :: Calibrating Institutional Risk Engine...',
        'DATA :: Syncing 1,000+ Trade History Logs...',
        'ALGO :: Verifying Strategy Win Rate Expectancy Matrix...',
        'SECURITY :: TLS 1.3 AES-256 Tunnel Established...',
        'STATUS :: Terminal Synchronization Complete.'
      ];
      setTerminalLogs(prev => [...prev.slice(-3), logs[Math.floor(Math.random() * logs.length)]]);
    }, 450);

    // 3. Progress Step Progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 96) {
          clearInterval(progressInterval);
          return 98;
        }
        const nextVal = prev + Math.floor(Math.random() * 12) + 8;
        
        if (nextVal > 75) setCurrentStepIndex(3);
        else if (nextVal > 50) setCurrentStepIndex(2);
        else if (nextVal > 25) setCurrentStepIndex(1);

        return nextVal > 95 ? 95 : nextVal;
      });
    }, 240);

    return () => {
      clearInterval(tickInterval);
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentStepIcon = loadingSteps[currentStepIndex].icon;

  // Real-Time Animated Candlesticks Formation
  const animatedCandles = [
    { h: 'h-10', color: 'bg-emerald-500', wick: 'h-14', pnl: '+1.4%' },
    { h: 'h-6', color: 'bg-rose-500', wick: 'h-10', pnl: '-0.3%' },
    { h: 'h-14', color: 'bg-emerald-400', wick: 'h-18', pnl: '+2.8%' },
    { h: 'h-8', color: 'bg-emerald-500', wick: 'h-12', pnl: '+0.9%' },
    { h: 'h-5', color: 'bg-rose-400', wick: 'h-8', pnl: '-0.2%' },
    { h: 'h-20', color: 'bg-gradient-to-t from-emerald-500 to-cyan-300 animate-pulse', wick: 'h-24', pnl: '+4.2% MAX' }
  ];

  return (
    <div className="py-16 sm:py-24 px-4 flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden font-mono select-none">
      
      {/* Background Floating Candlestick Parallax Canvas */}
      <TradingCandleBackground />

      {/* Ambient Radial Glow Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* MAIN EXECUTIVE TERMINAL LOADER CARD with Rotating Laser Light Beam */}
      <div className="w-full max-w-2xl relative p-[2px] rounded-[30px] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] group z-10">
        
        {/* Continuous Rotating Laser Light Beam around Card */}
        <div 
          className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 230deg, #06b6d4 280deg, #10b981 320deg, #f59e0b 360deg)'
          }}
        />

        {/* Inner Card Screen */}
        <div className="relative p-6 sm:p-10 rounded-[28px] bg-[#060913]/95 backdrop-blur-2xl space-y-7 text-center border border-white/15">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="ml-2 font-bold text-slate-200 font-sans tracking-wide">TradeTrack PRO Executive Terminal Sync</span>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5 shadow-md">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              TELEMETRY LIVE
            </span>
          </div>

          {/* CENTRAL 3D QUANTUM HOLOGRAPHIC RADAR & CANDLESTICK HUD */}
          <div className="p-5 rounded-2xl bg-[#080D1A] border border-cyan-500/30 space-y-4 shadow-inner relative overflow-hidden">
            
            {/* Live Market Price Banner */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>INSTITUTIONAL LIQUIDITY FEED</span>
              </span>
              <span className="text-emerald-400 font-bold font-mono text-sm drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                BTC/USD ${livePrice.toFixed(2)}
              </span>
            </div>

            {/* Real-Time Animated Candlestick Chart HUD */}
            <div className="h-28 flex items-end justify-center gap-4 pt-3 border-b border-white/10 pb-2 relative">
              {/* Background Price Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none">
                <div className="border-b border-cyan-400 border-dashed"></div>
                <div className="border-b border-emerald-400 border-dashed"></div>
                <div className="border-b border-cyan-400 border-dashed"></div>
              </div>

              {animatedCandles.map((c, idx) => (
                <div key={idx} className="flex flex-col items-center group relative z-10">
                  <div className={`w-0.5 ${c.wick} ${c.color} opacity-60 mb-0.5`}></div>
                  <div className={`w-5 sm:w-7 ${c.h} ${c.color} rounded-sm shadow-lg shadow-emerald-500/30 transition-all duration-300`}></div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1">{c.pnl}</span>
                </div>
              ))}
            </div>

            {/* Live Streaming Terminal Log Line */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1 text-left">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold truncate max-w-md">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{terminalLogs[terminalLogs.length - 1]}</span>
              </span>
              <span className="text-emerald-400 font-bold shrink-0 ml-2">100% SECURE</span>
            </div>
          </div>

          {/* Current Step Status Pill */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/20">
              <CurrentStepIcon className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Step [{currentStepIndex + 1}/5]: {loadingSteps[currentStepIndex].label}</span>
            </div>
          </div>

          {/* Sleek Progress Bar Beam */}
          <div className="space-y-2 pt-1 font-sans">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>TERMINAL SYNCHRONIZATION</span>
              </span>
              <span className="text-cyan-400 font-mono text-sm">{progress}%</span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-[#0B101D] border border-white/15 p-[2px] relative overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Bar Footer */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono">
            <div className="p-2 rounded-xl bg-[#0B101D] border border-white/10 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">LATENCY</span>
              <span className="text-emerald-400 font-bold">12 ms</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0B101D] border border-white/10 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">DATABASE</span>
              <span className="text-cyan-400 font-bold">Neon Cloud</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0B101D] border border-white/10 space-y-0.5">
              <span className="text-slate-500 block uppercase font-bold">ENCRYPTION</span>
              <span className="text-purple-400 font-bold">AES-256 GCM</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
