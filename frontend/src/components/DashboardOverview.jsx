import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
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
  DollarSign, 
  Percent, 
  Scale, 
  Hash, 
  Target, 
  Trophy, 
  AlertTriangle, 
  FileText,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';

// 3D Antigravity Tilt Card Component
const AntigravityCard = ({ children, className = '', bloomColor = 'emerald' }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6;
    const rY = ((x - centerX) / centerX) * 6;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getBloomShadow = () => {
    if (!isHovered) {
      return 'box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 12px 30px -10px rgba(0,0,0,0.8)';
    }

    switch (bloomColor) {
      case 'emerald':
        return '0 25px 50px -12px rgba(16, 185, 129, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      case 'teal':
        return '0 25px 50px -12px rgba(20, 184, 166, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      case 'purple':
        return '0 25px 50px -12px rgba(168, 85, 247, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      case 'sky':
        return '0 25px 50px -12px rgba(56, 189, 248, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      case 'amber':
        return '0 25px 50px -12px rgba(245, 158, 11, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      case 'rose':
        return '0 25px 50px -12px rgba(244, 63, 94, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
      default:
        return '0 25px 50px -12px rgba(16, 185, 129, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
        boxShadow: getBloomShadow(),
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
          : 'transform 0.5s ease-out, box-shadow 0.5s ease',
      }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      <div className="shimmer-edge"></div>
      {children}
    </div>
  );
};

export default function DashboardOverview({ analytics, trades = [] }) {
  const [capitalTimeframe, setCapitalTimeframe] = useState('Yearly');

  if (!analytics || !analytics.overview) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Loading quantitative analytics engine...
      </div>
    );
  }

  const { overview, best_strategy, worst_strategy, best_asset, worst_asset, equity_curve = [], strategy_performance = [] } = analytics;
  const isNetPositive = overview.total_net_pnl >= 0;

  // Dynamic Fallback calculation for Asset Symbol Name & Last Traded Price
  const computedBestAsset = best_asset || (trades.length > 0 ? {
    name: trades[0].symbol,
    pnl: trades[0].net_pnl,
    price: trades[0].exit_price || trades[0].entry_price || 0,
    winRate: trades[0].net_pnl > 0 ? 100 : 0,
    trades: 1
  } : null);

  const computedWorstAsset = worst_asset || (trades.length > 0 ? {
    name: trades[trades.length - 1].symbol,
    pnl: trades[trades.length - 1].net_pnl,
    price: trades[trades.length - 1].exit_price || trades[trades.length - 1].entry_price || 0,
    winRate: trades[trades.length - 1].net_pnl > 0 ? 100 : 0,
    trades: 1
  } : null);

  // PDF Report Generator
  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(7, 10, 18);
    doc.rect(0, 0, pageWidth, 297, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TradeTrack PRO', 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Quantitative Performance Analytics Report', 14, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, pageWidth - 14, 26, { align: 'right' });

    doc.setDrawColor(30, 37, 54);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30);

    doc.setFillColor(15, 20, 32);
    doc.roundedRect(14, 36, pageWidth - 28, 48, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CORE QUANTITATIVE METRICS', 20, 44);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    doc.setTextColor(148, 163, 184);
    doc.text('Total Net PnL:', 20, 54);
    const pnlStr = `${overview.total_net_pnl >= 0 ? '+' : ''}$${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    doc.setTextColor(overview.total_net_pnl >= 0 ? 16 : 239, overview.total_net_pnl >= 0 ? 185 : 68, overview.total_net_pnl >= 0 ? 129 : 68);
    doc.setFont('helvetica', 'bold');
    doc.text(pnlStr, 55, 54);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Win Rate:', 110, 54);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overview.win_rate}% (${overview.win_count}W / ${overview.loss_count}L)`, 140, 54);

    doc.save(`TradeTrack_Performance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Dynamic Speedometer Arc calculation
  const winRateVal = Number(overview.win_rate) || 0;
  const radius = 65;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (winRateVal / 100) * circumference;

  // Format Date Short for X-Axis
  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  // Recent 5 Trades from real trade list
  const recentTrades = trades.slice(0, 5);

  // Dynamic Strategy Max PnL calculation for bar widths
  const maxStratPnl = strategy_performance.length > 0
    ? Math.max(...strategy_performance.map(s => Math.abs(s.total_net_pnl)))
    : 1;

  return (
    <div className="space-y-6 font-sans">

      {/* Executive 10-Metric Quantitative Header Ribbon (User Screenshot Match) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 font-mono">
        
        {/* 1. Total PnL */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-emerald-500/30 flex flex-col justify-between space-y-1 shadow-lg hover:border-emerald-500/50 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total P&L</span>
          <p className={`text-base font-black tracking-tight ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[9px] text-emerald-400 font-bold">Net Portfolio PnL</span>
        </div>

        {/* 2. Total Trades */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/10 flex flex-col justify-between space-y-1 shadow-lg hover:border-white/20 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Trades</span>
          <p className="text-base font-black text-white">{overview.closed_trades}</p>
          <span className="text-[9px] text-slate-400">Total Executed</span>
        </div>

        {/* 3. Avg Trades/Day */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/10 flex flex-col justify-between space-y-1 shadow-lg hover:border-white/20 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. Trades/Day</span>
          <p className="text-base font-black text-cyan-400">{overview.avg_trades_per_day || 1.0}</p>
          <span className="text-[9px] text-slate-400">Per trading day</span>
        </div>

        {/* 4. Avg PnL per Trade */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-white/10 flex flex-col justify-between space-y-1 shadow-lg hover:border-white/20 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. P&L / Trade</span>
          <p className={`text-base font-black ${overview.avg_pnl_per_trade >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {overview.avg_pnl_per_trade >= 0 ? '+' : ''}${overview.avg_pnl_per_trade || 0}
          </p>
          <span className="text-[9px] text-emerald-400">Per trade</span>
        </div>

        {/* 5. Highest Win */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-emerald-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-emerald-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Highest Win</span>
          <p className="text-base font-black text-emerald-400">+${overview.highest_win || 0}</p>
          <span className="text-[9px] text-emerald-400/80">Best trade</span>
        </div>

        {/* 6. Highest Loss */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-rose-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-rose-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Highest Loss</span>
          <p className="text-base font-black text-rose-400">-${overview.highest_loss || 0}</p>
          <span className="text-[9px] text-rose-400/80">Worst trade</span>
        </div>

        {/* 7. Avg Winning Trade */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-emerald-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-emerald-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. Win Trade</span>
          <p className="text-base font-black text-emerald-400">+${overview.avg_win}</p>
          <span className="text-[9px] text-emerald-400/80">Per winning trade</span>
        </div>

        {/* 8. Avg Losing Trade */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-rose-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-rose-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. Loss Trade</span>
          <p className="text-base font-black text-rose-400">-${overview.avg_loss}</p>
          <span className="text-[9px] text-rose-400/80">Per losing trade</span>
        </div>

        {/* 9. Win Days */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-emerald-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-emerald-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Win Days</span>
          <p className="text-base font-black text-emerald-400">{overview.win_days || 0}</p>
          <span className="text-[9px] text-emerald-400">Profitable days</span>
        </div>

        {/* 10. Loss Days */}
        <div className="p-3.5 rounded-2xl bg-[#090E18] border border-rose-500/20 flex flex-col justify-between space-y-1 shadow-lg hover:border-rose-500/40 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Loss Days</span>
          <p className="text-base font-black text-rose-400">{overview.loss_days || 0}</p>
          <span className="text-[9px] text-rose-400">Loss making days</span>
        </div>

      </div>

      {/* Dynamic Side-by-Side Performance Banners (Best & Worst Strategies & Assets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Top Performing Strategy */}
        <AntigravityCard
          bloomColor="emerald"
          className="bg-gradient-to-r from-[#071F17]/90 via-[#0A261D]/80 to-[#0A0E17]/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/20 shrink-0">
              <Trophy className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                TOP PERFORMING STRATEGY
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 font-mono tracking-wide">
                {best_strategy ? best_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-lg sm:text-xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
              {best_strategy ? `${best_strategy.total_net_pnl >= 0 ? '+' : ''}$${best_strategy.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {best_strategy ? `${best_strategy.win_rate}% Win Rate (${best_strategy.trades_count} trades)` : '0 trades'}
            </div>
          </div>
        </AntigravityCard>

        {/* Lowest Performing Strategy */}
        <AntigravityCard
          bloomColor="rose"
          className="bg-gradient-to-r from-[#29080F]/90 via-[#2E0B12]/80 to-[#0A0E17]/90 border border-rose-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest font-mono">
                LOWEST PERFORMING STRATEGY
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 font-mono tracking-wide">
                {worst_strategy ? worst_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className={`text-lg sm:text-xl font-black ${worst_strategy && worst_strategy.total_net_pnl < 0 ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'text-slate-300'}`}>
              {worst_strategy ? `${worst_strategy.total_net_pnl >= 0 ? '+' : ''}$${worst_strategy.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {worst_strategy ? `${worst_strategy.win_rate}% Win Rate (${worst_strategy.trades_count} trades)` : '0 trades'}
            </div>
          </div>
        </AntigravityCard>

        {/* Best Performing Asset Class / Symbol */}
        <AntigravityCard
          bloomColor="teal"
          className="bg-gradient-to-r from-[#071C1E]/90 via-[#0A261D]/80 to-[#0A0E17]/90 border border-teal-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-md shadow-teal-500/20 shrink-0">
              <Trophy className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-widest font-mono">
                  BEST PERFORMING ASSET
                </span>
                {computedBestAsset && computedBestAsset.price > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    Price: ${Number(computedBestAsset.price).toLocaleString()}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 font-mono tracking-wide">
                {computedBestAsset ? computedBestAsset.name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-lg sm:text-xl font-black text-teal-300 drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">
              {computedBestAsset ? `${computedBestAsset.pnl >= 0 ? '+' : ''}$${Number(computedBestAsset.pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {computedBestAsset ? `${computedBestAsset.winRate || 100}% Win Rate (${computedBestAsset.trades} trades)` : '0 trades'}
            </div>
          </div>
        </AntigravityCard>

        {/* Lowest Performing Asset Class / Symbol */}
        <AntigravityCard
          bloomColor="rose"
          className="bg-gradient-to-r from-[#29080F]/90 via-[#2E0B12]/80 to-[#0A0E17]/90 border border-rose-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest font-mono">
                  LOWEST PERFORMING ASSET
                </span>
                {computedWorstAsset && computedWorstAsset.price > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    Price: ${Number(computedWorstAsset.price).toLocaleString()}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 font-mono tracking-wide">
                {computedWorstAsset ? computedWorstAsset.name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className={`text-lg sm:text-xl font-black ${computedWorstAsset && computedWorstAsset.pnl < 0 ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'text-slate-300'}`}>
              {computedWorstAsset ? `${computedWorstAsset.pnl >= 0 ? '+' : ''}$${Number(computedWorstAsset.pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {computedWorstAsset ? `${computedWorstAsset.winRate || 0}% Win Rate (${computedWorstAsset.trades} trades)` : '0 trades'}
            </div>
          </div>
        </AntigravityCard>

      </div>

      {/* 2. Cumulative P&L Dynamic Area Chart + Semicircle Win Rate Speedometer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Dynamic Cumulative P&L Area Chart */}
        <div className="lg:col-span-2 bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
                Cumulative P&L
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time equity growth trajectory</p>
            </div>
            <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold ${
              isNetPositive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {overview.win_rate}% Edge
            </div>
          </div>

          {/* Dynamic Recharts Cumulative Equity Curve */}
          <div className="w-full h-56 pt-2">
            {equity_curve.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equity_curve} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="dynamicPnlCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickFormatter={formatShortDate} />
                  <YAxis stroke="#64748B" fontSize={10} width={65} tickFormatter={(val) => `$${val}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1422', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Cumulative PnL']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative_pnl"
                    stroke="#22D3EE"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#dynamicPnlCurveGrad)"
                    dot={{ r: 3, fill: '#22D3EE' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-1">
                <span>No Closed Trades Logged Yet</span>
                <span className="text-[10px] text-slate-600">Log a trade using "+ Log New Trade" to see real-time PnL trajectory!</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Semicircle Speedometer Gauge */}
        <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Win Rate
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">Accuracy</span>
          </div>

          {/* Semicircle Speedometer SVG */}
          <div className="relative py-4 flex flex-col items-center justify-center">
            <svg width="200" height="110" viewBox="0 0 160 90" className="overflow-visible">
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#1E293B"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#10B981"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute top-[52px] flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-cyan-400 tracking-tight">
                {overview.win_rate}%
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase mt-0.5">
                SUCCESS
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>{overview.win_count} Wins • {overview.loss_count} Losses</span>
          </div>
        </div>

      </div>

      {/* 3. Dynamic Strategy Performance & Real Recent Trades Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Strategy Performance Bar Chart */}
        <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Strategy Performance
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">Real Strategy Rankings</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {strategy_performance.length > 0 ? (
              strategy_performance.map((strat, idx) => {
                const isProfitable = strat.total_net_pnl >= 0;
                const barPct = Math.min(100, Math.max(15, (Math.abs(strat.total_net_pnl) / maxStratPnl) * 100));
                return (
                  <div key={idx} className="space-y-1 font-mono">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{strat.strategy_name} ({strat.trades_count} trades)</span>
                      <span className={isProfitable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {isProfitable ? '+' : ''}${strat.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full h-7 rounded-xl bg-[#0F1422] p-1 border border-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-lg transition-all duration-700 shadow-md ${
                          isProfitable
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-rose-500 to-red-400 shadow-rose-500/20'
                        }`}
                        style={{ width: `${barPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No strategy performance data logged yet.
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Recent Trades Stream Feed */}
        <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Recent Executions
            </h3>
            <span className="text-xs font-mono text-slate-400 font-medium">Live Trade Feed</span>
          </div>

          <div className="space-y-2.5 pt-1 font-mono">
            {recentTrades.length > 0 ? (
              recentTrades.map((t) => {
                const isWin = t.net_pnl > 0;
                const isLoss = t.net_pnl < 0;
                const dateFormatted = new Date(t.entry_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-[#0E1320] border border-white/10 hover:border-emerald-500/30 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
                        isWin
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : isLoss
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {isWin ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{t.symbol}</h4>
                        <span className="text-[11px] text-slate-400">{t.strategy_name || t.trade_type}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-extrabold ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-500">{dateFormatted}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No trades in history. Click "+ Log New Trade" above to add your first execution!
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PDF Export Floating Bar */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={generatePDFReport}
          className="px-6 py-3 text-xs font-black font-mono tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 rounded-xl shadow-xl shadow-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer border border-cyan-300/40"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.2]" />
          <span>Export PDF Report</span>
        </button>
      </div>

    </div>
  );
}
