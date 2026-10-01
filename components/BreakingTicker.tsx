'use client';

import React, { useState, useEffect } from 'react';
import { Radio, ChevronRight, ChevronLeft, Pause, Play, Bell } from 'lucide-react';
import { Post } from '@/lib/newsData';

interface BreakingTickerProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ posts, onSelectPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const breakingList = posts.filter((p) => p.is_breaking);
  const items = breakingList.length > 0 ? breakingList : posts.slice(0, 5);

  useEffect(() => {
    if (isPaused || items.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Red Breaking Badge */}
        <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-xs font-bold shrink-0 tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden min-h-[22px] flex items-center">
          <div 
            onClick={() => onSelectPost(currentItem)}
            className="cursor-pointer hover:text-red-400 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium truncate"
          >
            <span className="text-red-400 font-bold shrink-0">[{currentItem.category_name_bn}]:</span>
            <span className="truncate">{currentItem.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'অটো-স্ক্রল চালু করুন' : 'বিরতি দিন'}
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
