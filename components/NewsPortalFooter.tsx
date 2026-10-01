'use client';

import React, { useState } from 'react';
import { 
  Facebook, Twitter, Youtube, Instagram, Rss, Mail, Phone, MapPin, 
  Send, CheckCircle2, ChevronRight, Shield, Globe, Award, Sparkles 
} from 'lucide-react';
import { SiteConfig, Category } from '@/lib/newsData';

interface FooterProps {
  config: SiteConfig;
  categories?: Category[];
  onSelectCategory?: (slug: string) => void;
  onOpenAdminLogin?: () => void;
}

export const NewsPortalFooter: React.FC<FooterProps> = ({ 
  config, 
  categories = [], 
  onSelectCategory, 
  onOpenAdminLogin 
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    try {
      const existing = JSON.parse(localStorage.getItem('matribhumi_subscribers') || '[]');
      existing.push({ email: emailInput, date: new Date().toISOString() });
      localStorage.setItem('matribhumi_subscribers', JSON.stringify(existing));
      setSubscribed(true);
      setEmailInput('');
    } catch {
      setSubscribed(true);
    }
  };

  const defaultCategories = [
    { name_bn: 'জাতীয়', slug: 'national' },
    { name_bn: 'রাজনীতি', slug: 'politics' },
    { name_bn: 'অর্থনীতি', slug: 'economy' },
    { name_bn: 'আন্তর্জাতিক', slug: 'international' },
    { name_bn: 'খেলা', slug: 'sports' },
    { name_bn: 'বিনোদন', slug: 'entertainment' },
    { name_bn: 'লাইফস্টাইল', slug: 'lifestyle' },
    { name_bn: 'তথ্যপ্রযুক্তি', slug: 'tech' },
    { name_bn: 'প্রবাস', slug: 'expatriate' },
    { name_bn: 'মতামত', slug: 'opinion' },
  ];

  const catList = categories.length > 0 ? categories.slice(0, 10) : defaultCategories;

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-red-600 font-sans">
      
      {/* 1. TOP BRANDING & SOCIAL COMMUNITY ROW */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6 px-4">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo or Brand Heading */}
          <div 
            onClick={() => onSelectCategory && onSelectCategory('latest')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {config.logo_url ? (
              <img 
                src={config.logo_url} 
                alt={config.site_name || 'মাতৃভূমি টিভি'} 
                className="h-12 w-auto object-contain max-w-[220px]"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-red-600 text-white font-black text-2xl px-3 py-1 rounded-sm tracking-tight shadow-md group-hover:bg-red-700 transition-colors">
                  {config.site_name ? config.site_name.slice(0, 8) : 'মাতৃভূমি'}
                </div>
                <div className="flex items-center gap-1.5 font-black text-3xl tracking-tight text-white">
                  <span>{config.site_name ? config.site_name.slice(8) : 'টিভি'}</span>
                  <span className="text-slate-400 text-xs font-semibold tracking-normal block ml-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {config.site_url || 'matrivumi.tv'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Media Network Links */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline-block">আমাদের সাথে যুক্ত থাকুন:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
              title="Facebook Page"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-sky-500 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
              title="YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#rss"
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-amber-600 text-white flex items-center justify-center transition-all shadow-xs hover:scale-105"
              title="RSS Feed"
            >
              <Rss className="w-4 h-4" />
            </a>
          </div>

          {/* App Download Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-all shadow-2xs hover:border-slate-500">
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">GET IT ON</span>
              <span className="text-xs font-bold text-white">Google Play</span>
            </div>
            <div className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-md flex items-center gap-2 cursor-pointer transition-all shadow-2xs hover:border-slate-500">
              <span className="text-[10px] uppercase text-slate-400 block leading-tight">Download on</span>
              <span className="text-xs font-bold text-white">App Store</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN 4-COLUMN FOOTER CONTENT */}
      <div className="py-10 px-4">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 text-xs leading-relaxed">
          
          {/* COLUMN 1: EDITORIAL & REGISTRATION (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b-2 border-red-600 pb-1.5 inline-block">
              সম্পাদকীয় নেতৃত্ব ও তথ্য
            </h4>
            <div className="space-y-1.5 pt-1 text-slate-300">
              <p>
                <span className="text-slate-400 font-semibold">প্রকাশক:</span> {config.publisher_name || 'আল-আমীন সানা'}
              </p>
              <p>
                <span className="text-slate-400 font-semibold">সম্পাদক:</span> {config.editor_name || 'মো: রায়ান'}
              </p>
              <p>
                <span className="text-slate-400 font-semibold">বার্তা সম্পাদক:</span> {config.news_editor_name || 'মিরাজ হাওলাদার'}
              </p>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত অনলাইন নিউজ পোর্টাল।</span>
              </p>
              <p className="text-slate-400">
                সত্যের পাশে সবসময়। নিবিড় নিরপেক্ষতা ও বস্তুনিষ্ঠ সাংবাদিকতায় অঙ্গীকারবদ্ধ।
              </p>
            </div>
          </div>

          {/* COLUMN 2: POPULAR CATEGORIES & QUICK LINKS (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b-2 border-red-600 pb-1.5 inline-block">
              জনপ্রিয় সংবাদ ক্যাটাগরি
            </h4>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {catList.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                  className="flex items-center gap-1 text-slate-300 hover:text-red-400 transition-colors text-[11px] py-1 text-left cursor-pointer group"
                >
                  <ChevronRight className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>{cat.name_bn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* COLUMN 3: OFFICE CONTACT & LOCATION (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b-2 border-red-600 pb-1.5 inline-block">
              যোগাযোগ ও প্রধান কার্যালয়
            </h4>
            <div className="space-y-2 pt-1">
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{config.address || 'কাকরাইল, ঢাকা-১০০০, বাংলাদেশ'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>ফোন/হটলাইন: {config.phone || '০১৯১৩৪৪৯৯৯৭'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>ইমেইল: {config.email || 'news@matrivumi.tv'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>ওয়েবসাইট: {config.site_url || 'www.matrivumi.tv'}</span>
              </p>
            </div>
          </div>

          {/* COLUMN 4: NEWSLETTER & IMPORTANT LINKS (3 COLS) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b-2 border-red-600 pb-1.5 inline-block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>নিউজলেটার ও আপডেট</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              প্রতিদিনের ব্রেকিং নিউজ এবং বিশেষ বুলেটিন সরাসরি ইমেইলে পেতে সাবস্ক্রাইব করুন।
            </p>

            {subscribed ? (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/60 p-2.5 rounded-md border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ধন্যবাদ! সফলভাবে সাবস্ক্রাইব করা হয়েছে।</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>সাবস্ক্রাইব করুন</span>
                </button>
              </form>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
              <a href="#about" className="hover:text-red-400 transition-colors">আমাদের কথা</a>
              <span>•</span>
              <a href="#ad" className="hover:text-red-400 transition-colors">বিজ্ঞাপন দর</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-red-400 transition-colors">গোপনীয়তা নীতি</a>
              <span>•</span>
              <a href="#terms" className="hover:text-red-400 transition-colors">শর্তাবলী</a>
            </div>
          </div>

        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT */}
      <div className="bg-black py-4 px-4 border-t border-slate-900 text-center text-[11px] text-slate-400">
        <div className="max-w-[1240px] mx-auto text-center">
          <p>{config.copyright_text || '© ২০২৬ মাতৃভূমি টিভি (matrivumi.tv)। সর্বস্বত্ব সংরক্ষিত।'}</p>
        </div>
      </div>

    </footer>
  );
};

