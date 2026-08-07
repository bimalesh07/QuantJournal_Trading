import React from 'react';
import { Award, Trophy, Zap, ShieldCheck, Target, Flame, Star, Lock, CheckCircle2 } from 'lucide-react';

export default function TraderMilestones({ analytics, trades = [] }) {
  const overview = analytics?.overview || {};
  const totalTrades = trades.length || overview.closed_trades || 0;
  const winCount = overview.win_count || 0;
  const highestWin = overview.highest_win || 0;
  const netPnl = overview.total_net_pnl || 0;
  const avgRrr = overview.avg_rrr || 0;

  // Milestone Definitions
  const milestones = [
    {
      id: 'first_trade',
      title: 'First Execution',
      description: 'Logged first trade in journal',
      icon: Target,
      color: 'emerald',
      unlocked: totalTrades >= 1,
      progress: Math.min(100, (totalTrades / 1) * 100),
      label: `${totalTrades}/1 Trade`
    },
    {
      id: 'profit_century',
      title: '$100 Profit Day',
      description: 'Earned $100+ in a trade or total PnL',
      icon: Trophy,
      color: 'amber',
      unlocked: highestWin >= 100 || netPnl >= 100,
      progress: Math.min(100, (Math.max(highestWin, netPnl) / 100) * 100),
      label: `$${Math.max(highestWin, netPnl).toFixed(0)}/$100`
    },
    {
      id: 'win_streak',
      title: 'Winning Edge',
      description: 'Achieved 3+ winning trades',
      icon: Flame,
      color: 'rose',
      unlocked: winCount >= 3,
      progress: Math.min(100, (winCount / 3) * 100),
      label: `${winCount}/3 Wins`
    },
    {
      id: 'rrr_master',
      title: 'Risk Expectancy',
      description: 'Maintained 1:1.5+ Risk to Reward',
      icon: ShieldCheck,
      color: 'sky',
      unlocked: avgRrr >= 1.5,
      progress: Math.min(100, (avgRrr / 1.5) * 100),
      label: `1:${avgRrr ? avgRrr.toFixed(2) : '0.0'}`
    },
    {
      id: 'century_trader',
      title: 'Master Trader',
      description: 'Log 50+ total executions',
      icon: Award,
      color: 'purple',
      unlocked: totalTrades >= 50,
      progress: Math.min(100, (totalTrades / 50) * 100),
      label: `${totalTrades}/50 Trades`
    }
  ];

  const unlockedCount = milestones.filter(m => m.unlocked).length;

  return (
    <div className="bg-[#080C16] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 font-sans relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
              Trader Journey Milestones & Badges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated Achievement Unlocks & Discipline Streaks</p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0F1422] border border-amber-500/30 flex items-center gap-2 font-mono text-xs text-amber-300">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold">{unlockedCount} / {milestones.length} Badges Unlocked</span>
        </div>
      </div>

      {/* Grid of Milestone Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono">
        {milestones.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                m.unlocked
                  ? 'bg-gradient-to-br from-[#0F1923] via-[#0E1520] to-[#070A12] border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#090D18]/60 border-white/5 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                  m.unlocked
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                }`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                {m.unlocked ? (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-500 rounded-md uppercase flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-500" />
                    LOCKED
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide">{m.title}</h4>
                <p className="text-[10.5px] text-slate-400 mt-0.5 font-sans leading-snug">{m.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9.5px] text-slate-400">
                  <span>Progress</span>
                  <span className={m.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{m.label}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.unlocked ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : 'bg-slate-700'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  ></div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
