import React, { useState, useRef } from 'react';
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
  X,
  Download,
  Upload,
  FileSpreadsheet,
  Tag
} from 'lucide-react';
import ChartLightboxModal from './ChartLightboxModal';
import { getMediaUrl } from '../services/api';

export default function TradeTable({ 
  trades = [], 
  strategies = [], 
  onViewTrade, 
  onEditTrade, 
  onDeleteTrade,
  onImportTrades,
  filters,
  setFilters,
  onResetFilters
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxData, setLightboxData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    if (!trades || trades.length === 0) {
      alert('No trade records available to export.');
      return;
    }

    const headers = [
      'Date & Time',
      'Symbol',
      'Asset Class',
      'Type',
      'Strategy',
      'Entry Price',
      'Exit Price',
      'Net PnL',
      'RRR',
      'Mindset',
      'Rating',
      'Tags',
      'Notes'
    ];

    const csvRows = [headers.join(',')];

    trades.forEach(t => {
      const row = [
        `"${t.entry_time || ''}"`,
        `"${(t.symbol || '').replace(/"/g, '""')}"`,
        `"${t.asset_class || ''}"`,
        `"${t.trade_type || ''}"`,
        `"${(t.strategy_name || '').replace(/"/g, '""')}"`,
        t.entry_price ?? '',
        t.exit_price ?? '',
        t.net_pnl ?? '',
        t.risk_reward_ratio ?? '',
        `"${t.emotion || ''}"`,
        t.rating ?? 3,
        `"${(t.tags || '').replace(/"/g, '""')}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TradeTrack_Trades_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import Handler
  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (!text) return;

        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length <= 1) {
          alert('CSV file appears empty or missing data rows.');
          return;
        }

        const parseCSVLine = (line) => {
          const result = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(cur);
              cur = '';
            } else {
              cur += char;
            }
          }
          result.push(cur);
          return result;
        };

        const rows = lines.slice(1).map(parseCSVLine);
        const importedTrades = [];

        rows.forEach(row => {
          if (row.length < 4) return;
          const [entryTime, symbol, assetClass, tradeType, strategyName, entryPrice, exitPrice, netPnl, rrr, emotion, rating, tags, notes] = row;

          if (symbol && entryPrice) {
            importedTrades.push({
              entry_time: entryTime ? new Date(entryTime.replace(/"/g, '')).toISOString() : new Date().toISOString(),
              symbol: symbol.replace(/"/g, '').toUpperCase(),
              asset_class: (assetClass || 'CRYPTO').replace(/"/g, '').toUpperCase(),
              trade_type: (tradeType || 'LONG').replace(/"/g, '').toUpperCase(),
              entry_price: parseFloat(entryPrice) || 0,
              exit_price: exitPrice ? parseFloat(exitPrice) : null,
              quantity: 1.0,
              fees: 0.00,
              status: exitPrice ? 'CLOSED' : 'OPEN',
              emotion: (emotion || 'DISCIPLINED').replace(/"/g, '').toUpperCase(),
              rating: parseInt(rating) || 3,
              tags: (tags || '').replace(/"/g, ''),
              notes: (notes || '').replace(/"/g, '')
            });
          }
        });

        if (importedTrades.length === 0) {
          alert('No valid trade entries found in CSV.');
          return;
        }

        if (onImportTrades) {
          await onImportTrades(importedTrades);
          alert(`Successfully imported ${importedTrades.length} trades from CSV!`);
        }
      } catch (err) {
        console.error('Failed to import CSV:', err);
        alert('Error parsing CSV file. Please ensure it follows standard format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter Trades
  const filteredTrades = trades.filter(t => {
    const matchesSearch = 
      t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.strategy_name && t.strategy_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.tags && t.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAsset = !filters.asset_class || t.asset_class === filters.asset_class;
    const matchesType = !filters.trade_type || t.trade_type === filters.trade_type;
    const matchesStrategy = !filters.strategy || String(t.strategy) === String(filters.strategy);
    
    let matchesOutcome = true;
    if (filters.outcome === 'WIN') matchesOutcome = t.net_pnl > 0;
    if (filters.outcome === 'LOSS') matchesOutcome = t.net_pnl < 0;
    if (filters.outcome === 'BREAKEVEN') matchesOutcome = Number(t.net_pnl) === 0;

    return matchesSearch && matchesAsset && matchesType && matchesStrategy && matchesOutcome;
  });

  const getEmotionBadge = (emotion) => {
    switch (emotion) {
      case 'DISCIPLINED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PATIENT': return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      case 'FOMO': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'REVENGE': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'FEARFUL': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'GREEDY': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Chart Lightbox Zoom Modal */}
      <ChartLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        imageUrl={lightboxData?.url}
        title={lightboxData?.title}
      />

      {/* Sleek Toolbar Header */}
      <div className="bg-[#121622] p-4 rounded-2xl border border-slate-800/90 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-sans">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Symbol, Strategy, Tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161F2E] text-xs sm:text-sm text-slate-100 pl-10 pr-4 py-2 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none transition-all placeholder:text-slate-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Asset Class Filter */}
          <select
            value={filters.asset_class || ''}
            onChange={(e) => handleFilterChange('asset_class', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Asset Classes</option>
            <option value="CRYPTO" className="bg-[#121622] text-white">🪙 Crypto</option>
            <option value="STOCKS" className="bg-[#121622] text-white">📈 Stocks</option>
            <option value="FOREX" className="bg-[#121622] text-white">💱 Forex</option>
            <option value="OPTIONS" className="bg-[#121622] text-white">📊 Options</option>
            <option value="FUTURES" className="bg-[#121622] text-white">⚡ Futures</option>
          </select>

          {/* Trade Type Filter */}
          <select
            value={filters.trade_type || ''}
            onChange={(e) => handleFilterChange('trade_type', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Types</option>
            <option value="LONG" className="bg-[#121622] text-white">🟢 Long</option>
            <option value="SHORT" className="bg-[#121622] text-white">🔴 Short</option>
          </select>

          {/* Strategy Filter */}
          <select
            value={filters.strategy || ''}
            onChange={(e) => handleFilterChange('strategy', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium max-w-[140px] truncate cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Strategies</option>
            {strategies.map(s => (
              <option key={s.id} value={s.id} className="bg-[#121622] text-white">{s.name}</option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={filters.outcome || ''}
            onChange={(e) => handleFilterChange('outcome', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Outcomes</option>
            <option value="WIN" className="bg-[#121622] text-white">🟢 Win</option>
            <option value="LOSS" className="bg-[#121622] text-white">🔴 Loss</option>
            <option value="BREAKEVEN" className="bg-[#121622] text-white">⚪ Breakeven</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/70 transition-all flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Export Trade Log to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* CSV Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-3 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Import Trades from CSV Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>

        </div>

      </div>

      {/* Trade Log Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/90 bg-[#10141D] shadow-xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-[#141926] text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4">Symbol & Market</th>
              <th className="py-3.5 px-3 text-center">Type</th>
              <th className="py-3.5 px-4">Strategy & Setup Tags</th>
              <th className="py-3.5 px-4 text-right">Entry / Exit</th>
              <th className="py-3.5 px-4 text-right">Net PnL</th>
              <th className="py-3.5 px-3 text-center">RRR</th>
              <th className="py-3.5 px-3 text-center">Mindset & Rating</th>
              <th className="py-3.5 px-4 text-right sticky right-0 bg-[#141926] z-10 border-l border-slate-800 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs sm:text-sm">
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
                  <tr key={t.id} className="hover:bg-[#161F2E]/60 transition-colors group">
                    
                    {/* Date & Time */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap text-xs font-medium">
                      {dateStr}
                    </td>

                    {/* Symbol, Asset Class & Session */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white font-mono text-sm tracking-wide">{t.symbol}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700/70 font-semibold uppercase">
                          {t.asset_class}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-mono border border-blue-500/30 font-semibold uppercase">
                          {t.session === 'NEW_YORK' ? 'NY' : t.session === 'LONDON' ? 'London' : t.session === 'ASIAN' ? 'Asian' : 'NY'}
                        </span>
                      </div>
                    </td>

                    {/* Trade Type */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border font-mono ${
                        isLong 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm' 
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-sm'
                      }`}>
                        {isLong ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {t.trade_type}
                      </span>
                    </td>

                    {/* Strategy & Setup Tags */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-200 text-xs">
                      <div className="font-semibold text-slate-100">{t.strategy_name || <span className="text-slate-500 italic font-normal">No Strategy</span>}</div>
                      {t.tags && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {t.tags.split(',').map((rawTag, idx) => {
                            const trimmed = rawTag.trim();
                            if (!trimmed) return null;
                            const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
                            return (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-mono border border-purple-500/30 font-medium">
                                {formatted}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    {/* Entry / Exit Prices */}
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap text-xs">
                      <div className="text-slate-100 font-extrabold">${Number(t.entry_price).toLocaleString()}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5 font-medium">
                        Exit: {t.exit_price ? `$${Number(t.exit_price).toLocaleString()}` : <span className="text-amber-400 font-bold">OPEN</span>}
                      </div>
                    </td>

                    {/* Net PnL */}
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap text-xs">
                      <div className={`font-extrabold text-sm ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[11px] font-semibold mt-0.5 ${isWin ? 'text-emerald-400/80' : isLoss ? 'text-rose-400/80' : 'text-slate-400'}`}>
                        {t.return_percentage ? `${Number(t.return_percentage).toFixed(2)}%` : '0.00%'}
                      </div>
                    </td>

                    {/* RRR */}
                    <td className="py-3.5 px-3 text-center font-mono font-extrabold text-sky-400 whitespace-nowrap text-xs">
                      1:{t.risk_reward_ratio}
                    </td>

                    {/* Mindset & Rating Combined */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border font-mono tracking-wide ${getEmotionBadge(t.emotion)}`}>
                          {t.emotion}
                        </span>
                        <div className="flex items-center justify-center gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Actions (with Chart Lightbox Trigger) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap sticky right-0 bg-[#10141D] group-hover:bg-[#161F2E] z-10 border-l border-slate-800/80 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] transition-colors">
                      <div className="flex items-center justify-end gap-1">
                        {(t.chart_entry || t.chart_exit) && (
                          <button
                            onClick={() => {
                              const rawUrl = t.chart_entry || t.chart_exit;
                              const fullUrl = getMediaUrl(rawUrl);
                              setLightboxData({ url: fullUrl, title: `${t.symbol} Setup Chart` });
                            }}
                            className="p-1.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 bg-purple-500/10 rounded-lg transition-all cursor-pointer border border-purple-500/30"
                            title="View Setup Chart Lightbox"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewTrade(t)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="View Trade Details & Retrospective"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTrade(t)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Edit Trade"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTrade(t.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                          title="Delete Trade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400 text-sm font-medium">
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
