import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Upload, 
  Check, 
  Clock, 
  Tag, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { 
  TIMEFRAME_OPTIONS, 
  exportBacktestsToCSV 
} from '../utils/backtestUtils';

export default function BacktestTable({
  trades = [],
  strategies = [],
  onViewTrade,
  onEditTrade,
  onDeleteTrade,
  onImportCSV,
  onOpenLogModal,
  theme = 'dark'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [strategyFilter, setStrategyFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');
  const [timeframeFilter, setTimeframeFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');

  // Extract unique strategies and symbols from trades for dropdown filters
  const uniqueStrategies = useMemo(() => {
    const fromTrades = trades.map(t => t.strategy).filter(Boolean);
    const fromProps = (strategies || []).map(s => typeof s === 'object' ? s.name : s).filter(Boolean);
    return Array.from(new Set([...fromTrades, ...fromProps]));
  }, [trades, strategies]);

  const uniqueAssets = useMemo(() => {
    return Array.from(new Set(trades.map(t => t.symbol).filter(Boolean)));
  }, [trades]);

  // Filtered dataset
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      const matchSearch = searchTerm === '' || 
        (t.symbol || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.strategy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStrategy = strategyFilter === '' || t.strategy === strategyFilter;
      const matchAsset = assetFilter === '' || t.symbol === assetFilter;
      const matchTimeframe = timeframeFilter === '' || t.timeframe === timeframeFilter;
      
      let matchOutcome = true;
      if (outcomeFilter === 'WIN') matchOutcome = t.realized_r > 0;
      else if (outcomeFilter === 'LOSS') matchOutcome = t.realized_r < 0;
      else if (outcomeFilter === 'BREAKEVEN') matchOutcome = t.realized_r === 0;

      return matchSearch && matchStrategy && matchAsset && matchTimeframe && matchOutcome;
    });
  }, [trades, searchTerm, strategyFilter, assetFilter, timeframeFilter, outcomeFilter]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onImportCSV(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStrategyFilter('');
    setAssetFilter('');
    setTimeframeFilter('');
    setOutcomeFilter('');
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Filters & Import/Export */}
      <div className="p-4 rounded-2xl bg-[#070A12]/90 border border-white/10 shadow-xl backdrop-blur-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search backtest by asset, strategy, or notes..."
            className="w-full bg-[#0F1523] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Strategy Filter */}
          <select
            value={strategyFilter}
            onChange={(e) => setStrategyFilter(e.target.value)}
            className="bg-[#0F1523] border border-white/15 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="">All Strategies</option>
            {uniqueStrategies.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Asset Filter */}
          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="bg-[#0F1523] border border-white/15 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="">All Assets</option>
            {uniqueAssets.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          {/* Timeframe Filter */}
          <select
            value={timeframeFilter}
            onChange={(e) => setTimeframeFilter(e.target.value)}
            className="bg-[#0F1523] border border-white/15 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="">All Timeframes</option>
            {TIMEFRAME_OPTIONS.map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="bg-[#0F1523] border border-white/15 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="">All Outcomes</option>
            <option value="WIN">🎯 Win (+R)</option>
            <option value="LOSS">🛑 Loss (-R)</option>
            <option value="BREAKEVEN">⚖️ Breakeven (0R)</option>
          </select>

          {(searchTerm || strategyFilter || assetFilter || timeframeFilter || outcomeFilter) && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-mono text-rose-400 hover:underline px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Action Buttons: Export & Import CSV */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportBacktestsToCSV(trades)}
            className="h-8.5 px-3 rounded-xl bg-[#0D1527] hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Export Backtest Data to CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <label className="h-8.5 px-3 rounded-xl bg-[#0D1527] hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

      </div>

      {/* Data Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#090D16]/95 shadow-2xl backdrop-blur-xl">
        <table className="w-full text-left border-collapse min-w-[950px] font-mono">
          <thead>
            <tr className="bg-[#0D121F] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <th className="py-3 px-4">Asset & Strategy</th>
              <th className="py-3 px-4">Direction</th>
              <th className="py-3 px-4">TF / Session</th>
              <th className="py-3 px-4 text-right">Entry / SL / TP</th>
              <th className="py-3 px-4 text-center">Planned RRR</th>
              <th className="py-3 px-4 text-center">Realized R</th>
              <th className="py-3 px-4">Rule Quality & Confluences</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-xs text-slate-200">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                  <p className="text-sm font-semibold">No historical backtest records found.</p>
                  <button
                    onClick={onOpenLogModal}
                    className="mt-3 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500/30 transition-all cursor-pointer shadow-md"
                  >
                    + Log First Backtest Setup
                  </button>
                </td>
              </tr>
            ) : (
              filteredTrades.map((t) => {
                const isLong = t.direction === 'LONG';
                const r = parseFloat(t.realized_r) || 0;

                return (
                  <tr 
                    key={t.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Asset & Strategy */}
                    <td className="py-3 px-4">
                      <div className="font-black text-white text-sm tracking-wide flex items-center gap-1.5">
                        <span>{t.symbol}</span>
                        {t.chart_before_url && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" title="Chart proof attached"></span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-cyan-400/90">{t.strategy}</div>
                    </td>

                    {/* Direction */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-extrabold ${
                        isLong
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isLong ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {t.direction}
                      </span>
                    </td>

                    {/* TF & Session */}
                    <td className="py-3 px-4 text-slate-300">
                      <div className="font-bold text-xs text-white">{t.timeframe}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]" title={t.session}>
                        {t.session}
                      </div>
                    </td>

                    {/* Price levels */}
                    <td className="py-3 px-4 text-right">
                      <div className="text-slate-200 font-bold text-xs">{t.entry_price}</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">
                        SL: <span className="text-rose-400 font-semibold">{t.stop_loss}</span> | TP: <span className="text-emerald-400 font-semibold">{t.take_profit}</span>
                      </div>
                    </td>

                    {/* Planned RRR */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30">
                        1:{t.planned_rrr} R
                      </span>
                    </td>

                    {/* Realized R Badge */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-md font-black text-xs ${
                        r > 0
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : r < 0
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-sm'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                      }`}>
                        {r > 0 ? `+${r}` : r} R
                      </span>
                    </td>

                    {/* Rule Quality & Confluences Inline */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-slate-300 block mb-1">
                        {t.rule_adherence}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {(t.confluences || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#131B2C] text-slate-300 border border-white/10 font-medium">
                            {tag}
                          </span>
                        ))}
                        {(t.confluences || []).length > 3 && (
                          <span className="text-[9.5px] text-slate-400">
                            +{(t.confluences || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTrade(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
                          title="Quick View Chart Proof & Notes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditTrade(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
                          title="Edit Backtest Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
