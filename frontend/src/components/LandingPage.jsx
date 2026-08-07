import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Trophy,
  Activity,
  Pin,
  Flame,
  Bookmark,
  Heart,
  Quote,
  Layers,
  Percent,
  ShieldAlert,
  Target,
  Clock
} from 'lucide-react';

export default function LandingPage({ onEnterApp, onLoginClick, isLoggedIn }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarkedRules, setBookmarkedRules] = useState([1, 3, 7]);
  const [ruleLikes, setRuleLikes] = useState({ 1: 142, 2: 189, 3: 256, 4: 210, 5: 178, 6: 195, 7: 312 });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedRules(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    setRuleLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  // Trading Rules Pinboard Cards (From User's Board Image)
  const tradingRules = [
    {
      id: 1,
      rule: "There is NO law of speculation. Anything can & will happen!",
      category: "mindset",
      bgClass: "bg-sky-950/80 border-sky-400/40 text-sky-100 shadow-sky-500/10",
      pinColor: "bg-rose-500 shadow-rose-500/50",
      rotation: "-rotate-2",
      badge: "SPECULATION LAW",
      tag: "Truth #1",
      icon: Quote
    },
    {
      id: 2,
      rule: "Cut your losses small 🍎",
      category: "risk",
      bgClass: "bg-amber-950/80 border-amber-400/40 text-amber-100 shadow-amber-500/10",
      pinColor: "bg-red-500 shadow-red-500/50",
      rotation: "rotate-1",
      badge: "GOLDEN RULE",
      tag: "Capital Protection",
      icon: ShieldAlert
    },
    {
      id: 3,
      rule: "NEVER AVERAGE IN LOSS PLEASE 🙏",
      category: "risk",
      bgClass: "bg-purple-950/80 border-purple-400/40 text-purple-100 shadow-purple-500/10",
      pinColor: "bg-purple-500 shadow-purple-500/50",
      rotation: "-rotate-1",
      badge: "CRITICAL WARN",
      tag: "No Martingale",
      highlightGif: "💸",
      icon: Flame
    },
    {
      id: 4,
      rule: "Ratio of profit should always be higher or equal to loss 🏆",
      category: "strategy",
      bgClass: "bg-emerald-950/80 border-emerald-400/40 text-emerald-100 shadow-emerald-500/10",
      pinColor: "bg-emerald-500 shadow-emerald-500/50",
      rotation: "rotate-2",
      badge: "RRR PRINCIPLE",
      tag: "1:2+ RRR",
      highlightGif: "🥂",
      icon: Trophy
    },
    {
      id: 5,
      rule: "Hope is not a strategy ⚔️",
      category: "mindset",
      bgClass: "bg-rose-950/80 border-rose-400/40 text-rose-100 shadow-rose-500/10",
      pinColor: "bg-amber-500 shadow-amber-500/50",
      rotation: "-rotate-3",
      badge: "DISCIPLINE",
      tag: "Cold Logic",
      highlightGif: "🥋",
      icon: Target
    },
    {
      id: 6,
      rule: "Patience is key to profits! Let the setup come to you 📊",
      category: "strategy",
      bgClass: "bg-violet-950/80 border-violet-400/40 text-violet-100 shadow-violet-500/10",
      pinColor: "bg-cyan-500 shadow-cyan-500/50",
      rotation: "rotate-1",
      badge: "SNIPER MINDSET",
      tag: "Wait For Trigger",
      icon: Clock
    },
    {
      id: 7,
      rule: "STOPLOSS IS the only truth. Live to fight another day 💪",
      category: "risk",
      bgClass: "bg-teal-950/80 border-teal-400/40 text-teal-100 shadow-teal-500/10",
      pinColor: "bg-rose-500 shadow-rose-500/50",
      rotation: "-rotate-1",
      badge: "SURVIVAL FIRST",
      tag: "Rule #1",
      icon: ShieldCheck
    }
  ];

  const filteredRules = activeCategory === 'all' 
    ? tradingRules 
    : tradingRules.filter(r => r.category === activeCategory);

  const faqs = [
    {
      q: "Why is tracking trading psychology & rules critical?",
      a: "90% of retail trader failures stem from emotional breaches like averaging down losses, revenge trading, or breaking stop loss rules. TradeTrack PRO quantifies your compliance to these rules so you plug profit leaks permanently."
    },
    {
      q: "What makes TradeTrack PRO different from standard journals?",
      a: "We combine quantitative metric engines (PnL curves, Win Rate %, RRR tracking) with a live Mindset & Discipline Tracker inspired by institutional trading desk rules."
    },
    {
      q: "Can I import and export my trade logs?",
      a: "Yes! You can export your complete execution history to CSV format at any time or import existing CSV trade backups in one click."
    },
    {
      q: "Does TradeTrack PRO support Crypto, Forex, Nifty & Stocks?",
      a: "Yes, TradeTrack PRO supports all asset classes including Nifty 50, Bank Nifty, Stock Options, Forex, Crypto, Commodities, and Futures."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070A12]/85 border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with Rotating Neon Light Beam */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onEnterApp}>
            <div className="relative w-10 h-10 rounded-full p-[2px] overflow-hidden shadow-lg shadow-cyan-500/30 group/orb shrink-0">
              <div 
                className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #06b6d4 270deg, #10b981 320deg, #f59e0b 360deg)'
                }}
              />
              <div className="relative w-full h-full bg-[#070A12] rounded-full flex items-center justify-center group-hover/orb:bg-transparent transition-colors">
                <TrendingUp className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
              </div>
            </div>
            
            <span className="font-black text-xl tracking-wider text-white font-mono flex items-center gap-2">
              Trade<span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Track</span>
              <div className="relative p-[1px] rounded-full overflow-hidden shadow-md shadow-cyan-500/20">
                <div 
                  className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 200deg, #06b6d4 260deg, #10b981 310deg, #f59e0b 360deg)'
                  }}
                />
                <span className="relative text-[10px] px-2 py-0.5 rounded-full bg-[#070A12] text-cyan-300 font-mono font-bold block">
                  PRO
                </span>
              </div>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <a href="#rules-wall" className="hidden sm:inline text-xs font-mono font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
              <span>Rules Wall</span>
            </a>
            <a href="#features" className="hidden sm:inline text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hidden sm:inline text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors">FAQ</a>

            {isLoggedIn ? (
              <button
                onClick={onEnterApp}
                className="px-5 py-2.5 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 shadow-lg shadow-cyan-500/25 rounded-xl transition-all cursor-pointer border border-cyan-300/40"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2.5 text-xs font-mono font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/15 transition-all cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={onEnterApp}
                  className="px-5 py-2.5 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 shadow-lg shadow-cyan-500/25 rounded-xl transition-all cursor-pointer border border-cyan-300/40"
                >
                  Start Journaling Free →
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-8 z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-emerald-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wide shadow-lg shadow-amber-500/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 animate-pulse" />
          <span>The Elite Trader's Mindset & Analytics Engine</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-mono leading-tight">
            Stop Guessing.<br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Master Execution.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 font-sans max-w-3xl mx-auto font-medium pt-1 leading-relaxed">
            Eliminate emotional trading leaks, track strict risk-reward ratios, and journal with institutional discipline.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 text-sm font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 shadow-2xl shadow-cyan-500/40 rounded-2xl transition-all flex items-center justify-center gap-3 cursor-pointer border border-cyan-200/50"
          >
            <span>Launch Live Journal Terminal</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <a
            href="#rules-wall"
            className="w-full sm:w-auto px-8 py-4 text-sm font-mono font-bold text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 rounded-2xl border border-amber-500/30 transition-all text-center flex items-center justify-center gap-2"
          >
            <Pin className="w-4 h-4 text-amber-400" />
            <span>Explore Trader's Pinboard</span>
          </a>
        </div>

        {/* Live Simulation Widget Preview */}
        <div className="pt-8 relative">
          <div className="rounded-2xl border border-white/15 bg-[#0A0E17]/95 p-4 sm:p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl max-w-4xl mx-auto overflow-hidden text-left font-mono">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-bold text-slate-200">TradeTrack PRO Executive Terminal</span>
              </div>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                SYSTEM ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Net Cumulative PnL</span>
                <p className="text-2xl font-black text-emerald-400">+₹1,72,470</p>
                <span className="text-[10px] text-emerald-400/90 font-bold">↑ +14.2% Portfolio Growth</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Win Rate Speedometer</span>
                <p className="text-2xl font-black text-cyan-400">72.5%</p>
                <span className="text-[10px] text-cyan-400/90 font-bold">33 Trades Logged</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101625] border border-white/10 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase tracking-wide">Rule Compliance Score</span>
                <p className="text-2xl font-black text-amber-400">96.8%</p>
                <span className="text-[10px] text-amber-300/90 font-bold">Zero Loss-Averaging Breaches</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* TRADER'S MINDSET & RULES PINBOARD WALL (THE HIGHLIGHT SECTION) */}
      {/* ========================================================================= */}
      <section id="rules-wall" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 relative z-20">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            <span>TRADING DISCIPLINE PINBOARD</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-mono text-white tracking-tight">
            Rules Written in <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">Gold & Blood</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base font-sans leading-relaxed">
            Market speculates, but rules survive. Every top trader keeps these 7 golden rules pinned above their trading desk.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All 7 Golden Rules' },
              { id: 'risk', label: '🛡️ Risk Management' },
              { id: 'mindset', label: '🧠 Mindset & Psychology' },
              { id: 'strategy', label: '📈 Strategy & Execution' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 border border-amber-300'
                    : 'bg-[#0E1424] text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned Board Grid (Inspired by User's Image) */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-[#090D18] border border-amber-500/20 shadow-2xl shadow-amber-500/5 backdrop-blur-2xl">
          
          {/* Corkboard Background Subtle Texture Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none rounded-3xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {filteredRules.map((item) => {
              const Icon = item.icon;
              const isBookmarked = bookmarkedRules.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group relative p-6 rounded-2xl border backdrop-blur-xl ${item.bgClass} ${item.rotation} hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-5 cursor-pointer`}
                >
                  {/* Push Pin Icon Header */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 z-20">
                    <div className={`w-4 h-4 rounded-full ${item.pinColor} animate-pulse`}></div>
                  </div>

                  {/* Header Badge & Action */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md bg-white/10 border border-white/15 tracking-wider">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 font-semibold">{item.tag}</span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked 
                          ? 'bg-amber-400 text-slate-950 border-amber-300' 
                          : 'bg-black/30 text-slate-400 hover:text-white border-white/10'
                      }`}
                      title={isBookmarked ? "Bookmarked Rule" : "Bookmark Rule"}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Main Quote / Rule Text */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon className="w-6 h-6 shrink-0 opacity-80 mt-1" />
                      <p className="text-base sm:text-lg font-black font-sans leading-snug tracking-tight">
                        "{item.rule}"
                      </p>
                    </div>

                    {item.highlightGif && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-center text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
                        <span className="text-xl">{item.highlightGif}</span>
                        <span className="font-bold text-amber-300">Golden Wisdom Seal</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Interaction */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-rose-400 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30 group-hover:scale-125 transition-transform" />
                      <span>{ruleLikes[item.id]} Traders Swear By This</span>
                    </button>

                    <span className="text-[10px] text-slate-400 uppercase font-bold">Rule #{item.id}</span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Motivational Sign-off banner under board */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Which rule breaks your PnL most often? Track it automatically with TradeTrack PRO.</span>
            </div>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all cursor-pointer"
            >
              Start Journaling Discipline →
            </button>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            Built for Serious <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Quantitative Edges</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Combine institutional risk metrics with deep emotional leak detection.
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
            <h3 className="text-lg font-bold font-mono text-white">Psychology Leak Tracker</h3>
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

