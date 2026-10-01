'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, Lock, User, 
  Eye, EyeOff, AlertCircle, Sparkles, Newspaper
} from 'lucide-react';
import { authenticateUser } from '@/lib/newsData';

export default function AdminLoginPage() {
  const [mounted, setMounted] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect to /admin
    if (typeof window !== 'undefined') {
      const isLogged = localStorage.getItem('matribhumi_admin_logged');
      if (isLogged === 'true') {
        window.location.href = '/admin';
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = loginId.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setError('অনুগ্রহ করে ইউজার আইডি বা ইমেইল লিখুন');
      return;
    }
    if (!cleanPass) {
      setError('অনুগ্রহ করে পাসওয়ার্ড লিখুন');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const authResult = authenticateUser(cleanId, cleanPass);
      setIsLoading(false);

      if (authResult.success && authResult.user) {
        const roleLabel = authResult.user.role === 'Admin' 
          ? 'প্রধান প্রশাসক' 
          : authResult.user.role === 'Editor' 
            ? 'সম্পাদক' 
            : 'রিপোর্টার';
        setSuccessMsg(`স্বাগতম, ${authResult.user.name} (${roleLabel})! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...`);
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/admin';
          }
        }, 500);
      } else {
        setError(authResult.error || 'ভুল ইউজার আইডি বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
      }
    }, 400);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-red-600 selection:text-white">
      
      {/* Background visual glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-slate-900 text-white p-7 text-center relative border-b border-slate-800">
          <a 
            href="/" 
            className="absolute left-5 top-5 w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors border border-white/10"
            title="মূল ওয়েবসাইটে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </a>

          <div className="w-16 h-16 bg-red-600/20 border-2 border-red-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-red-600/20 mb-3">
            <ShieldCheck className="w-9 h-9 text-red-500" />
          </div>

          <h1 className="text-2xl font-black tracking-wide font-serif text-white">
            মাতৃভূমি টিভি সিএমএস
          </h1>
          <p className="text-xs text-red-200 mt-1 font-medium">
            নিউজ রুম ও কন্ট্রোল প্যানেল লগইন
          </p>
        </div>

        {/* Login Body Form */}
        <div className="p-7 space-y-6">

          {successMsg ? (
            <div className="py-10 text-center space-y-3 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-white">লগইন সফল হয়েছে!</h3>
              <p className="text-xs text-emerald-300">{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              
              {error && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-950/80 border border-red-900 text-red-200 rounded-xl animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* User ID / Email Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  ইউজার আইডি বা ইমেইল (User ID / Email) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="আপনার ইউজার আইডি বা ইমেইল লিখুন..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-medium transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-300">
                  পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-red-600/30 cursor-pointer flex items-center justify-center gap-2 mt-3"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center pt-2 leading-relaxed">
                অ্যাডমিন, বার্তা সম্পাদক ও অনুমোদিত রিপোর্টারগণ তাদের নির্ধারিত আইডি ও পাসওয়ার্ড দিয়ে সরাসরি সিস্টেমে লগইন করতে পারবেন।
              </p>

            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-950 px-6 py-4 text-center border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <Newspaper className="w-3.5 h-3.5 text-red-500" />
          <span>মাতৃভূমি টিভি নিউজ পোর্টাল © ২০২৬ | সর্বস্বত্ব সংরক্ষিত</span>
        </div>

      </div>
    </main>
  );
}
