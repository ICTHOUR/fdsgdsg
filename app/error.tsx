'use client';

import React from 'react';

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white text-xl font-black mb-4 shadow-lg shadow-red-600/30">
        মা
      </div>
      <h2 className="text-xl font-bold mb-2">একটি ত্রুটি ঘটেছে</h2>
      <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 max-w-md">
        পৃষ্ঠাটি লোড করার সময় একটি সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
      >
        পুনরায় চেষ্টা করুন
      </button>
    </div>
  );
}
