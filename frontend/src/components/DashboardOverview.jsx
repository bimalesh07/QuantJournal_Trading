import React from 'react';
import { jsPDF } from 'jspdf';
import { 
  DollarSign, 
  Percent, 
  Scale, 
  Hash, 
  Target, 
  Trophy, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  FileText,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

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

  // PDF Performance Report Generator
  const generatePDFReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(11, 14, 23);
    doc.rect(0, 0, pageWidth, 297, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TradeTrack PRO', 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Quantitative Performance & Analytics Report', 14, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, pageWidth - 14, 26, { align: 'right' });

    doc.setDrawColor(30, 37, 54);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30);

    doc.setFillColor(18, 22, 34);
    doc.roundedRect(14, 36, pageWidth - 28, 48, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CORE PERFORMANCE METRICS', 20, 44);

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

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Profit Factor:', 20, 64);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overview.profit_factor}`, 55, 64);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Avg Risk:Reward:', 110, 64);
    doc.setTextColor(147, 197, 253);
    doc.setFont('helvetica', 'bold');
    doc.text(`1:${overview.avg_rrr}`, 140, 64);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Total Trades:', 20, 74);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${overview.closed_trades}`, 55, 74);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Expectancy / Trade:', 110, 74);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${overview.expectancy}`, 140, 74);

    doc.save(`TradeTrack_Performance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header Title & PDF Download Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121622]/90 p-5 rounded-2xl border border-slate-800/90 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3.5 z-10">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/10">
            <Zap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Performance Overview
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full uppercase">
                Live Edge
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
              Quantitative Edge Metrics & Real-time Portfolio Health
            </p>
          </div>
        </div>

        <button
          onClick={generatePDFReport}
          className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-500/20 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 z-10"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Download PDF Report</span>
        </button>
      </div>
      
      {/* Top 5 Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Net PnL Card */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden group hover:-translate-y-1 ${
          isNetPositive 
            ? 'bg-gradient-to-br from-[#0c241b] via-[#102920] to-[#121622] border-emerald-500/50 shadow-emerald-500/10 hover:border-emerald-400' 
            : 'bg-gradient-to-br from-[#2f0c13] via-[#280f17] to-[#121622] border-rose-500/50 shadow-rose-500/10 hover:border-rose-400'
        }`}>
          <div className={`absolute top-0 left-0 right-0 h-1 ${isNetPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 font-mono">Total Net PnL</span>
            <div className={`p-2 rounded-xl border shadow-md ${
              isNetPositive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20'
            }`}>
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              isNetPositive ? 'text-emerald-400 drop-shadow-[0_2px_12px_rgba(52,211,153,0.35)]' : 'text-rose-400 drop-shadow-[0_2px_12px_rgba(244,63,94,0.35)]'
            }`}>
              {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-semibold mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-emerald-400">Gross: ${overview.total_gross_pnl.toLocaleString()}</span>
              <span className="text-slate-400">Fees: ${overview.total_fees.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a2327] via-[#0f2429] to-[#121622] border border-teal-500/50 shadow-2xl shadow-teal-500/10 hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-teal-400"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 font-mono">Win Rate</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md shadow-teal-500/20">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-tight drop-shadow-[0_2px_12px_rgba(45,212,191,0.35)]">
              {overview.win_rate}%
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-emerald-400">{overview.win_count} Wins</span>
              <span className="text-rose-400">{overview.loss_count} Losses</span>
              <span className="text-slate-400">{overview.breakeven_count} BE</span>
            </div>
          </div>
        </div>

        {/* Profit Factor Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a0c2e] via-[#160f29] to-[#121622] border border-purple-500/50 shadow-2xl shadow-purple-500/10 hover:border-purple-400 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 font-mono">Profit Factor</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/20">
              <Scale className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${overview.profit_factor >= 1.5 ? 'text-purple-300 drop-shadow-[0_2px_12px_rgba(192,132,252,0.35)]' : 'text-amber-400'}`}>
              {overview.profit_factor}
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-emerald-400">+${overview.total_profit.toLocaleString()}</span>
              <span className="text-rose-400">-${overview.total_loss.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Avg Risk to Reward */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0a1e34] via-[#0d1b2b] to-[#121622] border border-sky-500/50 shadow-2xl shadow-sky-500/10 hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 font-mono">Avg Risk:Reward</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-md shadow-sky-500/20">
              <Target className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-sky-300 tracking-tight drop-shadow-[0_2px_12px_rgba(56,189,248,0.35)]">
              1:{overview.avg_rrr}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium mt-3 pt-2.5 border-t border-slate-800/80">
              <span>Expectancy: <span className="text-sky-300 font-bold">${overview.expectancy}</span></span>
            </div>
          </div>
        </div>

        {/* Total Trades Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#241708] via-[#1f150d] to-[#121622] border border-amber-500/50 shadow-2xl shadow-amber-500/10 hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-300 font-mono">Total Trades</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20">
              <Hash className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
              {overview.closed_trades}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium mt-3 pt-2.5 border-t border-slate-800/80">
              <span>Avg Win: <span className="text-emerald-400 font-bold">${overview.avg_win}</span></span>
              <span>Avg Loss: <span className="text-rose-400 font-bold">${overview.avg_loss}</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Best vs Worst Strategy Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Best Strategy */}
        <div className="bg-gradient-to-r from-[#0a271c] via-[#0f3123] to-[#121622] border border-emerald-500/40 rounded-2xl p-5 shadow-2xl shadow-emerald-500/10 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/20 shrink-0">
              <Trophy className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono">Top Performing Strategy</span>
              <h4 className="text-sm sm:text-base font-black text-white mt-0.5 font-mono">
                {best_strategy ? best_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>
          {best_strategy && (
            <div className="text-right font-mono">
              <div className="text-base sm:text-lg font-black text-emerald-400 drop-shadow-sm">
                +${best_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">
                {best_strategy.win_rate}% Win Rate ({best_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </div>

        {/* Worst Strategy */}
        <div className="bg-gradient-to-r from-[#320a11] via-[#3a0d16] to-[#121622] border border-rose-500/40 rounded-2xl p-5 shadow-2xl shadow-rose-500/10 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20 shrink-0">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-rose-400 uppercase tracking-widest font-mono">Lowest Performing Strategy</span>
              <h4 className="text-sm sm:text-base font-black text-white mt-0.5 font-mono">
                {worst_strategy ? worst_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>
          {worst_strategy && (
            <div className="text-right font-mono">
              <div className={`text-base sm:text-lg font-black ${worst_strategy.total_net_pnl >= 0 ? 'text-slate-200' : 'text-rose-400 drop-shadow-sm'}`}>
                {worst_strategy.total_net_pnl >= 0 ? '+' : ''}${worst_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">
                {worst_strategy.win_rate}% Win Rate ({worst_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
