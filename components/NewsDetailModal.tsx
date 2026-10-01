'use client';

import React, { useState } from 'react';
import { ArrowLeft, Facebook, Twitter, MessageCircle, Clock, Eye, Printer, BookOpen, Download, Share2 } from 'lucide-react';
import { Post, getReporterInfo } from '@/lib/newsData';
import { formatBanglaDate, formatBanglaTime, formatBanglaNumber, calculateReadTime } from '@/lib/utils';
import { ArticlePrintModal } from './ArticlePrintModal';

interface DetailProps {
  post: Post | null;
  onClose: () => void;
  relatedPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const NewsDetailModal: React.FC<DetailProps> = ({
  post = null,
  onClose = () => {},
  relatedPosts = [],
  onSelectPost = () => {},
}) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [post?.id]);

  if (!post) return null;

  const reporter = getReporterInfo(post.reporter_id || post.reporter_name, post.reporter_avatar, post.reporter_designation);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const handleShareFacebook = () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://matribhumitv.com';
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Share not supported:', e);
    }
  };

  const handleShareTwitter = () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://matribhumitv.com';
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Share not supported:', e);
    }
  };

  const handleShareWhatsApp = () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://matribhumitv.com';
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + url)}`, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Share not supported:', e);
    }
  };

  const readTime = calculateReadTime(post.content + ' ' + (post.summary || ''));

  const handleOpenPrintView = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="w-full bg-white min-h-[85vh] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[900px] mx-auto space-y-6">
        
        {/* Navigation Back Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
          <button
            onClick={() => {
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-600 hover:text-white text-slate-800 text-sm font-bold rounded transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← হোম পেজে ফিরে যান</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-xs">
              {post.category_name_bn || 'সংবাদ'}
            </span>
            {post.subcategory_name_bn && (
              <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                {post.subcategory_name_bn}
              </span>
            )}
          </div>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-snug">
            {post.title}
          </h1>

          {/* Publish Time & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-600 border-y border-slate-200 py-2.5 bg-slate-50 px-4 rounded-xl">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700" suppressHydrationWarning>
                <Clock className="w-4 h-4 text-red-600" />
                <span>প্রকাশ: {formatBanglaDate(post.published_at)}, {formatBanglaTime(post.published_at)}</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600">
                <Eye className="w-4 h-4 text-slate-400" />
                <span>{formatBanglaNumber(post.views)} বার পঠিত</span>
              </span>
              <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-2.5 py-0.5 rounded font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{readTime}</span>
              </span>
            </div>

            {/* Social Share & Actions */}
            <div className="flex items-center gap-2 print:hidden">
              <span className="font-bold text-slate-700">শেয়ার:</span>
              <button onClick={handleShareFacebook} className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 cursor-pointer" title="ফেসবুক শেয়ার">
                <Facebook className="w-4 h-4" />
              </button>
              <button onClick={handleShareTwitter} className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-90 cursor-pointer" title="টুইটার শেয়ার">
                <Twitter className="w-4 h-4" />
              </button>
              <button onClick={handleShareWhatsApp} className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:opacity-90 cursor-pointer" title="হোয়াটসঅ্যাপ শেয়ার">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={handleOpenPrintView} 
                className="w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="A4 প্রিন্ট বা জেপিজি সেভ করুন"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image with Italic Caption and Reporter Attribution */}
        <div className="space-y-3">
          <figure className="space-y-2">
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-16/9 object-cover rounded-xl shadow-md"
            />
            {post.image_caption && (
              <figcaption className="text-xs sm:text-sm text-slate-500 italic text-center font-medium pt-1">
                {post.image_caption}
              </figcaption>
            )}
          </figure>

          {/* Reporter info bar directly under the feature image */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src={reporter.avatar}
                alt={reporter.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-red-600 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-red-600 font-bold">প্রতিবেদন:</span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">{reporter.name}</span>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {reporter.role === 'Admin' ? 'প্রধান সম্পাদক' : reporter.role === 'Editor' ? 'বার্তা সম্পাদক' : 'রিপোর্টার'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {reporter.designation} | মাতৃভূমি টেলিভিশন
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500" suppressHydrationWarning>
              <span className="block font-semibold text-slate-700">{formatBanglaDate(post.published_at)}</span>
              <span>{formatBanglaTime(post.published_at)}</span>
            </div>
          </div>
        </div>

        {/* Excerpt Lead */}
        {post.summary && (
          <p className="text-lg font-bold text-slate-900 leading-relaxed bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
            {post.summary}
          </p>
        )}

        {/* Full Content Text with Rich Formatting Support */}
        <div className="text-base sm:text-lg text-slate-800 leading-loose space-y-5 font-normal">
          {post.content.includes('<') && post.content.includes('>') ? (
            <div 
              className="space-y-4 prose max-w-none text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
          ) : (
            <p className="whitespace-pre-line">{post.content}</p>
          )}

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-600 mt-6">
            <p className="font-bold text-slate-900 mb-1">মাতৃভূমি টিভি সম্পাদকীয় নীতিমালা:</p>
            <p>সত্যের সন্ধানে নির্ভীক সাংবাদিকতা ও গণমানুষের কণ্ঠস্বর। এই সংবাদটি মাতৃভূমি টিভির নিজস্ব সম্পাদকীয় নীতিমালার আলোকে প্রকাশিত। সর্বস্বত্ব সংরক্ষিত © ২০২৬ matribhumitv.com</p>
          </div>

          {/* Prominent Print & Save as JPG Buttons at Bottom of News */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl space-y-3 mt-6 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-red-500" />
                  <span>সংবাদ প্রিন্ট ও ডাউনলোড সুবিধা (Print & Save JPG)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  সুন্দর এ-ফোর (A4) লেআউটে ফিচার ছবি, শিরোনাম ও মূল খবরসহ সরাসরি প্রিন্ট বা জেপিজি ছবি হিসেবে সেভ করুন
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPrintView}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট করুন (Print A4)</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenPrintView}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>জেপিজি সেভ করুন (Save JPG)</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              * নতুন পপআপ উইন্ডো বা প্রিভিউ স্ক্রিনে দুইটা বাটন পাবেন— সেখান থেকে &apos;প্রিন্ট&apos; চাপলে প্রিন্ট ডায়ালগ আসবে আর &apos;সেভ&apos; চাপলে পুরো সংবাদটি আপনার ডিভাইসে ছবি হিসেবে সংরক্ষিত হবে।
            </p>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center print:hidden">
          <button
            onClick={() => {
              onClose();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>অন্যান্য সংবাদ পড়ুন (হোম পেজে যান)</span>
          </button>
        </div>

        {/* Related News Section */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-200 print:hidden">
            <h4 className="text-xl font-bold text-slate-950 mb-4 border-b-2 border-red-600 pb-2 inline-block">আরও পড়ুন</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectPost(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-pointer group space-y-2 hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-full aspect-16/10 object-cover rounded"
                  />
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {item.title}
                  </h5>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* A4 Print & Save JPG Modal */}
      <ArticlePrintModal
        post={post}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
