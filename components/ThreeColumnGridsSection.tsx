'use client';

import React from 'react';
import { Post } from '@/lib/newsData';
import { ChevronRight } from 'lucide-react';

interface ThreeColumnProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onViewCategory: (slug: string) => void;
}

export const ThreeColumnGridsSection: React.FC<ThreeColumnProps> = ({
  posts,
  onSelectPost,
  onViewCategory,
}) => {
  const getPostsBySlug = (slug: string) => posts.filter((p) => p.category_slug === slug);

  // Group 1
  const educationPosts = getPostsBySlug('education');
  const healthPosts = getPostsBySlug('health');
  const techPosts = getPostsBySlug('tech');

  // Group 2
  const featurePosts = getPostsBySlug('features');
  const islamPosts = getPostsBySlug('islam');
  const lawPosts = getPostsBySlug('law');

  const renderSingleColumn = (title: string, slug: string, categoryPosts: Post[]) => {
    const featured = categoryPosts[0];
    const subList = categoryPosts.slice(1, 4);

    return (
      <div className="space-y-3 border-r border-slate-200 last:border-r-0 pr-0 md:pr-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-red-600 pb-1 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-4.5 bg-red-600 block" />
            <h3 className="text-base sm:text-lg font-black text-slate-950">{title}</h3>
          </div>
          <button
            onClick={() => onViewCategory(slug)}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>সব</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Featured Item */}
        {featured && (
          <div
            onClick={() => onSelectPost(featured)}
            className="cursor-pointer group space-y-2 pb-3 border-b border-slate-200"
          >
            <img
              src={featured.image}
              alt=""
              className="w-full aspect-16/10 object-cover rounded-none group-hover:opacity-90 transition-opacity"
            />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
              {featured.title}
            </h4>
            <p className="text-[11px] text-slate-600 line-clamp-2">
              {featured.summary}
            </p>
          </div>
        )}

        {/* Bullet List Items */}
        {subList.length > 0 && (
          <div className="divide-y divide-slate-200">
            {subList.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPost(item)}
                className="py-2.5 flex items-start gap-2 cursor-pointer group hover:bg-slate-50 transition-colors"
              >
                <span className="text-red-600 font-bold text-xs mt-0.5">•</span>
                <p className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-6 space-y-8 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 space-y-6">
        
        {/* 1. Group 1: শিক্ষা | স্বাস্থ্য | তথ্যপ্রযুক্তি */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderSingleColumn('শিক্ষা', 'education', educationPosts)}
          {renderSingleColumn('স্বাস্থ্য', 'health', healthPosts)}
          {renderSingleColumn('তথ্যপ্রযুক্তি', 'tech', techPosts)}
        </div>

        {/* 2. Group 2: ফিচার | ইসলাম | আইন ও আদালত */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {renderSingleColumn('ফিচার', 'features', featurePosts)}
          {renderSingleColumn('ইসলাম', 'islam', islamPosts)}
          {renderSingleColumn('আইন ও আদালত', 'law', lawPosts)}
        </div>

      </div>
    </div>
  );
};
