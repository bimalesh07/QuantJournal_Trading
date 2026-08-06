import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Calculator, Image as ImageIcon, ShieldCheck, CheckSquare, Square, Check, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

export default function TradeFormModal({ isOpen, onClose, onSubmit, initialData = null, strategies = [] }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    symbol: '',
    trade_type: 'LONG',
    asset_class: 'CRYPTO',
    session: 'NEW_YORK',
    entry_price: '',
    exit_price: '',
    stop_loss: '',
    take_profit: '',
    quantity: '',
    fees: '0.00',
    status: 'CLOSED',
    strategy: '',
    emotion: 'DISCIPLINED',
    rating: 4,
    notes: '',
    tags: '',
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: new Date().toISOString().slice(0, 16),
  });

  const [checklist, setChecklist] = useState({
    maxRisk: true,
    htfAlignment: true,
    entryTrigger: true,
    noNews: true,
  });

  const [chartEntryFile, setChartEntryFile] = useState(null);
  const [chartExitFile, setChartExitFile] = useState(null);
  const [chartEntryPreview, setChartEntryPreview] = useState(null);
  const [chartExitPreview, setChartExitPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        symbol: initialData.symbol || '',
        trade_type: initialData.trade_type || 'LONG',
        asset_class: initialData.asset_class || 'CRYPTO',
        session: initialData.session || 'NEW_YORK',
        entry_price: initialData.entry_price || '',
        exit_price: initialData.exit_price || '',
        stop_loss: initialData.stop_loss || '',
        take_profit: initialData.take_profit || '',
        quantity: initialData.quantity || '',
        fees: initialData.fees || '0.00',
        status: initialData.status || 'CLOSED',
        strategy: initialData.strategy || '',
        emotion: initialData.emotion || 'DISCIPLINED',
        rating: initialData.rating || 4,
        notes: initialData.notes || '',
        tags: initialData.tags || '',
        entry_time: initialData.entry_time ? new Date(initialData.entry_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        exit_time: initialData.exit_time ? new Date(initialData.exit_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
      setChartEntryPreview(initialData.chart_entry || null);
      setChartExitPreview(initialData.chart_exit || null);
      setChecklist({
        maxRisk: true,
        htfAlignment: true,
        entryTrigger: true,
        noNews: true,
      });
    } else {
      setChecklist({
        maxRisk: true,
        htfAlignment: true,
        entryTrigger: true,
        noNews: true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChecklistToggle = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const handleEntryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChartEntryFile(file);
      setChartEntryPreview(URL.createObjectURL(file));
    }
  };

  const handleExitFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChartExitFile(file);
      setChartExitPreview(URL.createObjectURL(file));
    }
  };

  // Calculations
  const entry = parseFloat(formData.entry_price) || 0;
  const exit = parseFloat(formData.exit_price) || 0;
  const qty = parseFloat(formData.quantity) || 0;
  const sl = parseFloat(formData.stop_loss) || 0;
  const tp = parseFloat(formData.take_profit) || 0;
  const fee = parseFloat(formData.fees) || 0;

  let calcGrossPnL = 0;
  if (entry > 0 && exit > 0 && qty > 0) {
    calcGrossPnL = formData.trade_type === 'LONG' ? (exit - entry) * qty : (entry - exit) * qty;
  }
  const calcNetPnL = calcGrossPnL - fee;

  let calcRiskAmount = 0;
  let calcRewardAmount = 0;
  let calcRRR = '0.00';

  if (entry > 0 && sl > 0) {
    calcRiskAmount = Math.abs(entry - sl) * qty;
  }
  if (entry > 0 && tp > 0) {
    calcRewardAmount = Math.abs(tp - entry) * qty;
  }
  if (calcRiskAmount > 0 && calcRewardAmount > 0) {
    calcRRR = (calcRewardAmount / calcRiskAmount).toFixed(2);
  } else if (calcRiskAmount > 0 && exit > 0) {
    const actualReward = Math.abs(calcGrossPnL);
    calcRRR = (actualReward / calcRiskAmount).toFixed(2);
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    if (chartEntryFile) {
      data.append('chart_entry', chartEntryFile);
    }
    if (chartExitFile) {
      data.append('chart_exit', chartExitFile);
    }

    onSubmit(data, initialData ? initialData.id : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#10141D] w-full max-w-4xl border border-slate-800 my-4 shadow-2xl rounded-2xl overflow-hidden text-slate-100 font-sans">
        
        {/* Sleek Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141926]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Calculator className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                {initialData ? 'Edit Trade Record' : 'Log New Quantitative Trade'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">Quick, streamlined trade execution logging</p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="hidden sm:flex items-center gap-5 px-4 py-1.5 rounded-xl bg-[#0B0E14] border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-500">Net PnL: </span>
              <span className={`font-bold ${calcNetPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calcNetPnL >= 0 ? '+' : ''}${calcNetPnL.toFixed(2)}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500">Planned RRR: </span>
              <span className="font-bold text-sky-400">1:{calcRRR}</span>
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500">Risk: </span>
              <span className="font-bold text-amber-400">${calcRiskAmount.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">

          {/* SECTION 1: Core Identification & Side Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Symbol */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Symbol *</label>
              <input
                type="text"
                name="symbol"
                required
                placeholder="e.g. BTC/USDT, AAPL"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none transition-all font-mono font-medium"
              />
            </div>

            {/* Trade Type Toggle */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Direction *</label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#161B27] rounded-xl border border-slate-700/70">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, trade_type: 'LONG' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    formData.trade_type === 'LONG'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LONG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, trade_type: 'SHORT' }))}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    formData.trade_type === 'SHORT'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>SHORT</span>
                </button>
              </div>
            </div>

            {/* Asset Class */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Asset Class *</label>
              <select
                name="asset_class"
                value={formData.asset_class}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none transition-all font-medium cursor-pointer"
              >
                <option value="CRYPTO" className="bg-[#10141D] text-white">🪙 Crypto</option>
                <option value="STOCKS" className="bg-[#10141D] text-white">📈 Stocks</option>
                <option value="FOREX" className="bg-[#10141D] text-white">💱 Forex</option>
                <option value="OPTIONS" className="bg-[#10141D] text-white">📊 Options</option>
                <option value="FUTURES" className="bg-[#10141D] text-white">⚡ Futures</option>
              </select>
            </div>

            {/* Trading Session */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Trading Session *</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none transition-all font-medium cursor-pointer"
              >
                <option value="NEW_YORK" className="bg-[#10141D] text-white">🗽 New York Session</option>
                <option value="LONDON" className="bg-[#10141D] text-white">🏛️ London Session</option>
                <option value="ASIAN" className="bg-[#10141D] text-white">🌏 Asian Session</option>
              </select>
            </div>

          </div>

          {/* SECTION 2: Compact Pre-Trade Confluence Checklist Pills */}
          <div className="bg-[#141926] p-3.5 rounded-xl border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Pre-Trade Discipline Checklist</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                {checkedCount}/4 Confluences Confirmed
              </span>
            </div>

            {/* 4 Interactive Toggle Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              
              <button
                type="button"
                onClick={() => handleChecklistToggle('maxRisk')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                  checklist.maxRisk
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#181E2C] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Risk ≤ 2%</span>
                {checklist.maxRisk ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm"></div>}
              </button>

              <button
                type="button"
                onClick={() => handleChecklistToggle('htfAlignment')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                  checklist.htfAlignment
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#181E2C] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>HTF Trend Match</span>
                {checklist.htfAlignment ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm"></div>}
              </button>

              <button
                type="button"
                onClick={() => handleChecklistToggle('entryTrigger')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                  checklist.entryTrigger
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#181E2C] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>Setup Confirmed</span>
                {checklist.entryTrigger ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm"></div>}
              </button>

              <button
                type="button"
                onClick={() => handleChecklistToggle('noNews')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                  checklist.noNews
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-[#181E2C] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>No High News</span>
                {checklist.noNews ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <div className="w-3.5 h-3.5 border border-slate-600 rounded-sm"></div>}
              </button>

            </div>
          </div>

          {/* SECTION 3: Execution Prices & Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Entry Price *</label>
              <input
                type="number"
                step="any"
                name="entry_price"
                required
                placeholder="0.00"
                value={formData.entry_price}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Exit Price</label>
              <input
                type="number"
                step="any"
                name="exit_price"
                placeholder="0.00 (Open)"
                value={formData.exit_price}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1 font-mono">Stop Loss</label>
              <input
                type="number"
                step="any"
                name="stop_loss"
                placeholder="0.00"
                value={formData.stop_loss}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-rose-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 font-mono">Take Profit</label>
              <input
                type="number"
                step="any"
                name="take_profit"
                placeholder="0.00"
                value={formData.take_profit}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Size / Qty *</label>
              <input
                type="number"
                step="any"
                name="quantity"
                required
                placeholder="1.0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 font-mono">Fees</label>
              <input
                type="number"
                step="any"
                name="fees"
                placeholder="0.00"
                value={formData.fees}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

          </div>

          {/* SECTION 4: Strategy, Status, Emotion & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Status */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
              >
                <option value="CLOSED" className="bg-[#10141D] text-white">✅ CLOSED</option>
                <option value="OPEN" className="bg-[#10141D] text-white">⏳ OPEN</option>
              </select>
            </div>

            {/* Strategy Model */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Strategy Model</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
              >
                <option value="" className="bg-[#10141D] text-white">📌 No Strategy</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#10141D] text-white">⚡ {s.name}</option>
                ))}
              </select>
            </div>

            {/* Emotional Mindset */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Mindset</label>
              <select
                name="emotion"
                value={formData.emotion}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium cursor-pointer"
              >
                <option value="DISCIPLINED" className="bg-[#10141D] text-white">🎯 Disciplined</option>
                <option value="PATIENT" className="bg-[#10141D] text-white">🧘 Patient</option>
                <option value="FOMO" className="bg-[#10141D] text-white">🔥 FOMO (Chasing)</option>
                <option value="REVENGE" className="bg-[#10141D] text-white">⚡ Revenge Trading</option>
                <option value="FEARFUL" className="bg-[#10141D] text-white">😨 Fearful</option>
                <option value="GREEDY" className="bg-[#10141D] text-white">🤑 Greedy</option>
                <option value="IMPULSIVE" className="bg-[#10141D] text-white">💥 Impulsive</option>
              </select>
            </div>

            {/* Execution Rating */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Rating</label>
              <div className="flex items-center justify-around py-1.5 bg-[#161B27] px-3 rounded-xl border border-slate-700/70 h-[38px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION 5: Entry Time & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Entry Date & Time *</label>
              <input
                type="datetime-local"
                name="entry_time"
                required
                value={formData.entry_time}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm font-mono text-white px-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Setup Tags</label>
              <div className="relative">
                <input
                  type="text"
                  name="tags"
                  placeholder="#FVG, #LiquiditySweep, #Breakout"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-[#161B27] text-xs sm:text-sm text-white pl-8 pr-3 py-2 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium"
                />
                <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* SECTION 6: Notes & Chart Attachments (Compact Side-by-Side) */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Execution Logic & Review Notes</label>
              <textarea
                name="notes"
                rows="2"
                placeholder="Key setup thesis, entry confirmation trigger, and execution review..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/70 focus:border-emerald-400 focus:outline-none font-medium resize-y"
              />
            </div>

            {/* Screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Entry Chart */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Entry Chart Screenshot</label>
                <div className="relative border border-dashed border-slate-700 hover:border-emerald-500/50 bg-[#141926] rounded-xl p-3 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEntryFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {chartEntryPreview ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold truncate">
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">Entry Screenshot Attached</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">Change</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Entry Chart</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Exit Chart */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Exit Chart Screenshot</label>
                <div className="relative border border-dashed border-slate-700 hover:border-emerald-500/50 bg-[#141926] rounded-xl p-3 text-center transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleExitFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {chartExitPreview ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold truncate">
                        <ImageIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">Exit Screenshot Attached</span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">Change</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Exit Chart</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs sm:text-sm font-black rounded-xl text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              {initialData ? 'Update Trade Record' : 'Save Trade Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
