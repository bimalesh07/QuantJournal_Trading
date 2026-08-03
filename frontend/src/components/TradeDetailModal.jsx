import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Star, Image as ImageIcon, Calendar, Target, DollarSign, Brain, Layers, Maximize2 } from 'lucide-react';

export default function TradeDetailModal({ trade, isOpen, onClose }) {
  if (!isOpen || !trade) return null;

  const [activeChartTab, setActiveChartTab] = useState('entry'); // 'entry' or 'exit'
  const [isFullscreenImage, setIsFullscreenImage] = useState(null);

  const isLong = trade.trade_type === 'LONG';
  const isWin = trade.net_pnl > 0;
  const isLoss = trade.net_pnl < 0;

  const getMediaUrl = (urlStr) => {
    if (!urlStr) return null;
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) return urlStr;
    return `http://localhost:8000${urlStr}`;
  };

  const entryImgUrl = getMediaUrl(trade.chart_entry);
  const exitImgUrl = getMediaUrl(trade.chart_exit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="card-dark w-full max-w-4xl border border-slate-700/80 my-8 shadow-2xl overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-[#151921] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isLong ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-mono text-white">{trade.symbol}</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isLong ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {trade.trade_type}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {trade.asset_class}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(trade.entry_time).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* PnL Display */}
            <div className="text-right font-mono">
              <div className={`text-xl font-extrabold ${isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-300'}`}>
                {isWin ? '+' : ''}${Number(trade.net_pnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-400">
                Return: {Number(trade.return_percentage).toFixed(2)}%
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Retrospective Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Key Parameters Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#151921] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Entry Price</span>
              <div className="text-sm font-bold text-white mt-1">${Number(trade.entry_price).toLocaleString()}</div>
            </div>

            <div className="bg-[#151921] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Exit Price</span>
              <div className="text-sm font-bold text-white mt-1">
                {trade.exit_price ? `$${Number(trade.exit_price).toLocaleString()}` : 'OPEN'}
              </div>
            </div>

            <div className="bg-[#151921] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Stop Loss / TP</span>
              <div className="text-xs font-bold text-slate-300 mt-1">
                SL: {trade.stop_loss ? `$${Number(trade.stop_loss).toLocaleString()}` : 'N/A'}
              </div>
              <div className="text-[10px] text-emerald-400">
                TP: {trade.take_profit ? `$${Number(trade.take_profit).toLocaleString()}` : 'N/A'}
              </div>
            </div>

            <div className="bg-[#151921] p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Risk : Reward</span>
              <div className="text-sm font-bold text-blue-300 mt-1">1:{trade.risk_reward_ratio}</div>
            </div>
          </div>

          {/* Strategy, Emotion & Rating Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#151921]/60 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Strategy:</span>
              <span className="text-xs font-bold text-purple-300">{trade.strategy_name || 'Unassigned'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Emotion:</span>
              <span className="text-xs font-bold text-amber-300">{trade.emotion}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rating:</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < trade.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Setup Logic & Notes */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Trade Logic & Notes</h4>
            <div className="bg-[#151921] p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
              {trade.notes || 'No setup logic or retrospective notes recorded for this trade.'}
            </div>
          </div>

          {/* Chart Screenshots Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Chart Screenshots</h4>
              </div>
              <div className="flex items-center gap-1 bg-[#151921] p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveChartTab('entry')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    activeChartTab === 'entry' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Entry Chart
                </button>
                <button
                  onClick={() => setActiveChartTab('exit')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    activeChartTab === 'exit' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exit Chart
                </button>
              </div>
            </div>

            {/* Display Active Chart */}
            <div className="relative bg-[#151921] p-4 rounded-xl border border-slate-800 min-h-48 flex items-center justify-center">
              {activeChartTab === 'entry' ? (
                entryImgUrl ? (
                  <div className="relative group w-full">
                    <img
                      src={entryImgUrl}
                      alt="Entry Chart Screenshot"
                      className="max-h-96 w-auto mx-auto rounded-lg object-contain cursor-pointer"
                      onClick={() => setIsFullscreenImage(entryImgUrl)}
                    />
                    <button
                      onClick={() => setIsFullscreenImage(entryImgUrl)}
                      className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Expand Image"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">No entry chart screenshot uploaded.</div>
                )
              ) : (
                exitImgUrl ? (
                  <div className="relative group w-full">
                    <img
                      src={exitImgUrl}
                      alt="Exit Chart Screenshot"
                      className="max-h-96 w-auto mx-auto rounded-lg object-contain cursor-pointer"
                      onClick={() => setIsFullscreenImage(exitImgUrl)}
                    />
                    <button
                      onClick={() => setIsFullscreenImage(exitImgUrl)}
                      className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Expand Image"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">No exit chart screenshot uploaded.</div>
                )
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Image Lightbox Overlay */}
      {isFullscreenImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsFullscreenImage(null)}
        >
          <img src={isFullscreenImage} alt="Fullscreen Chart" className="max-w-full max-h-full rounded-lg" />
          <button className="absolute top-4 right-4 text-white bg-slate-800 p-2 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
}
