'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/newsData';
import { ChevronRight, ChevronLeft, Camera } from 'lucide-react';
import { formatBanglaNumber } from '@/lib/utils';

interface LifestylePhotoProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewCategory: (slug: string) => void;
}

export const LifestyleAndPhotoSection: React.FC<LifestylePhotoProps> = ({
  posts,
  onSelectPost,
  onViewCategory,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const lifestylePosts = posts.filter((p) => p.category_slug === 'lifestyle');

  const photoGallery = [
    {
      id: 1,
      title: 'শরতের কাশফুলে শুভ্রতার ছোঁয়া, মুখরিত দিয়াবাড়ি',
      image: 'https://picsum.photos/seed/kashfulphoto/800/500',
      caption: 'রাজধানীর উত্তরা দিয়াবাড়িতে কাশফুলের শুভ্র সৌন্দর্য উপভোগ করতে মানুষের উপচে পড়া ভিড়।',
      date: '১২ সেপ্টেম্বর ২০২৬',
      totalPhotos: 6,
    },
    {
      id: 2,
      title: 'ঐতিহাসিক রবীন্দ্র সরোবরের সান্ধ্যকালীন রূপ',
      image: 'https://picsum.photos/seed/rabindrasarobar/800/500',
      caption: 'লেকপাড়ে তরুণ-তরুণীদের আড্ডা ও লোকগানের মূর্ছনায় মুখর হয়ে ওঠে ধনমন্ডি লেক প্রাঙ্গণ।',
      date: '১১ সেপ্টেম্বর ২০২৬',
      totalPhotos: 8,
    },
    {
      id: 3,
      title: 'বান্দরবানের নীলগিরিতে মেঘের রাজ্য',
      image: 'https://picsum.photos/seed/nilgiriclouds/800/500',
      caption: 'পাহাড়ের কোল ঘেঁষে ভেসে বেড়ানো তুলার মতো মেঘ ছুঁয়ে দেখতে পর্যটকদের রোমাঞ্চকর ভ্রমণ।',
      date: '১০ সেপ্টেম্বর ২০২৬',
      totalPhotos: 10,
    },
  ];

  const currentPhoto = photoGallery[photoIndex];

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* =========================================================
              1. লাইফস্টাইল (Lifestyle) - 7 Columns
              ========================================================= */}
          <div className="lg:col-span-7">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-red-600 block rounded-xs" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">লাইফস্টাইল</h2>
              </div>
              <button
                onClick={() => onViewCategory('lifestyle')}
                className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>এই বিভাগের সব খবর</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Big Lifestyle Card */}
            {lifestylePosts[0] && (
              <div
                onClick={() => onSelectPost(lifestylePosts[0])}
                className="cursor-pointer group space-y-2 mb-4"
              >
                <div className="relative aspect-16/9 overflow-hidden rounded">
                  <img
                    src={lifestylePosts[0].image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    স্বাস্থ্য ও রূপচর্চা
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-red-600 transition-colors leading-snug">
                  {lifestylePosts[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {lifestylePosts[0].summary}
                </p>
              </div>
            )}

            {/* 4 Small Lifestyle Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              {lifestylePosts.slice(1, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectPost(item)}
                  className="flex gap-2.5 cursor-pointer group pb-2 border-b border-slate-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-20 h-14 object-cover rounded shrink-0 group-hover:opacity-90 transition-opacity"
                  />
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              2. ফটো গ্যালারি (Photo Gallery) - 5 Columns
              ========================================================= */}
          <div className="lg:col-span-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-1.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">ফটো গ্যালারি</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                ছবি {formatBanglaNumber(photoIndex + 1)} / {formatBanglaNumber(photoGallery.length)}
              </span>
            </div>

            {/* Photo Card with Carousel Controls */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs relative">
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={currentPhoto.image}
                  alt={currentPhoto.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Date Badge */}
                <span className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {currentPhoto.date}
                </span>

                {/* Total Photos Badge */}
                <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  <span>{formatBanglaNumber(currentPhoto.totalPhotos)} টি ছবি</span>
                </span>

                {/* Arrow Controls */}
                <button
                  onClick={() => setPhotoIndex((prev) => (prev - 1 + photoGallery.length) % photoGallery.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition-colors shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPhotoIndex((prev) => (prev + 1) % photoGallery.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full cursor-pointer transition-colors shadow-md"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Caption & Indicators */}
              <div className="p-3.5">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {currentPhoto.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {currentPhoto.caption}
                </p>

                {/* Bullet Indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  {photoGallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        photoIndex === i ? 'w-5 bg-red-600' : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
