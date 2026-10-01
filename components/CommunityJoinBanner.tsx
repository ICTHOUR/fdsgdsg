'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Send, Youtube, Facebook, 
  Share2, Check, QrCode, X, Sparkles, Bell, ExternalLink 
} from 'lucide-react';

export const CommunityJoinBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://whatsapp.com/channel/matribhumitv');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="community-join-banner" className="my-8 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 sm:p-7 shadow-xl border border-emerald-600/30 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-48 h-48 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Headline & Description */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-400/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full font-serif backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>সবার আগে ব্রেকিং নিউজ সরাসরি আপনার ফোনে!</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight leading-tight">
            মাতৃভূমি টিভি হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হোন
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/90 font-sans max-w-xl">
            প্রতিটি গুরুত্বপূর্ণ ঘটনা, লাইভ বুলেটিন, খেলাধুলার স্কোর এবং স্পেশাল রিপোর্টের ইনস্ট্যান্ট নোটিফিকেশন পেতে আমাদের অফিশিয়াল সোশ্যাল মিডিয়া নেটওয়ার্কে ফলো করুন।
          </p>
        </div>

        {/* Right: Action Buttons Group */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 shrink-0">
          {/* WhatsApp Channel CTA Button */}
          <a
            href="https://whatsapp.com/channel/matrivumitv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black font-serif px-4 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer text-sm"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp চ্যানেল</span>
            <span className="bg-slate-950/20 text-slate-950 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
              120K+
            </span>
          </a>

          {/* Facebook Group */}
          <a
            href="https://facebook.com/matrivumitv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#1565cc] text-white font-bold font-serif px-3.5 py-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer text-xs"
          >
            <Facebook className="w-4 h-4 fill-white" />
            <span>Facebook</span>
          </a>

          {/* YouTube Channel */}
          <a
            href="https://youtube.com/@matrivumitv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold font-serif px-3.5 py-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer text-xs"
          >
            <Youtube className="w-4 h-4 fill-white" />
            <span>YouTube</span>
          </a>

          {/* Telegram Alert */}
          <a
            href="https://t.me/matrivumitv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1c84b5] text-white font-bold font-serif px-3.5 py-2.5 rounded-xl transition-all hover:scale-105 cursor-pointer text-xs"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>Telegram</span>
          </a>

          {/* QR Code Trigger Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-emerald-200 hover:text-white rounded-xl border border-emerald-500/40 transition-colors cursor-pointer"
            title="QR কোড স্ক্যান করুন"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-emerald-200 hover:text-white px-3 py-2.5 rounded-xl border border-emerald-500/40 transition-colors cursor-pointer text-xs font-serif"
            title="চ্যানেল লিংক কপি করুন"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে!' : 'লিংক'}</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal for Mobile Quick Join */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 fill-emerald-700" />
            </div>

            <h4 className="text-lg font-bold font-serif">হোয়াটসঅ্যাপ চ্যানেল কিউআর কোড</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4 font-sans">
              আপনার মোবাইলের ক্যামেরা দিয়ে স্ক্যান করে সরাসরি চ্যানেলে যুক্ত হোন
            </p>

            {/* Simulated Clean Styled QR Box */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-emerald-300 rounded-xl inline-block mb-4">
              <div className="w-44 h-44 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center p-2 shadow-inner">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://whatsapp.com/channel/matrivumitv"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold font-serif py-2.5 rounded-xl shadow transition-colors text-sm"
              >
                সরাসরি WhatsApp-এ খুলুন &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
