'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/newsData';
import { formatBanglaDate } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface MoreNewsProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const MoreNewsSection: React.FC<MoreNewsProps> = ({ posts, onSelectPost }) => {
  const [displayCount, setDisplayCount] = useState(8);

  const displayedPosts = posts.slice(0, displayCount);

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-red-600 pb-1.5 mb-6">
          <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">আরও খবর</h2>
        </div>

        {/* Grid of 4 Columns (2 Columns on Mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {displayedPosts.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPost(item)}
              className="border border-slate-200 rounded overflow-hidden group cursor-pointer hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  {item.category_name_bn && (
                    <span className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.category_name_bn}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-3 pb-3 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span suppressHydrationWarning>{formatBanglaDate(item.published_at)}</span>
                <span className="text-red-600 font-semibold">বিস্তারিত &gt;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < posts.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount((prev) => prev + 8)}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-8 py-2.5 rounded transition-colors cursor-pointer shadow-xs"
            >
              <span>আরো দেখুন</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
