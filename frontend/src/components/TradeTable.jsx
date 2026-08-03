import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Star, 
  Image as ImageIcon, 
  TrendingUp, 
  TrendingDown, 
  X 
} from 'lucide-react';

export default function TradeTable({ 
  trades = [], 
  strategies = [], 
  onViewTrade, 
  onEditTrade, 
  onDeleteTrade,
  filters,
  setFilters,
  onResetFilters
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Client-side search filtering by symbol or notes
  const filteredTrades = trades.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.symbol.toLowerCase().includes(term) ||
      (t.notes && t.notes.toLowerCase().includes(term)) ||
      (t.strategy_name && t.strategy_name.toLowerCase().includes(term))
    );
  });

  const getEmotionBadge = (emotion) => {
    const emotionColors = {
      DISCIPLINED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      PATIENT: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      FOMO: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
      REVENGE: 'bg-red-600/20 text-red-400 border-red-500/40 font-bold',
      FEARFUL: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      GREEDY: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      IMPULSIVE: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    };
    return emotionColors[emotion] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="card-dark p-6 space-y-5">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Symbol, Strategy, or Logic Notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151921] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Asset Class Filter */}
          <select
            value={filters.asset_class || ''}
            onChange={(e) => handleFilterChange('asset_class', e.target.value)}
            className="bg-[#151921] text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Asset Classes</option>
            <option value="CRYPTO">Crypto</option>
            <option value="STOCKS">Stocks</option>
            <option value="FOREX">Forex</option>
            <option value="OPTIONS">Options</option>
            <option value="FUTURES">Futures</option>
          </select>

          {/* Trade Type Filter */}
          <select
            value={filters.trade_type || ''}
            onChange={(e) => handleFilterChange('trade_type', e.target.value)}
            className="bg-[#151921] text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Types (Long/Short)</option>
            <option value="LONG">Long</option>
            <option value="SHORT">Short</option>
          </select>

          {/* Strategy Filter */}
          <select
            value={filters.strategy || ''}
            onChange={(e) => handleFilterChange('strategy', e.target.value)}
            className="bg-[#151921] text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Strategies</option>
            {strategies.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={filters.outcome || ''}
            onChange={(e) => handleFilterChange('outcome', e.target.value)}
            className="bg-[#151921] text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Outcomes</option>
            <option value="WIN">Win</option>
            <option value="LOSS">Loss</option>
            <option value="BREAKEVEN">Breakeven</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-all flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>

        </div>

      </div>

      {/* Trade Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#151921]/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Symbol</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Strategy</th>
              <th className="py-3.5 px-4 text-right">Entry / Exit</th>
              <th className="py-3.5 px-4 text-right">Net PnL</th>
              <th className="py-3.5 px-4 text-center">RRR</th>
              <th className="py-3.5 px-4">Mindset</th>
              <th className="py-3.5 px-4 text-center">Rating</th>
              <th className="py-3.5 px-4 text-center">Chart</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredTrades.length > 0 ? (
              filteredTrades.map((t) => {
                const isLong = t.trade_type === 'LONG';
                const isWin = t.net_pnl > 0;
                const isLoss = t.net_pnl < 0;
                const dateStr = new Date(t.entry_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {dateStr}
                    </td>

                    {/* Symbol & Asset Class */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{t.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {t.asset_class}
                        </span>
                      </div>
                    </td>

                    {/* Trade Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isLong 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {t.trade_type}
                      </span>
                    </td>

                    {/* Strategy */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {t.strategy_name || <span className="text-slate-500 italic">None</span>}
                    </td>

                    {/* Entry / Exit Prices */}
                    <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                      <div className="text-slate-200">${Number(t.entry_price).toLocaleString()}</div>
                      <div className="text-slate-400 text-[10px]">
                        Exit: {t.exit_price ? `$${Number(t.exit_price).toLocaleString()}` : 'OPEN'}
                      </div>
                    </td>

                    {/* Net PnL */}
                    <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                      <div className={`font-bold ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t.return_percentage ? `${Number(t.return_percentage).toFixed(2)}%` : '0%'}
                      </div>
                    </td>

                    {/* RRR */}
                    <td className="py-3 px-4 text-center font-mono font-semibold text-blue-300 whitespace-nowrap">
                      1:{t.risk_reward_ratio}
                    </td>

                    {/* Mindset / Emotion */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getEmotionBadge(t.emotion)}`}>
                        {t.emotion}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Media Thumbnail Indicator */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {(t.chart_entry || t.chart_exit) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                          <ImageIcon className="w-3 h-3" />
                          Chart
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[10px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTrade(t)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="View Trade Details & Retrospective"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditTrade(t)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Edit Trade"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete Trade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" className="py-12 text-center text-slate-500">
                  No trades found matching your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
