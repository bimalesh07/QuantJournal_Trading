import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Lock, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  KeyRound,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import InstitutionalOrderflowCanvas from './InstitutionalOrderflowCanvas';

export default function AuthScreen({ onAuthSuccess, onBackToHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mouse-following Spotlight State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleFillDemo = () => {
    setFormData({
      username: 'bimalesh',
      password: 'password123',
      email: 'bimalesh@tradetrack.pro',
      first_name: 'Bimalesh'
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        onAuthSuccess(data);
      } else {
        const data = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name || formData.username,
        });
        onAuthSuccess(data);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      let msg = 'Authentication failed. Please check your credentials.';
      if (!err.response) {
        msg = 'Connecting to cloud backend... If server is sleeping, please wait ~20 seconds and click Unlock Dashboard again!';
      } else if (err.response.data?.error) {
        msg = err.response.data.error;
      } else if (err.response.data?.detail) {
        msg = err.response.data.detail;
      } else if (typeof err.response.data === 'object') {
        const firstKey = Object.keys(err.response.data)[0];
        const val = err.response.data[firstKey];
        const detailText = Array.isArray(val) ? val.join(', ') : String(val);
        msg = `${firstKey}: ${detailText}`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Dynamic Mouse-Following Reactive Radial Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.14), rgba(6, 182, 212, 0.08) 40%, transparent 80%)`
        }}
      />

      {/* Cyber Grid Background Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0"></div>

      {/* Animated Institutional Orderflow Canvas Background */}
      <InstitutionalOrderflowCanvas />

      {/* Top Left Navigation back to Landing Page */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="absolute top-6 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1322]/90 hover:bg-[#151E33] text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/15 transition-all cursor-pointer shadow-xl backdrop-blur-xl group hover:border-cyan-500/40"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Landing Page</span>
        </button>
      )}

      {/* Top Right System Status Pulse */}
      <div className="absolute top-6 right-6 z-30 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-bold backdrop-blur-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>256-BIT QUANTUM SECURITY ACTIVE</span>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md relative z-10 space-y-6 my-8">
        
        {/* Logo & Header with Rotating Neon Beam */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl p-[2px] overflow-hidden shadow-2xl shadow-cyan-500/30 mb-1 group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div 
              className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 220deg, #06b6d4 270deg, #10b981 320deg, #f59e0b 360deg)'
              }}
            />
            <div className="relative w-full h-full bg-[#05070D] rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-cyan-400 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white tracking-wider font-mono flex items-center justify-center gap-2">
              Trade<span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Track</span>
              <div className="relative p-[1px] rounded-full overflow-hidden shadow-md shadow-cyan-500/20">
                <div 
                  className="absolute -inset-[150%] animate-spin-slow opacity-100 pointer-events-none"
                  style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 200deg, #06b6d4 260deg, #10b981 310deg, #f59e0b 360deg)'
                  }}
                />
                <span className="relative px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[#05070D] text-cyan-300 rounded-full block">
                  PRO
                </span>
              </div>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Executive Quantitative Trading Terminal
            </p>
          </div>
        </div>

        {/* Auth Glassmorphic Card Container with Animated Running Neon Border Beam */}
        <div className="relative p-[2px] rounded-[26px] overflow-hidden shadow-2xl shadow-cyan-500/25 group transition-transform duration-300">
          
          {/* Continuous Rotating Neon Border Beam */}
          <div 
            className="absolute -inset-[150%] animate-spin-slow opacity-90 pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 230deg, #06b6d4 280deg, #10b981 320deg, #f59e0b 360deg)'
            }}
          />
          
          {/* Outer Ambient Glow Effect around Card */}
          <div className="absolute inset-0 rounded-[26px] shadow-[0_0_35px_rgba(6,182,212,0.35)] pointer-events-none"></div>

          {/* Inner Glassmorphic Card Content */}
          <div className="relative p-7 sm:p-8 rounded-[24px] bg-[#070A14]/95 backdrop-blur-2xl space-y-6">
          
            {/* Subtle Top Card Gradient Edge */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>

            {/* Tab Switcher (Log In / Create Account) */}
            <div className="relative flex bg-[#0D1220] p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-mono font-bold rounded-xl transition-all duration-300 cursor-pointer z-10 ${
                  isLogin
                    ? 'text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-2.5 text-xs font-mono font-bold rounded-xl transition-all duration-300 cursor-pointer z-10 ${
                  !isLogin
                    ? 'text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Helper Tag */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 px-1">
              <span>{isLogin ? 'Enter authorized credentials' : 'Register new trader profile'}</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Zap className="w-3 h-3 fill-amber-400" />
                Auto-fill Demo
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 rounded-2xl text-xs font-mono text-rose-300 flex items-start gap-2.5 animate-fadeIn shadow-lg">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1 animate-pulse"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Username</span>
                  <span className="text-[10px] text-slate-500 lowercase font-normal">required</span>
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="e.g. bimalesh"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[#0D1220] text-xs font-mono text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>

              {/* Email Field (Registration Only) */}
              {!isLogin && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-500 lowercase font-normal">required</span>
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="trader@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#0D1220] text-xs font-mono text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-500 lowercase font-normal">encrypted</span>
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0D1220] text-xs font-mono text-white pl-10 pr-10 py-3 rounded-xl border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 mt-3 border border-cyan-200/50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2.5 font-mono">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin shrink-0"></div>
                    <span>Authenticating Terminal...</span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? 'Unlock Dashboard Terminal' : 'Create & Protect Account'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>

            </form>

            {/* Security Shield Footer */}
            <div className="pt-3 border-t border-white/10 text-center text-[11px] text-slate-400 font-mono space-y-1">
              <p className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Isolated Database Encryption Active
              </p>
            </div>

          </div>

        </div>


        {/* Footer Credit */}
        <p className="text-center text-xs text-slate-500 font-mono">
          TradeTrack PRO System • Owner <span className="text-emerald-400 font-bold">Bimalesh Yadav</span>
        </p>

      </div>

    </div>
  );
}

