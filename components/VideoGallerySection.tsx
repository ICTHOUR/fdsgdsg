'use client';

import React from 'react';
import { Play, ChevronRight, Video } from 'lucide-react';

interface VideoSectionProps {
  onPlayVideo?: (videoUrl: string, title: string) => void;
}

export const VideoGallerySection: React.FC<VideoSectionProps> = ({ onPlayVideo }) => {
  const topVideos = [
    {
      id: 1,
      title: 'হিলি স্থলবন্দর দিয়ে ভারত থেকে এলো চালের বড় চালান',
      image: 'https://picsum.photos/seed/videohiliport/600/360',
      duration: '৩:৪৫',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    },
    {
      id: 2,
      title: 'সিলেটে সুরমা নদীর পানি বৃদ্ধি, প্লাবিত নিম্নাঞ্চল',
      image: 'https://picsum.photos/seed/videosurmaflood/600/360',
      duration: '২:১৫',
      url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    },
  ];

  const bottomVideos = [
    {
      id: 3,
      title: 'মিরপুর শেরেবাংলা স্টেডিয়ামে বিসিবির সংস্কার কাজ শুরু',
      image: 'https://picsum.photos/seed/videomirpurstadium/400/250',
      duration: '১:৫০',
    },
    {
      id: 4,
      title: 'রাজধানীতে ট্রাফিক শৃঙ্খলা ফেরাতে ছাত্র-জনতার যৌথ উদ্যোগ',
      image: 'https://picsum.photos/seed/videotrafficcontrol/400/250',
      duration: '৪:১০',
    },
    {
      id: 5,
      title: 'সুন্দরবনে পর্যটকদের পদচারণায় মুখরিত করমজল পয়েন্ট',
      image: 'https://picsum.photos/seed/videosundarbans/400/250',
      duration: '৩:০৫',
    },
    {
      id: 6,
      title: 'চট্টগ্রাম বন্দরে কনটেইনার জট নিরসনে নতুন স্বয়ংক্রিয় টার্মিনাল',
      image: 'https://picsum.photos/seed/videochattogramport/400/250',
      duration: '২:৪০',
    },
    {
      id: 7,
      title: 'কৃত্রিম বুদ্ধিমত্তা দিয়ে পরিচালিত হবে আধুনিক ট্রাফিক সিগন্যাল',
      image: 'https://picsum.photos/seed/videoaitraffic/400/250',
      duration: '২:২০',
    },
    {
      id: 8,
      title: 'ঐতিহাসিক লালবাগ কেল্লায় আলোক উৎসবের বর্ণিল আয়োজন',
      image: 'https://picsum.photos/seed/videolalbaghfort/400/250',
      duration: '৩:৩০',
    },
  ];

  return (
    <section id="video-gallery-section" className="py-8 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">ভিডিও গ্যালারি</h2>
          </div>
          <a
            href="#all-videos"
            className="text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-0.5"
          >
            <span>সব ভিডিও</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* 2 Top Large Video Cards with Red Overlay Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {topVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onPlayVideo && onPlayVideo(video.url, video.title)}
              className="relative rounded-lg overflow-hidden group cursor-pointer border border-slate-700 shadow-lg"
            >
              <div className="relative aspect-16/9 overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-mono">
                  {video.duration}
                </span>

                {/* Red Title Banner at Bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-700 via-red-700/90 to-transparent p-4 text-white">
                  <h3 className="text-sm sm:text-base font-bold leading-snug">
                    {video.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 6 Bottom Compact Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {bottomVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-800 rounded overflow-hidden group cursor-pointer border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.2 rounded font-mono">
                  {video.duration}
                </span>
              </div>
              <div className="p-2">
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
