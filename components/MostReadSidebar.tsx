'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TrendingUp, Eye, Clock } from 'lucide-react';
import { Post } from '@/lib/newsData';
import { formatBanglaNumber } from '@/lib/utils';

interface MostReadProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const MostReadSidebar: React.FC<MostReadProps> = ({ posts, onSelectPost }) => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');

  // Sort by views
  const sortedPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 8);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
      {/* Title & Timeframe switcher */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-3">
        <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-red-600" />
          <span>সর্বাধিক পঠিত</span>
        </h3>

        <div className="flex items-center bg-slate-100 p-0.5 rounded text-[11px] font-medium">
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              timeframe === '24h' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ২৪ ঘণ্টা
          </button>
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              timeframe === '7d' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ৭ দিন
          </button>
        </div>
      </div>

      {/* Ranked List (1 to 8) */}
      <div className="flex flex-col divide-y divide-slate-100">
        {sortedPosts.map((post, idx) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="py-2.5 group cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors flex items-start gap-3"
          >
            {/* Number Rank Badge */}
            <span
              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                idx === 0
                  ? 'bg-red-600 text-white shadow-xs'
                  : idx === 1
                  ? 'bg-amber-500 text-white shadow-xs'
                  : idx === 2
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {idx + 1}
            </span>

            <div className="flex-1">
              <h5 className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                {post.title}
              </h5>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="text-slate-600 font-medium">{post.category_name_bn}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatBanglaNumber(post.views)}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
