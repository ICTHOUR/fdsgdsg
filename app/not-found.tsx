export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white text-2xl font-black mb-4">
        মা
      </div>
      <h1 className="text-2xl font-bold mb-2">৪০৪ - পৃষ্ঠাটি পাওয়া যায়নি</h1>
      <p className="text-slate-400 text-sm mb-6 max-w-md">
        দুঃখিত, আপনি যে সংবাদ বা পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা মুছে ফেলা হয়েছে।
      </p>
      <a
        href="/"
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors inline-block"
      >
        মূল হোমপেজে ফিরে যান
      </a>
    </div>
  );
}
