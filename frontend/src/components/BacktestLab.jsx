import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  FlaskConical, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Target, 
  Scale, 
  Activity, 
  Award, 
  BarChart3, 
  PieChart, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Download,
  Upload,
  Clock,
  Tag,
  Dices
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

import {
  calculateBacktestAnalytics,
  calculateStrategyAssetMatrix,
  calculateCumulativeREquityCurve,
  calculateSessionPerformance,
  calculateTimeframePerformance,
  calculateConfluencePower,
  calculateMFEOptimizer
} from '../utils/backtestUtils';

import BacktestTable from './BacktestTable';
import MonteCarloModal from './MonteCarloModal';

export default function BacktestLab({
  backtestTrades = [],
  strategies = [],
  onOpenLogModal,
  onOpenEditModal,
  onOpenDetailModal,
  onDeleteTrade,
  onImportCSV,
  theme = 'dark'
}) {

  const [isMonteCarloOpen, setIsMonteCarloOpen] = useState(false);

  // Calculate quantitative analytics exclusively from isolated backtest dataset
  const analytics = useMemo(() => {
    return calculateBacktestAnalytics(backtestTrades);
  }, [backtestTrades]);

  // Strategy x Asset Leaderboard Matrix
  const compatibilityMatrix = useMemo(() => {
    return calculateStrategyAssetMatrix(backtestTrades);
  }, [backtestTrades]);

  // Cumulative R-Equity Growth Curve
  const equityCurveData = useMemo(() => {
    return calculateCumulativeREquityCurve(backtestTrades);
  }, [backtestTrades]);

  // Session Performance Breakdown
  const sessionBreakdown = useMemo(() => {
    return calculateSessionPerformance(backtestTrades);
  }, [backtestTrades]);

  // Timeframe Performance Breakdown
  const timeframeBreakdown = useMemo(() => {
    return calculateTimeframePerformance(backtestTrades);
  }, [backtestTrades]);

  // Confluence Power Leaderboard
  const confluencePower = useMemo(() => {
    return calculateConfluencePower(backtestTrades);
  }, [backtestTrades]);

  // MFE Target Optimizer
  const mfeOptimizer = useMemo(() => {
    return calculateMFEOptimizer(backtestTrades);
  }, [backtestTrades]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Header Toolbar */}
      <div className="p-6 rounded-3xl bg-[#070A14]/90 border border-cyan-500/20 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Glow Accent Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <FlaskConical className="w-6 h-6 animate-bounce" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-wider text-white flex items-center gap-2">
                <span>Backtesting Lab</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40 uppercase">
                  Institutional Edge Engine
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Hypothesis testing, mathematical expected value (EV), and strategy-market compatibility leaderboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsMonteCarloOpen(true)}
              className="h-10 px-3.5 rounded-xl text-xs font-mono font-bold text-cyan-300 bg-[#0C1527] hover:bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 shadow-md transition-all cursor-pointer flex items-center gap-2"
              title="Run 1,000-shuffle Monte Carlo Stress Test"
            >
              <Dices className="w-4 h-4 text-cyan-400" />
              <span>🎲 Monte Carlo Simulator</span>
            </button>

            <button
              onClick={onOpenLogModal}
              className="h-10 px-4 rounded-xl text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>+ Log Backtest Trade</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Executive Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        
        {/* Card 1: Sample Size & Quality */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Sample Size</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">
            {analytics.totalTrades} <span className="text-xs text-slate-400 font-normal">Trades</span>
          </div>
          <div className={`text-[10px] font-bold ${analytics.sampleQuality.color}`}>
            {analytics.sampleQuality.badge}
          </div>
        </div>

        {/* Card 2: Win Rate % */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Backtested Win Rate</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">
            {analytics.winRate}%
          </div>
          <div className="text-[10px] text-slate-400">
            {analytics.winsCount} Wins | {analytics.lossesCount} Losses | {analytics.breakevenCount} BE
          </div>
        </div>

        {/* Card 3: Profit Factor */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>R-Profit Factor</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-cyan-300">
            {analytics.profitFactor}
          </div>
          <div className="text-[10px] text-slate-400">
            Gross R: +{analytics.sumPositiveR} / -{analytics.sumNegativeR}
          </div>
        </div>

        {/* Card 4: Accumulated Net R */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Accumulated Net R</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-xl font-black ${analytics.totalNetR >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {analytics.totalNetR >= 0 ? `+${analytics.totalNetR}` : analytics.totalNetR} R
          </div>
          <div className="text-[10px] text-slate-400">
            Avg Win: +{analytics.avgWinR}R
          </div>
        </div>

        {/* Card 5: Mathematical Edge (EV) */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-cyan-500/30 shadow-xl backdrop-blur-xl space-y-1 font-mono bg-cyan-950/10">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
            <span>Mathematical Edge (EV)</span>
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className={`text-xl font-black ${analytics.evPerTrade > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {analytics.evPerTrade > 0 ? `+${analytics.evPerTrade}` : analytics.evPerTrade} R / trade
          </div>
          <div className="text-[10px] text-cyan-200">
            EV = (Win% × WinR) - (Loss% × LossR)
          </div>
        </div>

        {/* Card 6: Risk of Ruin & Max Drawdown */}
        <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Max Drawdown & Streak</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">
            -{analytics.maxRDrawdown} R
          </div>
          <div className="text-[10px] text-slate-400">
            Max Loss Streak: {analytics.maxConsecutiveLosses} trades
          </div>
        </div>

      </div>

      {/* 3. Cumulative Simulated R-Equity Growth Chart */}
      <div className="p-6 rounded-3xl bg-[#070A12]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Cumulative Simulated R-Equity Growth Curve</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Historical performance timeline measured in risk units (R-Multiple).
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Peak: {Math.max(...equityCurveData.map(d => d.cumulativeR), 0)} R
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurveData}>
              <defs>
                <linearGradient id="colorCumulativeR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickLine={false} 
                tickFormatter={(v) => `${v}R`}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0B101D] border border-cyan-500/40 p-3 rounded-xl shadow-2xl font-mono text-xs text-white space-y-1">
                        <div className="font-bold text-cyan-300">{data.symbol} ({data.strategy})</div>
                        <div>Realized: <span className={data.realizedR >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {data.realizedR >= 0 ? `+${data.realizedR}` : data.realizedR} R
                        </span></div>
                        <div>Cumulative R: <span className="text-cyan-400 font-bold">{data.cumulativeR} R</span></div>
                        <div className="text-[10px] text-slate-400">{data.date}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeR" 
                stroke="#06b6d4" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorCumulativeR)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Strategy × Asset Compatibility Matrix (Leaderboard) */}
      <div className="p-6 rounded-3xl bg-[#070A12]/90 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Strategy × Asset Compatibility Matrix (Leaderboard)</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Quantitative comparison of strategy performance per asset class to identify high-probability setups.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B101D] border-b border-white/10 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Strategy Model</th>
                <th className="py-3 px-4">Asset / Market</th>
                <th className="py-3 px-4 text-center">Sample N</th>
                <th className="py-3 px-4 text-center">Win Rate %</th>
                <th className="py-3 px-4 text-center">Avg R:R</th>
                <th className="py-3 px-4 text-center">Profit Factor</th>
                <th className="py-3 px-4 text-center">EV (Edge)</th>
                <th className="py-3 px-4 text-right">Readiness Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono text-xs text-slate-200">
              {compatibilityMatrix.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    No strategy x asset data available yet. Log backtest setups to populate matrix.
                  </td>
                </tr>
              ) : (
                compatibilityMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{item.strategy}</td>
                    <td className="py-3 px-4 text-cyan-300">{item.asset}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{item.sampleSize}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">{item.winRate}%</td>
                    <td className="py-3 px-4 text-center text-slate-300">{item.avgRR}</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-300">{item.profitFactor}</td>
                    <td className="py-3 px-4 text-center font-black">
                      <span className={item.ev > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {item.ev > 0 ? `+${item.ev}` : item.ev} R
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.status.badgeClass}`}>
                        {item.status.text}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Edge Breakdown Visuals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Breakdown 1: Trading Session */}
        <div className="p-5 rounded-3xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Performance by Trading Session
          </h3>

          <div className="space-y-2 font-mono">
            {sessionBreakdown.map((s) => (
              <div key={s.session} className="p-2.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{s.shortLabel}</span>
                  <span className="text-cyan-300">{s.winRate}% Win</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>N = {s.count} trades</span>
                  <span className={s.netR >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    Net {s.netR >= 0 ? `+${s.netR}` : s.netR} R
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown 2: Timeframe */}
        <div className="p-5 rounded-3xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Performance by Timeframe Split
          </h3>

          <div className="space-y-2 font-mono">
            {timeframeBreakdown.filter(tf => tf.count > 0).length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No timeframe data available.</div>
            ) : (
              timeframeBreakdown.filter(tf => tf.count > 0).map((tf) => (
                <div key={tf.timeframe} className="p-2.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>TF: {tf.timeframe}</span>
                    <span className="text-emerald-400">{tf.winRate}% Win</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>N = {tf.count} trades</span>
                    <span className={tf.netR >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      Net {tf.netR >= 0 ? `+${tf.netR}` : tf.netR} R
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Breakdown 3: Confluence Edge Power */}
        <div className="p-5 rounded-3xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Tag className="w-4 h-4 text-amber-400" />
            Confluence Edge Power (Win Rate)
          </h3>

          <div className="space-y-2 font-mono">
            {confluencePower.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">No confluence tags logged yet.</div>
            ) : (
              confluencePower.slice(0, 4).map((c) => (
                <div key={c.tag} className="p-2.5 rounded-xl bg-[#0B101D] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>{c.tag}</span>
                    <span className="text-emerald-400">{c.winRate}% Win</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>N = {c.sampleSize}</span>
                    <span className="text-cyan-300">EV: +{c.ev}R</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* MFE Take-Profit Target Optimizer Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#090E1A] via-[#0B1426] to-[#090E1A] border border-cyan-500/30 shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">MFE Take-Profit Target Optimizer</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                Optimal Target: {mfeOptimizer.optimalTargetR} R
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {mfeOptimizer.recommendation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto bg-[#070A12] p-2.5 rounded-2xl border border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Avg Peak MFE</span>
            <span className="font-bold text-emerald-400">+{mfeOptimizer.avgMFE} R</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Profit Left On Table</span>
            <span className="font-bold text-amber-300">+{mfeOptimizer.profitLeftOnTable} R</span>
          </div>
        </div>
      </div>

      {/* 6. Backtest Trade Log Table */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span>Historical Backtest Execution Log</span>
            <span className="text-xs font-normal text-slate-400">({backtestTrades.length} Total Records)</span>
          </h2>
        </div>

        <BacktestTable
          trades={backtestTrades}
          strategies={strategies}
          onViewTrade={onOpenDetailModal}
          onEditTrade={onOpenEditModal}
          onDeleteTrade={onDeleteTrade}
          onImportCSV={onImportCSV}
          onOpenLogModal={onOpenLogModal}
          theme={theme}
        />
      </div>

      {/* 7. Monte Carlo Stress Test Lightbox Modal */}
      <MonteCarloModal
        isOpen={isMonteCarloOpen}
        onClose={() => setIsMonteCarloOpen(false)}
        trades={backtestTrades}
      />

    </div>
  );
}
