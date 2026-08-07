import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp, BarChart2, Brain, Clock, Layers, Target } from 'lucide-react';

export default function AnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  const { 
    equity_curve = [], 
    overview = {}, 
    pnl_by_emotion = [],
    pnl_by_session = [],
    pnl_by_asset_class = []
  } = analytics;

  const assetClassData = pnl_by_asset_class;

  // Condensed Currency Formatter
  const formatCurrencyCondensed = (val) => {
    if (val === 0 || val === null || val === undefined) return '$0';
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (absVal >= 1000000) return `${sign}$${(absVal / 1000000).toFixed(1)}M`;
    if (absVal >= 1000) return `${sign}$${(absVal / 1000).toFixed(0)}k`;
    return `${sign}$${absVal}`;
  };

  // Custom Glassmorphism Tooltip for Mouse Hover
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0D1220] border border-white/15 p-3.5 rounded-2xl shadow-2xl text-xs font-mono backdrop-blur-2xl z-50 pointer-events-none min-w-[160px]">
          <div className="text-slate-300 font-bold mb-1.5 border-b border-white/10 pb-1 flex items-center justify-between gap-3">
            <span>{label || data.date || data.month || data.session || data.day || data.emotion || data.name}</span>
            {data.trades !== undefined && <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-md font-semibold">{data.trades} Trades</span>}
          </div>
          {payload.map((entry, index) => {
            const rawVal = entry.value;
            const valNum = Number(rawVal || 0);
            const formattedVal = `${valNum >= 0 ? '+' : ''}$${valNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            return (
              <div key={index} className="flex items-center justify-between gap-4 font-black text-sm py-0.5" style={{ color: entry.color || '#34D399' }}>
                <span>{entry.name || 'Net PnL'}:</span>
                <span>{formattedVal}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* SVG Gradient Definitions */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
            <stop offset="100%" stopColor="#34D399" stopOpacity={0.85} />
          </linearGradient>
          <linearGradient id="roseBarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FB7185" stopOpacity={1} />
            <stop offset="100%" stopColor="#E11D48" stopOpacity={0.85} />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Win Rate & P&L by Asset Class Widget */}
      <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
                Win Rate & P&L by Asset Class
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Asset Performance & Accuracy Breakdown</p>
            </div>
          </div>

          <span className="text-xs text-emerald-400 font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            Multi-Asset Terminal
          </span>
        </div>

        {/* Dual Grid: Horizontal Bar Chart on Left + Asset Breakdown List Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left: Horizontal Bar Chart */}
          <div className="h-80 w-full font-mono bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={assetClassData}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                style={{ backgroundColor: 'transparent' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={formatCurrencyCondensed} />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={100} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                <Bar dataKey="pnl" name="Net PnL" maxBarSize={20} radius={[0, 6, 6, 0]}>
                  {assetClassData.map((entry, index) => (
                    <Cell
                      key={`asset-cell-${index}`}
                      fill={entry.pnl >= 0 ? 'url(#emeraldBarGrad)' : 'url(#roseBarGrad)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Stacked Asset Cards List */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-mono">
            {assetClassData.map((asset, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0D1220] border border-white/10 hover:border-emerald-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${asset.isProfit ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500'}`}></span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{asset.name}</h4>
                    <span className="text-[10px] text-slate-400">{asset.trades} trades</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold">{asset.winRate}%</span>
                  </div>

                  <div className={`font-extrabold ${asset.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.isProfit ? '+' : ''}${asset.pnl.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 2. PnL by Trading Session & Emotional Mindset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Session Performance */}
        <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-white">PnL by Trading Session</h3>
                <p className="text-xs text-slate-400 font-sans">New York vs London vs Asian</p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full font-mono bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pnl_by_session.length > 0 ? pnl_by_session : [
                  { session: 'New York', net_pnl: 14500 },
                  { session: 'London', net_pnl: 8200 },
                  { session: 'Asian', net_pnl: -1200 }
                ]}
                style={{ backgroundColor: 'transparent' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="session" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                <Bar dataKey="net_pnl" maxBarSize={45} radius={[8, 8, 0, 0]}>
                  {(pnl_by_session.length > 0 ? pnl_by_session : [
                    { session: 'New York', net_pnl: 14500 },
                    { session: 'London', net_pnl: 8200 },
                    { session: 'Asian', net_pnl: -1200 }
                  ]).map((entry, index) => (
                    <Cell key={`sess-${index}`} fill={entry.net_pnl >= 0 ? '#34D399' : '#FB7185'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PnL by Emotional Mindset */}
        <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Brain className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-white">PnL by Emotional Mindset</h3>
                <p className="text-xs text-slate-400 font-sans">Disciplined vs FOMO Leak Analysis</p>
              </div>
            </div>
          </div>

          <div className="h-60 w-full font-mono bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pnl_by_emotion.length > 0 ? pnl_by_emotion : [
                  { emotion: 'Disciplined', net_pnl: 22400 },
                  { emotion: 'Patient', net_pnl: 12100 },
                  { emotion: 'FOMO', net_pnl: -4500 },
                  { emotion: 'Revenge', net_pnl: -8200 }
                ]}
                style={{ backgroundColor: 'transparent' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="emotion" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                <Bar dataKey="net_pnl" maxBarSize={45} radius={[8, 8, 0, 0]}>
                  {(pnl_by_emotion.length > 0 ? pnl_by_emotion : [
                    { emotion: 'Disciplined', net_pnl: 22400 },
                    { emotion: 'Patient', net_pnl: 12100 },
                    { emotion: 'FOMO', net_pnl: -4500 },
                    { emotion: 'Revenge', net_pnl: -8200 }
                  ]).map((entry, index) => (
                    <Cell key={`emo-${index}`} fill={entry.net_pnl >= 0 ? '#34D399' : '#FB7185'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

