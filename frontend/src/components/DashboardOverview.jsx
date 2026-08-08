import React, { useState, useRef, useMemo } from 'react';
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
  Activity,
  Award,
  BarChart2,
  Clock,
  Sparkles,
  Plus
} from 'lucide-react';
import { isTradeInTimeframe, calculateAnalyticsFromTrades } from '../utils/analyticsUtils';
import TimeframeDropdown from './TimeframeDropdown';

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

    const rX = ((y - centerY) / centerY) * -5;
    const rY = ((x - centerX) / centerX) * 5;

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
      return 'box-shadow: 0 10px 30px -10px rgba(0,0,0,0.6)';
    }

    switch (bloomColor) {
      case 'emerald':
        return '0 20px 40px -10px rgba(16, 185, 129, 0.3)';
      case 'teal':
        return '0 20px 40px -10px rgba(20, 184, 166, 0.3)';
      case 'purple':
        return '0 20px 40px -10px rgba(168, 85, 247, 0.3)';
      case 'sky':
        return '0 20px 40px -10px rgba(56, 189, 248, 0.3)';
      case 'amber':
        return '0 20px 40px -10px rgba(245, 158, 11, 0.3)';
      case 'rose':
        return '0 20px 40px -10px rgba(244, 63, 94, 0.3)';
      default:
        return '0 20px 40px -10px rgba(16, 185, 129, 0.3)';
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
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        boxShadow: getBloomShadow(),
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
          : 'transform 0.5s ease-out, box-shadow 0.5s ease',
      }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Subtle Shimmer Edge */}
      <div className="shimmer-edge"></div>
      {children}
    </div>
  );
};

export default function DashboardOverview({
  analytics,
  trades = [],
  activeTimeframe = 'All Time',
  onTimeframeChange,
  isTransitioning: propIsTransitioning = false,
  onOpenTradeModal,
  hideTimeframeDropdown = false
}) {
  const [localTimeframe, setLocalTimeframe] = useState('All Time');
  const [localTransitioning, setLocalTransitioning] = useState(false);

  const currentTimeframe = onTimeframeChange ? activeTimeframe : localTimeframe;
  const isTransitioning = propIsTransitioning || localTransitioning;

  const handleSelectTimeframe = (tf) => {
    if (tf === currentTimeframe) return;
    setLocalTransitioning(true);
    setTimeout(() => {
      setLocalTimeframe(tf);
      if (onTimeframeChange) {
        onTimeframeChange(tf);
      }
      setTimeout(() => {
        setLocalTransitioning(false);
      }, 50);
    }, 150);
  };

  const filteredTrades = useMemo(() => {
    return (trades || []).filter((t) => isTradeInTimeframe(t, currentTimeframe));
  }, [trades, currentTimeframe]);

  const effectiveAnalytics = useMemo(() => {
    if (currentTimeframe === 'All Time' && analytics && analytics.overview) {
      return analytics;
    }
    return calculateAnalyticsFromTrades(filteredTrades, analytics);
  }, [filteredTrades, analytics, currentTimeframe]);

  const activeAnalytics = effectiveAnalytics || analytics;

  if (!activeAnalytics || !activeAnalytics.overview) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p>Synchronizing quantitative analytics engine...</p>
      </div>
    );
  }

  const { overview = {}, best_strategy, worst_strategy, best_asset, worst_asset, equity_curve = [], strategy_performance = [] } = activeAnalytics;
  const isNetPositive = (overview.total_net_pnl || 0) >= 0;

  // Dynamic Fallback calculation for Asset Symbol Name & Last Traded Price
  const computedBestAsset = best_asset || (filteredTrades.length > 0 ? {
    name: filteredTrades[0].symbol,
    pnl: filteredTrades[0].net_pnl,
    price: filteredTrades[0].exit_price || filteredTrades[0].entry_price || 0,
    winRate: filteredTrades[0].net_pnl > 0 ? 100 : 0,
    trades: 1
  } : null);

  const computedWorstAsset = worst_asset || (filteredTrades.length > 0 ? {
    name: filteredTrades[filteredTrades.length - 1].symbol,
    pnl: filteredTrades[filteredTrades.length - 1].net_pnl,
    price: filteredTrades[filteredTrades.length - 1].exit_price || filteredTrades[filteredTrades.length - 1].entry_price || 0,
    winRate: filteredTrades[filteredTrades.length - 1].net_pnl > 0 ? 100 : 0,
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

  // Speedometer Arc calculation
  const winRateVal = Number(overview.win_rate) || 0;
  const radius = 65;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (winRateVal / 100) * circumference;

  // Format Date Short for X-Axis
  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  };

  // Sort trades newest first (latest entry time / id descending)
  const sortedTrades = [...filteredTrades].sort((a, b) => {
    const dateA = new Date(a.entry_time || a.created_at || 0).getTime();
    const dateB = new Date(b.entry_time || b.created_at || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (b.id || 0) - (a.id || 0);
  });
  const recentTrades = sortedTrades.slice(0, 5);
  const latestTrade = sortedTrades.length > 0 ? sortedTrades[0] : null;

  // Strategy Max PnL calculation
  const maxStratPnl = strategy_performance.length > 0
    ? Math.max(...strategy_performance.map(s => Math.abs(s.total_net_pnl)))
    : 1;

  return (
    <div className="space-y-6 font-sans">

      {/* Timeframe Filter Bar - Premium Dropdown Selector */}
      {!hideTimeframeDropdown && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <TimeframeDropdown
            activeTimeframe={currentTimeframe}
            onSelectTimeframe={handleSelectTimeframe}
            tradeCount={filteredTrades.length}
          />

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Scope: <strong className="text-cyan-300 font-bold">{currentTimeframe}</strong> ({filteredTrades.length} trades evaluated)</span>
          </div>
        </div>
      )}

      {/* Top Section Header with Title & PDF Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-wide">
              Quantitative Executive Overview
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Real-time execution analytics, win rate accuracy, risk expectancy & performance breakdown.
          </p>
        </div>

        <button
          onClick={generatePDFReport}
          className="self-start sm:self-auto px-5 py-2.5 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer border border-cyan-300/40"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.2]" />
          <span>Export PDF Report</span>
        </button>
      </div>

      {/* Dynamic Content Container with 200ms Opacity Transition */}
      <div className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'opacity-25 scale-[0.995]' : 'opacity-100 scale-100'}`}>

        {/* ========================================================================= */}
        {/* 1. TOP 4 EXECUTIVE FINANCIAL KPI CARDS */}
        {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">

        {/* Card 1: Portfolio Net PnL */}
        <AntigravityCard
          bloomColor={isNetPositive ? 'emerald' : 'rose'}
          className={`bg-gradient-to-br ${isNetPositive ? 'from-[#061B15] via-[#09261E]/90 to-[#070A12] border-emerald-500/40' : 'from-[#22070D] via-[#2A0B11]/90 to-[#070A12] border-rose-500/40'} border rounded-2xl p-5 backdrop-blur-2xl flex flex-col justify-between shadow-xl min-h-[125px]`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 font-sans tracking-wide flex items-center gap-1.5">
              <span>Portfolio Net P&L</span>
            </span>
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${isNetPositive ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-rose-500/20 border-rose-400/40 text-rose-300'}`}>
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-2">
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isNetPositive ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`}>
              {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">Gross: +${overview.total_gross_pnl.toLocaleString()}</span>
            <span className="text-slate-400">Fees: ${overview.total_fees.toLocaleString()}</span>
          </div>
        </AntigravityCard>

        {/* Card 2: Average Risk to Reward Ratio */}
        <AntigravityCard
          bloomColor="sky"
          className="bg-gradient-to-br from-[#061524] via-[#0A2036]/90 to-[#070A12] border border-sky-500/40 rounded-2xl p-5 backdrop-blur-2xl flex flex-col justify-between shadow-xl min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 font-sans tracking-wide flex items-center gap-1.5">
              <span>Avg. Risk to Reward</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
              <Target className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-sky-300 tracking-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              1 : {Number(overview.avg_rrr || 1.5).toFixed(2)}
            </h3>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-sky-300 font-bold">Expectancy: ${overview.expectancy}</span>
            <span className="text-slate-400">{overview.win_rate}% Win Rate</span>
          </div>
        </AntigravityCard>

        {/* Card 3: Profit Factor */}
        <AntigravityCard
          bloomColor="purple"
          className="bg-gradient-to-br from-[#120821] via-[#1A0C30]/90 to-[#070A12] border border-purple-500/40 rounded-2xl p-5 backdrop-blur-2xl flex flex-col justify-between shadow-xl min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 font-sans tracking-wide flex items-center gap-1.5">
              <span>Profit Factor</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
              <Scale className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-purple-300 tracking-tight drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
              {Number(overview.profit_factor || 0).toFixed(2)}
            </h3>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-bold">+${overview.total_profit.toLocaleString()}</span>
            <span className="text-rose-400">-${overview.total_loss.toLocaleString()}</span>
          </div>
        </AntigravityCard>

        {/* Card 4: Total Executions */}
        <AntigravityCard
          bloomColor="amber"
          className="bg-gradient-to-br from-[#1A1005] via-[#261807]/90 to-[#070A12] border border-amber-500/40 rounded-2xl p-5 backdrop-blur-2xl flex flex-col justify-between shadow-xl min-h-[125px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 font-sans tracking-wide flex items-center gap-1.5">
              <span>Total Executions</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Hash className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              {overview.closed_trades} Trades
            </h3>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-bold">{overview.win_count} Wins</span>
            {overview.breakeven_count > 0 && (
              <span className="text-slate-400 font-bold">{overview.breakeven_count} BE</span>
            )}
            <span className="text-rose-400">{overview.loss_count} Losses</span>
          </div>
        </AntigravityCard>

      </div>

      {/* ========================================================================= */}
      {/* 2. UNIFIED TRADING VELOCITY & CONSISTENCY EXECUTIVE PANEL */}
      {/* ========================================================================= */}
      <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">Execution Velocity & Consistency Breakdown</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Quantitative Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          
          {/* Avg Trades/Day */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Avg. Trades / Day</span>
            <p className="text-base font-black text-cyan-400">{overview.avg_trades_per_day || 1.0}</p>
          </div>

          {/* Avg PnL per Trade */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-white/10 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Avg. P&L / Trade</span>
            <p className={`text-base font-black ${overview.avg_pnl_per_trade >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {overview.avg_pnl_per_trade >= 0 ? '+' : ''}${overview.avg_pnl_per_trade || 0}
            </p>
          </div>

          {/* Highest Win */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-emerald-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Highest Win 🏆</span>
            <p className="text-base font-black text-emerald-400">+${overview.highest_win || 0}</p>
          </div>

          {/* Highest Loss */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-rose-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Highest Loss ⚠️</span>
            <p className="text-base font-black text-rose-400">-${overview.highest_loss || 0}</p>
          </div>

          {/* Win Days */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-emerald-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Win Days 🟢</span>
            <p className="text-base font-black text-emerald-400">{overview.win_days || 0} Days</p>
          </div>

          {/* Loss Days */}
          <div className="p-3.5 rounded-xl bg-[#0E1320] border border-rose-500/30 space-y-1">
            <span className="text-[11px] text-slate-400 block font-sans">Loss Days 🔴</span>
            <p className="text-base font-black text-rose-400">{overview.loss_days || 0} Days</p>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STRATEGY & ASSET LEADERBOARD MATRIX */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">

        {/* Top Performing Strategy */}
        <AntigravityCard
          bloomColor="emerald"
          className="bg-gradient-to-r from-[#061B15]/90 via-[#0A261D]/80 to-[#070A12]/90 border border-emerald-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/20 shrink-0">
              <Trophy className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 font-sans block">
                Top Performing Strategy
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-wide">
                {best_strategy ? best_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right">
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
          className="bg-gradient-to-r from-[#22070D]/90 via-[#2A0B11]/80 to-[#070A12]/90 border border-rose-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 font-sans block">
                Lowest Performing Strategy
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-wide">
                {worst_strategy ? worst_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right">
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
          className="bg-gradient-to-r from-[#06181B]/90 via-[#0A261D]/80 to-[#070A12]/90 border border-teal-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-md shadow-teal-500/20 shrink-0">
              <Award className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 font-sans block">
                  Best Performing Asset
                </span>
                {computedBestAsset && computedBestAsset.price > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    ${Number(computedBestAsset.price).toLocaleString()}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-wide">
                {computedBestAsset ? computedBestAsset.name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right">
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
          className="bg-gradient-to-r from-[#22070D]/90 via-[#2A0B11]/80 to-[#070A12]/90 border border-rose-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-400 font-sans block">
                  Lowest Performing Asset
                </span>
                {computedWorstAsset && computedWorstAsset.price > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    ${Number(computedWorstAsset.price).toLocaleString()}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-wide">
                {computedWorstAsset ? computedWorstAsset.name : 'N/A'}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-lg sm:text-xl font-black ${computedWorstAsset && computedWorstAsset.pnl < 0 ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'text-slate-300'}`}>
              {computedWorstAsset ? `${computedWorstAsset.pnl >= 0 ? '+' : ''}$${Number(computedWorstAsset.pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
            </div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5">
              {computedWorstAsset ? `${computedWorstAsset.winRate || 0}% Win Rate (${computedWorstAsset.trades} trades)` : '0 trades'}
            </div>
          </div>
        </AntigravityCard>

      </div>

      {/* ========================================================================= */}
      {/* 4. CUMULATIVE P&L DYNAMIC AREA CHART + SPEEDOMETER GAUGE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Dynamic Cumulative P&L Area Chart */}
        <div className="lg:col-span-2 bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <span>Cumulative Portfolio Equity Growth</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">Real-time equity growth trajectory across executed trades</p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full border text-xs font-mono font-bold ${
                isNetPositive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {overview.win_rate}% Winning Edge
              </div>
            </div>
          </div>

          {/* High-Tech LATEST TRADE TELEMETRY SNAPSHOT Bar */}
          {latestTrade && (
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#0A1A24] via-[#0D2229] to-[#0D1220] border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 text-[9px] font-black tracking-wider bg-cyan-400 text-slate-950 rounded uppercase flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  LATEST TRADE
                </span>
                <span className="font-extrabold text-white text-sm tracking-wide">{latestTrade.symbol}</span>
                <span className={`font-black ${latestTrade.net_pnl >= 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'text-rose-400'}`}>
                  {latestTrade.net_pnl >= 0 ? '+' : ''}${Number(latestTrade.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium">Strategy:</span>
                  <span className="font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                    {latestTrade.strategy_name || latestTrade.strategy || 'Default'}
                  </span>
                </div>

                {latestTrade.session && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-medium">Session:</span>
                    <span className="font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      {latestTrade.session}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Recharts Cumulative Equity Curve */}
          <div className="w-full h-64 pt-3">
            {equity_curve.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equity_curve} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                  <defs>
                    {/* Positive Net PnL Gradients */}
                    <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                      <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#080C16" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emeraldLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>

                    {/* Negative Net PnL Gradients (Red Highlight for Loss) */}
                    <linearGradient id="roseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity={0.5} />
                      <stop offset="50%" stopColor="#E11D48" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#080C16" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="roseLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F43F5E" />
                      <stop offset="50%" stopColor="#E11D48" />
                      <stop offset="100%" stopColor="#FB7185" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickFormatter={formatShortDate} />
                  <YAxis stroke="#64748B" fontSize={10} width={70} tickFormatter={(val) => `$${Number(val).toLocaleString()}`} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F1422', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '14px', fontSize: '12px', fontFamily: 'JetBrains Mono', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                    formatter={(val, name, item) => {
                      const tradePnl = item?.payload?.trade_pnl;
                      const formattedPnl = `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      if (tradePnl !== undefined) {
                        const tradePnlStr = `${tradePnl >= 0 ? '+' : ''}$${Number(tradePnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                        return [`${formattedPnl} (Trade P&L: ${tradePnlStr})`, 'Cumulative Equity'];
                      }
                      return [formattedPnl, 'Cumulative Equity'];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative_pnl"
                    stroke={isNetPositive ? "url(#emeraldLineGrad)" : "url(#roseLineGrad)"}
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill={isNetPositive ? "url(#emeraldAreaGrad)" : "url(#roseAreaGrad)"}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!cx || !cy) return null;
                      const tradePnl = payload?.trade_pnl !== undefined ? payload.trade_pnl : (payload?.cumulative_pnl || 0);
                      const isLossDot = tradePnl < 0;
                      return (
                        <g key={`dot-${cx}-${cy}`}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={7}
                            fill={isLossDot ? '#FB7185' : '#34D399'}
                            fillOpacity={0.4}
                            className="animate-pulse"
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={isLossDot ? '#E11D48' : '#10B981'}
                            stroke="#080C16"
                            strokeWidth={2}
                          />
                        </g>
                      );
                    }}
                    activeDot={{ r: 8, strokeWidth: 3, fill: isNetPositive ? '#34D399' : '#FB7185' }}
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
        <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold font-mono text-white tracking-wide">
              Win Rate Accuracy
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">Speedometer</span>
          </div>

          {/* Semicircle Speedometer SVG */}
          <div className="relative py-4 flex flex-col items-center justify-center my-auto">
            <svg width="210" height="115" viewBox="0 0 160 90" className="overflow-visible">
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
                stroke="url(#speedometerGrad)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
              />
              <defs>
                <linearGradient id="speedometerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute top-[48px] flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-cyan-300 tracking-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                {overview.win_rate}%
              </span>
              <span className="text-[11px] font-sans text-slate-300 font-bold tracking-wide mt-0.5">
                Execution Edge
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs font-mono font-bold">
            <span className="text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              {overview.win_count} Wins
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-rose-400">
              {overview.loss_count} Losses
            </span>
            {overview.breakeven_count > 0 && (
              <>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400">
                  {overview.breakeven_count} BE
                </span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. STRATEGY RANKINGS & LIVE RECENT EXECUTIONS FEED */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Strategy Performance Bar Chart */}
        <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Strategy Performance Rankings</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">Strategy Breakdown</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {strategy_performance.length > 0 ? (
              strategy_performance.map((strat, idx) => {
                const isProfitable = strat.total_net_pnl >= 0;
                const barPct = Math.min(100, Math.max(15, (Math.abs(strat.total_net_pnl) / maxStratPnl) * 100));
                const isLatestStrategy = latestTrade && (
                  strat.strategy_name?.toLowerCase() === (latestTrade.strategy_name || latestTrade.strategy || '').toLowerCase()
                );

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl transition-all ${
                      isLatestStrategy
                        ? 'bg-gradient-to-r from-cyan-950/60 via-[#0A2028] to-[#0D1220] border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'space-y-1.5'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-300 font-mono mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-medium text-slate-200">{strat.strategy_name} ({strat.trades_count} trades)</span>
                        {isLatestStrategy && (
                          <span className="px-1.5 py-0.5 text-[8px] font-black bg-cyan-400 text-slate-950 rounded uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-slate-950" />
                            LATEST STRATEGY
                          </span>
                        )}
                      </div>
                      <span className={isProfitable ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {isProfitable ? '+' : ''}${strat.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="w-full h-6 rounded-xl bg-[#0D1220] p-1 border border-white/5 overflow-hidden">
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

        {/* Dynamic Recent Trades Stream Feed Card */}
        <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Recent Executions Log</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              LIVE FEED
            </span>
          </div>

          <div className="space-y-3 pt-1 font-mono">
            {recentTrades.length > 0 ? (
              recentTrades.map((t, idx) => {
                const isLatest = idx === 0;
                const isWin = t.net_pnl > 0;
                const isLoss = t.net_pnl < 0;
                const dateFormatted = new Date(t.entry_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                // Dynamic Laser Beam Gradient for Latest Execution: Green if Profit, Red if Loss
                const laserGradient = isWin
                  ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #10b981 270deg, #34d399 320deg, #059669 360deg)'
                  : isLoss
                  ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #f43f5e 270deg, #fb7185 320deg, #e11d48 360deg)'
                  : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #06b6d4 270deg, #10b981 320deg, #f59e0b 360deg)';

                if (isLatest) {
                  return (
                    <div key={t.id || idx} className="relative p-[1.5px] rounded-xl overflow-hidden shadow-lg group">
                      {/* Rotating Laser Light Beam running specifically around Latest Trade Card */}
                      <div 
                        className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                        style={{ background: laserGradient }}
                      />

                      {/* Inner Latest Trade Card */}
                      <div className={`relative p-3.5 rounded-[10px] flex items-center justify-between overflow-hidden ${
                        isWin
                          ? 'bg-gradient-to-r from-[#061D16] via-[#09261E] to-[#070A12]'
                          : isLoss
                          ? 'bg-gradient-to-r from-[#24080F] via-[#2D0B13] to-[#070A12]'
                          : 'bg-[#0D1220]'
                      }`}>
                        {/* Floating Badge */}
                        <div className="absolute top-0 right-0">
                          <span className={`px-2 py-0.5 text-[8.5px] font-black font-mono tracking-widest rounded-bl-lg uppercase flex items-center gap-1 shadow-sm ${
                            isWin
                              ? 'bg-emerald-400 text-slate-950'
                              : isLoss
                              ? 'bg-rose-500 text-white'
                              : 'bg-cyan-400 text-slate-950'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                            LATEST EXECUTION
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`w-8.5 h-8.5 rounded-lg border flex items-center justify-center shrink-0 ${
                            isWin
                              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-md shadow-emerald-500/20'
                              : isLoss
                              ? 'bg-rose-500/20 border-rose-400/50 text-rose-300 shadow-md shadow-rose-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            {isWin ? <TrendingUp className="w-4 h-4 stroke-[2.5]" /> : <TrendingDown className="w-4 h-4 stroke-[2.5]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-white font-sans">{t.symbol}</h4>
                              <span className={`w-2 h-2 rounded-full animate-pulse ${
                                isWin ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                              }`}></span>
                            </div>
                            <span className="text-[11px] text-slate-300 font-sans">{t.strategy_name || t.trade_type}</span>
                          </div>
                        </div>

                        <div className="text-right pt-2">
                          <div className={`text-sm font-extrabold ${isWin ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : isLoss ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'text-slate-400'}`}>
                            {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans">{dateFormatted}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={t.id || idx}
                    className="p-3.5 rounded-xl border bg-[#0D1220] border-white/10 hover:border-emerald-500/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-lg border flex items-center justify-center shrink-0 ${
                        isWin
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : isLoss
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {isWin ? <TrendingUp className="w-4 h-4 stroke-[2.5]" /> : <TrendingDown className="w-4 h-4 stroke-[2.5]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-sans">{t.symbol}</h4>
                        <span className="text-[11px] text-slate-400 font-sans">{t.strategy_name || t.trade_type}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-extrabold ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans">{dateFormatted}</span>
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

      </div>

    </div>
  );
}

