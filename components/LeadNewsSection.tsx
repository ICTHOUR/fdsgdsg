'use client';

import React, { useState } from 'react';
import { Post, AdUnit } from '@/lib/newsData';
import { MessageCircle } from 'lucide-react';
import { formatBanglaNumber } from '@/lib/utils';

interface LeadProps {
  mainLead: Post | null;
  subLeads: Post[];
  leftPosts: Post[];
  allPosts: Post[];
  onSelectPost: (post: Post) => void;
  ads: AdUnit[];
}

export const LeadNewsSection: React.FC<LeadProps> = ({
  mainLead,
  subLeads,
  leftPosts,
  allPosts,
  onSelectPost,
  ads,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [activeLeadIndex, setActiveLeadIndex] = useState<number>(0);

  // Array of top highlighted posts for the left lead card
  const leadList = [mainLead, ...subLeads].filter(Boolean) as Post[];
  const currentLead = leadList[activeLeadIndex] || mainLead || leadList[0];

  // Tabbed list news for right column widget
  const latestList = allPosts.slice(0, 10);
  const popularList = [...allPosts].sort((a, b) => b.views - a.views).slice(0, 10);
  const displayedTabList = activeTab === 'latest' ? latestList : popularList;

  return (
    <section className="py-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 space-y-6">
        
        {/* =========================================================
            1. MAIN TOP GRID (COMPACT FEATURED LEAD + TABBED WIDGET)
            Matches user requirement and demo screenshot (image.png)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ---------------------------------------------------------
              LEFT COLUMN (58% / 7 cols): COMPACT MAIN LEAD FEATURE CARD
              --------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-3">
            {currentLead && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-white dark:bg-slate-950 p-2 sm:p-2.5 shadow-xs group">
                
                {/* Photo with Overlay Headline at bottom of image */}
                <div 
                  onClick={() => onSelectPost(currentLead)}
                  className="relative overflow-hidden rounded-xs cursor-pointer aspect-[16/9.5] bg-slate-900"
                >
                  <img
                    src={currentLead.image}
                    alt={currentLead.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  {currentLead.category_name_bn && (
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-xs shadow-xs z-10">
                      {currentLead.category_name_bn}
                    </span>
                  )}

                  {/* Gradient Title Overlay at bottom of Image */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3 sm:p-4 pt-10">
                    <h2 className="text-base sm:text-xl lg:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug sm:leading-snug">
                      {currentLead.title}
                    </h2>
                  </div>
                </div>

                {/* Summary Excerpt below Image */}
                <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xs mt-2 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal inline">
                    {currentLead.summary}{' '}
                  </p>
                  <button
                    onClick={() => onSelectPost(currentLead)}
                    className="inline-flex items-center text-xs sm:text-sm font-bold text-blue-600 hover:text-red-600 dark:text-blue-400 dark:hover:text-red-400 hover:underline cursor-pointer ml-1"
                  >
                    বিস্তারিত
                  </button>
                </div>

                {/* Slider / Carousel Rectangular Indicators */}
                {leadList.length > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-2.5 pb-1">
                    {leadList.slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveLeadIndex(idx)}
                        className={`h-2 transition-all cursor-pointer rounded-xs ${
                          activeLeadIndex === idx
                            ? 'w-6 bg-red-600'
                            : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                        title={`বিশেষ সংবাদ ${formatBanglaNumber(idx + 1)}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------
              RIGHT COLUMN (42% / 5 cols): TABBED LATEST & TRENDING NEWS
              Exact replica of image.png right side widget
              --------------------------------------------------------- */}
          <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden bg-white dark:bg-slate-950 shadow-xs">
            
            {/* Header Tabs: [ সর্বশেষ সংবাদ ] | [ আলোচিত সংবাদ ] */}
            <div className="grid grid-cols-2 text-center text-xs sm:text-sm font-bold border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('latest')}
                className={`py-2.5 px-2 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'latest'
                    ? 'bg-[#003355] text-white border-red-600 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                সর্বশেষ সংবাদ
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`py-2.5 px-2 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'popular'
                    ? 'bg-[#003355] text-white border-red-600 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                আলোচিত সংবাদ
              </button>
            </div>

            {/* Scrollable List of News Items with Circular Numbers & Thumbnails */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[415px] overflow-y-auto p-2 space-y-0 scrollbar-thin">
              {displayedTabList.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="py-2 px-1 flex items-start gap-2.5 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-900 rounded transition-colors"
                >
                  {/* Circular Number Badge: 1, 2, 3... */}
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors mt-0.5">
                    {formatBanglaNumber(idx + 1)}
                  </span>

                  {/* Thumbnail Image */}
                  <img
                    src={item.image}
                    alt=""
                    className="w-20 h-14 sm:w-24 sm:h-15 object-cover rounded-sm shrink-0 group-hover:opacity-90 transition-opacity"
                  />

                  {/* News Title */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================================
            2. SECONDARY SECTION: OTHER IMPORTANT NEWS & WHATSAPP
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 border-t border-slate-200 dark:border-slate-800">
          
          {/* Left Column: Other Important News Grid */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                <span>অন্যান্য গুরুত্বপূর্ণ সংবাদ</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {leftPosts.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="p-2 sm:p-2.5 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-start gap-2 sm:gap-3 cursor-pointer group hover:border-red-300 dark:hover:border-red-900 transition-colors shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-22 h-24 sm:h-16 object-cover rounded-xs shrink-0 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: WhatsApp Community Banner */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-red-600 rounded-lg p-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-black leading-tight">
                    যুক্ত হোন মাতৃভূমি টিভির হোয়াটসঅ্যাপ চ্যানেলে
                  </h4>
                  <p className="text-[11px] text-red-100 mt-0.5">
                    দেশ ও বিদেশের ব্রেকিং নিউজ পান সবার আগে
                  </p>
                </div>
              </div>
              <a
                href="https://whatsapp.com/channel/matribhumitv"
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center bg-white hover:bg-slate-100 text-red-600 text-xs font-bold py-2 rounded transition-colors shadow-xs"
              >
                Follow WhatsApp Channel
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
