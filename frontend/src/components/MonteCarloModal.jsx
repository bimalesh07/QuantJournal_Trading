import React from 'react';
import { 
  X, 
  Dices, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Sparkles,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { runMonteCarloSimulation } from '../utils/backtestUtils';

export default function MonteCarloModal({ isOpen, onClose, trades = [] }) {
  if (!isOpen) return null;

  const simResult = runMonteCarloSimulation(trades, 1000);

  const colors = [
    '#06b6d4', '#10b981', '#a855f7', '#f59e0b', 
    '#3b82f6', '#ec4899', '#14b8a6', '#8b5cf6', 
    '#f43f5e', '#6366f1'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-4xl bg-[#090D16] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B101D]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Dices className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                <span>Monte Carlo Strategy Stress-Test</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                  1,000 Resamples
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Randomized trade sequence shuffling to stress-test drawdown & true statistical edge.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Median Expected PnL */}
            <div className="p-3.5 rounded-xl bg-[#0B101D] border border-cyan-500/30 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                <span>Median Return</span>
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-lg font-black text-cyan-300">
                {simResult.medianFinalR > 0 ? `+${simResult.medianFinalR}` : simResult.medianFinalR} R
              </div>
              <p className="text-[9.5px] text-slate-500 mt-1">Expected 50th percentile outcome</p>
            </div>

            {/* 95% Confidence Max Drawdown */}
            <div className="p-3.5 rounded-xl bg-[#0B101D] border border-rose-500/30 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                <span>95% Max Drawdown</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-lg font-black text-rose-400">
                -{simResult.p95MaxDrawdownR} R
              </div>
              <p className="text-[9.5px] text-slate-500 mt-1">95% worst-case loss streak</p>
            </div>

            {/* Worst Case Drawdown */}
            <div className="p-3.5 rounded-xl bg-[#0B101D] border border-amber-500/30 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                <span>Worst Case Dip</span>
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-black text-amber-300">
                -{simResult.worstMaxDrawdownR} R
              </div>
              <p className="text-[9.5px] text-slate-500 mt-1">Absolute maximum draw across 1,000 runs</p>
            </div>

            {/* Probability of Ruin */}
            <div className="p-3.5 rounded-xl bg-[#0B101D] border border-purple-500/30 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold mb-1">
                <span>Probability of Ruin</span>
                <Zap className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-lg font-black text-purple-300">
                {simResult.probabilityOfRuin}%
              </div>
              <p className="text-[9.5px] text-slate-500 mt-1">Odds of dipping below -10.0 R</p>
            </div>

          </div>

          {/* Recharts Multi-Path Equity Curve */}
          <div className="p-4 rounded-xl bg-[#0B101D] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Randomized Equity Growth Paths (Top 10 Resamples)
              </h3>
              <span className="text-[10px] text-slate-400">
                {simResult.totalTradeCount} trades per simulation
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simResult.sampledChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="step" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit="R" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090D16',
                      borderColor: '#1E293B',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  {colors.map((color, idx) => (
                    <Line
                      key={`Path ${idx + 1}`}
                      type="monotone"
                      dataKey={`Path ${idx + 1}`}
                      stroke={color}
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistical Verdict */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300">
              <span className="font-bold text-cyan-300 block">Quantitative Verdict:</span>
              <p>
                Out of 1,000 randomized sequences, 95% of all equity paths stay above a -{simResult.p95MaxDrawdownR} R drawdown. 
                {simResult.probabilityOfRuin === 0
                  ? ' Zero probability of ruin detected (-10R threshold was never breached). This strategy demonstrates strong mathematical edge!'
                  : ` Risk of Ruin is ${simResult.probabilityOfRuin}%. Keep position sizing under 1% per trade to mitigate drawdown streaks.`}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
