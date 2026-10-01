'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { Category } from '@/lib/newsData';

interface MobileNavProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  onSelectTag: (slug: string | null) => void;
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenMenu = () => {} }) => {
  return (
    <button
      onClick={onOpenMenu}
      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white w-9 h-9 rounded-md shrink-0 cursor-pointer shadow-xs transition-colors"
      title="মেনু খুলুন"
      aria-label="Mobile Menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
};
