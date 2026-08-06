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
  FileText
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

    // Dark luxury theme background
    doc.setFillColor(11, 14, 20);
    doc.rect(0, 0, pageWidth, 297, 'F');

    // System Title Header
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TradeTrack PRO', 14, 20);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Executive Performance & Analytics Report', 14, 26);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, pageWidth - 14, 26, { align: 'right' });

    // Divider Line
    doc.setDrawColor(30, 37, 54);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageWidth - 14, 30);

    // CORE METRICS CONTAINER
    doc.setFillColor(21, 25, 33);
    doc.roundedRect(14, 36, pageWidth - 28, 48, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CORE PERFORMANCE METRICS', 20, 44);

    // KPI Values
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Row 1
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

    // Row 2
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

    // Row 3
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

    // STRATEGY BREAKDOWN CONTAINER
    doc.setFillColor(21, 25, 33);
    doc.roundedRect(14, 92, pageWidth - 28, 90, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('STRATEGY PERFORMANCE BREAKDOWN', 20, 102);

    let startY = 112;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('STRATEGY NAME', 20, startY);
    doc.text('TRADES', 90, startY);
    doc.text('WIN RATE', 120, startY);
    doc.text('NET PNL', 160, startY);

    doc.setDrawColor(45, 55, 77);
    doc.line(20, startY + 2, pageWidth - 20, startY + 2);

    const stratList = analytics.strategy_performance || [];
    let currentY = startY + 10;

    stratList.slice(0, 7).forEach((strat) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(strat.strategy_name || 'Unassigned', 20, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`${strat.trades_count} (${strat.wins}W/${strat.losses}L)`, 90, currentY);
      doc.text(`${strat.win_rate}%`, 120, currentY);

      const isStratPos = strat.total_net_pnl >= 0;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(isStratPos ? 16 : 239, isStratPos ? 185 : 68, isStratPos ? 129 : 68);
      doc.text(`${isStratPos ? '+' : ''}$${strat.total_net_pnl.toLocaleString()}`, 160, currentY);

      currentY += 8;
    });

    // PSYCHOLOGY & EMOTION CONTAINER
    doc.setFillColor(21, 25, 33);
    doc.roundedRect(14, 190, pageWidth - 28, 85, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('EMOTIONAL TRAIT BREAKDOWN', 20, 200);

    let emoY = 210;
    const emotions = analytics.pnl_by_emotion || [];
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('MINDSET TRAIT', 20, emoY);
    doc.text('TOTAL TRADES', 80, emoY);
    doc.text('WIN RATE', 120, emoY);
    doc.text('NET PNL DRAIN', 160, emoY);

    doc.line(20, emoY + 2, pageWidth - 20, emoY + 2);
    emoY += 10;

    emotions.slice(0, 6).forEach((emo) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(emo.emotion, 20, emoY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225);
      doc.text(`${emo.trades}`, 80, emoY);
      doc.text(`${emo.win_rate}%`, 120, emoY);

      const isEmoPos = emo.net_pnl >= 0;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(isEmoPos ? 16 : 239, isEmoPos ? 185 : 68, isEmoPos ? 129 : 68);
      doc.text(`${isEmoPos ? '+' : ''}$${emo.net_pnl.toLocaleString()}`, 160, emoY);

      emoY += 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('TradeTrack PRO • Executive Quantitative Analytics Report • Strictly Confidential', pageWidth / 2, 285, { align: 'center' });

    doc.save(`TradeTrack_Performance_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">

      {/* Header Title & PDF Download Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121622]/80 p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-wide text-white">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Performance Overview
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
            Quantitative Edge Metrics & Real-time Portfolio Health
          </p>
        </div>
        <button
          onClick={generatePDFReport}
          className="px-4.5 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 hover:brightness-110 shadow-lg shadow-purple-500/25 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <FileText className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Download PDF Report</span>
        </button>
      </div>
      
      {/* Top 5 Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Net PnL Card */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 shadow-xl ${
          isNetPositive 
            ? 'bg-gradient-to-br from-[#0a2c20] via-[#0f2e24] to-[#0c1824] border-emerald-500/50 shadow-emerald-500/10 hover:border-emerald-400 hover:scale-[1.02]' 
            : 'bg-gradient-to-br from-[#3b0b13] via-[#320f17] to-[#0c1824] border-rose-500/50 shadow-rose-500/10 hover:border-rose-400 hover:scale-[1.02]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">Total Net PnL</span>
            <div className={`p-2.5 rounded-xl border shadow-md ${
              isNetPositive 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20' 
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20'
            }`}>
              <DollarSign className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              isNetPositive ? 'text-emerald-400 drop-shadow-[0_2px_8px_rgba(16,185,129,0.35)]' : 'text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.35)]'
            }`}>
              {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-emerald-400/90 font-semibold">Gross: ${overview.total_gross_pnl.toLocaleString()}</span>
              <span className="text-slate-400 font-medium">Fees: ${overview.total_fees.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#09292d] via-[#0e272c] to-[#0c1824] border border-teal-500/50 shadow-xl shadow-teal-500/10 hover:border-teal-400 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">Win Rate</span>
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md shadow-teal-500/20">
              <Percent className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-tight drop-shadow-[0_2px_8px_rgba(20,184,166,0.3)]">
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
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1e0f33] via-[#1a122c] to-[#0c1824] border border-purple-500/50 shadow-xl shadow-purple-500/10 hover:border-purple-400 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">Profit Factor</span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md shadow-purple-500/20">
              <Scale className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${overview.profit_factor >= 1.5 ? 'text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)]' : 'text-amber-400'}`}>
              {overview.profit_factor}
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-emerald-400">+${overview.total_profit.toLocaleString()}</span>
              <span className="text-rose-400">-${overview.total_loss.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Avg Risk to Reward */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b2138] via-[#0e1d2e] to-[#0c1824] border border-blue-500/50 shadow-xl shadow-blue-500/10 hover:border-blue-400 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">Avg Risk:Reward</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md shadow-blue-500/20">
              <Target className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-blue-300 tracking-tight drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
              1:{overview.avg_rrr}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium mt-3 pt-2.5 border-t border-slate-800/80">
              <span>Exp: <span className="text-blue-300 font-bold">${overview.expectancy}</span> / trade</span>
            </div>
          </div>
        </div>

        {/* Total Trades Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2a1d0a] via-[#22180f] to-[#0c1824] border border-amber-500/50 shadow-xl shadow-amber-500/10 hover:border-amber-400 hover:scale-[1.02] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">Total Trades</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/20">
              <Hash className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]">
              {overview.closed_trades}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono font-medium mt-3 pt-2.5 border-t border-slate-800/80">
              <span>Win: <span className="text-emerald-400 font-bold">${overview.avg_win}</span></span>
              <span>Loss: <span className="text-rose-400 font-bold">${overview.avg_loss}</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Best vs Worst Strategy Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Best Strategy */}
        <div className="bg-gradient-to-r from-[#092b20] via-[#0e3527] to-[#121824] border border-emerald-500/50 rounded-2xl p-5 shadow-xl shadow-emerald-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/20">
              <Trophy className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-400/90 uppercase tracking-wider font-mono">Top Performing Strategy</span>
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
        <div className="bg-gradient-to-r from-[#380e15] via-[#42131b] to-[#121824] border border-rose-500/50 rounded-2xl p-5 shadow-xl shadow-rose-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-500/20">
              <AlertTriangle className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-rose-400/90 uppercase tracking-wider font-mono">Lowest Performing Strategy</span>
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
