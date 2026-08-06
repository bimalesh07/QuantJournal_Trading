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
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, BarChart2, PieChart as PieIcon, Brain, AlertTriangle, Clock, Calendar } from 'lucide-react';

export default function AnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  const { 
    equity_curve = [], 
    monthly_pnl = [], 
    overview = {}, 
    pnl_by_emotion = [],
    pnl_by_session = [],
    pnl_by_day = []
  } = analytics;

  // Condensed Currency Formatter
  const formatCurrencyCondensed = (val) => {
    if (val === 0 || val === null || val === undefined) return '$0';
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (absVal >= 1000000) return `${sign}$${(absVal / 1000000).toFixed(1)}M`;
    if (absVal >= 1000) return `${sign}$${(absVal / 1000).toFixed(0)}k`;
    return `${sign}$${absVal}`;
  };

  // Short Date Formatter for X-Axis
  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  // Donut chart data for Win / Loss / Breakeven
  const pieData = [
    { name: 'Wins', value: overview.win_count || 0, color: '#10B981' },
    { name: 'Losses', value: overview.loss_count || 0, color: '#F43F5E' },
    { name: 'Breakeven', value: overview.breakeven_count || 0, color: '#64748B' },
  ].filter(d => d.value > 0);

  // Check if any negative emotional trait generated positive PnL (Discipline Risk)
  const negativeTraits = ['FOMO', 'REVENGE', 'IMPULSIVE', 'FEARFUL', 'GREEDY'];
  const hasDisciplineWarning = pnl_by_emotion.some(
    e => negativeTraits.includes(e.emotion?.toUpperCase()) && e.net_pnl > 0
  );

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBadMindsetProfitable = negativeTraits.includes(data.emotion?.toUpperCase()) && data.net_pnl > 0;

      return (
        <div className="bg-[#121622] border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono backdrop-blur-xl">
          <div className="text-slate-300 font-bold mb-1.5 border-b border-slate-800 pb-1">
            {label || data.date || data.month || data.session || data.day || data.emotion}
          </div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 font-extrabold text-sm py-0.5" style={{ color: entry.color || '#10B981' }}>
              <span>{entry.name}:</span>
              <span>${entry.value ? entry.value.toLocaleString() : 0}</span>
            </div>
          ))}
          {data.trades !== undefined && (
            <div className="text-slate-400 text-xs mt-1 font-semibold">
              Trades: <span className="text-white font-bold">{data.trades}</span> ({data.win_rate || 0}% Win Rate)
            </div>
          )}
          {data.symbol && <div className="text-slate-400 text-xs mt-1">Symbol: <span className="text-white font-bold">{data.symbol}</span></div>}
          {isBadMindsetProfitable && (
            <div className="mt-2 text-xs text-amber-400 flex items-center gap-1.5 font-sans bg-amber-500/15 p-1.5 rounded-lg border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Discipline Risk: Profitable negative-behavior trade</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* SVG Gradient Definitions */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
          {/* Blue Session Gradient */}
          <linearGradient id="blueSessionGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.8} />
          </linearGradient>
          {/* Emerald Gradient */}
          <linearGradient id="emeraldBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
            <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
          </linearGradient>
          {/* Rose Gradient */}
          <linearGradient id="roseBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
            <stop offset="100%" stopColor="#991B1B" stopOpacity={0.8} />
          </linearGradient>
          {/* Indigo Gradient */}
          <linearGradient id="indigoBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
            <stop offset="100%" stopColor="#4338CA" stopOpacity={0.8} />
          </linearGradient>
          {/* Teal Gradient */}
          <linearGradient id="tealBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity={1} />
            <stop offset="100%" stopColor="#0F766E" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Cumulative Equity Curve Area Chart */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide font-mono">Cumulative Equity Curve</h3>
              <p className="text-xs text-slate-400 font-medium">Account Growth & Drawdown Timeline</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            Account Timeline
          </span>
        </div>
        <div className="h-72 w-full">
          {equity_curve.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equity_curve} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d40" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} tickFormatter={formatShortDate} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} width={65} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(16, 185, 129, 0.5)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="cumulative_pnl" 
                  name="Cumulative PnL" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#equityGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
              No closed trade timeline data available.
            </div>
          )}
        </div>
      </div>

      {/* 2. PnL by Trading Session Chart */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-500/20">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-mono">PnL by Trading Session</h3>
              <p className="text-xs text-slate-400 font-medium">Session Performance Analysis</p>
            </div>
          </div>
          <span className="text-xs text-blue-300 font-mono font-bold px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30">
            Asian / London / NY
          </span>
        </div>
        <div className="h-64 w-full">
          {pnl_by_session.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnl_by_session} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d40" />
                <XAxis dataKey="session" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} width={65} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', rx: 6, ry: 6 }} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[6, 6, 0, 0]}>
                  {pnl_by_session.map((entry, index) => (
                    <Cell key={`sess-cell-${index}`} fill={entry.net_pnl >= 0 ? 'url(#blueSessionGrad)' : 'url(#roseBarGrad)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
              No trading session stats available.
            </div>
          )}
        </div>
      </div>

      {/* 3. PnL by Day of Week Chart */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md shadow-indigo-500/20">
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-mono">PnL by Day of Week</h3>
              <p className="text-xs text-slate-400 font-medium">Daily Consistency Breakdown</p>
            </div>
          </div>
          <span className="text-xs text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            Mon - Sun
          </span>
        </div>
        <div className="h-64 w-full">
          {pnl_by_day.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnl_by_day.filter(d => d.trades > 0 || d.net_pnl !== 0)} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d40" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} tickFormatter={(val) => val.slice(0, 3)} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} width={65} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', rx: 6, ry: 6 }} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[6, 6, 0, 0]}>
                  {pnl_by_day.map((entry, index) => (
                    <Cell key={`day-cell-${index}`} fill={entry.net_pnl >= 0 ? 'url(#emeraldBarGrad)' : 'url(#roseBarGrad)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
              No day-of-week data available.
            </div>
          )}
        </div>
      </div>

      {/* 4. Monthly PnL Performance Bar Chart */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md shadow-teal-500/20">
              <BarChart2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-mono">Monthly PnL Performance</h3>
              <p className="text-xs text-slate-400 font-medium">Macro Returns Overview</p>
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          {monthly_pnl.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_pnl} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d40" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} tickLine={false} width={65} tickFormatter={formatCurrencyCondensed} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', rx: 6, ry: 6 }} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[6, 6, 0, 0]}>
                  {monthly_pnl.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.net_pnl >= 0 ? 'url(#tealBarGrad)' : 'url(#roseBarGrad)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
              No monthly data available.
            </div>
          )}
        </div>
      </div>

      {/* 5. Win / Loss / Breakeven Ratio Donut Chart */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/20">
              <PieIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-mono">Win / Loss Ratio</h3>
              <p className="text-xs text-slate-400 font-medium">Outcome Distribution</p>
            </div>
          </div>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} stroke="#121622" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-200 font-mono font-bold ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-sm font-mono">No trades logged yet.</div>
          )}
        </div>
      </div>

      {/* 6. PnL by Emotional State Breakdown */}
      <div className="bg-[#121622]/90 border border-slate-800/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl col-span-1 lg:col-span-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20">
              <Brain className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-mono">PnL by Emotional Mindset</h3>
              <p className="text-xs text-slate-400 font-medium">Psychology Leak Analysis</p>
            </div>
          </div>
          {hasDisciplineWarning && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 animate-pulse shadow-md shadow-amber-500/10">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Discipline Warning: Profitable negative-mindset trades detected</span>
            </div>
          )}
        </div>
        <div className="h-64 w-full">
          {pnl_by_emotion.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnl_by_emotion} layout="vertical" margin={{ top: 10, right: 25, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252d40" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} fontWeight={600} tickFormatter={formatCurrencyCondensed} />
                <YAxis dataKey="emotion" type="category" stroke="#CBD5E1" fontSize={11} fontWeight={700} tickLine={false} width={95} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', rx: 6, ry: 6 }} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[0, 6, 6, 0]}>
                  {pnl_by_emotion.map((entry, index) => (
                    <Cell key={`emo-cell-${index}`} fill={entry.net_pnl >= 0 ? 'url(#emeraldBarGrad)' : 'url(#roseBarGrad)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm font-mono">
              No emotion stats available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
