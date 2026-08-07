import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  PieChart, 
  Calendar, 
  Lock, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Trophy,
  Activity,
  Play
} from 'lucide-react';

export default function LandingPage({ onEnterApp, onLoginClick }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What is TradeTrack PRO?",
      a: "TradeTrack PRO is an executive-grade quantitative trading journal and performance analytics platform designed for retail traders, prop firm candidates, and market analysts to track PnL, win rate, risk-reward ratios, and emotional trading leaks."
    },
    {
      q: "Is my trading data secure and private?",
      a: "Yes! TradeTrack PRO enforces strict CORS origin shields, token-based API authentication, and isolated database encryption. Your trading data is private to your account only."
    },
    {
      q: "Can I import and export my trade logs?",
      a: "Absolutely. You can export your complete execution history to CSV format at any time or import existing CSV trade backups in one click."
    },
    {
      q: "Does TradeTrack PRO support crypto, forex, and stocks?",
      a: "Yes, TradeTrack PRO supports all asset classes including Stocks (Nifty 50, Bank Nifty, Sensex), Forex, Crypto, Commodities, and Futures."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-hidden">
      
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Landing Page Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070A12]/80 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterApp}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#070A12] rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
              </div>
            </div>
            <span className="font-black text-xl tracking-wider text-white font-mono">
              Trade<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Track</span>
            </span>
          </div>

          {/* Navigation & Auth Links */}
          <div className="flex items-center space-x-6">
            <a href="#features" className="hidden sm:inline text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hidden sm:inline text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hidden sm:inline text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors">FAQ</a>

            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-xs font-mono font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              Login
            </button>

            <button
              onClick={onEnterApp}
              className="px-5 py-2 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 shadow-lg shadow-cyan-500/25 rounded-xl transition-all cursor-pointer border border-cyan-300/40"
            >
              Sign Up
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-8 z-10">
        
        {/* Competitive Edge Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wide shadow-md shadow-cyan-500/10">
          <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
          <span>Your Competitive Edge in Trading</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-mono leading-none">
            Stop Guessing.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Start Winning.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 font-sans max-w-2xl mx-auto font-medium pt-2">
            With Trade Track - Your Personal Trading Analyst.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 text-sm font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 shadow-2xl shadow-cyan-500/40 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer border border-cyan-200/50"
          >
            <span>Try Free Demo</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-4 text-sm font-mono font-bold text-slate-300 hover:text-white bg-[#0D121F] hover:bg-[#141B2D] rounded-2xl border border-white/15 transition-all text-center"
          >
            View Pricing
          </a>
        </div>

        {/* Hero Interactive App Preview Mockup */}
        <div className="pt-10 relative">
          <div className="rounded-2xl border border-white/15 bg-[#0A0E17]/90 p-3 sm:p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl max-w-4xl mx-auto overflow-hidden text-left font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-bold text-slate-300">TradeTrack PRO Dashboard Preview</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SIMULATION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase">Cumulative Net PnL</span>
                <p className="text-2xl font-extrabold text-emerald-400">+₹1,72,470</p>
                <span className="text-[10px] text-emerald-400/80">97% Win Rate • 33 Trades</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase">Win Rate Speedometer</span>
                <p className="text-2xl font-extrabold text-cyan-400">72.5%</p>
                <span className="text-[10px] text-cyan-400/80">↗ +5.2% vs last month</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase">Top Asset Setup</span>
                <p className="text-2xl font-extrabold text-purple-400">Nifty 50</p>
                <span className="text-[10px] text-purple-300">Iron Condor • 1:3.2 RRR</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            Everything You Need to <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Level Up</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Stop losing profits to unexamined trading habits. Track every detail with institutional analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Quantitative Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track Cumulative PnL curves, Win Rate %, Profit Factor, and Risk-to-Reward Ratio (RRR) across custom date ranges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Mindset & Psychology Leak</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tag emotional execution states (Disciplined, FOMO, Revenge) to identify exact leaks burning your capital.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D121F] border border-white/10 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">Interactive PnL Calendar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual daily profit & loss breakdown with win/loss color-coded heatmaps and instant date filtering.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-mono text-white">
            Transparent <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-slate-400 text-sm">Choose the plan that fits your trading capital and goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Starter Plan */}
          <div className="p-6 rounded-2xl bg-[#0B0F1A] border border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Starter Journal</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black font-mono text-white">Free</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-400">Perfect for retail traders tracking personal execution logs.</p>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Trade Logs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Core Win Rate & PnL Analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> CSV Export & Backup</li>
              </ul>
            </div>
            <button onClick={onEnterApp} className="w-full py-3 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all cursor-pointer">
              Launch Free Terminal
            </button>
          </div>

          {/* Pro Trader Plan */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0F1829] to-[#0A0E17] border border-cyan-500/50 shadow-xl shadow-cyan-500/10 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-black uppercase">
              RECOMMENDED
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">TradeTrack PRO</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black font-mono text-white">Pro</span>
                <span className="text-xs text-cyan-300">/ full access</span>
              </div>
              <p className="text-xs text-slate-400">For prop firm candidates and quantitative edge analysts.</p>
              <ul className="space-y-2.5 text-xs text-slate-200 pt-2 font-mono">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Executive PDF Analytics Export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Mindset & Psychology Leak Analysis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Interactive PnL Calendar Heatmap</li>
              </ul>
            </div>
            <button onClick={onEnterApp} className="w-full py-3 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-lg shadow-cyan-500/20 rounded-xl transition-all cursor-pointer border border-cyan-300/40">
              Unlock PRO Terminal →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 sm:px-8 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black font-mono text-white">Frequently Asked <span className="text-cyan-400">Questions</span></h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl bg-[#0B0F1A] border border-white/10 overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 text-left font-mono font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-xs text-slate-400 font-sans leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500 font-mono space-y-2">
        <p>TradeTrack PRO • Executive Quantitative Trading & Analytics Engine</p>
        <p className="text-[11px] text-slate-600">Built & Owned by <span className="text-emerald-400 font-bold">Bimalesh Yadav</span></p>
      </footer>

    </div>
  );
}
