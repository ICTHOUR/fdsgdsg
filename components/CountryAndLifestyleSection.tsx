'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/lib/newsData';
import { MapPin, Film, HeartHandshake, Sparkles, ChevronRight, Clock, Eye, Utensils, Shirt, Activity } from 'lucide-react';
import { formatBanglaTime } from '@/lib/utils';

interface CountryAndLifestyleProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectCategory?: (slug: string) => void;
}

const DIVISIONS = [
  { id: 'all', name: 'সকল বিভাগ' },
  { id: 'dhaka', name: 'ঢাকা' },
  { id: 'chattogram', name: 'চট্টগ্রাম' },
  { id: 'rajshahi', name: 'রাজশাহী' },
  { id: 'khulna', name: 'খুলনা' },
  { id: 'barishal', name: 'বরিশাল' },
  { id: 'sylhet', name: 'সিলেট' },
  { id: 'rangpur', name: 'রংপুর' },
  { id: 'mymensingh', name: 'ময়মনসিংহ' },
];

export const CountryAndLifestyleSection: React.FC<CountryAndLifestyleProps> = ({
  posts,
  onSelectPost,
  onSelectCategory,
}) => {
  const [selectedDivision, setSelectedDivision] = useState('all');

  // Filter country news
  const countryNews = posts.filter(
    (p) => p.category_slug === 'country' || p.category_slug === 'chattogram' || p.tags?.some((t) => t.includes('জেলা') || t.includes('বন্দর'))
  );

  // Fallback to general posts if empty
  const displayCountryNews = (countryNews.length >= 4 ? countryNews : posts.slice(2, 6)).slice(0, 4);

  // Filter Entertainment & Lifestyle news
  const entertainmentNews = posts.filter((p) => p.category_slug === 'entertainment');
  const displayEntertainment = (entertainmentNews.length >= 3 ? entertainmentNews : posts.slice(4, 7)).slice(0, 3);

  const lifestyleNews = posts.filter((p) => p.category_slug === 'lifestyle' || p.category_slug === 'features');
  const displayLifestyle = (lifestyleNews.length >= 3 ? lifestyleNews : posts.slice(6, 9)).slice(0, 3);

  return (
    <div className="space-y-8 my-6">
      {/* 1. সারা দেশ (Country News) Section */}
      <section id="country-news-section" className="bg-slate-50/60 p-4 sm:p-5">
        {/* Header & Division Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-teal-600 pb-3 mb-5 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-600 text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-serif text-slate-900 tracking-tight">
                সারা দেশ
              </h2>
              <span className="text-xs text-slate-500 font-sans">
                ৬৪ জেলার তৃণমূলের মাটি ও মানুষের খবর
              </span>
            </div>
          </div>

          {/* Division Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-serif">
            {DIVISIONS.map((div) => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-2.5 py-1 whitespace-nowrap cursor-pointer transition-colors ${
                  selectedDivision === div.id
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {div.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Card District News Grid -> Borderless flat editorial grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayCountryNews.map((post, idx) => (
            <div
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group cursor-pointer bg-white p-2.5 hover:bg-slate-100/80 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 mb-2">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.reporter_name?.split(' ')[0] || 'জেলা প্রতিনিধি'}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-serif text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatBanglaTime(post.published_at)}</span>
                  </span>
                  <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    বিস্তারিত &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. বিনোদন (Entertainment) & লাইফস্টাইল (Lifestyle) Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: বিনোদন (Entertainment) */}
        <section id="entertainment-section" className="bg-slate-50/60 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-pink-600 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-pink-600 text-white">
                  <Film className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900">বিনোদন ও শোবিজ</h2>
              </div>
              {onSelectCategory && (
                <button
                  onClick={() => onSelectCategory('entertainment')}
                  className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Featured Item + 2 Sub Items */}
            {displayEntertainment[0] && (
              <div
                onClick={() => onSelectPost(displayEntertainment[0])}
                className="group cursor-pointer mb-3 pb-3 border-b border-slate-200 bg-white p-2.5"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 mb-2">
                  <Image
                    src={displayEntertainment[0].image}
                    alt={displayEntertainment[0].title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5">
                    বিশেষ প্রতিবেদন
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-slate-900 group-hover:text-pink-600 transition-colors leading-snug">
                  {displayEntertainment[0].title}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                  {displayEntertainment[0].summary}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {displayEntertainment.slice(1).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="group cursor-pointer flex items-center gap-3 bg-white p-2 hover:bg-slate-100 transition-colors"
                >
                  <div className="relative w-20 h-14 shrink-0 overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold font-serif text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
                      {formatBanglaTime(post.published_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right: লাইফস্টাইল ও ফিচার (Lifestyle & Health) */}
        <section id="lifestyle-section" className="bg-slate-50/60 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-purple-600 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-600 text-white">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900">লাইফস্টাইল ও স্বাস্থ্য</h2>
              </div>
              {onSelectCategory && (
                <button
                  onClick={() => onSelectCategory('lifestyle')}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Featured Item + 2 Sub Items */}
            {displayLifestyle[0] && (
              <div
                onClick={() => onSelectPost(displayLifestyle[0])}
                className="group cursor-pointer mb-3 pb-3 border-b border-slate-200 bg-white p-2.5"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 mb-2">
                  <Image
                    src={displayLifestyle[0].image}
                    alt={displayLifestyle[0].title}
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5">
                    স্বাস্থ্য ও টিপস
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-serif text-slate-900 group-hover:text-purple-600 transition-colors leading-snug">
                  {displayLifestyle[0].title}
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-1 line-clamp-2">
                  {displayLifestyle[0].summary}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {displayLifestyle.slice(1).map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="group cursor-pointer flex items-center gap-3 bg-white p-2 hover:bg-slate-100 transition-colors"
                >
                  <div className="relative w-20 h-14 shrink-0 overflow-hidden bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold font-serif text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">
                      {formatBanglaTime(post.published_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
