'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Search, ChevronDown, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, 
  Youtube, Instagram, Flame, Video, Globe, X, SlidersHorizontal, Settings, Sun, Moon
} from 'lucide-react';
import { Category, INITIAL_TAGS, Post, AdUnit } from '@/lib/newsData';
import { getTodayBanglaDateString, getBengaliAndHijriDateString } from '@/lib/utils';
import { MobileNav } from '@/components/MobileNav';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (slug: string | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  breakingPosts?: Post[];
  onSelectPost?: (post: Post) => void;
  topAd?: AdUnit | null;
  iccbAd?: AdUnit | null;
  siteConfig?: any;
  onOpenMobileMenu?: () => void;
  onOpenAdminLogin?: () => void;
}

export const BanglaNewsHeader: React.FC<HeaderProps> = ({
  categories = [],
  selectedCategory = null,
  onSelectCategory = () => {},
  selectedTag = null,
  onSelectTag = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  breakingPosts = [],
  onSelectPost = () => {},
  topAd = null,
  iccbAd = null,
  siteConfig = {},
  onOpenMobileMenu = () => {},
  onOpenAdminLogin = () => {},
}) => {
  const [socialOpen, setSocialOpen] = useState(false);
  const [bibidhOpen, setBibidhOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const socialRef = useRef<HTMLDivElement>(null);
  const bibidhRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      trendingRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('matribhumi_dark') === 'true';
    setIsDarkMode(stored);
    if (stored) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('matribhumi_dark', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (socialRef.current && !socialRef.current.contains(event.target as Node)) {
        setSocialOpen(false);
      }
      if (bibidhRef.current && !bibidhRef.current.contains(event.target as Node)) {
        setBibidhOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ticker cycle
  useEffect(() => {
    if (breakingPosts.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingPosts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [breakingPosts.length]);

  const currentBreaking = breakingPosts[tickerIndex] || breakingPosts[0] || null;

  // Mini sports news shown in the header (exact screenshot 2)
  const miniHeaderNews = [
    {
      id: 991,
      title: 'খেলোয়াড়, নিয়োগকর্তা, অর্থদাতা: সান্তোসে নেইমারই যেন সব',
      image: 'https://picsum.photos/seed/neymarmini/80/60',
    },
    {
      id: 992,
      title: 'নিগার অধিনায়ক থাকছেন, তবে কত দিন?',
      image: 'https://picsum.photos/seed/nigarsports/80/60',
    },
    {
      id: 993,
      title: '২০৩০ বিশ্বকাপের ফাইনাল নিয়ে স্পেন-মরক্কোর কথার লড়াই',
      image: 'https://picsum.photos/seed/worldcupmini/80/60',
    },
  ];

  const bibidhItems = [
    { name_bn: 'লাইফস্টাইল', slug: 'lifestyle' },
    { name_bn: 'তথ্যপ্রযুক্তি', slug: 'tech' },
    { name_bn: 'শিক্ষা', slug: 'education' },
    { name_bn: 'স্বাস্থ্য', slug: 'health' },
    { name_bn: 'আইন ও আদালত', slug: 'law' },
    { name_bn: 'প্রবাস', slug: 'expatriate' },
    { name_bn: 'মতামত', slug: 'opinion' },
  ];

  const primaryNavSlugs = ['national', 'politics', 'economy', 'international', 'sports', 'chattogram', 'country', 'features', 'entertainment', 'islam'];
  const primaryNavCategories = categories.filter((c) => primaryNavSlugs.includes(c.slug));

  return (
    <>
      {/* 1. TOP HEADER BRANDING & INFO BAR (Dynamic Layout based on siteConfig.header_style) */}
      <header className={`border-b transition-colors ${
        siteConfig?.header_style === 'gradient'
          ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white border-red-900 shadow-lg'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}>
        
        {/* LAYOUT 1: CLASSIC (Left Logo, Middle Sports Highlights, Right Controls) */}
        {(siteConfig?.header_style === 'classic' || !siteConfig?.header_style) && (
          <div className="max-w-[1240px] mx-auto px-3 sm:px-4 py-2.5 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 animate-in fade-in">
            {/* Left: Brand Logo */}
            <div 
              onClick={() => { onSelectCategory(null); onSelectTag(null); }}
              className="cursor-pointer flex items-center gap-2.5 shrink-0 group select-none"
            >
              {siteConfig?.logo_url ? (
                <img 
                  src={siteConfig.logo_url} 
                  alt={siteConfig.site_name || 'মাতৃভূমি টিভি'} 
                  className="h-10 sm:h-12 w-auto object-contain max-w-[240px]"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all text-white font-black text-2xl sm:text-3xl px-3 py-1 rounded shadow-sm tracking-tight flex items-center">
                    <span>{siteConfig?.site_name ? siteConfig.site_name.slice(0, 8) : 'মাতৃভূমি'}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-950 dark:text-white font-black text-2xl sm:text-3xl tracking-tighter">
                        {siteConfig?.site_name ? siteConfig.site_name.slice(8) : 'টিভি'}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-wider">
                      {siteConfig?.site_url || 'matrivumi.tv'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: 3 Mini Sports Highlights (Desktop XL only) */}
            <div className="hidden xl:flex items-center gap-3.5 border-x border-slate-200 dark:border-slate-800 px-4">
              {miniHeaderNews.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectCategory('sports')}
                  className="flex items-center gap-2 max-w-[210px] cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                >
                  <img 
                    src={item.image} 
                    alt="" 
                    className="w-12 h-10 object-cover rounded shrink-0 group-hover:opacity-90 shadow-2xs"
                  />
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Right: Date and Control buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5 shrink-0">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600 fill-slate-400" />}
                <span className="hidden sm:inline">{isDarkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                <span>খুঁজুন</span>
              </button>
              {/* Date */}
              <div className="hidden sm:flex flex-col items-center md:items-end text-center md:text-right border-l border-slate-200 dark:border-slate-800 pl-3 ml-1">
                <div className="text-slate-700 dark:text-slate-200 text-xs leading-tight font-semibold" suppressHydrationWarning>
                  {getTodayBanglaDateString()}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] leading-tight mt-0.5" suppressHydrationWarning>
                  {getBengaliAndHijriDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 2: CENTERED (Centered Logo, Centered Slogan, Date on Left, Controls on Right) */}
        {siteConfig?.header_style === 'centered' && (
          <div className="max-w-[1240px] mx-auto px-4 py-4 sm:py-6 flex flex-col items-center gap-4 text-center animate-in fade-in">
            {/* Top Bar for Date and Search Buttons */}
            <div className="w-full flex items-center justify-between border-b border-slate-150 dark:border-slate-800/80 pb-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-col items-start leading-relaxed">
                <span className="font-bold text-red-600 dark:text-red-400">{getTodayBanglaDateString()}</span>
                <span>{getBengaliAndHijriDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                </button>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>খুঁজুন</span>
                </button>
              </div>
            </div>

            {/* Massive Centered Branding */}
            <div 
              onClick={() => { onSelectCategory(null); onSelectTag(null); }}
              className="cursor-pointer flex flex-col items-center gap-1.5 select-none"
            >
              {siteConfig?.logo_url ? (
                <img 
                  src={siteConfig.logo_url} 
                  alt={siteConfig.site_name} 
                  className="h-14 sm:h-18 w-auto object-contain max-w-[340px]"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="bg-red-600 text-white font-black text-3xl sm:text-5xl px-4 py-1 rounded shadow-lg">
                    <span>{siteConfig?.site_name ? siteConfig.site_name.slice(0, 8) : 'মাতৃভূমি'}</span>
                  </div>
                  <span className="text-slate-950 dark:text-white font-black text-3xl sm:text-5xl tracking-tighter">
                    {siteConfig?.site_name ? siteConfig.site_name.slice(8) : 'টিভি'}
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md shrink-0">
                    LIVE
                  </span>
                </div>
              )}
              <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest max-w-[500px]">
                {siteConfig?.site_slogan || 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা'}
              </p>
            </div>
          </div>
        )}

        {/* LAYOUT 3: MINIMAL (Ultra Sleek, Single Horizontal Header Row) */}
        {siteConfig?.header_style === 'minimal' && (
          <div className="max-w-[1240px] mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between gap-4 animate-in fade-in">
            {/* Minimal Logo */}
            <div 
              onClick={() => { onSelectCategory(null); onSelectTag(null); }}
              className="cursor-pointer flex items-center gap-1.5 select-none shrink-0"
            >
              <div className="bg-red-600 text-white font-black text-lg sm:text-xl px-2 py-0.5 rounded shadow-xs">
                <span>{siteConfig?.site_name ? siteConfig.site_name.slice(0, 8) : 'মাতৃভূমি'}</span>
              </div>
              <span className="text-slate-950 dark:text-white font-black text-lg sm:text-xl">
                {siteConfig?.site_name ? siteConfig.site_name.slice(8) : 'টিভি'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>

            {/* Quick Slogan (Desktop only) */}
            <span className="hidden md:inline text-xs font-bold text-slate-500 dark:text-slate-400 italic truncate max-w-sm">
              {siteConfig?.site_slogan}
            </span>

            {/* Compact Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 hover:text-red-500 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                title="খুঁজুন"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="text-right text-[10px] sm:text-xs text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-2 leading-none font-bold">
                <div>{getTodayBanglaDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: GRADIENT EDITORIAL (Dark Premium Gradient Theme, Gold Branding Accents) */}
        {siteConfig?.header_style === 'gradient' && (
          <div className="max-w-[1240px] mx-auto px-4 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
            {/* Golden Logo */}
            <div 
              onClick={() => { onSelectCategory(null); onSelectTag(null); }}
              className="cursor-pointer flex flex-col md:items-start items-center select-none shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="bg-amber-500 hover:bg-amber-600 transition-all text-slate-950 font-black text-2xl sm:text-3.5xl px-3.5 py-1 rounded-lg shadow-lg tracking-tight">
                  <span>{siteConfig?.site_name ? siteConfig.site_name.slice(0, 8) : 'মাতৃভূমি'}</span>
                </div>
                <span className="text-white font-black text-2xl sm:text-3.5xl tracking-tighter">
                  {siteConfig?.site_name ? siteConfig.site_name.slice(8) : 'টিভি'}
                </span>
                <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-widest uppercase">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-300/80 tracking-widest mt-1.5">
                {siteConfig?.site_slogan || 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা'}
              </p>
            </div>

            {/* Gradient Center: 3 Highlights */}
            <div className="hidden xl:flex items-center gap-4 bg-black/35 border border-red-900/40 p-1.5 rounded-xl px-4">
              {miniHeaderNews.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectCategory('sports')}
                  className="flex items-center gap-2 max-w-[190px] cursor-pointer group p-1 transition-colors"
                >
                  <img 
                    src={item.image} 
                    alt="" 
                    className="w-10 h-8 object-cover rounded-lg shrink-0 border border-slate-800"
                  />
                  <p className="text-[10px] font-semibold text-slate-200 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Gradient Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 cursor-pointer"
                title="থিম পরিবর্তন"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-200" />}
              </button>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>খুঁজুন</span>
              </button>
              <div className="text-right border-l border-white/15 pl-3 leading-tight">
                <div className="text-amber-300 text-xs font-black">{getTodayBanglaDateString()}</div>
                <div className="text-slate-300 text-[10px] font-semibold">{getBengaliAndHijriDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Search Input when triggered from top */}
        {searchOpen && (
          <div className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-2.5">
            <div className="max-w-[700px] mx-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="মাতৃভূমি টিভিতে যে কোনো সংবাদ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs focus:outline-hidden focus:border-red-600 shadow-xs"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer text-xs font-bold px-3 shrink-0"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. STICKY NAVIGATION BAR (Always sticky at top-0 z-50 on both Mobile & Desktop during scroll) */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-xs">
        
        {/* MOBILE STICKY NAVIGATION HEADER (lg:hidden) */}
        <div className="lg:hidden flex flex-col">
          {/* Mobile Top Header Row: Menu Button + Logo + Live Badge + Search + Theme */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MobileNav
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
                onSelectTag={onSelectTag}
                onOpenMenu={onOpenMobileMenu}
              />
              <div 
                onClick={() => { onSelectCategory(null); onSelectTag(null); }}
                className="cursor-pointer flex items-center gap-1.5"
              >
                <div className="bg-red-600 text-white font-black text-lg px-2 py-0.5 rounded-sm tracking-tight flex items-center">
                  <span>মাতৃভূমি</span>
                </div>
                <span className="text-slate-950 dark:text-white font-black text-lg tracking-tighter">টিভি</span>
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase animate-pulse">
                  LIVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="খুঁজুন"
              >
                <Search className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="থিম পরিবর্তন"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Mobile Categories Horizontal Scrollable Strip */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-3 py-1.5 text-xs whitespace-nowrap bg-slate-50 dark:bg-slate-950">
            <button
              onClick={() => { onSelectCategory(null); onSelectTag(null); }}
              className={`p-2 rounded font-bold transition-colors shrink-0 cursor-pointer sticky left-0 z-20 bg-slate-50 dark:bg-slate-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] flex items-center justify-center ${
                selectedCategory === null && selectedTag === null
                  ? 'bg-red-600 text-white'
                  : 'text-slate-800 dark:text-slate-200 hover:text-red-600'
              }`}
              title="প্রচ্ছদ"
            >
              <Home className={`w-4 h-4 ${selectedCategory === null && selectedTag === null ? 'text-white' : 'text-red-600'}`} />
            </button>
            <button
              onClick={() => { onSelectCategory('latest'); onSelectTag(null); }}
              className={`px-3 py-1 rounded font-semibold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'latest'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-red-600'
              }`}
            >
              সর্বশেষ
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isActive ? null : cat.slug)}
                  className={`px-3 py-1 rounded font-semibold transition-colors shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-slate-800 dark:text-slate-200 hover:text-red-600'
                  }`}
                >
                  {cat.name_bn}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP NAVIGATION BAR (hidden on mobile, lg:flex) */}
        <div className="hidden lg:flex max-w-[1240px] mx-auto px-4 items-center justify-between">
          <div className="flex items-center overflow-x-auto no-scrollbar py-1 w-full relative">
            {/* Home Icon / Prochhod (Sticky pinned on left) */}
            <div className="sticky left-0 z-20 bg-white dark:bg-slate-900 pr-2 flex items-center shrink-0 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)]">
              <button
                onClick={() => { onSelectCategory(null); onSelectTag(null); }}
                className={`p-2 transition-colors cursor-pointer border-b-2 flex items-center justify-center ${
                  selectedCategory === null && selectedTag === null
                    ? 'text-red-600 border-red-600 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:text-red-600 border-transparent'
                }`}
                title="প্রচ্ছদ (হোম)"
              >
                <Home className="w-4 h-4 text-red-600" />
              </button>
            </div>

            {/* সর্বশেষ */}
            <button
              onClick={() => { onSelectCategory('latest'); onSelectTag(null); }}
              className={`px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                selectedCategory === 'latest'
                  ? 'text-red-600 border-red-600 font-bold'
                  : 'text-slate-800 dark:text-slate-200 hover:text-red-600 border-transparent'
              }`}
            >
              সর্বশেষ
            </button>

            {/* Standard Category Links */}
            {primaryNavCategories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isActive ? null : cat.slug)}
                  className={`px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-red-600 border-red-600 font-bold'
                      : 'text-slate-800 dark:text-slate-200 hover:text-red-600 border-transparent'
                  }`}
                >
                  {cat.name_bn}
                </button>
              );
            })}

            {/* বিবিধ Dropdown */}
            <div className="relative hidden lg:block" ref={bibidhRef}>
              <button
                onClick={() => setBibidhOpen(!bibidhOpen)}
                className={`px-3 py-2 text-sm font-semibold flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  bibidhOpen ? 'text-red-600' : 'text-slate-800 dark:text-slate-200 hover:text-red-600'
                }`}
              >
                <span>বিবিধ</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bibidhOpen ? 'rotate-180' : ''}`} />
              </button>

              {bibidhOpen && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-md shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in duration-100">
                  {bibidhItems.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => {
                        onSelectCategory(item.slug);
                        setBibidhOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      {item.name_bn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons (Live TV / Video) */}
          <div className="hidden sm:flex items-center gap-2 pl-2 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('video-gallery-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onSelectCategory('video');
              }}
              className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 rounded transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Video className="w-3.5 h-3.5" />
              <span>লাইভ টিভি / ভিডিও</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. BREAKING TICKER & TRENDING TAGS & BANNER */}
      <div className="bg-white dark:bg-slate-900">
        {/* BREAKING TICKER */}
        <div className="border-b border-slate-200 dark:border-slate-800 py-1.5 px-4 overflow-hidden">
          <div className="max-w-[1240px] mx-auto flex items-center gap-3">
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-xs shrink-0 flex items-center gap-1.5 z-10 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>শীর্ষ সংবাদ</span>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="animate-marquee flex items-center gap-8 whitespace-nowrap py-0.5">
                {breakingPosts.length > 0 ? (
                  breakingPosts.concat(breakingPosts).map((post, idx) => (
                    <div
                      key={`${post.id}-${idx}`}
                      onClick={() => onSelectPost && onSelectPost(post)}
                      className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600 transition-colors cursor-pointer group shrink-0"
                    >
                      <span className="text-red-600 font-bold">•</span>
                      <span className="group-hover:underline">{post.title}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">• মাতৃভূমি টিভিতে ২৪ ঘণ্টা তাজা সংবাদ ও আন্তর্জাতিক খবরাখবর</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">• সত্যের সন্ধানে নির্ভীক সাংবাদিকতা</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">• জনকল্যাণে আপসহীন সম্প্রচার</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRENDING TOPICS ROW (REDESIGNED WITH SMOOTH SCROLL, ARROWS & BADGE) */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 py-2 px-3 sm:px-4 backdrop-blur-xs">
          <div className="max-w-[1240px] mx-auto flex items-center gap-2">
            
            {/* Trending Badge */}
            <div className="flex items-center gap-1.5 bg-red-600 text-white text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full shrink-0 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-white text-white animate-bounce" />
              <span className="tracking-wide uppercase">ট্রেন্ডিং:</span>
            </div>

            {/* Left Scroll Arrow */}
            <button
              onClick={() => scrollTrending('left')}
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 shrink-0 shadow-2xs transition-all cursor-pointer"
              title="বাম দিকে স্ক্রল করুন"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Scrollable / Draggable Tag Strip */}
            <div
              ref={trendingRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar py-0.5 px-1"
            >
              {INITIAL_TAGS.map((tag) => {
                const isSelected = selectedTag === tag.slug;
                return (
                  <button
                    key={tag.id}
                    onClick={() => onSelectTag(isSelected ? null : tag.slug)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 font-bold shadow-xs scale-102'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-red-500 font-bold text-[10px]">#</span>
                    <span>{tag.name_bn}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scrollTrending('right')}
              className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 shrink-0 shadow-2xs transition-all cursor-pointer"
              title="ডান দিকে স্ক্রল করুন"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

        {/* LEADERBOARD AD BANNER */}
        <div className="py-2.5 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-[920px] mx-auto text-center">
            <a
              href={iccbAd?.redirect_url || 'https://matribhumitv.com'}
              target="_blank"
              rel="noreferrer"
              className="block relative hover:opacity-95 transition-opacity"
            >
              <div className="w-full h-20 sm:h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-between px-4 sm:px-8 text-white shadow-2xs">
                <div className="text-left">
                  <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    বিজ্ঞাপন
                  </span>
                  <h4 className="text-base sm:text-xl font-black text-amber-400 mt-1">
                    International Convention City Bashundhara (ICCB)
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300">
                    Book Your Event Now • Hotline: <span className="text-white font-bold font-mono">01969-999866</span>
                  </p>
                </div>
                <div className="hidden sm:block">
                  <span className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                    বুকিং দিন
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
