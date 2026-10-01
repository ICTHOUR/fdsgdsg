'use client';

import React, { useState } from 'react';
import { 
  Lock, User, ShieldCheck, X, AlertCircle, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { authenticateUser } from '@/lib/newsData';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userRole: 'admin' | 'editor', userName: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
        const mappedRole: 'admin' | 'editor' = authResult.user.role === 'Admin' ? 'admin' : 'editor';
        setSuccessMsg(`লগইন সফল! স্বাগতম, ${authResult.user.name}`);
        setTimeout(() => {
          onLoginSuccess(mappedRole, authResult.user?.name || 'ব্যবহারকারী');
        }, 400);
      } else {
        setError(authResult.error || 'ভুল ইউজার আইডি বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif">মাতৃভূমি টিভি সিএমএস</h3>
              <p className="text-[11px] text-red-100">নিউজ রুম ও কন্ট্রোল প্যানেল লগইন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-700 hover:bg-red-800 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5 text-xs">
          
          {successMsg ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{successMsg}</p>
              <p className="text-slate-500 text-[11px]">ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ইউজার আইডি বা ইমেইল (User ID / Email) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="আপনার ইউজার আইডি বা ইমেইল..."
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
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

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1">
                অ্যাডমিন, বার্তা সম্পাদক ও অনুমোদিত রিপোর্টারগণ তাদের নির্ধারিত আইডি ও পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
              </p>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3 text-center text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800">
          নিরাপদ নিউজ রুম ম্যানেজমেন্ট সিস্টেম © ২০২৬ মাতৃভূমি টিভি
        </div>
      </div>
    </div>
  );
};
