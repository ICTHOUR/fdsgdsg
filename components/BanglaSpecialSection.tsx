'use client';

import React from 'react';
import { Post, AdUnit } from '@/lib/newsData';
import { ChevronRight } from 'lucide-react';

interface SpecialProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewCategory: (slug: string) => void;
  housingAd?: AdUnit | null;
}

export const BanglaSpecialSection: React.FC<SpecialProps> = ({
  posts,
  onSelectPost,
  onViewCategory,
  housingAd,
}) => {
  const topFour = posts.slice(0, 4);
  const bottomFour = posts.slice(4, 8);

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              মাতৃভূমি টিভি স্পেশাল
            </h2>
          </div>
          <button
            onClick={() => onViewCategory('special')}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>এই বিভাগের সব খবর</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid -> Clean 2-column mobile / 4-column desktop editorial layout without card borders */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {topFour.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPost(item)}
              className="bg-slate-50/70 hover:bg-slate-100/80 transition-colors cursor-pointer group flex flex-col p-2.5 rounded-sm"
            >
              <div className="relative overflow-hidden aspect-16/10 mb-2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs">
                  স্পেশাল
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Bottom Text Links */}
        {bottomFour.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-sm">
            {bottomFour.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPost(item)}
                className="cursor-pointer group flex items-start gap-1.5 pb-2 sm:pb-0"
              >
                <span className="text-red-600 font-bold text-xs mt-0.5">•</span>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Bashundhara Group Housing Banner - Reduced width on both sides by 1-1.5 inches */}
        <div className="mt-5 text-center">
          <div className="max-w-[920px] mx-auto">
            <a
              href={housingAd?.redirect_url || 'https://matribhumitv.com'}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="w-full h-20 sm:h-24 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded border border-slate-200 flex items-center justify-between px-4 sm:px-8 text-white shadow-2xs">
                <div className="text-left">
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded uppercase">
                    বসুন্ধরা গ্রুপ
                  </span>
                  <h4 className="text-base sm:text-xl font-black text-amber-300 mt-0.5">
                    দেশের বৃহত্তম গেইটেড ও স্মার্ট সিটি বসুন্ধরা
                  </h4>
                  <p className="text-[11px] sm:text-xs text-emerald-100">
                    নিরাপদ ভবিষ্যৎ ও আধুনিক জীবনযাপনের সেরা ঠিকানা
                  </p>
                </div>
                <div className="hidden sm:block">
                  <span className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2 rounded transition-colors">
                    প্লট বুকিং
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
