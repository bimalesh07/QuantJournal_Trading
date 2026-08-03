import React from 'react';
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
  Flame 
} from 'lucide-react';

export default function DashboardOverview({ analytics }) {
  if (!analytics || !analytics.overview) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading analytics engine...
      </div>
    );
  }

  const { overview, best_strategy, worst_strategy } = analytics;
  const isNetPositive = overview.total_net_pnl >= 0;

  return (
    <div className="space-y-6">
      
      {/* Top 5 Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Net PnL Card */}
        <div className="card-dark card-dark-hover p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net PnL</span>
            <div className={`p-2 rounded-lg ${isNetPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-mono ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isNetPositive ? '+' : ''}${overview.total_net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Gross: ${overview.total_gross_pnl.toLocaleString()}</span>
              <span>Fees: ${overview.total_fees.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="card-dark card-dark-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Win Rate</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white">
              {overview.win_rate}%
            </div>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-800/80">
              <span className="text-emerald-400 font-semibold">{overview.win_count} Wins</span>
              <span className="text-rose-400 font-semibold">{overview.loss_count} Losses</span>
              <span className="text-slate-400">{overview.breakeven_count} BE</span>
            </div>
          </div>
        </div>

        {/* Profit Factor Card */}
        <div className="card-dark card-dark-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Profit Factor</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-mono ${overview.profit_factor >= 1.5 ? 'text-purple-300' : 'text-amber-400'}`}>
              {overview.profit_factor}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span className="text-emerald-400">+${overview.total_profit.toLocaleString()}</span>
              <span className="text-rose-400">-${overview.total_loss.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Avg Risk to Reward */}
        <div className="card-dark card-dark-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Risk:Reward</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-blue-300">
              1:{overview.avg_rrr}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Exp: ${overview.expectancy} / trade</span>
            </div>
          </div>
        </div>

        {/* Total Trades Card */}
        <div className="card-dark card-dark-hover p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Trades</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono text-white">
              {overview.closed_trades}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Avg Win: ${overview.avg_win}</span>
              <span>Avg Loss: ${overview.avg_loss}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Best vs Worst Strategy Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Best Strategy */}
        <div className="card-dark p-4 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Top Performing Strategy</span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {best_strategy ? best_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>
          {best_strategy && (
            <div className="text-right font-mono">
              <div className="text-sm font-bold text-emerald-400">
                +${best_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                {best_strategy.win_rate}% Win Rate ({best_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </div>

        {/* Worst Strategy */}
        <div className="card-dark p-4 border-l-4 border-l-rose-500 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lowest Performing Strategy</span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {worst_strategy ? worst_strategy.strategy_name : 'N/A'}
              </h4>
            </div>
          </div>
          {worst_strategy && (
            <div className="text-right font-mono">
              <div className={`text-sm font-bold ${worst_strategy.total_net_pnl >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                {worst_strategy.total_net_pnl >= 0 ? '+' : ''}${worst_strategy.total_net_pnl.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                {worst_strategy.win_rate}% Win Rate ({worst_strategy.trades_count} trades)
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
