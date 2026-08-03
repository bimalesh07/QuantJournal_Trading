import React, { useState, useEffect } from 'react';
import { X, Upload, Star, Calculator, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function TradeFormModal({ isOpen, onClose, onSubmit, initialData = null, strategies = [] }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    symbol: '',
    trade_type: 'LONG',
    asset_class: 'CRYPTO',
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
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: new Date().toISOString().slice(0, 16),
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
        entry_time: initialData.entry_time ? new Date(initialData.entry_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        exit_time: initialData.exit_time ? new Date(initialData.exit_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
      setChartEntryPreview(initialData.chart_entry || null);
      setChartExitPreview(initialData.chart_exit || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  // Real-time calculation helpers
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="card-dark w-full max-w-3xl border border-slate-700/80 my-8 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#151921]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {initialData ? 'Edit Trade Record' : 'Log New Executed Trade'}
              </h3>
              <p className="text-xs text-slate-400">Record price levels, setup notes, and chart screenshots</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Live Calculation Banner */}
        <div className="bg-[#0F131C] px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400">Net PnL: </span>
              <span className={`font-bold ${calcNetPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calcNetPnL >= 0 ? '+' : ''}${calcNetPnL.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Planned RRR: </span>
              <span className="font-bold text-blue-300">1:{calcRRR}</span>
            </div>
            <div>
              <span className="text-slate-400">Risked Amt: </span>
              <span className="text-amber-400">${calcRiskAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitForm} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Basic Trade Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Symbol *</label>
              <input
                type="text"
                name="symbol"
                required
                placeholder="e.g. BTC/USDT, AAPL, NIFTY"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Trade Type *</label>
              <select
                name="trade_type"
                value={formData.trade_type}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="LONG">LONG (Buy)</option>
                <option value="SHORT">SHORT (Sell)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asset Class *</label>
              <select
                name="asset_class"
                value={formData.asset_class}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="CRYPTO">Crypto</option>
                <option value="STOCKS">Stocks</option>
                <option value="FOREX">Forex</option>
                <option value="OPTIONS">Options</option>
                <option value="FUTURES">Futures</option>
              </select>
            </div>

          </div>

          {/* Price Levels Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#151921]/50 p-4 rounded-xl border border-slate-800/60">
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Entry Price *</label>
              <input
                type="number"
                step="any"
                name="entry_price"
                required
                placeholder="0.00"
                value={formData.entry_price}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Exit Price</label>
              <input
                type="number"
                step="any"
                name="exit_price"
                placeholder="0.00 (Blank if Open)"
                value={formData.exit_price}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-rose-400 mb-1">Stop Loss</label>
              <input
                type="number"
                step="any"
                name="stop_loss"
                placeholder="0.00"
                value={formData.stop_loss}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Take Profit Target</label>
              <input
                type="number"
                step="any"
                name="take_profit"
                placeholder="0.00"
                value={formData.take_profit}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Position Size / Qty *</label>
              <input
                type="number"
                step="any"
                name="quantity"
                required
                placeholder="1.0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Fees / Commission</label>
              <input
                type="number"
                step="any"
                name="fees"
                placeholder="0.00"
                value={formData.fees}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              >
                <option value="CLOSED">CLOSED</option>
                <option value="OPEN">OPEN</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Strategy</label>
              <select
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-lg border border-slate-700/80 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">-- Select Strategy --</option>
                {strategies.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Timestamps & Mindset */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Entry Date & Time *</label>
              <input
                type="datetime-local"
                name="entry_time"
                required
                value={formData.entry_time}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs font-mono text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emotional Mindset</label>
              <select
                name="emotion"
                value={formData.emotion}
                onChange={handleChange}
                className="w-full bg-[#151921] text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="DISCIPLINED">Disciplined</option>
                <option value="PATIENT">Patient</option>
                <option value="FOMO">FOMO (Chasing)</option>
                <option value="REVENGE">Revenge Trading</option>
                <option value="FEARFUL">Fearful</option>
                <option value="GREEDY">Greedy</option>
                <option value="IMPULSIVE">Impulsive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Execution Rating</label>
              <div className="flex items-center gap-1.5 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-110 transition-transform"
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

          {/* Trade Logic Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Trade Setup Logic & Retrospective Notes</label>
            <textarea
              rows="4"
              name="notes"
              placeholder="Why did you take this trade? Describe entry trigger, confluence factors, key level, market context, and lessons learned..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full bg-[#151921] text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Image Drag & Drop Screenshot Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Entry Chart Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Entry Chart Screenshot</label>
              <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-center bg-[#151921]/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEntryFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {chartEntryPreview ? (
                  <div className="relative group">
                    <img src={chartEntryPreview} alt="Entry Chart" className="max-h-32 mx-auto rounded-lg object-contain" />
                    <span className="text-[10px] text-emerald-400 block mt-1">Entry Chart Loaded</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 font-medium">Click or Drag Entry Screenshot</span>
                  </div>
                )}
              </div>
            </div>

            {/* Exit Chart Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Exit Chart Screenshot</label>
              <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-center bg-[#151921]/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleExitFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {chartExitPreview ? (
                  <div className="relative group">
                    <img src={chartExitPreview} alt="Exit Chart" className="max-h-32 mx-auto rounded-lg object-contain" />
                    <span className="text-[10px] text-emerald-400 block mt-1">Exit Chart Loaded</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 font-medium">Click or Drag Exit Screenshot</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
            >
              {initialData ? 'Update Trade' : 'Save Trade Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
