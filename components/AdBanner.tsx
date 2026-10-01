'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { AdUnit } from '@/lib/newsData';

interface AdBannerProps {
  ad?: AdUnit | null;
  slotName?: 'header_banner' | 'sidebar_top' | 'sidebar_bottom' | 'between_sections' | 'in_article' | 'footer_banner' | string;
  title?: string;
  imageUrl?: string;
  redirectUrl?: string;
  adsenseSlotId?: string;
  adsenseClientId?: string;
  onClick?: () => void;
  onAdClick?: (id: number) => void;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  ad,
  slotName = 'between_sections',
  title = 'বিজ্ঞাপন (Google AdSense / Sponsored Partner)',
  imageUrl,
  redirectUrl = 'https://matrivumitv.com/sponsor',
  adsenseSlotId,
  adsenseClientId = 'ca-pub-1234567890123456',
  onClick,
  onAdClick,
  className = '',
}) => {
  const currentImageUrl = ad?.image_url || imageUrl;
  const currentTitle = ad?.title || title;
  const currentRedirect = ad?.redirect_url || redirectUrl;

  useEffect(() => {
    if (ad?.type === 'adsense_code' || adsenseSlotId) {
      // Check if running inside iframe or preview sandbox domains
      const isIframe = typeof window !== 'undefined' && (
        window.self !== window.top || 
        window.location.hostname.includes('run.app') || 
        window.location.hostname.includes('aistudio') ||
        window.location.hostname.includes('localhost')
      );
      if (isIframe) return;

      try {
        const unfilledIns = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])');
        if (unfilledIns.length > 0) {
          // @ts-expect-error Google AdSense window push
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        // Suppress benign repeated push errors
      }
    }
  }, [ad, adsenseSlotId]);

  const handleClick = () => {
    if (onClick) onClick();
    if (ad && onAdClick) onAdClick(ad.id);
  };

  return (
    <div className={`relative bg-slate-50 border border-slate-200 rounded-lg p-2 overflow-hidden group shadow-2xs ${className}`}>
      <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase tracking-widest font-mono mb-1.5 px-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>বিজ্ঞাপন (SPONSORED)</span>
        </span>
        <span>{slotName}</span>
      </div>

      {ad?.type === 'adsense_code' && ad.ad_code ? (
        <div 
          dangerouslySetInnerHTML={{ __html: ad.ad_code }}
          className="w-full overflow-hidden"
        />
      ) : currentImageUrl ? (
        <div 
          onClick={handleClick}
          className="relative w-full h-20 sm:h-24 md:h-28 rounded-md overflow-hidden cursor-pointer hover:opacity-95 transition-opacity border border-slate-200"
        >
          <Image
            src={currentImageUrl}
            alt={currentTitle}
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
          />
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className="w-full h-20 sm:h-24 rounded-md bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 flex items-center justify-between px-6 text-white cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase font-mono block">Google AdSense / Sponsor Partner</span>
            <h5 className="text-sm sm:text-base font-bold font-serif">{currentTitle}</h5>
          </div>
          <span className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shrink-0">
            বিস্তারিত দেখুন &rarr;
          </span>
        </div>
      )}
    </div>
  );
};
