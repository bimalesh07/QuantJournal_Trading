import React, { useState } from 'react';
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
  KeyRound
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      let msg = 'Authentication failed. Please check your inputs.';
      if (!err.response) {
        msg = 'Unable to connect to backend server. Please verify the backend service is reachable.';
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
    <div className="min-h-screen bg-[#0B0E14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Branding & Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/20 mb-1">
            <TrendingUp className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              TradeTrack
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono">PRO</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Complete Trade Logging & PnL Analytics Engine
            </p>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="card-dark p-7 border border-slate-800/80 shadow-2xl space-y-6">
          
          {/* Toggle Switcher */}
          <div className="flex bg-[#0F131C] p-1 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/15'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/15'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter your username..."
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#0F131C] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Email Input (Registration Only) */}
            {!isLogin && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email..."
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0F131C] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Enter your password..."
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0F131C] text-xs text-white pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Unlock Dashboard' : 'Create & Protect Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Security Note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1 font-mono border-t border-slate-800/80">
            <p className="flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3 text-emerald-400" />
              Private Trading Data Security Mode Active
            </p>
          </div>

        </div>

        {/* Footer Attribution */}
        <p className="text-center text-xs text-slate-500 font-mono">
          TradeTrack PRO System · System Owner <span className="text-slate-400">Bimalesh Yadav</span>
        </p>

      </div>

    </div>
  );
}
