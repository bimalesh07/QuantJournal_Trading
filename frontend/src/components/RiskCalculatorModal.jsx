import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  DollarSign, 
  Percent, 
  ShieldAlert, 
  Target, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  PlusCircle, 
  Check, 
  Copy,
  Zap,
  Scale
} from 'lucide-react';

export default function RiskCalculatorModal({ 
  isOpen, 
  onClose, 
  onLogTradeWithCalculatedData,
  theme = 'dark' 
}) {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  // Calculator Form State
  const [accountBalance, setAccountBalance] = useState('10000');
  const [riskType, setRiskType] = useState('percent'); // 'percent' | 'cash'
  const [riskInputValue, setRiskInputValue] = useState('1'); // 1% or $100
  const [assetType, setAssetType] = useState('FOREX'); // 'FOREX' | 'CRYPTO' | 'INDIAN_INDEX' | 'STOCKS'
  const [symbol, setSymbol] = useState('EUR/USD');
  const [tradeType, setTradeType] = useState('LONG'); // 'LONG' | 'SHORT'
  
  const [entryPrice, setEntryPrice] = useState('1.0850');
  const [stopLoss, setStopLoss] = useState('1.0820');
  const [takeProfit, setTakeProfit] = useState('1.0940');

  // Pre-configured lot multipliers / Pip values
  const [customLotSize, setCustomLotSize] = useState('25'); // For Nifty / Banknifty lot sizes

  const [copied, setCopied] = useState(false);

  // Quick Preset Handlers
  const handleSelectAssetPreset = (preset) => {
    setAssetType(preset.type);
    setSymbol(preset.symbol);
    setEntryPrice(preset.entry);
    setStopLoss(preset.sl);
    setTakeProfit(preset.tp);
    if (preset.lotSize) setCustomLotSize(preset.lotSize);
  };

  // Perform Position Size & Telemetry Math
  const calculationResults = useMemo(() => {
    const bal = Math.max(0, Number(accountBalance) || 0);
    const riskVal = Math.max(0, Number(riskInputValue) || 0);

    // Calculate Total Cash at Risk
    const cashAtRisk = riskType === 'percent' 
      ? (bal * (riskVal / 100))
      : riskVal;

    const entry = Number(entryPrice) || 0;
    const sl = Number(stopLoss) || 0;
    const tp = Number(takeProfit) || 0;

    if (entry <= 0 || sl <= 0 || entry === sl) {
      return {
        cashAtRisk: Number(cashAtRisk.toFixed(2)),
        slDistance: 0,
        tpDistance: 0,
        positionSize: 0,
        forexLots: 0,
        indexLots: 0,
        rrr: 0,
        potentialProfit: 0,
        accountRiskPct: bal > 0 ? Number(((cashAtRisk / bal) * 100).toFixed(2)) : 0,
        isValid: false
      };
    }

    // Stop loss distance in price points
    const slDistance = Math.abs(entry - sl);
    const tpDistance = tp > 0 ? Math.abs(tp - entry) : 0;

    // RRR
    const rrr = slDistance > 0 && tpDistance > 0 ? Number((tpDistance / slDistance).toFixed(2)) : 0;
    const potentialProfit = Number((cashAtRisk * rrr).toFixed(2));
    const accountRiskPct = bal > 0 ? Number(((cashAtRisk / bal) * 100).toFixed(2)) : 0;

    // Position Size Calculations
    let positionSize = 0;
    let forexLots = 0;
    let indexLots = 0;

    if (assetType === 'FOREX') {
      // Standard Forex contract = 100,000 units (1 Pip = 0.0001 for non-JPY, 0.01 for JPY)
      const isJpy = symbol.toUpperCase().includes('JPY');
      const pipMultiplier = isJpy ? 100 : 10000;
      const slPips = slDistance * pipMultiplier;
      const pipValueStandard = 10; // ~$10 per pip for 1.0 standard lot EURUSD

      if (slPips > 0) {
        forexLots = Number((cashAtRisk / (slPips * pipValueStandard)).toFixed(2));
        positionSize = Number((forexLots * 100000).toFixed(0));
      }
    } else if (assetType === 'INDIAN_INDEX') {
      // Indian Index Options / Futures (Nifty=25/50, BankNifty=15)
      const lotMultiplier = Math.max(1, Number(customLotSize) || 25);
      const riskPerQuantity = slDistance; // Price points SL
      if (riskPerQuantity > 0) {
        const totalQty = Math.floor(cashAtRisk / riskPerQuantity);
        indexLots = Math.max(1, Math.floor(totalQty / lotMultiplier));
        positionSize = indexLots * lotMultiplier;
      }
    } else {
      // Crypto / Stocks / Equity: Quantity = Cash Risk / SL Price Distance
      if (slDistance > 0) {
        positionSize = Number((cashAtRisk / slDistance).toFixed(4));
      }
    }

    return {
      cashAtRisk: Number(cashAtRisk.toFixed(2)),
      slDistance: Number(slDistance.toFixed(4)),
      tpDistance: Number(tpDistance.toFixed(4)),
      positionSize,
      forexLots,
      indexLots,
      rrr,
      potentialProfit,
      accountRiskPct,
      isValid: true
    };
  }, [accountBalance, riskType, riskInputValue, assetType, symbol, entryPrice, stopLoss, takeProfit, customLotSize]);

  // Copy Position Size to Clipboard
  const handleCopy = () => {
    let sizeText = `${calculationResults.positionSize}`;
    if (assetType === 'FOREX') sizeText = `${calculationResults.forexLots} Lots`;
    if (assetType === 'INDIAN_INDEX') sizeText = `${calculationResults.indexLots} Lots (${calculationResults.positionSize} Qty)`;

    navigator.clipboard.writeText(sizeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Launch Trade Form with Pre-populated Risk Data
  const handleSendToTradeForm = () => {
    if (onLogTradeWithCalculatedData) {
      let qty = calculationResults.positionSize;
      if (assetType === 'FOREX') qty = calculationResults.forexLots;

      onLogTradeWithCalculatedData({
        symbol,
        asset_class: assetType === 'INDIAN_INDEX' ? 'INDIAN_STOCKS' : assetType,
        trade_type: tradeType,
        entry_price: entryPrice,
        stop_loss: stopLoss,
        take_profit: takeProfit,
        quantity: qty
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className={`relative w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden transition-all my-auto ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-cyan-500/30 text-white'
      }`}>
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-mono tracking-wide text-white flex items-center gap-2">
                <span>Automated Position Size & Risk Calculator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PRECISION TOOL
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Calculate exact Lot Sizes, Cash Risk & Risk-to-Reward Ratio before placing trades.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">

          {/* Quick Instrument Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold font-mono text-slate-400 block uppercase tracking-wider">
              Quick Instrument Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectAssetPreset({ type: 'FOREX', symbol: 'EUR/USD', entry: '1.0850', sl: '1.0820', tp: '1.0940' })}
                className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                  assetType === 'FOREX'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/10 text-slate-300 hover:border-cyan-500/40')
                }`}
              >
                <span className="block font-bold">💱 Forex</span>
                <span className="text-[10px] opacity-75">EUR/USD (Lots)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAssetPreset({ type: 'CRYPTO', symbol: 'BTC/USD', entry: '68500', sl: '67200', tp: '71000' })}
                className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                  assetType === 'CRYPTO'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/10 text-slate-300 hover:border-cyan-500/40')
                }`}
              >
                <span className="block font-bold">⚡ Crypto</span>
                <span className="text-[10px] opacity-75">BTC/USD (Coins)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAssetPreset({ type: 'INDIAN_INDEX', symbol: 'NIFTY 50', entry: '24500', sl: '24420', tp: '24700', lotSize: '25' })}
                className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                  assetType === 'INDIAN_INDEX'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/10 text-slate-300 hover:border-cyan-500/40')
                }`}
              >
                <span className="block font-bold">🇮🇳 Nifty / Options</span>
                <span className="text-[10px] opacity-75">Nifty / BankNifty</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAssetPreset({ type: 'STOCKS', symbol: 'AAPL', entry: '220.50', sl: '215.00', tp: '232.00' })}
                className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                  assetType === 'STOCKS'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : (isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/10 text-slate-300 hover:border-cyan-500/40')
                }`}
              >
                <span className="block font-bold">📈 Stocks</span>
                <span className="text-[10px] opacity-75">Shares Qty</span>
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Account Balance & Risk Parameters */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0B0F1A] border-white/10'
            }`}>
              <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>1. Account & Risk Parameters</span>
              </h3>

              {/* Account Size */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono font-bold">Total Account Size ($ or ₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(e.target.value)}
                    placeholder="10000"
                    className={`w-full border rounded-xl p-3 text-sm font-mono focus:border-cyan-400 outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#070A12] border-white/15 text-white'
                    }`}
                  />
                  <DollarSign className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>

              {/* Risk Mode Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 font-mono font-bold">Risk Allocation Mode</label>
                  <div className="inline-flex rounded-lg border border-white/15 p-0.5 text-[10px] font-mono font-bold bg-[#070A12]">
                    <button
                      type="button"
                      onClick={() => { setRiskType('percent'); setRiskInputValue('1'); }}
                      className={`px-2 py-0.5 rounded-md ${riskType === 'percent' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                    >
                      Risk %
                    </button>
                    <button
                      type="button"
                      onClick={() => { setRiskType('cash'); setRiskInputValue('100'); }}
                      className={`px-2 py-0.5 rounded-md ${riskType === 'cash' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'}`}
                    >
                      Fixed $ / ₹
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={riskInputValue}
                    onChange={(e) => setRiskInputValue(e.target.value)}
                    placeholder={riskType === 'percent' ? '1.0' : '100'}
                    className={`w-full border rounded-xl p-3 text-sm font-mono focus:border-cyan-400 outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#070A12] border-white/15 text-white'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold text-cyan-400 absolute right-3 top-3.5">
                    {riskType === 'percent' ? '%' : '$'}
                  </span>
                </div>
              </div>

              {/* Symbol & Trade Direction */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-mono font-bold">Symbol</label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className={`w-full border rounded-xl p-2.5 text-xs font-mono font-bold focus:border-cyan-400 outline-none uppercase ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#070A12] border-white/15 text-cyan-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-mono font-bold">Direction</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setTradeType('LONG')}
                      className={`py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                        tradeType === 'LONG'
                          ? 'bg-emerald-500/25 border border-emerald-500/40 text-emerald-300'
                          : 'bg-[#070A12] border border-white/10 text-slate-400'
                      }`}
                    >
                      BUY ↗
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('SHORT')}
                      className={`py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                        tradeType === 'SHORT'
                          ? 'bg-rose-500/25 border border-rose-500/40 text-rose-300'
                          : 'bg-[#070A12] border border-white/10 text-slate-400'
                      }`}
                    >
                      SELL ↘
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Targets & SL Entry Inputs */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0B0F1A] border-white/10'
            }`}>
              <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>2. Entry, Stop Loss & Take Profit</span>
              </h3>

              {/* Entry Price */}
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-mono font-bold">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="1.0850"
                  className={`w-full border rounded-xl p-3 text-sm font-mono focus:border-cyan-400 outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#070A12] border-white/15 text-white'
                  }`}
                />
              </div>

              {/* Stop Loss Price */}
              <div>
                <label className="text-xs text-rose-400 block mb-1 font-mono font-bold">Stop Loss Price</label>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="1.0820"
                  className={`w-full border border-rose-500/30 rounded-xl p-3 text-sm font-mono text-rose-300 focus:border-rose-400 outline-none ${
                    isLight ? 'bg-white text-slate-900' : 'bg-[#070A12]'
                  }`}
                />
              </div>

              {/* Take Profit Price */}
              <div>
                <label className="text-xs text-emerald-400 block mb-1 font-mono font-bold">Take Profit Price (Optional)</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="1.0940"
                  className={`w-full border border-emerald-500/30 rounded-xl p-3 text-sm font-mono text-emerald-300 focus:border-emerald-400 outline-none ${
                    isLight ? 'bg-white text-slate-900' : 'bg-[#070A12]'
                  }`}
                />
              </div>

              {assetType === 'INDIAN_INDEX' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-mono font-bold">Lot Multiplier Qty (Nifty=25, BankNifty=15)</label>
                  <input
                    type="number"
                    value={customLotSize}
                    onChange={(e) => setCustomLotSize(e.target.value)}
                    placeholder="25"
                    className={`w-full border rounded-xl p-2.5 text-xs font-mono focus:border-cyan-400 outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#070A12] border-white/15 text-white'
                    }`}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Dynamic Results & Telemetry Card */}
          <div className="bg-gradient-to-r from-[#0D1B2A] via-[#091522] to-[#0D1525] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                <span>Calculated Position Size Telemetry</span>
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied!' : 'Copy Size'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
              
              {/* Position Size / Lot Size Main Result */}
              <div className="p-3.5 rounded-xl bg-[#060A14] border border-cyan-400/30 space-y-1 col-span-2 md:col-span-1">
                <span className="text-[11px] text-slate-400 block font-sans">Recommended Size</span>
                <p className="text-xl sm:text-2xl font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                  {assetType === 'FOREX' ? `${calculationResults.forexLots} Lots` :
                   assetType === 'INDIAN_INDEX' ? `${calculationResults.indexLots} Lots` :
                   `${calculationResults.positionSize}`}
                </p>
                <span className="text-[10px] text-cyan-400 font-bold block">
                  {assetType === 'FOREX' ? `(${calculationResults.positionSize} Units)` :
                   assetType === 'INDIAN_INDEX' ? `(${calculationResults.positionSize} Total Qty)` :
                   'Units / Shares'}
                </span>
              </div>

              {/* Cash at Risk */}
              <div className="p-3.5 rounded-xl bg-[#060A14] border border-rose-500/30 space-y-1">
                <span className="text-[11px] text-slate-400 block font-sans">Total Risk Amount</span>
                <p className="text-lg font-black text-rose-400">
                  -${calculationResults.cashAtRisk}
                </p>
                <span className="text-[10px] text-rose-300 font-bold block">
                  {calculationResults.accountRiskPct}% of Account
                </span>
              </div>

              {/* RRR */}
              <div className="p-3.5 rounded-xl bg-[#060A14] border border-sky-500/30 space-y-1">
                <span className="text-[11px] text-slate-400 block font-sans">Risk to Reward</span>
                <p className="text-lg font-black text-sky-300">
                  1 : {calculationResults.rrr}
                </p>
                <span className="text-[10px] text-sky-400 font-bold block">
                  SL: {calculationResults.slDistance} Pts
                </span>
              </div>

              {/* Potential Profit */}
              <div className="p-3.5 rounded-xl bg-[#060A14] border border-emerald-500/30 space-y-1">
                <span className="text-[11px] text-slate-400 block font-sans">Potential Profit</span>
                <p className="text-lg font-black text-emerald-400">
                  +${calculationResults.potentialProfit}
                </p>
                <span className="text-[10px] text-emerald-300 font-bold block">
                  TP: {calculationResults.tpDistance} Pts
                </span>
              </div>

            </div>

          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400 font-mono">
              💡 <strong className="text-cyan-300">Rule:</strong> Never risk more than 1-2% of your account on a single setup!
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-xl border border-white/10 cursor-pointer"
              >
                Close
              </button>
              
              <button
                type="button"
                onClick={handleSendToTradeForm}
                disabled={!calculationResults.isValid}
                className="w-1/2 sm:w-auto px-6 py-3 text-xs font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:scale-105 rounded-xl shadow-lg shadow-emerald-500/25 font-mono cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>+ Log Trade With Calculated Size</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
