'use client';

import React, { useState } from 'react';
import { Tv, Radio, Play, Users, MessageSquare, Share2, Volume2 } from 'lucide-react';
import { SiteConfig } from '@/lib/newsData';

interface LiveVideoSectionProps {
  siteConfig: SiteConfig;
}

export const LiveVideoSection: React.FC<LiveVideoSectionProps> = ({ siteConfig }) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'schedule' | 'chat'>('stream');
  const [messages, setMessages] = useState([
    { id: 1, name: 'ফরিদুল ইসলাম', text: 'খুব চমৎকার আলোচনা চলছে। ধন্যবাদ মাতৃভূমি টিভি!', time: 'এইমাত্র' },
    { id: 2, name: 'নাজমুল হুদা', text: 'সরাসরি সম্প্রচারের জন্য অনেক ধন্যবাদ।', time: '২ মিনিট আগে' },
    { id: 3, name: 'শাহনাজ পারভীন', text: 'গুরুত্বপূর্ণ লাইভ আপডেট পাওয়ার নির্ভরযোগ্য মাধ্যম।', time: '৫ মিনিট আগে' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([
      { id: Date.now(), name: 'দর্শক', text: inputText.trim(), time: 'এইমাত্র' },
      ...messages,
    ]);
    setInputText('');
  };

  // Check if live stream URL is provided
  const hasValidStreamUrl = Boolean(siteConfig.live_stream_url && siteConfig.live_stream_url.trim() !== '');
  const streamUrl = hasValidStreamUrl ? siteConfig.live_stream_url! : 'https://www.youtube.com/embed/jfKfPfyJRdk';
  const streamTitle = siteConfig.live_stream_title || 'মাতৃভূমি টিভি লাইভ সম্প্রচার - বিশেষ সংবাদ ও টকশো';

  return (
    <section id="live-video-section" className="py-6 bg-slate-900 text-white">
      <div className="max-w-[1240px] mx-auto px-4 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white animate-pulse">
              <Radio className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-serif tracking-tight text-white">
                  মাতৃভূমি টিভি লাইভ (Live TV)
                </h2>

              </div>
              <p className="text-xs text-slate-400">
                {hasValidStreamUrl ? 'সরাসরি সম্প্রচার চলছে' : 'বর্তমানে কোনো লাইভ সম্প্রচার সংযুক্ত নেই'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'stream' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              লাইভ প্লেয়ার
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'schedule' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              আজকের সূচি
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                activeTab === 'chat' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              দর্শক মতামত ({messages.length})
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Main: Video Player or Schedule / Chat */}
          <div className="lg:col-span-8 space-y-3">
            {activeTab === 'stream' && (
              <div className="space-y-3">
                {hasValidStreamUrl ? (
                  <div className="relative aspect-video w-full bg-black rounded overflow-hidden shadow-lg border border-slate-800">
                    <iframe
                      src={streamUrl}
                      title={streamTitle}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-slate-950 rounded border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-950/80 text-amber-500 flex items-center justify-center animate-pulse">
                      <Tv className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">বর্তমানে কোনো লাইভ সম্প্রচার চলছে না</h4>
                      <p className="text-xs text-slate-400 max-w-md">
                        এডমিন প্যানেল থেকে লাইভ ভিডিও স্ট্রিমিং ইউআরএল (YouTube Embed URL) যুক্ত করলেই এখানে সরাসরি ভিডিও প্রদর্শিত হবে।
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/80 p-3 rounded gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">{streamTitle}</h3>
                    <p className="text-xs text-slate-400">উপস্থাপনায়: বার্তা কক্ষ ও লাইভ নিউজ ডেস্ক</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold bg-red-950/60 px-2.5 py-1 rounded">
                      <Users className="w-3.5 h-3.5" /> ১৩,৪৫০ জন দেখছেন
                    </span>
                    <button
                      onClick={() => alert('লাইভ সম্প্রচারের লিঙ্ক কপি করা হয়েছে!')}
                      className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" /> শেয়ার
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="bg-slate-800/80 p-5 rounded space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2">আজকের অনুষ্ঠানমালা ও লাইভ সূচি</h3>
                <div className="space-y-3">
                  {[
                    { time: 'সকাল ৮:০০ টা', title: 'সকালের সংবাদ ও সংবাদপত্রের পাতা', status: 'সম্পন্ন' },
                    { time: 'সকাল ১০:০০ টা', title: 'অর্থনীতি ও বাণিজ্য বিশেষ লাইভ আলোচনা', status: 'সম্পন্ন' },
                    { time: 'দুপুর ১২:০০ টা', title: 'দুপুরের লাইভ নিউজ বুলেটিন', status: 'সম্পন্ন' },
                    { time: 'বিকাল ৩:০০ টা', title: 'সারাদেশের সংবাদ ও জেলা প্রতিনিধি লাইভ', status: 'চলমান' },
                    { time: 'সন্ধ্যা ৭:০০ টা', title: 'মাতৃভূমি রাতের প্রধান সংবাদ ও লাইভ টকশো', status: 'আসছে' },
                    { time: 'রাত ১০:০০ টা', title: 'আন্তর্জাতিক বিশেষ বিশ্লেষণ ও খেলাধুলা', status: 'আসছে' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/60 rounded border border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2 py-1 rounded">{item.time}</span>
                        <span className="text-sm font-medium text-slate-200">{item.title}</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                        item.status === 'চলমান' ? 'bg-red-600 text-white animate-pulse' :
                        item.status === 'সম্পন্ন' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-slate-800/80 p-4 rounded space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-500" /> লাইভ কমেন্টস ও মতামত
                </h3>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                  {messages.map((m) => (
                    <div key={m.id} className="bg-slate-900/80 p-2.5 rounded border border-slate-700/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-400">{m.name}</span>
                        <span className="text-[10px] text-slate-500">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-200">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-700">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="আপনার মতামত লিখুন..."
                    className="flex-1 bg-slate-900 border border-slate-700 px-3 py-2 text-xs rounded text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded transition-colors cursor-pointer shrink-0"
                  >
                    পাঠান
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Sidebar: Live Highlights & Breaking Live Feeds */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-800/90 p-4 rounded space-y-3 border border-slate-700">
              <h3 className="text-sm font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-500" /> লাইভ আপডেট ও বুলেটিন
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'সংসদ ভবন থেকে সরাসরি সংবাদ সম্মেলন', time: '১০ মিনিট আগে' },
                  { title: 'রাজধানীতে যানজট পরিস্থিতি ও ট্রাফিক আপডেট', time: '২৫ মিনিট আগে' },
                  { title: 'আন্তর্জাতিক মুদ্রা বাজারের সর্বশেষ পরিস্থিতি', time: '৪২ মিনিট আগে' },
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer space-y-1 pb-2 border-b border-slate-700/60 last:border-0 last:pb-0">
                    <span className="text-[10px] text-red-400 font-semibold">{item.time}</span>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors leading-snug">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-950 to-slate-900 p-4 rounded border border-red-900/50 space-y-2 text-center">
              <h4 className="text-sm font-bold text-white">মোবাইল অ্যাপে লাইভ দেখুন</h4>
              <p className="text-xs text-slate-300">মাতৃভূমি টিভি অ্যাপ ডাউনলোড করে যেকোনো স্থানে সরাসরি সংবাদ ও লাইভ টিভি উপভোগ করুন।</p>
              <button
                onClick={() => alert('মাতৃভূমি টিভি অ্যান্ড্রয়েড ও আইওএস অ্যাপ শীঘ্রই প্লে স্টোরে আসছে!')}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors cursor-pointer inline-block"
              >
                অ্যাপ ডাউনলোড করুন
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
