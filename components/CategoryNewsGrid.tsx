'use client';

import React from 'react';
import { Post, AdUnit } from '@/lib/newsData';
import { ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewCategory: (slug: string) => void;
  tissueAd?: AdUnit | null;
}

export const CategoryNewsGrid: React.FC<CategoryGridProps> = ({
  posts,
  onSelectPost,
  onViewCategory,
  tissueAd,
}) => {
  const getCategoryPosts = (slug: string) => posts.filter((p) => p.category_slug === slug);

  const nationalPosts = getCategoryPosts('national');
  const politicsPosts = getCategoryPosts('politics');
  const economyPosts = getCategoryPosts('economy');
  const intlPosts = getCategoryPosts('international');
  const sportsPosts = getCategoryPosts('sports');
  const entertainmentPosts = getCategoryPosts('entertainment');
  const countryPosts = getCategoryPosts('country');
  const chattogramPosts = getCategoryPosts('chattogram');

  return (
    <div className="space-y-8 py-4">
      
      {/* =========================================================
          1. জাতীয় (National) Section - Fixed gap & Enlarged Cards
          ========================================================= */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">জাতীয়</h2>
            </div>
            <button
              onClick={() => onViewCategory('national')}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>এই বিভাগের সব খবর</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Main Featured Card */}
            <div className="lg:col-span-6">
              {nationalPosts[0] && (
                <div
                  onClick={() => onSelectPost(nationalPosts[0])}
                  className="cursor-pointer group space-y-2.5 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 hover:border-red-300 transition-colors shadow-2xs"
                >
                  <img
                    src={nationalPosts[0].image}
                    alt=""
                    className="w-full aspect-[16/9.5] object-cover rounded-md group-hover:opacity-95 transition-opacity"
                  />
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white group-hover:text-red-600 transition-colors leading-snug">
                    {nationalPosts[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {nationalPosts[0].summary}
                  </p>
                </div>
              )}
            </div>

            {/* Right Sub-items (Grid of 4) -> NO GAP, Bigger Cards, Bigger Thumbnails */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 content-start">
              {nationalPosts.slice(1, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="flex items-start gap-3 cursor-pointer group p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-red-300 dark:hover:border-red-900 transition-all shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-24 h-18 sm:w-28 sm:h-20 object-cover rounded-xs shrink-0 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 hidden sm:block">
                      {item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. রাজনীতি (Politics) Section
          ========================================================= */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">রাজনীতি</h2>
            </div>
            <button
              onClick={() => onViewCategory('politics')}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>এই বিভাগের সব খবর</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {politicsPosts.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPost(item)}
                className="cursor-pointer group space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-900 transition-all shadow-2xs"
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-full aspect-16/10 object-cover rounded-xs group-hover:opacity-90 transition-opacity"
                />
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 hidden sm:block">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          3. অর্থনীতি-ব্যবসা & আন্তর্জাতিক (Side by Side 2 Columns)
          ========================================================= */}
      <section className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Economy */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-600 block rounded-xs" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">অর্থনীতি-ব্যবসা</h3>
                </div>
                <button
                  onClick={() => onViewCategory('economy')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {economyPosts[0] && (
                <div
                  onClick={() => onSelectPost(economyPosts[0])}
                  className="cursor-pointer group space-y-2 mb-3 bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors shadow-2xs"
                >
                  <img
                    src={economyPosts[0].image}
                    alt=""
                    className="w-full aspect-16/9 object-cover rounded-xs"
                  />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors leading-snug">
                    {economyPosts[0].title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {economyPosts[0].summary}
                  </p>
                </div>
              )}

              <div className="space-y-2.5">
                {economyPosts.slice(1, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPost(item)}
                    className="flex items-start gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group shadow-2xs"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-22 h-15 object-cover rounded-xs shrink-0"
                    />
                    <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>

            {/* International */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-600 block rounded-xs" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">আন্তর্জাতিক</h3>
                </div>
                <button
                  onClick={() => onViewCategory('international')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {intlPosts[0] && (
                <div
                  onClick={() => onSelectPost(intlPosts[0])}
                  className="cursor-pointer group space-y-2 mb-3 bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors shadow-2xs"
                >
                  <img
                    src={intlPosts[0].image}
                    alt=""
                    className="w-full aspect-16/9 object-cover rounded-xs"
                  />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors leading-snug">
                    {intlPosts[0].title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {intlPosts[0].summary}
                  </p>
                </div>
              )}

              <div className="space-y-2.5">
                {intlPosts.slice(1, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPost(item)}
                    className="flex items-start gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group shadow-2xs"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-22 h-15 object-cover rounded-xs shrink-0"
                    />
                    <h5 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bashundhara Tissue Ad Banner */}
          <div className="mt-6 text-center">
            <div className="max-w-[920px] mx-auto">
              <a
                href={tissueAd?.redirect_url || 'https://matribhumitv.com'}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="w-full h-20 sm:h-24 bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-900 rounded border border-slate-200 flex items-center justify-between px-4 sm:px-8 text-white shadow-2xs">
                  <div className="text-left">
                    <span className="text-[10px] bg-sky-300 text-slate-950 font-bold px-1.5 py-0.2 rounded uppercase">
                      বসুন্ধরা টিস্যু
                    </span>
                    <h4 className="text-base sm:text-xl font-black text-amber-300 mt-0.5">
                      অশুদ্ধতার বিরুদ্ধে এক বিন্দুও ছাড় নয়!
                    </h4>
                    <p className="text-[11px] sm:text-xs text-sky-100">
                      শতভাগ ভার্জিন পাল্পে তৈরি জীবাণুমুক্ত সুরক্ষা
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2 rounded transition-colors">
                      অর্ডার করুন
                    </span>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          4. খেলা (Sports) Section
          ========================================================= */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">খেলা</h2>
            </div>
            <button
              onClick={() => onViewCategory('sports')}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>এই বিভাগের সব খবর</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Featured Big Sports Card */}
            <div className="lg:col-span-5">
              {sportsPosts[0] && (
                <div
                  onClick={() => onSelectPost(sportsPosts[0])}
                  className="cursor-pointer group space-y-2 relative rounded overflow-hidden"
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded">
                    <img
                      src={sportsPosts[0].image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-1.5">
                        খেলাধুলা
                      </span>
                      <h3 className="text-base sm:text-lg font-bold leading-snug group-hover:text-amber-300 transition-colors">
                        {sportsPosts[0].title}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6 Grid Sports Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-3">
              {sportsPosts.slice(1, 7).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group space-y-1.5"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-full aspect-16/10 object-cover rounded-xs"
                  />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. বিনোদন (Entertainment) Section
          ========================================================= */}
      <section className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">বিনোদন</h2>
            </div>
            <button
              onClick={() => onViewCategory('entertainment')}
              className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>এই বিভাগের সব খবর</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Featured Card */}
            <div className="lg:col-span-6">
              {entertainmentPosts[0] && (
                <div
                  onClick={() => onSelectPost(entertainmentPosts[0])}
                  className="bg-white dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group space-y-2"
                >
                  <img
                    src={entertainmentPosts[0].image}
                    alt=""
                    className="w-full aspect-16/10 object-cover rounded-xs"
                  />
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white group-hover:text-red-600 transition-colors leading-snug">
                    {entertainmentPosts[0].title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {entertainmentPosts[0].summary}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Entertainment Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {entertainmentPosts.slice(1, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group flex items-start gap-3"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-22 h-16 object-cover rounded-xs shrink-0"
                  />
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
      </section>

      {/* =========================================================
          6. সারাদেশ & চট্টগ্রাম প্রতিদিন (Side by Side 2 Columns)
          ========================================================= */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* সারাদেশ */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-600 block rounded-xs" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">সারাদেশ</h3>
                </div>
                <button
                  onClick={() => onViewCategory('country')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {countryPosts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPost(item)}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-22 h-16 object-cover rounded-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* চট্টগ্রাম প্রতিদিন */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-red-600 pb-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-600 block rounded-xs" />
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">চট্টগ্রাম প্রতিদিন</h3>
                </div>
                <button
                  onClick={() => onViewCategory('chattogram')}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>সব খবর</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chattogramPosts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectPost(item)}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-md border border-slate-200 dark:border-slate-800 hover:border-red-300 transition-colors cursor-pointer group"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-22 h-16 object-cover rounded-xs shrink-0"
                    />
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
        </div>
      </section>

    </div>
  );
};
