'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Home, Video, ChevronRight, ShieldCheck, LogOut, Key
} from 'lucide-react';
import { 
  getPosts, getCategories, getAds, getSiteConfig, loadStoredData, Post, Category, AdUnit, SiteConfig 
} from '@/lib/newsData';
import { BanglaNewsHeader } from '@/components/BanglaNewsHeader';
import { LeadNewsSection } from '@/components/LeadNewsSection';
import { BanglaSpecialSection } from '@/components/BanglaSpecialSection';
import { CategoryNewsGrid } from '@/components/CategoryNewsGrid';
import { VideoGallerySection } from '@/components/VideoGallerySection';
import { LifestyleAndPhotoSection } from '@/components/LifestyleAndPhotoSection';
import { ThreeColumnGridsSection } from '@/components/ThreeColumnGridsSection';
import { MoreNewsSection } from '@/components/MoreNewsSection';
import { LiveVideoSection } from '@/components/LiveVideoSection';
import { NewsPortalFooter } from '@/components/NewsPortalFooter';
import { AdminDeskModal } from '@/components/AdminDeskModal';
import { AdminLoginModal } from '@/components/AdminLoginModal';
import { NewsDetailModal } from '@/components/NewsDetailModal';
import { AdSenseScript } from '@/components/AdSenseScript';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminFromUrl, setIsAdminFromUrl] = useState(false);
  const [adminModalClosed, setAdminModalClosed] = useState(false);
  const [adminModalExplicitOpen, setAdminModalExplicitOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState<Post | null>(null);

  const adminOpen = (isAdminFromUrl && !adminModalClosed) || adminModalExplicitOpen;

  const handleSelectCategory = useCallback((slug: string | null) => {
    setSelectedCategory(slug);
    setSelectedTag(null);
    setSearchQuery('');
    setActiveDetailPost(null);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectTag = useCallback((slug: string | null) => {
    setSelectedTag(slug);
    setSelectedCategory(null);
    setSearchQuery('');
    setActiveDetailPost(null);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectPost = useCallback((post: Post) => {
    setActiveDetailPost(post);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  // Force re-fetch from memory data store when updated
  const refreshData = useCallback(() => {
    setDataVersion((v) => v + 1);
  }, []);

  // Safe client-side data initialization after SSR hydration
  useEffect(() => {
    const hasUpdates = loadStoredData();
    if (hasUpdates) {
      refreshData();
    }

    const handleDataChanged = () => {
      loadStoredData();
      refreshData();
    };

    window.addEventListener('matribhumi_posts_changed', handleDataChanged);
    window.addEventListener('matribhumi_data_changed', handleDataChanged);
    window.addEventListener('storage', handleDataChanged);

    return () => {
      window.removeEventListener('matribhumi_posts_changed', handleDataChanged);
      window.removeEventListener('matribhumi_data_changed', handleDataChanged);
      window.removeEventListener('storage', handleDataChanged);
    };
  }, [refreshData]);

  // Data queries
  const allPosts = useMemo(() => {
    return getPosts();
  }, [dataVersion]);

  const categories = useMemo(() => {
    return getCategories();
  }, [dataVersion]);

  const ads = useMemo(() => {
    return getAds();
  }, [dataVersion]);

  const siteConfig = useMemo(() => {
    return getSiteConfig();
  }, [dataVersion]);

  // Filtered posts when searching, selecting a tag, or category
  const filteredPosts = useMemo(() => {
    return getPosts({
      category_slug: selectedCategory || undefined,
      tag_slug: selectedTag || undefined,
      search: searchQuery || undefined,
    });
  }, [selectedCategory, selectedTag, searchQuery, dataVersion]);

  // Specific filtered lists for sections
  const mainLeadPost = useMemo(() => {
    return allPosts.find((p) => p.is_lead) || allPosts[0] || null;
  }, [allPosts]);

  const subLeadPosts = useMemo(() => {
    return allPosts.filter((p) => p.is_sub_lead && p.id !== mainLeadPost?.id);
  }, [allPosts, mainLeadPost]);

  const leftLeadPosts = useMemo(() => {
    return allPosts.filter((p) => !p.is_lead && !p.is_sub_lead).slice(0, 6);
  }, [allPosts]);

  const specialPosts = useMemo(() => {
    return allPosts.filter((p) => p.is_special || p.category_slug === 'special');
  }, [allPosts]);

  const breakingPosts = useMemo(() => {
    return allPosts.filter((p) => p.is_breaking);
  }, [allPosts]);

  const relatedDetailPosts = useMemo(() => {
    if (!activeDetailPost) return [];
    return allPosts
      .filter((p) => p.id !== activeDetailPost.id && (p.category_id === activeDetailPost.category_id || p.category_slug === activeDetailPost.category_slug))
      .slice(0, 3);
  }, [allPosts, activeDetailPost]);

  // Specific Ads
  const topAd = ads.find((a) => a.slot === 'top_header') || null;
  const iccbAd = ads.find((a) => a.slot === 'lead_top_iccb') || null;
  const housingAd = ads.find((a) => a.slot === 'between_special_housing') || null;
  const tissueAd = ads.find((a) => a.slot === 'between_economy_tissue') || null;

  const isFilteringActive = Boolean(selectedCategory || selectedTag || searchQuery.trim());

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600 font-semibold">মাতৃভূমি টিভি লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-red-600 selection:text-white">
      
      {/* 0. GOOGLE ADSENSE AUTOMATIC SCRIPT */}
      <AdSenseScript clientId={siteConfig.adsense_client_id} enabled={siteConfig.adsense_enabled} />

      {/* 1. TOP HEADER & NAVBAR & TICKER & LEADERBOARD */}
      <BanglaNewsHeader
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => handleSelectCategory(slug)}
        selectedTag={selectedTag}
        onSelectTag={(slug) => handleSelectTag(slug)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setActiveDetailPost(null);
          if (q.trim() && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        breakingPosts={breakingPosts}
        onSelectPost={(post) => setActiveDetailPost(post)}
        topAd={topAd}
        iccbAd={iccbAd}
        siteConfig={siteConfig}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* 2. MAIN CONTENT SECTIONS */}
      <main className="flex-1">
        {activeDetailPost ? (
          <NewsDetailModal
            post={activeDetailPost}
            onClose={() => setActiveDetailPost(null)}
            relatedPosts={relatedDetailPosts}
            onSelectPost={(post) => setActiveDetailPost(post)}
          />
        ) : isFilteringActive ? (
          /* FILTERED SEARCH / CATEGORY / TAG VIEW */
          <div className="max-w-[1240px] mx-auto px-4 py-8">
            <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                {searchQuery
                  ? `অনুসন্ধানের ফলাফল: "${searchQuery}" (${filteredPosts.length})`
                  : selectedCategory === 'latest'
                  ? `সর্বশেষ সংবাদ (${filteredPosts.length})`
                  : selectedCategory === 'expatriate'
                  ? `প্রবাস সংবাদ (${filteredPosts.length})`
                  : selectedCategory === 'opinion'
                  ? `মতামত ও কলাম (${filteredPosts.length})`
                  : selectedCategory === 'video'
                  ? `ভিডিও সংবাদ (${filteredPosts.length})`
                  : selectedCategory
                  ? `${
                      categories.find((c) => c.slug === selectedCategory)?.name_bn ||
                      (selectedCategory === 'lifestyle' ? 'লাইফস্টাইল' :
                       selectedCategory === 'tech' ? 'তথ্যপ্রযুক্তি' :
                       selectedCategory === 'education' ? 'শিক্ষা' :
                       selectedCategory === 'health' ? 'স্বাস্থ্য' :
                       selectedCategory === 'law' ? 'আইন ও আদালত' : selectedCategory)
                    } বিভাগের সংবাদ (${filteredPosts.length})`
                  : `ট্যাগ: ${selectedTag} (${filteredPosts.length})`}
              </h2>
              <button
                onClick={() => handleSelectCategory(null)}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                সকল সংবাদ দেখুন
              </button>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-base font-semibold text-slate-600">কোনো সংবাদ পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredPosts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveDetailPost(item)}
                    className="border border-slate-200 rounded overflow-hidden group cursor-pointer hover:shadow-xs transition-shadow"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      {item.category_name_bn && (
                        <span className="absolute bottom-1.5 left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {item.category_name_bn}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* COMPLETE HOMEPAGE (MATCHING ALL 14 SCREENSHOTS) */
          <>
            {/* Section 1: Lead News 3-Column Section */}
            {siteConfig.enable_lead_section !== false && (
              <LeadNewsSection
                mainLead={mainLeadPost}
                subLeads={subLeadPosts}
                leftPosts={leftLeadPosts}
                allPosts={allPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
                ads={ads}
              />
            )}

            {/* Live TV / Video Streaming Section */}
            {siteConfig.enable_live_section !== false && siteConfig.live_stream_active !== false && (
              <LiveVideoSection siteConfig={siteConfig} />
            )}

            {/* Section 2: বাংলানিউজ স্পেশাল */}
            {siteConfig.enable_bangla_special !== false && (
              <BanglaSpecialSection
                posts={specialPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
                onViewCategory={(slug) => handleSelectCategory(slug)}
                housingAd={housingAd}
              />
            )}

            {/* Section 3: Categories Grids */}
            {siteConfig.enable_category_grid !== false && (
              <CategoryNewsGrid
                posts={allPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
                onViewCategory={(slug) => handleSelectCategory(slug)}
                tissueAd={tissueAd}
              />
            )}

            {/* Section 4: ভিডিও গ্যালারি */}
            {siteConfig.enable_video_gallery !== false && (
              <VideoGallerySection
                onPlayVideo={(url, title) => {
                  setActiveDetailPost({
                    id: 9999,
                    title: title,
                    slug: 'video-play',
                    summary: 'মাতৃভূমি টিভি মাল্টিমিডিয়া ডেস্ক',
                    content: 'মাতৃভূমির বিশেষ ভিডিও প্রতিবেদন।',
                    category_id: 1,
                    reporter_id: 1,
                    image: 'https://picsum.photos/seed/videoplay/800/450',
                    views: 1200,
                    is_lead: false,
                    is_sub_lead: false,
                    is_breaking: false,
                    is_special: false,
                    status: 'published',
                    approval_status: 'approved' as const,
                    published_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                  });
                }}
              />
            )}

            {/* Section 5: লাইফস্টাইল ও ফটো গ্যালারি */}
            {siteConfig.enable_lifestyle_photo !== false && (
              <LifestyleAndPhotoSection
                posts={allPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
                onViewCategory={(slug) => handleSelectCategory(slug)}
              />
            )}

            {/* Section 6: 3-Column Grids */}
            {siteConfig.enable_three_column !== false && (
              <ThreeColumnGridsSection
                posts={allPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
                onViewCategory={(slug) => handleSelectCategory(slug)}
              />
            )}

            {/* Section 7: আরও খবর */}
            {siteConfig.enable_more_news !== false && (
              <MoreNewsSection
                posts={allPosts}
                onSelectPost={(post) => setActiveDetailPost(post)}
              />
            )}
          </>
        )}
      </main>

      {/* 3. COMPREHENSIVE FOOTER */}
      <NewsPortalFooter
        config={siteConfig}
        categories={categories}
        onSelectCategory={(slug) => handleSelectCategory(slug)}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* 4. ADMIN LOGIN MODAL */}
      {adminLoginOpen && (
        <AdminLoginModal
          onClose={() => setAdminLoginOpen(false)}
          onLoginSuccess={(role, userName) => {
            setAdminLoginOpen(false);
            setAdminModalClosed(false);
            setAdminModalExplicitOpen(true);
          }}
        />
      )}

      {/* 5. ADMIN CMS & GOOGLE ADSENSE MODAL */}
      <AdminDeskModal
        isOpen={adminOpen}
        onClose={() => {
          setAdminModalClosed(true);
          setAdminModalExplicitOpen(false);
        }}
        posts={allPosts}
        categories={categories}
        ads={ads}
        siteConfig={siteConfig}
        onDataChanged={refreshData}
      />

      {/* 6. MOBILE MENU POPUP MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-start animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-4 bg-red-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl font-serif">মাতৃভূমি টিভি</span>
                <span className="text-[10px] bg-red-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">সকল মেনু</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center hover:bg-red-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Links */}
            <div className="p-4 space-y-6 flex-1 text-slate-800 dark:text-slate-100">
              {/* Home & Quick Links */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">প্রধান মেনু</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectCategory(null)}
                    className={`text-left px-3 py-2 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      selectedCategory === null ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5 text-red-600" />
                    <span>প্রচ্ছদ (হোম)</span>
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('video-gallery-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 rounded text-xs font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1.5 hover:bg-red-100 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>লাইভ টিভি / ভিডিও</span>
                  </button>
                </div>
              </div>

              {/* Main Categories Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">প্রধান বিভাগসমূহ</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`text-left px-3 py-2 rounded text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-red-50 text-red-600 font-bold border border-red-200' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{cat.name_bn}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bibidh Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">বিবিধ বিভাগ</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name_bn: 'লাইফস্টাইল', slug: 'lifestyle' },
                    { name_bn: 'তথ্যপ্রযুক্তি', slug: 'tech' },
                    { name_bn: 'শিক্ষা', slug: 'education' },
                    { name_bn: 'স্বাস্থ্য', slug: 'health' },
                    { name_bn: 'আইন ও আদালত', slug: 'law' },
                    { name_bn: 'প্রবাস', slug: 'expatriate' },
                    { name_bn: 'মতামত', slug: 'opinion' },
                  ].map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => handleSelectCategory(item.slug)}
                      className="text-left px-3 py-2 rounded text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                    >
                      <span>{item.name_bn}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Login / Logout Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                {typeof window !== 'undefined' && localStorage.getItem('matribhumi_admin_logged') === 'true' ? (
                  <div className="space-y-2">
                    <a
                      href="/admin"
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>অ্যাডমিন ড্যাশবোর্ডে যান</span>
                    </a>
                    <button
                      onClick={() => {
                        localStorage.removeItem('matribhumi_admin_logged');
                        localStorage.removeItem('matribhumi_admin_role');
                        localStorage.removeItem('matribhumi_admin_name');
                        setMobileMenuOpen(false);
                        window.location.reload();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>লগআউট (Logout)</span>
                    </button>
                  </div>
                ) : (
                  <a
                    href="/admin-login"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm border border-slate-700"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>অ্যাডমিন লগইন (Admin Login)</span>
                  </a>
                )}
              </div>

              {/* Footer info in drawer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-1 text-[11px] text-slate-500">
                <p className="font-bold text-slate-700 dark:text-slate-300">মাতৃভূমি টিভি অনলাইন</p>
                <p>© ২০২৬ সর্বস্বত্ব সংরক্ষিত</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
