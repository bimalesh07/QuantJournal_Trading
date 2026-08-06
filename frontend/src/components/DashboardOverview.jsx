import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
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
  ArrowUpRight
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

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Define custom neon bloom glow styles for each color variant
  const getBloomShadow = () => {
    if (!isHovered) {
      return 'box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 12px 30px -10px rgba(0,0,0,0.9)';
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
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
        boxShadow: getBloomShadow(),
        transition: isHovered
          ? 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.2s ease'
          : 'transform 0.5s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.5s ease',
      }}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Light Sheen Effect */}
      <div className="shimmer-edge"></div>
      {children}
    </div>
  );
};

export default function DashboardOverview({ analytics }) {
  if (!analytics || !analytics.overview) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Loading quantitative analytics engine...
      </div>
    );
  }

  const { overview, best_strategy, worst_strategy } = analytics;
  const isNetPositive = overview.total_net_pnl >= 0;

  // PDF Report Generator
  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(3, 5, 8);
    doc.rect(0, 0, pageWidth, 297, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TradeTrack PRO', 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Antigravity Performance Analytics Report', 14, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, pageWidth - 14, 26, { align: 'right' });

    doc.setDrawColor(30, 37, 54);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30);

    doc.setFillColor(10, 14, 23);
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

  return (
    <div className="space-y-6 font-sans">

      {/* Aerogel Frosted Header Bar */}
      <div className="aerogel-surface p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="p-3 rounded-2xl bg-[#09151A] border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Zap className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wider text-white">
                Performance Overview
              </h2>
              
              {/* Holographic Cyan Pulsating Live Edge Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 shadow-sm">
                <span className="w-2 h-2 holo-dot"></span>
                <span className="text-[10px] font-black font-mono tracking-widest text-cyan-300 uppercase">
                  LIVE EDGE
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 tracking-wide">
              Quantitative Edge Metrics & Real-time Portfolio Health
            </p>
          </div>
        </div>

        {/* Sculpted Touch-Sensitive Sapphire Crystal PDF Button */}
        <button
          onClick={generatePDFReport}
          className="px-5 py-2.5 text-xs font-black font-mono tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:brightness-115 active:scale-95 rounded-xl shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300/40 shrink-0 z-10"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.2]" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* 5 Antigravity 3D Glass KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* 1. Total Net PnL Card */}
        <AntigravityCard
          bloomColor={isNetPositive ? 'emerald' : 'rose'}
          className={`p-5 rounded-2xl border backdrop-blur-2xl ${
            isNetPositive
              ? 'bg-[#091A14]/80 border-emerald-500/40'
              : 'bg-[#21090E]/80 border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
              TOTAL NET PNL
            </span>
            <div className={`p-2 rounded-xl border ${
              isNetPositive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              <DollarSign className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight transition-all duration-300 hover:scale-105 origin-left ${
              isNetPositive ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'
            }`}>
              {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold mt-4 pt-3 border-t border-white/10">
              <span className="text-emerald-400/90">Gross: ${overview.total_gross_pnl.toLocaleString()}</span>
              <span className="text-slate-400">Fees: ${overview.total_fees.toLocaleString()}</span>
            </div>
          </div>
        </AntigravityCard>

        {/* 2. Win Rate Card */}
        <AntigravityCard
          bloomColor="teal"
          className="p-5 rounded-2xl bg-[#071C1E]/80 border border-teal-500/40 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
              WIN RATE
            </span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Percent className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-tight drop-shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all duration-300 hover:scale-105 origin-left">
              {overview.win_rate}%
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold mt-4 pt-3 border-t border-white/10">
              <span className="text-emerald-400">{overview.win_count} Wins</span>
              <span className="text-rose-400">{overview.loss_count} Losses</span>
              <span className="text-slate-400">{overview.breakeven_count} BE</span>
            </div>
          </div>
        </AntigravityCard>

        {/* 3. Profit Factor Card */}
        <AntigravityCard
          bloomColor="purple"
          className="p-5 rounded-2xl bg-[#140A24]/80 border border-purple-500/40 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
              PROFIT FACTOR
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Scale className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight transition-all duration-300 hover:scale-105 origin-left ${overview.profit_factor >= 1.5 ? 'text-purple-300 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)]' : 'text-amber-400'}`}>
              {overview.profit_factor}
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold mt-4 pt-3 border-t border-white/10">
              <span className="text-emerald-400">+${overview.total_profit.toLocaleString()}</span>
              <span className="text-rose-400">-${overview.total_loss.toLocaleString()}</span>
            </div>
          </div>
        </AntigravityCard>

        {/* 4. Avg Risk to Reward */}
        <AntigravityCard
          bloomColor="sky"
          className="p-5 rounded-2xl bg-[#081829]/80 border border-sky-500/40 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
              AVG RISK:REWARD
            </span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40">
              <Target className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-sky-300 tracking-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-105 origin-left">
              1:{overview.avg_rrr}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-semibold mt-4 pt-3 border-t border-white/10">
              <span>Expectancy: <span className="text-sky-300 font-bold">${overview.expectancy}</span></span>
            </div>
          </div>
        </AntigravityCard>

        {/* 5. Total Trades Card */}
        <AntigravityCard
          bloomColor="amber"
          className="p-5 rounded-2xl bg-[#1C1307]/80 border border-amber-500/40 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
              TOTAL TRADES
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Hash className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-300 hover:scale-105 origin-left">
              {overview.closed_trades}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-bold mt-4 pt-3 border-t border-white/10">
              <span>Win: <span className="text-emerald-400 font-bold">${overview.avg_win}</span></span>
              <span>Loss: <span className="text-rose-400 font-bold">${overview.avg_loss}</span></span>
            </div>
          </div>
        </AntigravityCard>

      </div>

      {/* Best vs Worst Strategy Aerogel Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Best Strategy */}
        <AntigravityCard
          bloomColor="emerald"
          className="bg-gradient-to-r from-[#071F17]/90 via-[#0A261D]/80 to-[#0A0E17]/90 border border-emerald-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/20 shrink-0">
              <Trophy className="w-6 h-6 stroke-[1.8]" />
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

          {best_strategy && (
            <div className="text-right font-mono">
              <div className="text-base sm:text-xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                +${best_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-1">
                {best_strategy.win_rate}% Win Rate ({best_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </AntigravityCard>

        {/* Worst Strategy */}
        <AntigravityCard
          bloomColor="rose"
          className="bg-gradient-to-r from-[#29080F]/90 via-[#2E0B12]/80 to-[#0A0E17]/90 border border-rose-500/40 rounded-2xl p-5 backdrop-blur-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[1.8]" />
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

          {worst_strategy && (
            <div className="text-right font-mono">
              <div className={`text-base sm:text-xl font-black ${worst_strategy.total_net_pnl >= 0 ? 'text-slate-200' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]'}`}>
                {worst_strategy.total_net_pnl >= 0 ? '+' : ''}${worst_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-1">
                {worst_strategy.win_rate}% Win Rate ({worst_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </AntigravityCard>

      </div>

    </div>
  );
}
