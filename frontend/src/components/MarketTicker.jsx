import React from 'react';
import { TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';

const tickerData = [
  { symbol: '🇮🇳 NIFTY 50', name: 'NSE Nifty 50', price: '24,560.80', change: '+0.65%', isProfit: true },
  { symbol: '🇮🇳 BANK NIFTY', name: 'Nifty Bank', price: '52,340.50', change: '+0.85%', isProfit: true },
  { symbol: '🇮🇳 SENSEX', name: 'BSE Sensex', price: '80,420.15', change: '+0.52%', isProfit: true },
  { symbol: '🇮🇳 RELIANCE', name: 'Reliance Industries', price: '₹3,025.00', change: '+1.15%', isProfit: true },
  { symbol: '🇮🇳 TATA MOTORS', name: 'Tata Motors', price: '₹1,045.50', change: '+2.10%', isProfit: true },
  { symbol: '🇮🇳 HDFC BANK', name: 'HDFC Bank', price: '₹1,640.20', change: '+0.40%', isProfit: true },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$68,450.00', change: '+2.45%', isProfit: true },
  { symbol: 'XAU/USD', name: 'Gold', price: '$2,418.50', change: '+0.82%', isProfit: true },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$3,520.10', change: '-0.45%', isProfit: false },
  { symbol: 'NDX', name: 'Nasdaq 100', price: '19,865.00', change: '+1.12%', isProfit: true },
  { symbol: 'XAG/USD', name: 'Silver', price: '$28.65', change: '+1.35%', isProfit: true },
];

export default function MarketTicker() {
  return (
    <div className="w-full bg-[#05070F]/90 border-b border-white/10 overflow-hidden backdrop-blur-md py-2 font-mono text-xs shadow-md select-none">
      <div className="flex items-center">
        
        {/* Live Market Label Badge */}
        <div className="bg-[#0A0F1D] px-3 py-1 border-r border-white/10 flex items-center gap-2 shrink-0 z-10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-black tracking-wider text-slate-200 uppercase text-[10px] flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            LIVE MARKETS
          </span>
        </div>

        {/* Marquee Infinite Scrolling Ticker Track */}
        <div className="flex overflow-hidden whitespace-nowrap group relative flex-1">
          
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] space-x-8 items-center pl-6">
            {tickerData.concat(tickerData).map((item, idx) => (
              <div key={idx} className="inline-flex items-center space-x-2 shrink-0">
                <span className="font-bold text-slate-200 tracking-wide">{item.symbol}</span>
                <span className="text-slate-300 font-semibold">{item.price}</span>
                
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
                  item.isProfit 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.isProfit ? <TrendingUp className="w-3 h-3 stroke-[2.5]" /> : <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
                  <span>{item.change}</span>
                </span>

                <span className="text-slate-700 ml-4">•</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
