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
  const [lightboxData, setLightboxData] = useState(null); // { url, title }
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
        const text = event.target.result;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          alert('CSV file is empty or missing data rows.');
          return;
        }

        const importedData = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
          if (!cols || cols.length < 2) continue;

          const symbol = cols[1] || cols[0];
          if (!symbol) continue;

          importedData.push({
            symbol: symbol.toUpperCase(),
            asset_class: cols[2] ? cols[2].toUpperCase() : 'STOCKS',
            trade_type: cols[3] && cols[3].toUpperCase() === 'SHORT' ? 'SHORT' : 'LONG',
            entry_price: parseFloat(cols[5]) || 100,
            exit_price: cols[6] ? parseFloat(cols[6]) : null,
            net_pnl: parseFloat(cols[7]) || 0,
            risk_reward_ratio: parseFloat(cols[8]) || 1.5,
            emotion: cols[9] ? cols[9].toUpperCase() : 'DISCIPLINED',
            rating: parseInt(cols[10]) || 3,
            tags: cols[11] || '',
            notes: cols[12] || 'Imported via CSV',
            status: cols[6] ? 'CLOSED' : 'OPEN'
          });
        }

        if (onImportTrades && importedData.length > 0) {
          await onImportTrades(importedData);
        }
      } catch (err) {
        console.error('Failed to parse CSV file:', err);
        alert('Error parsing CSV file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Client-side search filtering by symbol, strategy, notes, or tags
  const filteredTrades = trades.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.symbol.toLowerCase().includes(term) ||
      (t.notes && t.notes.toLowerCase().includes(term)) ||
      (t.strategy_name && t.strategy_name.toLowerCase().includes(term)) ||
      (t.tags && t.tags.toLowerCase().includes(term))
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
      
      {/* Lightbox Modal */}
      <ChartLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        imageUrl={lightboxData?.url}
        title={lightboxData?.title}
      />

      {/* Header & Filter Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Symbol, Strategy, #Tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#151921] text-xs sm:text-sm text-white pl-9 pr-8 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & CSV Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Asset Class Filter */}
          <select
            value={filters.asset_class || ''}
            onChange={(e) => handleFilterChange('asset_class', e.target.value)}
            className="bg-[#151921] text-xs sm:text-sm text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#161B29] text-white font-medium py-2">All Asset Classes</option>
            <option value="CRYPTO" className="bg-[#161B29] text-white font-medium py-2">Crypto</option>
            <option value="STOCKS" className="bg-[#161B29] text-white font-medium py-2">Stocks</option>
            <option value="FOREX" className="bg-[#161B29] text-white font-medium py-2">Forex</option>
            <option value="OPTIONS" className="bg-[#161B29] text-white font-medium py-2">Options</option>
            <option value="FUTURES" className="bg-[#161B29] text-white font-medium py-2">Futures</option>
          </select>

          {/* Trade Type Filter */}
          <select
            value={filters.trade_type || ''}
            onChange={(e) => handleFilterChange('trade_type', e.target.value)}
            className="bg-[#151921] text-xs sm:text-sm text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#161B29] text-white font-medium py-2">All Types</option>
            <option value="LONG" className="bg-[#161B29] text-white font-medium py-2">Long</option>
            <option value="SHORT" className="bg-[#161B29] text-white font-medium py-2">Short</option>
          </select>

          {/* Strategy Filter */}
          <select
            value={filters.strategy || ''}
            onChange={(e) => handleFilterChange('strategy', e.target.value)}
            className="bg-[#151921] text-xs sm:text-sm text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-medium max-w-[150px] truncate cursor-pointer"
          >
            <option value="" className="bg-[#161B29] text-white font-medium py-2">All Strategies</option>
            {strategies.map(s => (
              <option key={s.id} value={s.id} className="bg-[#161B29] text-white font-medium py-2">{s.name}</option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={filters.outcome || ''}
            onChange={(e) => handleFilterChange('outcome', e.target.value)}
            className="bg-[#151921] text-xs sm:text-sm text-slate-200 px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#161B29] text-white font-medium py-2">All Outcomes</option>
            <option value="WIN" className="bg-[#161B29] text-white font-medium py-2">Win</option>
            <option value="LOSS" className="bg-[#161B29] text-white font-medium py-2">Loss</option>
            <option value="BREAKEVEN" className="bg-[#161B29] text-white font-medium py-2">Breakeven</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-all flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
            title="Export Trade Log to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* CSV Import Button & Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-3 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/30 transition-all flex items-center gap-1 cursor-pointer"
            title="Import Trades from CSV Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>

        </div>

      </div>

      {/* Trade Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#151921]/90 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono border-b border-slate-800">
              <th className="py-2.5 px-2.5">Date & Time</th>
              <th className="py-2.5 px-2.5">Symbol</th>
              <th className="py-2.5 px-2 text-center">Type</th>
              <th className="py-2.5 px-2.5">Strategy & Setup Tags</th>
              <th className="py-2.5 px-2.5 text-right">Entry / Exit</th>
              <th className="py-2.5 px-2.5 text-right">Net PnL</th>
              <th className="py-2.5 px-2 text-center">RRR</th>
              <th className="py-2.5 px-2 text-center">Mindset & Rating</th>
              <th className="py-2.5 px-2.5 text-right sticky right-0 bg-[#151921] z-10 border-l border-slate-800/80 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
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
                  <tr key={t.id} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* Date */}
                    <td className="py-2.5 px-2.5 font-mono text-slate-300 whitespace-nowrap text-xs font-medium">
                      {dateStr}
                    </td>

                    {/* Symbol, Asset Class & Session */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 max-w-full">
                        <span className="font-bold text-white font-mono shrink-0 text-xs sm:text-sm">{t.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono shrink-0 border border-slate-700/60 font-semibold">
                          {t.asset_class}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono shrink-0 border border-blue-500/20 font-semibold">
                          {t.session === 'NEW_YORK' ? 'NY' : t.session === 'LONDON' ? 'London' : t.session === 'ASIAN' ? 'Asian' : 'NY'}
                        </span>
                      </div>
                    </td>

                    {/* Trade Type */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        isLong 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {isLong ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {t.trade_type}
                      </span>
                    </td>

                    {/* Strategy & Setup Tags */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-200 text-xs font-medium">
                      <div>{t.strategy_name || <span className="text-slate-500 italic">None</span>}</div>
                      {t.tags && (
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          {t.tags.split(',').map((rawTag, idx) => {
                            const trimmed = rawTag.trim();
                            if (!trimmed) return null;
                            const formatted = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
                            return (
                              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20 font-medium">
                                {formatted}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    {/* Entry / Exit Prices */}
                    <td className="py-2.5 px-2.5 text-right font-mono whitespace-nowrap text-xs">
                      <div className="text-slate-100 font-semibold">${Number(t.entry_price).toLocaleString()}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Exit: {t.exit_price ? `$${Number(t.exit_price).toLocaleString()}` : 'OPEN'}
                      </div>
                    </td>

                    {/* Net PnL */}
                    <td className="py-2.5 px-2.5 text-right font-mono whitespace-nowrap text-xs">
                      <div className={`font-bold ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-400'}`}>
                        {isWin ? '+' : ''}${Number(t.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {t.return_percentage ? `${Number(t.return_percentage).toFixed(2)}%` : '0%'}
                      </div>
                    </td>

                    {/* RRR */}
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-blue-300 whitespace-nowrap text-xs">
                      1:{t.risk_reward_ratio}
                    </td>

                    {/* Mindset & Rating Combined */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getEmotionBadge(t.emotion)}`}>
                          {t.emotion}
                        </span>
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
                      </div>
                    </td>

                    {/* Actions (with Chart Lightbox Trigger) */}
                    <td className="py-2.5 px-2.5 text-right whitespace-nowrap sticky right-0 bg-[#151921] group-hover:bg-[#1a202c] z-10 border-l border-slate-800/80 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.5)] transition-colors">
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
                <td colSpan="11" className="py-12 text-center text-slate-400 text-sm font-medium">
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
