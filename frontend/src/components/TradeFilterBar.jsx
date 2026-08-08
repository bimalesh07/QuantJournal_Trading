import React, { useRef } from 'react';
import { Search, X, Download, Upload } from 'lucide-react';
import TimeframeDropdown from './TimeframeDropdown';

export default function TradeFilterBar({
  filters = {},
  setFilters,
  onResetFilters,
  strategies = [],
  trades = [],
  onImportTrades,
  // Timeframe props (optional)
  activeTimeframe,
  onTimeframeChange,
  evaluatedTradeCount,
  showTimeframe = true,
  className = ''
}) {
  const fileInputRef = useRef(null);

  const handleFilterChange = (key, value) => {
    if (setFilters) {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
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
              result.push(cur.trim());
              cur = '';
            } else {
              cur += char;
            }
          }
          result.push(cur.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const importedTrades = [];

        for (let i = 1; i < lines.length; i++) {
          const vals = parseCSVLine(lines[i]);
          if (vals.length < 2) continue;

          const getVal = (colNames) => {
            for (const c of colNames) {
              const idx = headers.findIndex(h => h.includes(c));
              if (idx !== -1 && vals[idx] !== undefined) return vals[idx];
            }
            return '';
          };

          const symbol = getVal(['symbol', 'ticker', 'pair', 'asset']);
          if (!symbol) continue;

          const tradeType = (getVal(['type', 'side', 'dir']) || 'LONG').toUpperCase();
          const assetClass = (getVal(['assetclass', 'market', 'category']) || 'CRYPTO').toUpperCase();
          const entryPrice = parseFloat(getVal(['entryprice', 'entry', 'buyprice'])) || 0;
          const exitPrice = parseFloat(getVal(['exitprice', 'exit', 'sellprice'])) || 0;
          const netPnl = parseFloat(getVal(['netpnl', 'pnl', 'profit', 'realizedpnl'])) || 0;
          const rrr = parseFloat(getVal(['rrr', 'riskreward', 'ratio'])) || 1;
          const emotion = (getVal(['mindset', 'emotion', 'rating']) || 'DISCIPLINED').toUpperCase();

          importedTrades.push({
            symbol,
            trade_type: tradeType.includes('SHORT') ? 'SHORT' : 'LONG',
            asset_class: ['CRYPTO','STOCKS','FOREX','OPTIONS','FUTURES'].includes(assetClass) ? assetClass : 'CRYPTO',
            entry_price: entryPrice,
            exit_price: exitPrice,
            net_pnl: netPnl,
            risk_reward_ratio: rrr,
            emotion: ['DISCIPLINED','PATIENT','FOMO','REVENGE','FEARFUL','GREEDY'].includes(emotion) ? emotion : 'DISCIPLINED',
            notes: getVal(['notes', 'tags', 'strategy']) || 'Imported via CSV backup'
          });
        }

        if (importedTrades.length > 0 && onImportTrades) {
          await onImportTrades(importedTrades);
        } else if (importedTrades.length === 0) {
          alert('No valid trade rows detected in CSV file.');
        }
      } catch (err) {
        console.error('Error parsing CSV file:', err);
        alert('Failed to parse CSV file. Please check file formatting.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className={`bg-[#121622]/90 p-4 rounded-2xl border border-slate-800/90 shadow-xl backdrop-blur-xl space-y-3 font-sans ${className}`}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search symbol, notes, market..."
            value={filters.symbol || ''}
            onChange={(e) => handleFilterChange('symbol', e.target.value)}
            className="w-full bg-[#161F2E] text-xs sm:text-sm text-slate-100 pl-10 pr-8 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-slate-500"
          />
          {filters.symbol && (
            <button 
              onClick={() => handleFilterChange('symbol', '')} 
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters & Actions Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Asset Class Filter */}
          <select
            value={filters.asset_class || ''}
            onChange={(e) => handleFilterChange('asset_class', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none font-medium cursor-pointer"
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
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Types</option>
            <option value="LONG" className="bg-[#121622] text-white">🟢 Long</option>
            <option value="SHORT" className="bg-[#121622] text-white">🔴 Short</option>
          </select>

          {/* Strategy Filter */}
          <select
            value={filters.strategy || ''}
            onChange={(e) => handleFilterChange('strategy', e.target.value)}
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none font-medium max-w-[140px] truncate cursor-pointer"
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
            className="bg-[#161F2E] text-xs text-slate-200 px-3 py-2 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none font-medium cursor-pointer"
          >
            <option value="" className="bg-[#121622] text-white">All Outcomes</option>
            <option value="WIN" className="bg-[#121622] text-white">🟢 Win</option>
            <option value="LOSS" className="bg-[#121622] text-white">🔴 Loss</option>
            <option value="BREAKEVEN" className="bg-[#121622] text-white">⚪ Breakeven</option>
          </select>

          {/* Timeframe Dropdown (if enabled) */}
          {showTimeframe && activeTimeframe && onTimeframeChange && (
            <TimeframeDropdown
              activeTimeframe={activeTimeframe}
              onSelectTimeframe={onTimeframeChange}
              tradeCount={evaluatedTradeCount}
            />
          )}

          {/* Reset Filters Button */}
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/70 transition-all flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

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
            className="px-3 py-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Import Trades from CSV Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>
        </div>
      </div>
    </div>
  );
}
