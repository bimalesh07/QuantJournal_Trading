import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  Scale, 
  Scissors, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Tag, 
  Clock, 
  FileText, 
  Layers,
  Activity,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { 
  DEFAULT_CONFLUENCES, 
  RULE_ADHERENCE_OPTIONS, 
  ASSET_CLASS_OPTIONS, 
  TIMEFRAME_OPTIONS, 
  SESSION_OPTIONS,
  calculatePlannedRRR,
  calculateRealizedR
} from '../utils/backtestUtils';
import RichNoteEditor from './RichNoteEditor';

export default function BacktestFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  strategies = [],
  theme = 'dark'
}) {
  const [formData, setFormData] = useState({
    strategy: '',
    symbol: 'Nifty 50',
    asset_class: 'Indian F&O (NSE)',
    timeframe: '5m',
    session: 'NSE Normal Hours (09:15-15:30)',
    timestamp: new Date().toISOString().slice(0, 16),
    direction: 'LONG',
    entry_price: '',
    stop_loss: '',
    take_profit: '',
    exit_price: '',
    outcome_type: 'FULL_TP',
    custom_realized_r: '',
    confluences: ['#HTF_Trend', '#FairValueGap'],
    rule_adherence: '100% Flawless',
    mae_r: '-0.2',
    mfe_r: '+3.0',
    chart_before_url: '',
    chart_after_url: '',
    notes: '',
  });

  const [customTagInput, setCustomTagInput] = useState('');

  // Default strategy suggestions
  const strategyOptions = useMemo(() => {
    const defaultStrats = ['Breakout & Retest', 'ICT Silver Bullet', 'Trend Pullback', 'FVG Scalp'];
    const userStrats = (strategies || []).map(s => typeof s === 'object' ? s.name : s);
    const combined = Array.from(new Set([...defaultStrats, ...userStrats]));
    return combined;
  }, [strategies]);

  // Load editing or reset on open
  useEffect(() => {
    if (initialData) {
      setFormData({
        strategy: initialData.strategy || strategyOptions[0] || 'Breakout & Retest',
        symbol: initialData.symbol || 'Nifty 50',
        asset_class: initialData.asset_class || 'Indian F&O (NSE)',
        timeframe: initialData.timeframe || '5m',
        session: initialData.session || 'NSE Normal Hours (09:15-15:30)',
        timestamp: initialData.timestamp ? new Date(initialData.timestamp).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        direction: initialData.direction || 'LONG',
        entry_price: initialData.entry_price || '',
        stop_loss: initialData.stop_loss || '',
        take_profit: initialData.take_profit || '',
        exit_price: initialData.exit_price || '',
        outcome_type: initialData.outcome_type || 'FULL_TP',
        custom_realized_r: initialData.realized_r || '',
        confluences: initialData.confluences || ['#HTF_Trend', '#FairValueGap'],
        rule_adherence: initialData.rule_adherence || '100% Flawless',
        mae_r: initialData.mae_r || 0,
        mfe_r: initialData.mfe_r || 0,
        chart_before_url: initialData.chart_before_url || '',
        chart_after_url: initialData.chart_after_url || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        strategy: strategyOptions[0] || 'Breakout & Retest',
        symbol: 'Nifty 50',
        asset_class: 'Indian F&O (NSE)',
        timeframe: '5m',
        session: 'NSE Normal Hours (09:15-15:30)',
        timestamp: new Date().toISOString().slice(0, 16),
        direction: 'LONG',
        entry_price: '24500.00',
        stop_loss: '24460.00',
        take_profit: '24620.00',
        exit_price: '24620.00',
        outcome_type: 'FULL_TP',
        custom_realized_r: '',
        confluences: ['#HTF_Trend', '#FairValueGap'],
        rule_adherence: '100% Flawless',
        mae_r: '-0.2',
        mfe_r: '+3.0',
        chart_before_url: '',
        chart_after_url: '',
        notes: '',
      });
    }
  }, [initialData, isOpen, strategyOptions]);

  // Real-time calculated Planned RRR
  const plannedRRR = useMemo(() => {
    return calculatePlannedRRR(
      formData.entry_price,
      formData.stop_loss,
      formData.take_profit,
      formData.direction
    );
  }, [formData.entry_price, formData.stop_loss, formData.take_profit, formData.direction]);

  // Real-time calculated Realized R
  const calculatedRealizedR = useMemo(() => {
    if (formData.outcome_type === 'PARTIAL' && formData.custom_realized_r !== '') {
      return parseFloat(formData.custom_realized_r) || 0;
    }
    return calculateRealizedR(
      formData.outcome_type,
      plannedRRR,
      formData.entry_price,
      formData.stop_loss,
      formData.exit_price,
      formData.direction
    );
  }, [formData.outcome_type, formData.custom_realized_r, plannedRRR, formData.entry_price, formData.stop_loss, formData.exit_price, formData.direction]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleToggleTag = (tag) => {
    setFormData(prev => {
      const exists = prev.confluences.includes(tag);
      if (exists) {
        return { ...prev, confluences: prev.confluences.filter(t => t !== tag) };
      } else {
        return { ...prev, confluences: [...prev.confluences, tag] };
      }
    });
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (!customTagInput.trim()) return;
    const tag = customTagInput.startsWith('#') ? customTagInput.trim() : `#${customTagInput.trim()}`;
    if (!formData.confluences.includes(tag)) {
      setFormData(prev => ({ ...prev, confluences: [...prev.confluences, tag] }));
    }
    setCustomTagInput('');
  };

  const handleFileUpload = (e, targetField) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(targetField, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: initialData?.id || `bt-${Date.now()}`,
      planned_rrr: plannedRRR,
      realized_r: calculatedRealizedR,
      entry_price: parseFloat(formData.entry_price) || 0,
      stop_loss: parseFloat(formData.stop_loss) || 0,
      take_profit: parseFloat(formData.take_profit) || 0,
      exit_price: parseFloat(formData.exit_price) || parseFloat(formData.entry_price) || 0,
      mae_r: parseFloat(formData.mae_r) || 0,
      mfe_r: parseFloat(formData.mfe_r) || 0,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090D16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B101D]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[1px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#070A12] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-mono tracking-wide text-white flex items-center gap-2">
                <span>{initialData ? 'Edit Historical Backtest' : '+ Log Fast Backtest Setup'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40 uppercase">
                  Quantitative Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Log historical setup metadata, R-Multiple math, confluences & chart proof.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: SETUP METADATA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                1. Setup Identification & Metadata
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Strategy Model */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Strategy Model <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.strategy}
                  onChange={(e) => handleChange('strategy', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                >
                  {strategyOptions.map((strat) => (
                    <option key={strat} value={strat}>{strat}</option>
                  ))}
                </select>
              </div>

              {/* Symbol / Asset */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Asset / Symbol <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => handleChange('symbol', e.target.value)}
                  placeholder="e.g. Nifty 50, BTC/USD, Gold"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>

              {/* Asset Class */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Asset Class
                </label>
                <select
                  value={formData.asset_class}
                  onChange={(e) => handleChange('asset_class', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {ASSET_CLASS_OPTIONS.map((ac) => (
                    <option key={ac} value={ac}>{ac}</option>
                  ))}
                </select>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Timeframe
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => handleChange('timeframe', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {TIMEFRAME_OPTIONS.map((tf) => (
                    <option key={tf} value={tf}>{tf}</option>
                  ))}
                </select>
              </div>

              {/* Session */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Trading Session
                </label>
                <select
                  value={formData.session}
                  onChange={(e) => handleChange('session', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  {SESSION_OPTIONS.map((sess) => (
                    <option key={sess} value={sess}>{sess}</option>
                  ))}
                </select>
              </div>

              {/* Timestamp */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Historical Timestamp
                </label>
                <input
                  type="datetime-local"
                  value={formData.timestamp}
                  onChange={(e) => handleChange('timestamp', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>


          {/* SECTION 2: PRICE & R-MULTIPLE ENGINE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                2. Price & R-Multiple Calculation Engine
              </h3>

              <div className="flex items-center gap-2">
                {/* Direction Toggle */}
                <button
                  type="button"
                  onClick={() => handleChange('direction', 'LONG')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    formData.direction === 'LONG'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-[#0F1523] text-slate-400 border border-white/10'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  LONG
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('direction', 'SHORT')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    formData.direction === 'SHORT'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-[#0F1523] text-slate-400 border border-white/10'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  SHORT
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Entry Price */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Entry Price <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.entry_price}
                  onChange={(e) => handleChange('entry_price', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Stop Loss (SL) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.stop_loss}
                  onChange={(e) => handleChange('stop_loss', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-400 transition-colors"
                  required
                />
              </div>

              {/* Planned Target */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Planned Target (TP) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.take_profit}
                  onChange={(e) => handleChange('take_profit', e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Planned RRR Live Display */}
            <div className="p-3 rounded-xl bg-[#0B1324] border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300">Auto-Calculated Planned R:R Ratio:</span>
              </div>
              <span className="text-sm font-mono font-black text-cyan-300">
                1 : {plannedRRR} R
              </span>
            </div>

            {/* Outcome Quick Selector Buttons */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-2">
                Historical Trade Outcome Quick Selector:
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Full TP Hit */}
                <button
                  type="button"
                  onClick={() => handleChange('outcome_type', 'FULL_TP')}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    formData.outcome_type === 'FULL_TP'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                      : 'bg-[#0F1523] border-white/10 text-slate-400 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>🎯 Full TP Hit</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">+{plannedRRR} R</span>
                </button>

                {/* 2. Stop Loss Hit */}
                <button
                  type="button"
                  onClick={() => handleChange('outcome_type', 'STOP_LOSS')}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    formData.outcome_type === 'STOP_LOSS'
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-md shadow-rose-500/20'
                      : 'bg-[#0F1523] border-white/10 text-slate-400 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center gap-1 text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>🛑 Stop Loss Hit</span>
                  </div>
                  <span className="text-[10px] text-rose-300 font-mono">-1.0 R</span>
                </button>

                {/* 3. Breakeven */}
                <button
                  type="button"
                  onClick={() => handleChange('outcome_type', 'BREAKEVEN')}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    formData.outcome_type === 'BREAKEVEN'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
                      : 'bg-[#0F1523] border-white/10 text-slate-400 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    <Scale className="w-3.5 h-3.5" />
                    <span>⚖️ Breakeven</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono">0.0 R</span>
                </button>

                {/* 4. Partial / Custom Exit */}
                <button
                  type="button"
                  onClick={() => handleChange('outcome_type', 'PARTIAL')}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    formData.outcome_type === 'PARTIAL'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md shadow-purple-500/20'
                      : 'bg-[#0F1523] border-white/10 text-slate-400 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-center gap-1 text-purple-400">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>✂️ Custom Exit</span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">Custom Realized R</span>
                </button>
              </div>
            </div>

            {/* Custom Exit / Partial Price Inputs */}
            {formData.outcome_type === 'PARTIAL' && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-mono text-purple-200 mb-1">
                    Custom Exit Price:
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.exit_price}
                    onChange={(e) => handleChange('exit_price', e.target.value)}
                    placeholder="Actual exit price"
                    className="w-full bg-[#0F1523] border border-purple-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-purple-200 mb-1">
                    Direct Custom Realized R (Optional):
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.custom_realized_r}
                    onChange={(e) => handleChange('custom_realized_r', e.target.value)}
                    placeholder="e.g. +1.75"
                    className="w-full bg-[#0F1523] border border-purple-500/40 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Realized R Result Badge */}
            <div className="p-3 rounded-xl bg-[#090F1E] border border-white/15 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">Final Realized R-Multiple to Log:</span>
              <span className={`text-base font-mono font-black ${
                calculatedRealizedR > 0 ? 'text-emerald-400' : calculatedRealizedR < 0 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {calculatedRealizedR > 0 ? `+${calculatedRealizedR}` : calculatedRealizedR} R
              </span>
            </div>
          </div>


          {/* SECTION 3: INSTITUTIONAL QUANT EDGE INPUTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                3. Confluences, Rule Adherence & MAE/MFE
              </h3>
            </div>

            {/* Confluences Checklist Tags */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                Technical Confluences Checklist (Multi-select):
              </label>
              
              <div className="flex flex-wrap gap-1.5 mb-2">
                {DEFAULT_CONFLUENCES.map((tag) => {
                  const isSelected = formData.confluences.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400 font-bold'
                          : 'bg-[#0F1523] text-slate-400 border border-white/10 hover:border-amber-500/40'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tag */}
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder="Add custom tag (e.g. #SessionHigh)"
                  className="flex-1 bg-[#0F1523] border border-white/15 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-mono font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>
            </div>

            {/* Rule Adherence & MAE/MFE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Rule Adherence */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Rule Adherence Rating
                </label>
                <select
                  value={formData.rule_adherence}
                  onChange={(e) => handleChange('rule_adherence', e.target.value)}
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  {RULE_ADHERENCE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* MAE Tracking */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1" title="Maximum Adverse Excursion (deepest drawdown during trade in R)">
                  MAE (Max Adverse Excursion R)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.mae_r}
                  onChange={(e) => handleChange('mae_r', e.target.value)}
                  placeholder="e.g. -0.3"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-rose-300 focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* MFE Tracking */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1" title="Maximum Favorable Excursion (highest peak before exit in R)">
                  MFE (Max Favorable Excursion R)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.mfe_r}
                  onChange={(e) => handleChange('mfe_r', e.target.value)}
                  placeholder="e.g. +3.2"
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>


          {/* SECTION 4: CHART PROOFS & REVIEW NOTES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                4. Chart Screenshots & Quantitative Review Notes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before Entry Chart Screenshot */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-cyan-400" />
                  Before-Entry Chart Proof URL / Upload:
                </label>
                <input
                  type="text"
                  value={formData.chart_before_url}
                  onChange={(e) => handleChange('chart_before_url', e.target.value)}
                  placeholder="Paste TradingView Image Link or URL..."
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'chart_before_url')}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.chart_before_url && (
                  <div className="mt-1 h-24 rounded-xl border border-white/10 overflow-hidden bg-black/40">
                    <img src={formData.chart_before_url} alt="Before Entry Chart" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* After Exit Chart Screenshot */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-emerald-400" />
                  After-Exit Chart Proof URL / Upload:
                </label>
                <input
                  type="text"
                  value={formData.chart_after_url}
                  onChange={(e) => handleChange('chart_after_url', e.target.value)}
                  placeholder="Paste TradingView Image Link or URL..."
                  className="w-full bg-[#0F1523] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'chart_after_url')}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.chart_after_url && (
                  <div className="mt-1 h-24 rounded-xl border border-white/10 overflow-hidden bg-black/40">
                    <img src={formData.chart_after_url} alt="After Exit Chart" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Quantitative Review & Secret Notes (Rich Editor) */}
            <div className="pt-2">
              <RichNoteEditor
                label="Quantitative Review & Key Setup Lessons (Rich Formatting & Highlights)"
                placeholder="Log key secret lessons, market behavior during trade execution, pattern observations, and highlight key words..."
                rows={4}
                value={formData.notes || ''}
                onChange={(val) => handleChange('notes', val)}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{initialData ? 'Update Backtest Trade' : 'Save Backtest Record'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
