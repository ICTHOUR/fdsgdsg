'use client';

import React from 'react';
import Image from 'next/image';
import { AdUnit } from '@/lib/newsData';
import { ExternalLink, Sparkles } from 'lucide-react';

export interface AdSlotProps {
  slotName: 'header_banner' | 'sidebar_top' | 'sidebar_bottom' | 'between_sections' | 'in_article' | 'footer_banner' | 'fullscreen_interstitial' | 'video_ad' | string;
  ad?: AdUnit | null;
  title?: string;
  imageUrl?: string;
  redirectUrl?: string;
  adClient?: string;
  adSlotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  margin?: string; // e.g. 'my-6 mx-auto max-w-[90%]'
  padding?: string;
  onAdClick?: (id: number) => void;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotName,
  ad,
  title,
  imageUrl,
  redirectUrl = 'https://matribhumitv.com/sponsor',
  adClient = 'ca-pub-811400024240001',
  adSlotId = '1234567890',
  format = 'auto',
  className = '',
  margin = 'my-5 mx-auto max-w-[88%] sm:max-w-[82%]',
  padding = 'p-3',
  onAdClick,
}) => {
  const currentTitle = ad?.title || title || 'গুগল অ্যাডসেন্স / স্পন্সর বিজ্ঞাপন';
  const currentImage = ad?.image_url || imageUrl;
  const currentUrl = ad?.redirect_url || redirectUrl;

  React.useEffect(() => {
    if (ad?.type === 'adsense_code') {
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
        // Suppress benign AdSense push error
      }
    }
  }, [ad]);

  const handleClick = () => {
    if (ad && onAdClick) {
      onAdClick(ad.id);
    }
  };

  return (
    <div
      id={`ad-slot-${slotName}`}
      className={`${margin} bg-slate-50 border border-dashed border-slate-300 rounded-lg ${padding} overflow-hidden group transition-all hover:border-slate-400 ${className}`}
    >
      {/* Ad Label Bar */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono tracking-wider uppercase mb-1.5 px-1 border-b border-slate-200 pb-1">
        <span className="flex items-center gap-1.5 font-sans font-medium text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>বিজ্ঞাপন / SPONSORED ({slotName})</span>
        </span>
        <span className="text-[9px] text-slate-400">Google AdSense Certified • ID: {adClient}</span>
      </div>

      {/* Content Rendering */}
      {ad?.type === 'adsense_code' && ad.ad_code ? (
        <div
          dangerouslySetInnerHTML={{ __html: ad.ad_code }}
          className="w-full min-h-[90px] flex items-center justify-center overflow-hidden"
        />
      ) : ad?.type === 'video' && (ad.video_url || ad.image_url) ? (
        <div className="relative aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center group">
          <img src={ad.image_url || 'https://picsum.photos/seed/videoad/800/450'} alt={currentTitle} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/20 transition-colors text-white text-center p-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform">
              <span className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></span>
            </div>
            <span className="text-xs font-bold bg-black/70 px-2.5 py-1 rounded">{currentTitle} (ভিডিও বিজ্ঞাপন)</span>
          </a>
        </div>
      ) : currentImage ? (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="relative block w-full aspect-[8/1] min-h-[75px] sm:min-h-[85px] max-h-[110px] rounded-md overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
        >
          <Image
            src={currentImage}
            alt={currentTitle}
            fill
            referrerPolicy="no-referrer"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        </a>
      ) : (
        /* Native Interactive AdSense Placeholder Preview */
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="block w-full py-3 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-md shadow-inner hover:brightness-105 transition-all cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">
                  AD
                </span>
                <span className="text-xs font-semibold text-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {currentTitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-serif line-clamp-1">
                মাতৃভূমি টিভিতে বিজ্ঞাপন দিতে বা বিশেষ স্পন্সরশিপের জন্য এখনই যোগাযোগ করুন
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shrink-0">
              <span>বিজ্ঞাপন বুকিং</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </a>
      )}
    </div>
  );
};
