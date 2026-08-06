import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Star, Image as ImageIcon, Calendar, Target, DollarSign, Brain, Layers, Maximize2, Tag } from 'lucide-react';
import ChartLightboxModal from './ChartLightboxModal';
import { getMediaUrl } from '../services/api';

export default function TradeDetailModal({ trade, isOpen, onClose }) {
  if (!isOpen || !trade) return null;

  const [activeChartTab, setActiveChartTab] = useState('entry'); // 'entry' or 'exit'
  const [lightboxData, setLightboxData] = useState(null);

  const isLong = trade.trade_type === 'LONG';
  const isWin = trade.net_pnl > 0;
  const isLoss = trade.net_pnl < 0;

  const entryImgUrl = getMediaUrl(trade.chart_entry);
  const exitImgUrl = getMediaUrl(trade.chart_exit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      {/* Lightbox Zoom Modal */}
      <ChartLightboxModal
        isOpen={!!lightboxData}
        onClose={() => setLightboxData(null)}
        imageUrl={lightboxData?.url}
        title={lightboxData?.title}
      />

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
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-mono font-semibold">
                  {trade.session === 'NEW_YORK' ? 'New York Session' : trade.session === 'LONDON' ? 'London Session' : trade.session === 'ASIAN' ? 'Asian Session' : 'New York Session'}
                </span>
              </div>
              
              {/* Tags Badges */}
              {trade.tags && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {trade.tags.split(',').map((tagStr, idx) => {
                    const trimmed = tagStr.trim();
                    if (!trimmed) return null;
                    const tag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
                    return (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 font-mono border border-purple-500/30 flex items-center gap-1 font-medium">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        {tag}
                      </span>
                    );
                  })}
                </div>
              )}

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
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#151921] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Entry Price</span>
              <span className="text-base font-bold font-mono text-slate-200 mt-1 block">${Number(trade.entry_price).toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151921] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Exit Price</span>
              <span className="text-base font-bold font-mono text-slate-200 mt-1 block">
                {trade.exit_price ? `$${Number(trade.exit_price).toLocaleString()}` : 'OPEN'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#151921] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Risk : Reward</span>
              <span className="text-base font-bold font-mono text-blue-400 mt-1 block">1:{trade.risk_reward_ratio}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#151921] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mindset / Rating</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-400 font-mono">{trade.emotion}</span>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-xs font-bold ml-1">{trade.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy & Retrospective Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Strategy Execution & Logic Notes
              </h4>
              <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                {trade.strategy_name || 'No Strategy Selected'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#151921] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {trade.notes || 'No setup notes or retrospective recorded for this trade.'}
            </div>
          </div>

          {/* Chart Screenshots Tabbed Container */}
          {(entryImgUrl || exitImgUrl) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">Chart Screenshots (Click to Zoom)</h4>
                </div>
                <div className="flex items-center gap-1 bg-[#151921] p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveChartTab('entry')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      activeChartTab === 'entry' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Entry Chart
                  </button>
                  <button
                    onClick={() => setActiveChartTab('exit')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
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
                    <div className="relative group w-full text-center">
                      <img
                        src={entryImgUrl}
                        alt="Entry Chart Screenshot"
                        className="max-h-96 w-auto mx-auto rounded-lg object-contain cursor-pointer transition-transform group-hover:scale-[1.01]"
                        onClick={() => setLightboxData({ url: entryImgUrl, title: `${trade.symbol} Entry Execution Chart` })}
                      />
                      <button
                        onClick={() => setLightboxData({ url: entryImgUrl, title: `${trade.symbol} Entry Execution Chart` })}
                        className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                        <span>Zoom Lightbox</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No Entry Chart Uploaded</span>
                  )
                ) : (
                  exitImgUrl ? (
                    <div className="relative group w-full text-center">
                      <img
                        src={exitImgUrl}
                        alt="Exit Chart Screenshot"
                        className="max-h-96 w-auto mx-auto rounded-lg object-contain cursor-pointer transition-transform group-hover:scale-[1.01]"
                        onClick={() => setLightboxData({ url: exitImgUrl, title: `${trade.symbol} Exit Execution Chart` })}
                      />
                      <button
                        onClick={() => setLightboxData({ url: exitImgUrl, title: `${trade.symbol} Exit Execution Chart` })}
                        className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <Maximize2 className="w-4 h-4 text-emerald-400" />
                        <span>Zoom Lightbox</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">No Exit Chart Uploaded</span>
                  )
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
