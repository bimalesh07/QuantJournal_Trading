import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Calculator, Image as ImageIcon, AlertCircle, ShieldCheck, CheckSquare, Square } from 'lucide-react';

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
    rating: 3,
    notes: '',
    tags: '',
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: new Date().toISOString().slice(0, 16),
  });

  const [checklist, setChecklist] = useState({
    maxRisk: false,
    htfAlignment: false,
    entryTrigger: false,
    noNews: false,
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
        rating: initialData.rating || 3,
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
        maxRisk: false,
        htfAlignment: false,
        entryTrigger: false,
        noNews: false,
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
  const isChecklistComplete = checkedCount === 4;

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
    if (!isChecklistComplete) return;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121622] w-full max-w-3xl border border-slate-700/90 my-8 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#161B29]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10">
              <Calculator className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black font-mono text-white">
                {initialData ? 'Edit Trade Record' : 'Log New Quantitative Trade'}
              </h3>
              <p className="text-xs font-medium text-slate-300">Record execution metrics, discipline checklist, and setup notes</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic PnL & RRR Summary Bar */}
        <div className="bg-[#141924] px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-inner">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 font-medium">Net PnL: </span>
              <span className={`font-extrabold text-sm ${calcNetPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calcNetPnL >= 0 ? '+' : ''}${calcNetPnL.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Planned RRR: </span>
              <span className="font-extrabold text-sm text-blue-300">1:{calcRRR}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Risked Amt: </span>
              <span className="font-extrabold text-sm text-amber-400">${calcRiskAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Symbol, Type, Asset Class, Session Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Symbol *</label>
              <input
                type="text"
                name="symbol"
                required
                placeholder="e.g. BTC/USDT, AAPL"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:bg-[#1C2333] focus:outline-none transition-all font-mono font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Trade Type *</label>
              <select
                name="trade_type"
                value={formData.trade_type}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:bg-[#1C2333] focus:outline-none transition-all font-semibold shadow-inner cursor-pointer"
              >
                <option value="LONG" className="bg-[#161B29] text-white font-medium py-2">LONG (Buy)</option>
                <option value="SHORT" className="bg-[#161B29] text-white font-medium py-2">SHORT (Sell)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Asset Class *</label>
              <select
                name="asset_class"
                value={formData.asset_class}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:bg-[#1C2333] focus:outline-none transition-all font-semibold shadow-inner cursor-pointer"
              >
                <option value="CRYPTO" className="bg-[#161B29] text-white font-medium py-2">Crypto</option>
                <option value="STOCKS" className="bg-[#161B29] text-white font-medium py-2">Stocks</option>
                <option value="FOREX" className="bg-[#161B29] text-white font-medium py-2">Forex</option>
                <option value="OPTIONS" className="bg-[#161B29] text-white font-medium py-2">Options</option>
                <option value="FUTURES" className="bg-[#161B29] text-white font-medium py-2">Futures</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">Trading Session *</label>
              <select
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:bg-[#1C2333] focus:outline-none transition-all font-semibold shadow-inner cursor-pointer"
              >
                <option value="NEW_YORK" className="bg-[#161B29] text-white font-medium py-2">New York Session</option>
                <option value="LONDON" className="bg-[#161B29] text-white font-medium py-2">London Session</option>
                <option value="ASIAN" className="bg-[#161B29] text-white font-medium py-2">Asian Session</option>
              </select>
            </div>

          </div>

          {/* Pre-Trade Discipline & Confluence Checklist */}
          <div className="bg-gradient-to-br from-[#121824] via-[#161f30] to-[#121622] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider font-mono">
                  Pre-Trade Discipline & Confluence Checklist
                </h4>
              </div>
              
              <span className={`text-xs px-3 py-1 rounded-xl font-extrabold font-mono border shadow-md ${
                isChecklistComplete 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/10' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-500/10'
              }`}>
                {isChecklistComplete ? '4/4 Rules Ticked - Disciplined Setup' : `${checkedCount}/4 Rules Ticked - Warning`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Rule 1 */}
              <div 
                onClick={() => handleChecklistToggle('maxRisk')} 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  checklist.maxRisk 
                    ? 'bg-gradient-to-r from-emerald-950/60 via-[#0a3324] to-[#0c261e] border-2 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-500/10' 
                    : 'bg-[#181E2C] border-2 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#1F2739]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checklist.maxRisk ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 stroke-[1.5]" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-extrabold block text-white">Followed Max Risk Limit</span>
                  <span className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5 block">Position size risk is strictly &le; 1-2% of total capital.</span>
                </div>
              </div>

              {/* Rule 2 */}
              <div 
                onClick={() => handleChecklistToggle('htfAlignment')} 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  checklist.htfAlignment 
                    ? 'bg-gradient-to-r from-emerald-950/60 via-[#0a3324] to-[#0c261e] border-2 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-500/10' 
                    : 'bg-[#181E2C] border-2 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#1F2739]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checklist.htfAlignment ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 stroke-[1.5]" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-extrabold block text-white">Higher Timeframe Trend Alignment</span>
                  <span className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5 block">Trade direction matches Daily / 4H market structure.</span>
                </div>
              </div>

              {/* Rule 3 */}
              <div 
                onClick={() => handleChecklistToggle('entryTrigger')} 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  checklist.entryTrigger 
                    ? 'bg-gradient-to-r from-emerald-950/60 via-[#0a3324] to-[#0c261e] border-2 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-500/10' 
                    : 'bg-[#181E2C] border-2 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#1F2739]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checklist.entryTrigger ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 stroke-[1.5]" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-extrabold block text-white">Clear Entry Trigger / Setup Present</span>
                  <span className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5 block">Valid strategy setup confirmed (e.g. FVG, S/R retest).</span>
                </div>
              </div>

              {/* Rule 4 */}
              <div 
                onClick={() => handleChecklistToggle('noNews')} 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  checklist.noNews 
                    ? 'bg-gradient-to-r from-emerald-950/60 via-[#0a3324] to-[#0c261e] border-2 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-500/10' 
                    : 'bg-[#181E2C] border-2 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#1F2739]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {checklist.noNews ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 stroke-[1.5]" />
                  )}
                </div>
                <div className="text-xs">
                  <span className="font-extrabold block text-white">No High-Impact Economic News Pending</span>
                  <span className="text-xs text-slate-400 font-medium leading-relaxed mt-0.5 block">No major CPI/FOMC high volatility event in next 30 mins.</span>
                </div>
              </div>

            </div>

            {!isChecklistComplete && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#3a200a] to-[#2b1807] border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 stroke-[2.5]" />
                <span>Mandatory: All 4 discipline rules must be ticked to enable saving the trade.</span>
              </div>
            )}
          </div>

          {/* Numerical Inputs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#141924] p-4.5 rounded-2xl border border-slate-800/80 shadow-inner">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Entry Price *</label>
              <input
                type="number"
                step="any"
                name="entry_price"
                required
                placeholder="0.00"
                value={formData.entry_price}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Exit Price</label>
              <input
                type="number"
                step="any"
                name="exit_price"
                placeholder="0.00 (Open)"
                value={formData.exit_price}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-rose-400 uppercase tracking-wider mb-1.5 font-mono">Stop Loss</label>
              <input
                type="number"
                step="any"
                name="stop_loss"
                placeholder="0.00"
                value={formData.stop_loss}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-rose-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1.5 font-mono">Take Profit Target</label>
              <input
                type="number"
                step="any"
                name="take_profit"
                placeholder="0.00"
                value={formData.take_profit}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Position Size / Qty *</label>
              <input
                type="number"
                step="any"
                name="quantity"
                required
                placeholder="1.0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Fees / Commission</label>
              <input
                type="number"
                step="any"
                name="fees"
                placeholder="0.00"
                value={formData.fees}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-semibold shadow-inner cursor-pointer"
              >
                <option value="CLOSED" className="bg-[#161B29] text-white font-medium py-2">CLOSED</option>
                <option value="OPEN" className="bg-[#161B29] text-white font-medium py-2">OPEN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Strategy Model</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-semibold shadow-inner cursor-pointer"
              >
                <option value="" className="bg-[#161B29] text-white font-medium py-2">No Strategy Assigned</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#161B29] text-white font-medium py-2">{s.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Timestamps & Mindset */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Entry Date & Time *</label>
              <input
                type="datetime-local"
                name="entry_time"
                required
                value={formData.entry_time}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Emotional Mindset</label>
              <select
                name="emotion"
                value={formData.emotion}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-semibold shadow-inner cursor-pointer"
              >
                <option value="DISCIPLINED" className="bg-[#161B29] text-white font-medium py-2">Disciplined</option>
                <option value="PATIENT" className="bg-[#161B29] text-white font-medium py-2">Patient</option>
                <option value="FOMO" className="bg-[#161B29] text-white font-medium py-2">FOMO (Chasing)</option>
                <option value="REVENGE" className="bg-[#161B29] text-white font-medium py-2">Revenge Trading</option>
                <option value="FEARFUL" className="bg-[#161B29] text-white font-medium py-2">Fearful</option>
                <option value="GREEDY" className="bg-[#161B29] text-white font-medium py-2">Greedy</option>
                <option value="IMPULSIVE" className="bg-[#161B29] text-white font-medium py-2">Impulsive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Execution Rating</label>
              <div className="flex items-center gap-1.5 py-2 bg-[#181E2C] px-3.5 rounded-xl border border-slate-700/80">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Tags & Logic Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Setup Tags (Comma Separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. #fvg, #sweep, #retest"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm font-mono text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 font-mono">Execution Logic & Retrospective Notes</label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Document your entry thesis, key levels, and post-trade retrospective observations..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-[#181E2C] text-xs sm:text-sm text-white p-3.5 rounded-xl border border-slate-700/80 focus:border-emerald-400 focus:outline-none font-medium leading-relaxed shadow-inner"
              ></textarea>
            </div>
          </div>

          {/* Chart Screenshots Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Entry Chart Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Entry Chart Screenshot</label>
              <div className="relative border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-[#181E2C]/60 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEntryFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {chartEntryPreview ? (
                  <div className="relative group">
                    <img src={chartEntryPreview} alt="Entry Chart" className="max-h-32 mx-auto rounded-xl object-contain shadow-md" />
                    <span className="text-xs font-bold text-emerald-400 block mt-2 font-mono">Entry Chart Loaded</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs text-slate-300 font-semibold">Click or Drag Entry Screenshot</span>
                  </div>
                )}
              </div>
            </div>

            {/* Exit Chart Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Exit Chart Screenshot</label>
              <div className="relative border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-[#181E2C]/60 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleExitFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {chartExitPreview ? (
                  <div className="relative group">
                    <img src={chartExitPreview} alt="Exit Chart" className="max-h-32 mx-auto rounded-xl object-contain shadow-md" />
                    <span className="text-xs font-bold text-emerald-400 block mt-2 font-mono">Exit Chart Loaded</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-xs text-slate-300 font-semibold">Click or Drag Exit Screenshot</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isChecklistComplete}
              className={`px-6 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all ${
                isChecklistComplete
                  ? 'text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 shadow-xl shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
              title={!isChecklistComplete ? 'Tick all 4 checklist items to enable saving' : 'Save Trade Record'}
            >
              {initialData ? 'Update Trade' : 'Save Trade Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
