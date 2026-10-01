'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, Calendar, Clock, Eye, User, Share2, Facebook, 
  Twitter, MessageSquare, Send, CheckCircle2, Bookmark, Printer
} from 'lucide-react';
import { Post, CommentItem, INITIAL_COMMENTS } from '@/lib/newsData';
import { formatBanglaDate, formatBanglaTime, formatBanglaNumber } from '@/lib/utils';

interface ArticleDetailProps {
  post: Post | null;
  onClose: () => void;
  onSelectTag: (tagSlug: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailProps> = ({
  post,
  onClose,
  onSelectTag,
}) => {
  const [comments, setComments] = useState<CommentItem[]>(() => {
    return post ? INITIAL_COMMENTS.filter((c) => c.post_id === post.id) : [];
  });
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!post) return null;

  const handlePrintArticle = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('দয়া করে ব্রাউজারের পপআপ ব্লকার বন্ধ করুন অথবা প্রিন্ট অপশন সক্রিয় করুন।');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>${post.title} - মাতৃভূমি টিভি</title>
        <style>
          body { font-family: 'SolaimanLipi', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.8; }
          h1 { font-size: 26px; font-weight: bold; margin-bottom: 16px; color: #000; }
          .meta { font-size: 13px; color: #555; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
          img { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 16px; display: block; }
          .summary { font-size: 16px; font-weight: bold; background: #fff5f5; padding: 16px; border-left: 4px solid #dc2626; margin-bottom: 24px; }
          .content { font-size: 15px; white-space: pre-line; margin-bottom: 30px; }
          .footer { font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${post.title}</h1>
        <div class="meta">
          <strong>প্রতিবেদক:</strong> ${post.reporter_name || 'মাতৃভূমি টিভি অনলাইন ডেস্ক'} &nbsp;|&nbsp; 
          <strong>প্রকাশ:</strong> ${formatBanglaDate(post.published_at)}, ${formatBanglaTime(post.published_at)}
        </div>
        ${post.image ? `<img src="${post.image}" alt="${post.title}" />` : ''}
        ${post.summary ? `<div class="summary">${post.summary}</div>` : ''}
        <div class="content">${post.content}</div>
        <div class="footer">
          মাতৃভূমি টিভি অনলাইন | সর্বস্বত্ব সংরক্ষিত © ২০২৬ matribhumitv.com
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newComment: CommentItem = {
        id: Date.now(),
        post_id: post.id,
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || 'reader@matribhumitv.com',
        comment: commentText.trim(),
        created_at: new Date().toISOString(),
        status: 'approved',
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setAuthorName('');
      setAuthorEmail('');
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              {post.category_name_bn}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              মাতৃভূমি টিভি অনলাইন পোর্টাল
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Article Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight font-serif">
              {post.title}
            </h1>

            {/* Reporter & Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 mt-4 border-t border-b border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <User className="w-4 h-4 text-red-600" />
                  <span>{post.reporter_name || 'বার্তা কক্ষ (News Desk)'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{formatBanglaDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{formatBanglaTime(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Eye className="w-4 h-4 text-red-500" />
                  <span>{formatBanglaNumber(post.views)} ভিউজ</span>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <span className="text-[11px] font-medium text-slate-400">শেয়ার:</span>
                <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer" title="ফেসবুক শেয়ার">
                  <Facebook className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-sky-50 text-sky-500 rounded hover:bg-sky-100 cursor-pointer" title="টুইটার শেয়ার">
                  <Twitter className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer" title="শেয়ার করুন">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handlePrintArticle} 
                  className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 cursor-pointer"
                  title="প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image with Caption */}
          <div className="space-y-2">
            <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
              <Image
                src={post.image}
                alt={post.title}
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
            {post.image_caption && (
              <p className="text-xs text-slate-500 italic text-center font-sans">
                ছবি: {post.image_caption}
              </p>
            )}
          </div>

          {/* Article Summary Box */}
          {post.summary && (
            <div className="bg-slate-50 border-l-4 border-red-600 p-4 rounded-r text-slate-800 text-base font-semibold leading-relaxed font-sans">
              {post.summary}
            </div>
          )}

          {/* In-Article Google AdSense Banner Simulation */}
          <div className="my-6 p-4 bg-amber-50/50 border border-amber-200 rounded-lg text-center">
            <span className="text-[10px] text-amber-700 uppercase tracking-widest font-mono block mb-1">
              Google AdSense (ইন-আর্টিকেল ব্যানার)
            </span>
            <div className="text-sm font-bold text-slate-900">
              🚀 ক্লাউড হোস্টিং ও MySQL ডেটাবেস সার্ভার সার্ভিস
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              উচ্চগতির পারফরম্যান্স, আনলিমিটেড ব্যান্ডউইথ ও ২৪/৭ ডেডিকেটেড টেকনিক্যাল সাপোর্ট।
            </div>
          </div>

          {/* Full Article Content */}
          <div 
            className="text-slate-800 text-base sm:text-lg leading-loose space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Pills */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700">সম্পর্কিত টপিক:</span>
                {post.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onClose();
                      onSelectTag(tag);
                    }}
                    className="text-xs bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reader Comments Section */}
          <section className="pt-8 border-t-2 border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>পাঠকের মন্তব্য ({comments.length})</span>
              </h3>
              <span className="text-xs text-slate-400">মন্তব্যের দায়ভার পাঠকের নিজস্ব</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">আপনার মন্তব্য লিখুন</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="আপনার নাম *"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-hidden focus:border-red-500"
                />
                <input
                  type="email"
                  placeholder="আপনার ইমেইল (প্রকাশিত হবে না)"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-hidden focus:border-red-500"
                />
              </div>
              <textarea
                placeholder="সংবাদ সম্পর্কে আপনার গঠনমূলক মতামত দিন..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows={3}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs focus:outline-hidden focus:border-red-500"
              />
              <div className="flex items-center justify-between">
                {submittedSuccess ? (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>মন্তব্য পাঠান</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">এখনও কোনো মন্তব্য করা হয়নি। আপনি প্রথম মন্তব্য করুন!</p>
              ) : (
                comments.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">{item.author_name}</strong>
                      <span className="text-[11px] text-slate-400">
                        {formatBanglaDate(item.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">{item.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
