import React, { useState } from 'react';
import { 
  X, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Tag, 
  FileText, 
  Activity, 
  Maximize2, 
  ShieldCheck, 
  Check, 
  Layers 
} from 'lucide-react';
import FormattedTextDisplay from './FormattedTextDisplay';

export default function BacktestDetailModal({ isOpen, onClose, trade }) {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  if (!isOpen || !trade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090D16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B101D]">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-xl text-xs font-mono font-black flex items-center gap-1.5 ${
              trade.direction === 'LONG'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {trade.direction === 'LONG' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trade.direction}</span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black font-mono tracking-wide text-white flex items-center gap-2">
                <span>{trade.symbol}</span>
                <span className="text-xs text-slate-400 font-mono font-normal">({trade.strategy})</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>{trade.asset_class}</span>
                <span>•</span>
                <span>{trade.timeframe}</span>
                <span>•</span>
                <span>{trade.session}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Realized R Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-sm font-mono font-black ${
              trade.realized_r > 0
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                : trade.realized_r < 0
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
            }`}>
              {trade.realized_r > 0 ? `+${trade.realized_r}` : trade.realized_r} R
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#0F1523] border border-white/10 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Entry Price</span>
              <span className="text-sm font-bold text-white">{trade.entry_price}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0F1523] border border-white/10 font-mono">
              <span className="text-[10px] text-rose-400 block uppercase">Stop Loss</span>
              <span className="text-sm font-bold text-rose-300">{trade.stop_loss}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0F1523] border border-white/10 font-mono">
              <span className="text-[10px] text-emerald-400 block uppercase">Planned Target</span>
              <span className="text-sm font-bold text-emerald-300">{trade.take_profit}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0F1523] border border-cyan-500/30 font-mono">
              <span className="text-[10px] text-cyan-400 block uppercase">Planned RRR</span>
              <span className="text-sm font-bold text-cyan-300">1 : {trade.planned_rrr} R</span>
            </div>
          </div>

          {/* Institutional Edge & MAE / MFE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0B101D] border border-white/10 space-y-2">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                Confluences & Rule Adherence
              </h3>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {(trade.confluences || []).map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-white/5">
                <span className="text-slate-400">Execution Quality:</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {trade.rule_adherence}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B101D] border border-white/10 space-y-2 font-mono">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Excursion Metrics (MAE / MFE)
              </h3>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-[#070A12] border border-rose-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Max Adverse (MAE)</span>
                  <span className="text-xs font-bold text-rose-400">{trade.mae_r ? `${trade.mae_r} R` : 'N/A'}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#070A12] border border-emerald-500/20 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">Max Favorable (MFE)</span>
                  <span className="text-xs font-bold text-emerald-400">{trade.mfe_r ? `${trade.mfe_r} R` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Screenshots Side-by-Side Lightbox */}
          {(trade.chart_before_url || trade.chart_after_url) && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Historical Chart Proofs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before Entry Chart */}
                {trade.chart_before_url && (
                  <div className="relative group rounded-xl border border-white/15 overflow-hidden bg-black/60 aspect-video">
                    <img src={trade.chart_before_url} alt="Before Entry" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex items-center justify-between text-xs font-mono text-white">
                      <span>Before Entry Chart</span>
                      <button
                        onClick={() => setFullscreenImage(trade.chart_before_url)}
                        className="p-1 rounded bg-white/20 hover:bg-white/40 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* After Exit Chart */}
                {trade.chart_after_url && (
                  <div className="relative group rounded-xl border border-white/15 overflow-hidden bg-black/60 aspect-video">
                    <img src={trade.chart_after_url} alt="After Exit" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex items-center justify-between text-xs font-mono text-white">
                      <span>After Exit Chart</span>
                      <button
                        onClick={() => setFullscreenImage(trade.chart_after_url)}
                        className="p-1 rounded bg-white/20 hover:bg-white/40 cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantitative Review & Notes */}
          {trade.notes && (
            <div className="space-y-2 p-4 rounded-xl bg-[#0B101D] border border-white/10">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                Quantitative Retrospective Review & Secret Notes
              </h3>
              <div className="text-xs font-mono text-slate-300 leading-relaxed pt-1">
                <FormattedTextDisplay text={trade.notes} />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreenImage(null)}>
          <button className="absolute top-4 right-4 p-2 text-white bg-white/10 rounded-full cursor-pointer">
            <X className="w-6 h-6" />
          </button>
          <img src={fullscreenImage} alt="Fullscreen Chart" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}
