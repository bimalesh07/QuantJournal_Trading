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

export default function DashboardOverview({ analytics }) {
  const [capitalTimeframe, setCapitalTimeframe] = useState('Yearly');

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
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (winRateVal / 100) * circumference;

  return (
    <div className="space-y-6 font-sans">

      {/* 1. Best Performing Asset Top Banner (Reference Screenshot 1 Top Banner) */}
      <AntigravityCard
        bloomColor="emerald"
        className="bg-[#0B101C] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
            <Trophy className="w-5.5 h-5.5 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Best Performing Asset
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-mono tracking-wide mt-0.5">
              {best_strategy ? best_strategy.strategy_name : 'Nifty 50'}
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono">
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]">
            +${best_strategy ? best_strategy.total_net_pnl.toLocaleString() : '1,72,470'}
          </div>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {best_strategy ? `${best_strategy.win_rate}% win rate • ${best_strategy.trades_count} trades` : '97% win rate • 33 trades'}
          </p>
        </div>
      </AntigravityCard>

      {/* 2. Cumulative P&L Area Chart + Semicircle Win Rate Speedometer (Reference Screenshot 1 Bottom Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cumulative P&L Area Chart (2 Columns wide) */}
        <div className="lg:col-span-2 bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
                Cumulative P&L
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time equity growth trajectory</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              +{overview.win_rate}% Edge
            </div>
          </div>

          {/* Smooth Equity Line Area Chart SVG */}
          <div className="w-full h-56 pt-4 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="pnlCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="130" x2="600" y2="130" stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="180" x2="600" y2="180" stroke="#1E293B" strokeDasharray="4 4" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="0" y="26" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">$80k</text>
              <text x="0" y="76" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">$60k</text>
              <text x="0" y="126" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">$40k</text>
              <text x="0" y="176" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">$20k</text>

              {/* Smooth Gradient Area */}
              <path
                d="M 50,140 Q 120,180 180,120 T 300,100 T 420,50 T 580,110 L 580,180 L 50,180 Z"
                fill="url(#pnlCurveGrad)"
              />

              {/* Smooth Glowing Cyan-Emerald Line */}
              <path
                d="M 50,140 Q 120,180 180,120 T 300,100 T 420,50 T 580,110"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* X Axis Dates */}
          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
            <span>23 Dec</span>
            <span>22 Dec</span>
            <span>21 Dec</span>
            <span>20 Dec</span>
            <span>19 Dec</span>
            <span>18 Dec</span>
            <span>17 Dec</span>
            <span>16 Dec</span>
            <span>15 Dec</span>
          </div>
        </div>

        {/* Win Rate Radial Arc Speedometer Gauge (Reference Screenshot 1 Right Card) */}
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
              {/* Outer Dark Arc Track */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#1E293B"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Active Neon Emerald Arc */}
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

            {/* Semicircle Center Value */}
            <div className="absolute top-[52px] flex flex-col items-center">
              <span className="text-3xl font-black font-mono text-cyan-400 tracking-tight">
                {overview.win_rate}%
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase mt-0.5">
                Success
              </span>
            </div>
          </div>

          {/* Subtitle Trend Badge */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>+5% vs last month</span>
          </div>
        </div>

      </div>

      {/* 3. Capital Performance Widget with Timeframe Selector Pills (Reference Screenshot 2) */}
      <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
              Capital Performance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              % of capital earned/lost over time
            </p>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center gap-1.5 bg-[#0F1422] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((tf) => (
              <button
                key={tf}
                onClick={() => setCapitalTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  capitalTimeframe === tf
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Capital Performance Percentage Line Chart */}
        <div className="w-full h-48 pt-2">
          <svg viewBox="0 0 600 160" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Y Axis Grid Lines */}
            <line x1="0" y1="20" x2="600" y2="20" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="600" y2="60" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="0" y1="140" x2="600" y2="140" stroke="#1E293B" strokeDasharray="3 3" />

            <text x="0" y="16" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">6.0%</text>
            <text x="0" y="56" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">3.0%</text>
            <text x="0" y="96" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">0.0%</text>
            <text x="0" y="136" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">-3.0%</text>

            <path
              d="M 40,130 L 110,60 L 190,70 L 270,40 L 350,110 L 430,70 L 510,40 L 580,80 L 580,140 L 40,140 Z"
              fill="url(#capGrad)"
            />

            <path
              d="M 40,130 L 110,60 L 190,70 L 270,40 L 350,110 L 430,70 L 510,40 L 580,80"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
          <span>Dec 15</span>
          <span>Dec 16</span>
          <span>Dec 17</span>
          <span>Dec 18</span>
          <span>Dec 19</span>
          <span>Dec 20</span>
          <span>Dec 21</span>
          <span>Dec 22</span>
          <span>Dec 23</span>
        </div>
      </div>

      {/* 4. Strategy Performance & Recent Trades Feed (Reference Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Strategy Performance Horizontal Bar Chart (Screenshot 3 Left) */}
        <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Strategy Performance
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">Top Setups</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { name: 'Iron Condor', val: 95, pnl: '+$280k' },
              { name: 'Bull Call Spread', val: 72, pnl: '+$195k' },
              { name: 'Iron Butterfly', val: 62, pnl: '+$165k' },
              { name: 'Bear Put Spread', val: 52, pnl: '+$135k' },
              { name: 'Straddle', val: 44, pnl: '+$115k' }
            ].map((strat, idx) => (
              <div key={idx} className="space-y-1 font-mono">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{strat.name}</span>
                  <span className="text-emerald-400 font-bold">{strat.pnl}</span>
                </div>
                <div className="w-full h-7 rounded-xl bg-[#0F1422] p-1 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-md shadow-emerald-500/20"
                    style={{ width: `${strat.val}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades Stream Feed (Screenshot 3 Right) */}
        <div className="bg-[#090E18] border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-lg font-bold font-mono text-white tracking-wide">
              Recent Trades
            </h3>
            <span className="text-xs font-mono text-slate-400 font-medium">Real-time Executions</span>
          </div>

          <div className="space-y-2.5 pt-1 font-mono">
            {[
              { symbol: 'Nifty 50', type: 'Straddle', pnl: '+$7,500', date: '24 Dec', isWin: true },
              { symbol: 'Nifty 50', type: 'Long', pnl: '+$7,500', date: '24 Dec', isWin: true },
              { symbol: 'Sensex', type: 'Long', pnl: '+$108', date: '23 Dec', isWin: true },
              { symbol: 'Fin Nifty', type: 'Long', pnl: '+$108', date: '15 Apr', isWin: true },
              { symbol: 'Bank Nifty', type: 'Short', pnl: '+$3,600', date: '10 Apr', isWin: true }
            ].map((trade, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0E1320] border border-white/10 hover:border-emerald-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{trade.symbol}</h4>
                    <span className="text-[11px] text-slate-400">{trade.type}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-400">{trade.pnl}</div>
                  <span className="text-[10px] text-slate-500">{trade.date}</span>
                </div>
              </div>
            ))}
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
