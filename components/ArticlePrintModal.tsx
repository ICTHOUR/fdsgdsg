'use client';

import React, { useRef, useState } from 'react';
import { Printer, Download, X, Check, Clock, Eye, Newspaper, ShieldCheck } from 'lucide-react';
import { Post, getReporterInfo } from '@/lib/newsData';
import { formatBanglaDate, formatBanglaTime, formatBanglaNumber } from '@/lib/utils';
import html2canvas from 'html2canvas';

interface PrintModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticlePrintModal: React.FC<PrintModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingJpg, setIsGeneratingJpg] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !post) return null;

  const reporter = getReporterInfo(post.reporter_id || post.reporter_name, post.reporter_avatar, post.reporter_designation);

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print command failed:', e);
    }
  };

  const handleSaveAsJpg = async () => {
    if (!printContentRef.current || isGeneratingJpg) return;

    try {
      setIsGeneratingJpg(true);
      setDownloadSuccess(false);

      // Render the element to canvas
      const canvas = await html2canvas(printContentRef.current, {
        scale: 2, // High DPI / Retina clarity
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
      });

      // Convert canvas to JPG blob
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsGeneratingJpg(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `matribhumi-news-${post.id}-${post.slug || 'article'}.jpg`;
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsGeneratingJpg(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error generating JPG:', error);
      setIsGeneratingJpg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-start justify-center overflow-y-auto p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[110] bg-slate-900/95 border border-slate-700 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 print:hidden max-w-[95vw]">
        <div className="flex items-center gap-2 border-r border-slate-700 pr-3">
          <Newspaper className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold hidden sm:inline">A4 প্রিন্ট ও জেপিজি সেভ ভিউ</span>
        </div>

        <button
          onClick={handlePrint}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট করুন (Print A4)</span>
        </button>

        <button
          onClick={handleSaveAsJpg}
          disabled={isGeneratingJpg}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>জেপিজি সেভ হয়েছে!</span>
            </>
          ) : isGeneratingJpg ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>ছবি তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>জেপিজি সেভ (Save JPG)</span>
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl text-xs cursor-pointer transition-colors ml-1"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Printable A4 Container */}
      <div className="mt-16 mb-10 print:m-0 w-full max-w-[820px] bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        <div
          ref={printContentRef}
          id="printable-a4-article"
          className="p-6 sm:p-10 md:p-12 space-y-6 bg-white border border-slate-200 print:border-0 print:p-0"
          style={{ fontFamily: "'kalpurush', 'SolaimanLipi', 'Noto Serif Bengali', serif" }}
        >
          {/* Header Branding Section */}
          <div className="border-b-2 border-red-600 pb-4 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-black text-xl sm:text-2xl px-2.5 py-0.5 rounded tracking-wide">
                  মাতৃভূমি
                </span>
                <span className="text-slate-900 font-black text-xl sm:text-2xl tracking-tight">
                  টেলিভিশন
                </span>
              </div>
              <p className="text-[11px] text-red-700 font-bold tracking-widest mt-0.5">
                সত্যের সন্ধানে নির্ভীক সাংবাদিকতা • matribhumitv.com
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-600 font-sans space-y-0.5">
              <p className="font-bold text-slate-900 text-xs">মাতৃভূমি মিডিয়া লিমিটেড</p>
              <p suppressHydrationWarning>তারিখ: {formatBanglaDate(post.published_at)}</p>
              <p suppressHydrationWarning>সময়: {formatBanglaTime(post.published_at)}</p>
            </div>
          </div>

          {/* Subheader Metadata */}
          <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="font-bold text-red-700">
              বিভাগ: {post.category_name_bn || 'সংবাদ'} {post.subcategory_name_bn ? `» ${post.subcategory_name_bn}` : ''}
            </span>
            <span className="flex items-center gap-3 font-sans text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span suppressHydrationWarning>{formatBanglaDate(post.published_at)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatBanglaNumber(post.views)} ভিউ</span>
              </span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
            {post.title}
          </h1>

          {/* Top Featured Image + Reporter Box Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-7 space-y-1.5">
              <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              {post.image_caption && (
                <p className="text-[11px] text-slate-600 italic font-medium leading-tight text-center">
                  ছবির বিবরণ: {post.image_caption}
                </p>
              )}
            </div>

            <div className="sm:col-span-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reporter.avatar}
                  alt={reporter.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-600 shadow-sm"
                  crossOrigin="anonymous"
                />
                <div>
                  <span className="text-[10px] text-red-600 font-bold block uppercase tracking-wider">প্রতিবেদক</span>
                  <p className="text-sm font-bold text-slate-900">{reporter.name}</p>
                  <p className="text-[11px] text-slate-600">{reporter.designation}</p>
                </div>
              </div>

              {post.summary && (
                <div className="bg-white p-2.5 rounded-lg border-l-3 border-red-600 text-xs text-slate-800 font-medium leading-relaxed">
                  <span className="font-bold text-slate-900 block text-[11px] mb-0.5">সংক্ষিপ্ত মূলভাব:</span>
                  {post.summary}
                </div>
              )}
            </div>
          </div>

          {/* Article Main Text Content */}
          <div className="text-base text-slate-900 leading-loose space-y-4 font-normal pt-2 border-t border-slate-200">
            {post.content.includes('<') && post.content.includes('>') ? (
              <div
                className="space-y-3 prose max-w-none text-slate-900 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="whitespace-pre-line text-base leading-loose">{post.content}</p>
            )}
          </div>

          {/* Footer Branding & Disclaimer */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>মাতৃভূমি টিভি অফিসিয়াল নিউজ আর্কাভিভ (matribhumitv.com)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                সত্যের সন্ধানে নির্ভীক সাংবাদিকতা • সর্বস্বত্ব সংরক্ষিত © ২০২৬ मातृভূমি টেলিভিশন
              </p>
            </div>

            <div className="text-right text-[10px] text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
              <p>সংবাদ আইডি: #{post.id}</p>
              <p>প্রিন্ট সময়: {new Date().toLocaleString('bn-BD')}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
