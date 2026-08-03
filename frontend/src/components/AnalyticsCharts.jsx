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
import { TrendingUp, BarChart2, PieChart as PieIcon, Brain } from 'lucide-react';

export default function AnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  const { equity_curve = [], monthly_pnl = [], overview = {}, pnl_by_emotion = [] } = analytics;

  // Donut chart data for Win / Loss / Breakeven
  const pieData = [
    { name: 'Wins', value: overview.win_count || 0, color: '#10B981' },
    { name: 'Losses', value: overview.loss_count || 0, color: '#EF4444' },
    { name: 'Breakeven', value: overview.breakeven_count || 0, color: '#64748B' },
  ].filter(d => d.value > 0);

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#151921] border border-slate-700/80 p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="text-slate-400 mb-1">{label || data.date || data.month || data.emotion}</div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 font-semibold" style={{ color: entry.color || '#10B981' }}>
              <span>{entry.name}:</span>
              <span>${entry.value ? entry.value.toLocaleString() : 0}</span>
            </div>
          ))}
          {data.symbol && <div className="text-slate-400 text-[10px] mt-1">Symbol: {data.symbol}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Cumulative Equity Curve Area Chart */}
      <div className="card-dark p-5 col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Cumulative Equity Curve</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Account Growth Timeline</span>
        </div>
        <div className="h-72 w-full">
          {equity_curve.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equity_curve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="cumulative_pnl" 
                  name="Cumulative PnL" 
                  stroke="#10B981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#equityGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No closed trade timeline data available.
            </div>
          )}
        </div>
      </div>

      {/* 2. Monthly PnL Performance Bar Chart */}
      <div className="card-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Monthly PnL Performance</h3>
          </div>
        </div>
        <div className="h-64 w-full">
          {monthly_pnl.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_pnl} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[4, 4, 0, 0]}>
                  {monthly_pnl.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.net_pnl >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No monthly data available.
            </div>
          )}
        </div>
      </div>

      {/* 3. Win / Loss / Breakeven Ratio Donut Chart */}
      <div className="card-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Win / Loss Ratio</h3>
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
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value, entry) => <span className="text-xs text-slate-300 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-slate-500 text-sm">No trades logged yet.</div>
          )}
        </div>
      </div>

      {/* 4. PnL by Emotional State Breakdown */}
      <div className="card-dark p-5 col-span-1 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">PnL by Emotional Mindset</h3>
          </div>
          <span className="text-xs text-slate-400">Track FOMO vs Disciplined PnL Drain</span>
        </div>
        <div className="h-64 w-full">
          {pnl_by_emotion.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pnl_by_emotion} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickFormatter={(v) => `$${v}`} />
                <YAxis dataKey="emotion" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="net_pnl" name="Net PnL" radius={[0, 4, 4, 0]}>
                  {pnl_by_emotion.map((entry, index) => (
                    <Cell key={`emo-cell-${index}`} fill={entry.net_pnl >= 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No emotion stats available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
