'use client';

import React, { useState, useEffect, useCallback, useSyncExternalStore, useMemo } from 'react';
import { 
  Plus, Edit, Trash2, CheckCircle2, Sliders, Image as ImageIcon, 
  DollarSign, FileText, Layers, Save, Video, Calendar, Clock, Bold, Italic, List, Quote, TrendingUp, Users, Eye, Newspaper, ShieldCheck, LogOut, Home, ArrowLeft,
  CheckSquare, Square, CheckCheck, Search, Filter, Crop, RefreshCw, XCircle, AlertTriangle, X,
  Database, Server, Download, Terminal, Globe, Code, HardDrive, Key, Copy, Check
} from 'lucide-react';
import { 
  Post, Category, Subcategory, AdUnit, SiteConfig, UserAccount, 
  getPosts, getCategories, getAds, getSiteConfig, loadStoredData,
  addPost, updatePost, deletePost, bulkDeletePosts, bulkApprovePosts, bulkRejectPosts, bulkUpdatePostStatus, getReporterPostStats,
  addCategory, updateSiteConfig,
  getUsers, addUser, updateUser, updateUserStatus, deleteUser, approvePost, rejectPost, deleteCategory,
  getSubcategories, addSubcategory, deleteSubcategory, addAd, deleteAd
} from '@/lib/newsData';
import { generateMySQLDump } from '@/lib/mysqlExport';
import { formatBanglaDate, formatBanglaTime } from '@/lib/utils';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageCropperModal } from '@/components/ImageCropperModal';
import Link from 'next/link';

function subscribeStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getAdminNameClient() {
  if (typeof window === 'undefined') return 'প্রধান প্রশাসক';
  return localStorage.getItem('matribhumi_admin_name') || 'প্রধান প্রশাসক';
}

function getAdminRoleClient() {
  if (typeof window === 'undefined') return 'Admin';
  return localStorage.getItem('matribhumi_admin_role') === 'editor' ? 'Editor' : 'Admin';
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'approval' | 'category' | 'users' | 'ads' | 'settings' | 'design' | 'cpanel'>('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const adminName = useSyncExternalStore(subscribeStorage, getAdminNameClient, () => 'প্রধান প্রশাসক');
  const adminRole = useSyncExternalStore(subscribeStorage, getAdminRoleClient, () => 'Admin');

  // Data states initialized consistently on server & client
  const [posts, setPosts] = useState<Post[]>(() => getPosts({ include_pending: true }));
  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [ads, setAds] = useState<AdUnit[]>(() => getAds());
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getSiteConfig());

  const loadData = useCallback(() => {
    loadStoredData();
    setPosts(getPosts({ include_pending: true }));
    setCategories(getCategories());
    setAds(getAds());
    setSiteConfig(getSiteConfig());
  }, []);

  // Sync data on mount
  useEffect(() => {
    loadData();
    const handleDataChanged = () => {
      loadData();
    };
    window.addEventListener('matribhumi_posts_changed', handleDataChanged);
    window.addEventListener('matribhumi_data_changed', handleDataChanged);
    window.addEventListener('storage', handleDataChanged);
    return () => {
      window.removeEventListener('matribhumi_posts_changed', handleDataChanged);
      window.removeEventListener('matribhumi_data_changed', handleDataChanged);
      window.removeEventListener('storage', handleDataChanged);
    };
  }, [loadData]);

  // Auth check
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('matribhumi_admin_logged');
      if (logged === 'true') {
        setIsAuthenticated(true);
      } else {
        window.location.href = '/admin-login';
      }
      setAuthChecked(true);
    }
  }, []);

  // New / Edit News Post Form State
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<number>(1);
  const [newsSubcategory, setNewsSubcategory] = useState<number | ''>('');
  const [selectedReporterId, setSelectedReporterId] = useState<number | 'custom'>(1);
  const [newsReporter, setNewsReporter] = useState('এ কে এম মঞ্জুরুল হক');
  const [newsReporterAvatar, setNewsReporterAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80');
  const [newsReporterDesignation, setNewsReporterDesignation] = useState('প্রধান সম্পাদক ও প্রকাশক');
  const [customReporterDragActive, setCustomReporterDragActive] = useState(false);
  const [newsImage, setNewsImage] = useState('');
  const [newsImageCaption, setNewsImageCaption] = useState('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [isSubLead, setIsSubLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [featureDragActive, setFeatureDragActive] = useState(false);

  // Current automatic date and time
  const autoDate = formatBanglaDate(new Date().toISOString());
  const autoTime = formatBanglaTime(new Date().toISOString());

  // User Management State
  const [usersList, setUsersList] = useState<UserAccount[]>(getUsers());
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Reporter' | 'Editor' | 'Reader'>('Reporter');
  const [newUserDesignation, setNewUserDesignation] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('');
  const [newUserBio, setNewUserBio] = useState('');
  const [newUserAllowedCats, setNewUserAllowedCats] = useState<string[]>([]);
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>(['post', 'edit', 'update']);
  const [userAvatarDragActive, setUserAvatarDragActive] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserUsername, setEditUserUsername] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<'Admin' | 'Reporter' | 'Editor' | 'Reader'>('Reporter');
  const [editUserDesignation, setEditUserDesignation] = useState('');
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const [editUserBio, setEditUserBio] = useState('');
  const [editUserAllowedCats, setEditUserAllowedCats] = useState<string[]>([]);
  const [editUserPermissions, setEditUserPermissions] = useState<string[]>(['post', 'edit', 'update']);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  // New Category Form State
  const [newCatBn, setNewCatBn] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatColor, setNewCatColor] = useState('#DC2626');

  // Subcategory Form State
  const [newSubCatParentId, setNewSubCatParentId] = useState<number>(1);
  const [newSubCatBn, setNewSubCatBn] = useState('');
  const [newSubCatEn, setNewSubCatEn] = useState('');
  const [newSubCatSlug, setNewSubCatSlug] = useState('');

  // News Bulk Selection & Filtering State
  const [selectedNewsIds, setSelectedNewsIds] = useState<number[]>([]);
  const [newsFilterCategory, setNewsFilterCategory] = useState<number | 'all'>('all');
  const [newsFilterStatus, setNewsFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [newsSearchTerm, setNewsSearchTerm] = useState('');

  // Approval Queue Bulk Selection State
  const [selectedPendingIds, setSelectedPendingIds] = useState<number[]>([]);

  // User Management Search & Role Filter State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterRole, setUserFilterRole] = useState<'all' | 'Reporter' | 'Editor' | 'Admin' | 'Reader'>('all');

  // Filtered Users List
  const filteredUsersList = usersList.filter((u) => {
    if (userFilterRole !== 'all' && u.role !== userFilterRole) {
      return false;
    }
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchDesig = (u.designation || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      const matchRole = (u.role || '').toLowerCase().includes(q);
      if (!matchName && !matchDesig && !matchEmail && !matchPhone && !matchRole) {
        return false;
      }
    }
    return true;
  });

  // Image Cropper Modal State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperSourceImage, setCropperSourceImage] = useState('');
  const [cropperTarget, setCropperTarget] = useState<'featured' | 'customReporter' | 'userAvatar' | 'editUserAvatar'>('featured');
  const [copiedUserId, setCopiedUserId] = useState<number | null>(null);
  const [showEditUserPassword, setShowEditUserPassword] = useState(false);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);

  // AdSense & Banner Ads Configuration State
  const [adsenseClientId, setAdsenseClientId] = useState(siteConfig.adsense_client_id || 'ca-pub-811400024240001');
  const [adsenseEnabled, setAdsenseEnabled] = useState(siteConfig.adsense_enabled ?? true);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSlot, setNewAdSlot] = useState<AdUnit['slot']>('lead_top_iccb');
  const [newAdImage, setNewAdImage] = useState('');
  const [newAdRedirectUrl, setNewAdRedirectUrl] = useState('https://matribhumitv.com');
  const [newAdCode, setNewAdCode] = useState('');

  // Site Config State
  const [siteName, setSiteName] = useState(siteConfig.site_name || 'মাতৃভূমি টিভি');
  const [siteSlogan, setSiteSlogan] = useState(siteConfig.site_slogan || 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা');
  const [editorName, setEditorName] = useState(siteConfig.editor_name || '');
  const [publisherName, setPublisherName] = useState(siteConfig.publisher_name || '');
  const [siteEmail, setSiteEmail] = useState(siteConfig.email || '');
  const [sitePhone, setSitePhone] = useState(siteConfig.phone || '');
  const [siteAddress, setSiteAddress] = useState(siteConfig.address || '');
  const [siteLogo, setSiteLogo] = useState(siteConfig.logo_url || '');
  const [siteFavicon, setSiteFavicon] = useState(siteConfig.favicon_url || '');
  const [liveStreamUrl, setLiveStreamUrl] = useState(siteConfig.live_stream_url || 'https://www.youtube.com/embed/jfKfPfyJRdk');
  const [liveStreamTitle, setLiveStreamTitle] = useState(siteConfig.live_stream_title || 'মাতৃভূমি টিভি লাইভ সম্প্রচার');
  const [liveStreamActive, setLiveStreamActive] = useState(siteConfig.live_stream_active ?? true);

  // Design & Section Toggles State
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primary_color || '#DC2626');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>(siteConfig.font_family || 'serif');
  const [headerStyle, setHeaderStyle] = useState<'classic' | 'modern' | 'centered'>(siteConfig.header_style || 'classic');
  const [showTopTicker, setShowTopTicker] = useState(siteConfig.show_top_ticker ?? true);
  const [showBreakingBar, setShowBreakingBar] = useState(siteConfig.show_breaking_bar ?? true);
  const [enableLeadSection, setEnableLeadSection] = useState(siteConfig.enable_lead_section ?? true);
  const [enableBanglaSpecial, setEnableBanglaSpecial] = useState(siteConfig.enable_bangla_special ?? true);
  const [enableCategoryGrid, setEnableCategoryGrid] = useState(siteConfig.enable_category_grid ?? true);
  const [enableVideoGallery, setEnableVideoGallery] = useState(siteConfig.enable_video_gallery ?? true);

  // Sync inputs states when siteConfig changes
  useEffect(() => {
    if (siteConfig) {
      setSiteName(siteConfig.site_name || 'মাতৃভূমি টিভি');
      setSiteSlogan(siteConfig.site_slogan || 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা');
      setEditorName(siteConfig.editor_name || '');
      setPublisherName(siteConfig.publisher_name || '');
      setSiteEmail(siteConfig.email || '');
      setSitePhone(siteConfig.phone || '');
      setSiteAddress(siteConfig.address || '');
      setSiteLogo(siteConfig.logo_url || '');
      setSiteFavicon(siteConfig.favicon_url || '');
      setLiveStreamUrl(siteConfig.live_stream_url || 'https://www.youtube.com/embed/jfKfPfyJRdk');
      setLiveStreamTitle(siteConfig.live_stream_title || 'মাতৃভূমি টিভি লাইভ সম্প্রচার');
      setLiveStreamActive(siteConfig.live_stream_active ?? true);
      
      setPrimaryColor(siteConfig.primary_color || '#DC2626');
      setFontFamily(siteConfig.font_family || 'serif');
      setHeaderStyle(siteConfig.header_style || 'classic');
      setShowTopTicker(siteConfig.show_top_ticker ?? true);
      setShowBreakingBar(siteConfig.show_breaking_bar ?? true);
      setEnableLeadSection(siteConfig.enable_lead_section ?? true);
      setEnableBanglaSpecial(siteConfig.enable_bangla_special ?? true);
      setEnableCategoryGrid(siteConfig.enable_category_grid ?? true);
      setEnableVideoGallery(siteConfig.enable_video_gallery ?? true);
    }
  }, [siteConfig]);

  // Logged-in user and permissions state
  const [loggedInUser, setLoggedInUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && usersList.length > 0) {
      const name = localStorage.getItem('matribhumi_admin_name');
      const role = localStorage.getItem('matribhumi_admin_role');
      const found = usersList.find(
        (u) => u.name === name || u.role.toLowerCase() === role?.toLowerCase()
      ) || null;
      setLoggedInUser(found);
    }
  }, [usersList]);

  const availableCategories = useMemo(() => {
    if (loggedInUser?.role === 'Reporter' && loggedInUser?.allowed_categories && loggedInUser.allowed_categories.length > 0) {
      return categories.filter((c) => loggedInUser.allowed_categories?.includes(c.slug));
    }
    return categories;
  }, [categories, loggedInUser]);

  const canApprove = useMemo(() => {
    if (!loggedInUser) return true; // Default admin/editor access
    if (loggedInUser.role === 'Admin' || loggedInUser.role === 'Editor') return true;
    return loggedInUser.permissions?.includes('approve') ?? false;
  }, [loggedInUser]);

  // Statistics calculations
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.approval_status === 'approved' || !p.approval_status).length;
  const pendingPosts = posts.filter(p => p.approval_status === 'pending').length;
  const totalCategories = categories.length;
  const totalUsers = usersList.length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 24500);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('matribhumi_admin_logged');
      localStorage.removeItem('matribhumi_admin_role');
      localStorage.removeItem('matribhumi_admin_name');
    }
    window.location.href = '/admin-login';
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) {
      showSuccess('⚠️ অনুগ্রহ করে সংবাদের একটি শিরোনাম প্রদান করুন!');
      return;
    }

    const repUser = selectedReporterId !== 'custom' ? usersList.find(u => u.id === Number(selectedReporterId)) : null;
    const finalReporterName = repUser ? repUser.name : (newsReporter || 'স্টাফ রিপোর্টার');
    const finalReporterAvatar = repUser ? repUser.avatar : (newsReporterAvatar || undefined);
    const finalReporterDesignation = repUser ? repUser.designation : (newsReporterDesignation || undefined);
    const finalReporterId = repUser ? repUser.id : 1;

    // Use default news image if none provided
    const finalNewsImage = newsImage && newsImage.trim() !== '' 
      ? newsImage 
      : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';

    if (editingPostId !== null) {
      updatePost(editingPostId, {
        title: newsTitle.trim(),
        summary: newsSummary.trim() || newsTitle.trim(),
        content: newsContent.trim() || newsSummary.trim() || newsTitle.trim(),
        category_id: Number(newsCategory),
        subcategory_id: newsSubcategory ? Number(newsSubcategory) : null,
        reporter_id: finalReporterId,
        reporter_name: finalReporterName,
        reporter_avatar: finalReporterAvatar,
        reporter_designation: finalReporterDesignation,
        image: finalNewsImage,
        image_caption: newsImageCaption.trim(),
        video_url: newsVideoUrl.trim() || null,
        is_lead: isLead,
        is_sub_lead: isSubLead,
        is_breaking: isBreaking,
        is_special: isSpecial,
        status: 'published',
        approval_status: 'approved',
      });
      showSuccess('✅ সংবাদ সফলভাবে আপডেট করা হয়েছে এবং ওয়েবসাইটে প্রকাশিত হয়েছে!');
      setEditingPostId(null);
    } else {
      const createdPost = addPost({
        title: newsTitle.trim(),
        summary: newsSummary.trim() || newsTitle.trim(),
        content: newsContent.trim() || newsSummary.trim() || newsTitle.trim(),
        category_id: Number(newsCategory),
        subcategory_id: newsSubcategory ? Number(newsSubcategory) : null,
        reporter_id: finalReporterId,
        reporter_name: finalReporterName,
        reporter_avatar: finalReporterAvatar,
        reporter_designation: finalReporterDesignation,
        image: finalNewsImage,
        image_caption: newsImageCaption.trim(),
        video_url: newsVideoUrl.trim() || null,
        is_lead: isLead,
        is_sub_lead: isSubLead,
        is_breaking: isBreaking,
        is_special: isSpecial,
        status: 'published',
        approval_status: 'approved',
        published_at: new Date().toISOString(),
      });
      showSuccess(`🎉 নতুন সংবাদ সফলভাবে প্রকাশিত হয়েছে! "${createdPost.title.slice(0, 30)}..."`);
    }

    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    setNewsImageCaption('');
    setNewsSubcategory('');
    setNewsVideoUrl('');
    setIsLead(false);
    setIsSubLead(false);
    setIsBreaking(false);
    setIsSpecial(false);

    loadData();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartEditPost = (p: Post) => {
    setEditingPostId(p.id);
    setNewsTitle(p.title);
    setNewsSummary(p.summary);
    setNewsContent(p.content);
    setNewsCategory(p.category_id);
    setNewsSubcategory(p.subcategory_id || '');
    if (p.reporter_id && usersList.some(u => u.id === p.reporter_id)) {
      setSelectedReporterId(p.reporter_id);
      const u = usersList.find(u => u.id === p.reporter_id);
      setNewsReporter(u?.name || p.reporter_name || 'স্টাফ রিপোর্টার');
      setNewsReporterAvatar(u?.avatar || p.reporter_avatar || '');
      setNewsReporterDesignation(u?.designation || p.reporter_designation || '');
    } else {
      setSelectedReporterId('custom');
      setNewsReporter(p.reporter_name || 'স্টাফ রিপোর্টার');
      setNewsReporterAvatar(p.reporter_avatar || '');
      setNewsReporterDesignation(p.reporter_designation || 'বিশেষ প্রতিনিধি');
    }
    setNewsImage(p.image);
    setNewsImageCaption(p.image_caption || '');
    setNewsVideoUrl(p.video_url || '');
    setIsLead(p.is_lead);
    setIsSubLead(p.is_sub_lead);
    setIsBreaking(p.is_breaking);
    setIsSpecial(p.is_special);
    setActiveTab('news');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImage('');
    setNewsImageCaption('');
    setNewsSubcategory('');
    setNewsVideoUrl('');
    setIsLead(false);
    setIsSubLead(false);
    setIsBreaking(false);
    setIsSpecial(false);
  };

  // Real Image Upload (PNG, JPG, JPEG, WEBP, GIF, SVG) using FileReader + Cropper
  const handleRealImageUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP, GIF)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCropperSourceImage(result);
        setCropperTarget('featured');
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCropperForExisting = () => {
    if (!newsImage) {
      showSuccess('⚠️ অনুগ্রহ করে প্রথমে একটি ছবি আপলোড করুন বা লিংক দিন।');
      return;
    }
    setCropperSourceImage(newsImage);
    setCropperTarget('featured');
    setIsCropperOpen(true);
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    if (cropperTarget === 'featured') {
      setNewsImage(croppedDataUrl);
      showSuccess('ফিচার ছবি সফলভাবে ক্রপ ও ফ্রেম অ্যাডজাস্ট করা হয়েছে!');
    } else if (cropperTarget === 'customReporter') {
      setNewsReporterAvatar(croppedDataUrl);
      showSuccess('রিপোর্টারের প্রোফাইল ছবি ক্রপ করা হয়েছে!');
    } else if (cropperTarget === 'userAvatar') {
      setNewUserAvatar(croppedDataUrl);
      showSuccess('ইউজার প্রোফাইল ছবি ক্রপ করা হয়েছে!');
    } else if (cropperTarget === 'editUserAvatar') {
      setEditUserAvatar(croppedDataUrl);
      showSuccess('এডিটিং ইউজারের ছবি ক্রপ করা হয়েছে!');
    }
  };

  const handleEditUserAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP, GIF)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCropperSourceImage(result);
        setCropperTarget('editUserAvatar');
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyCredentials = (u: UserAccount) => {
    const username = u.username || u.email.split('@')[0];
    const password = u.password || 'reporter123';
    const text = `মাদারল্যান্ড / মাতৃভূমি টিভি লগইন তথ্য:\nনাম: ${u.name}\nরোল: ${u.role}\nইউজার আইডি (Login ID): ${username}\nপাসওয়ার্ড: ${password}\nলগইন পেজ: /admin-login`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUserId(u.id);
      setTimeout(() => setCopiedUserId(null), 3000);
      showSuccess(`📋 "${u.name}"-এর ইউজার আইডি (${username}) ও পাসওয়ার্ড কপি হয়েছে!`);
    } else {
      showSuccess(`ID: ${username} | Pass: ${password}`);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleRealImageUpload(file);
    }
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFeatureDragActive(true);
  };

  const handleImageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFeatureDragActive(false);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFeatureDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleRealImageUpload(file);
    }
  };

  const handleSimulatedVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsVideoUrl(`https://www.youtube.com/embed/jfKfPfyJRdk`);
      showSuccess('ভিডিও ফাইল সফলভাবে আপলোড হয়েছে!');
    }
  };

  const handleApprovePost = (id: number) => {
    approvePost(id);
    loadData();
    showSuccess('সংবাদটি সফলভাবে অনুমোদিত ও প্রকাশিত হয়েছে!');
  };

  const handleRejectPost = (id: number) => {
    rejectPost(id);
    loadData();
    showSuccess('সংবাদটি বাতিল করা হয়েছে।');
  };

  const handleDeletePost = (id: number) => {
    deletePost(id);
    loadData();
    showSuccess('🗑️ সংবাদ সফলভাবে মুছে ফেলা হয়েছে!');
  };

  // Filtered posts for News Management Tab
  const filteredManagementPosts = posts.filter((p) => {
    if (newsFilterCategory !== 'all' && p.category_id !== Number(newsFilterCategory)) {
      return false;
    }
    if (newsFilterStatus !== 'all') {
      const status = p.approval_status || 'approved';
      if (status !== newsFilterStatus) return false;
    }
    if (newsSearchTerm.trim()) {
      const q = newsSearchTerm.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchReporter = (p.reporter_name || '').toLowerCase().includes(q);
      const matchCategory = (p.category_name_bn || '').toLowerCase().includes(q);
      if (!matchTitle && !matchReporter && !matchCategory) return false;
    }
    return true;
  });

  const isAllNewsSelected = filteredManagementPosts.length > 0 && filteredManagementPosts.every((p) => selectedNewsIds.includes(p.id));

  const handleToggleSelectAllNews = () => {
    if (isAllNewsSelected) {
      setSelectedNewsIds([]);
    } else {
      setSelectedNewsIds(filteredManagementPosts.map((p) => p.id));
    }
  };

  const handleToggleSelectNews = (id: number) => {
    setSelectedNewsIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteNews = () => {
    if (selectedNewsIds.length === 0) return;
    const count = selectedNewsIds.length;
    bulkDeletePosts(selectedNewsIds);
    setSelectedNewsIds([]);
    loadData();
    showSuccess(`🗑️ নির্বাচিত ${count}টি সংবাদ সফলভাবে মুছে ফেলা হয়েছে!`);
  };

  const handleBulkApproveNews = () => {
    if (selectedNewsIds.length === 0) return;
    const count = selectedNewsIds.length;
    bulkApprovePosts(selectedNewsIds);
    setSelectedNewsIds([]);
    loadData();
    showSuccess(`নির্বাচিত ${count}টি সংবাদ সফলভাবে অনুমোদন ও প্রকাশ করা হয়েছে!`);
  };

  const handleBulkRejectNews = () => {
    if (selectedNewsIds.length === 0) return;
    const count = selectedNewsIds.length;
    bulkRejectPosts(selectedNewsIds);
    setSelectedNewsIds([]);
    loadData();
    showSuccess(`নির্বাচিত ${count}টি সংবাদ বাতিল করা হয়েছে!`);
  };

  const handleBulkMarkPendingNews = () => {
    if (selectedNewsIds.length === 0) return;
    const count = selectedNewsIds.length;
    bulkUpdatePostStatus(selectedNewsIds, 'pending');
    setSelectedNewsIds([]);
    loadData();
    showSuccess(`নির্বাচিত ${count}টি সংবাদ অপেক্ষমাণ কিউ-তে পাঠানো হয়েছে!`);
  };

  // Approval Queue Helpers
  const pendingPostsList = posts.filter((p) => p.approval_status === 'pending');
  const isAllPendingSelected = pendingPostsList.length > 0 && pendingPostsList.every((p) => selectedPendingIds.includes(p.id));

  const handleToggleSelectAllPending = () => {
    if (isAllPendingSelected) {
      setSelectedPendingIds([]);
    } else {
      setSelectedPendingIds(pendingPostsList.map((p) => p.id));
    }
  };

  const handleToggleSelectPending = (id: number) => {
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprovePendingQueue = () => {
    if (selectedPendingIds.length === 0) return;
    const count = selectedPendingIds.length;
    bulkApprovePosts(selectedPendingIds);
    setSelectedPendingIds([]);
    loadData();
    showSuccess(`নির্বাচিত ${count}টি সংবাদ সফলভাবে অনুমোদন ও প্রকাশ করা হয়েছে!`);
  };

  const handleBulkRejectPendingQueue = () => {
    if (selectedPendingIds.length === 0) return;
    const count = selectedPendingIds.length;
    bulkRejectPosts(selectedPendingIds);
    setSelectedPendingIds([]);
    loadData();
    showSuccess(`নির্বাচিত ${count}টি সংবাদ বাতিল করা হয়েছে!`);
  };

  const handleUserAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP, GIF)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCropperSourceImage(result);
        setCropperTarget('userAvatar');
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomReporterAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP, GIF)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCropperSourceImage(result);
        setCropperTarget('customReporter');
        setIsCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const generatedUsername = newUserUsername.trim() || newUserEmail.split('@')[0] || `user${Date.now()}`;
    const generatedPassword = newUserPassword.trim() || 'reporter123';
    addUser({
      name: newUserName.trim(),
      username: generatedUsername,
      password: generatedPassword,
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      designation: newUserDesignation.trim() || (newUserRole === 'Admin' ? 'প্রধান প্রশাসক' : newUserRole === 'Editor' ? 'সহকারী বার্তা সম্পাদক' : 'স্টাফ রিপোর্টার'),
      avatar: newUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      bio: newUserBio.trim() || undefined,
      status: 'active',
      allowed_categories: newUserAllowedCats,
      permissions: newUserPermissions,
    });
    setUsersList([...getUsers()]);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserDesignation('');
    setNewUserAvatar('');
    setNewUserBio('');
    setNewUserAllowedCats([]);
    setNewUserPermissions(['post', 'edit', 'update']);
    showSuccess(`নতুন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! (ইউজার আইডি: ${generatedUsername}, পাসওয়ার্ড: ${generatedPassword})`);
  };

  const handleStartEditUser = (u: UserAccount) => {
    setEditingUser(u);
    setEditUserName(u.name);
    setEditUserUsername(u.username || u.email.split('@')[0]);
    setEditUserPassword(u.password || 'reporter123');
    setEditUserEmail(u.email);
    setEditUserPhone(u.phone || '');
    setEditUserRole(u.role);
    setEditUserDesignation(u.designation || '');
    setEditUserAvatar(u.avatar || '');
    setEditUserBio(u.bio || '');
    setEditUserAllowedCats(u.allowed_categories || []);
    setEditUserPermissions(u.permissions || ['post', 'edit', 'update']);
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editUserName.trim() || !editUserEmail.trim()) {
      showSuccess('⚠️ নাম এবং ইমেইল পূরণ করুন!');
      return;
    }

    updateUser(editingUser.id, {
      name: editUserName.trim(),
      username: editUserUsername.trim() || editingUser.username,
      password: editUserPassword.trim() || editingUser.password,
      email: editUserEmail.trim(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      designation: editUserDesignation.trim(),
      avatar: editUserAvatar || editingUser.avatar,
      bio: editUserBio.trim() || undefined,
      allowed_categories: editUserAllowedCats,
      permissions: editUserPermissions,
    });

    setUsersList([...getUsers()]);
    setIsEditUserModalOpen(false);
    setEditingUser(null);
    showSuccess(`✅ ইউজার "${editUserName}" এর তথ্য ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!`);
  };

  const handleToggleUserStatus = (id: number, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateUserStatus(id, nextStatus);
    setUsersList([...getUsers()]);
    showSuccess(`ইউজার স্ট্যাটাস পরিবর্তন করে "${nextStatus === 'active' ? 'সক্রিয়' : 'সাসপেন্ডেড'}" করা হয়েছে।`);
  };

  const handleDeleteUserAccount = (id: number) => {
    deleteUser(id);
    setUsersList([...getUsers()]);
    showSuccess('🗑️ ইউজার অ্যাকাউন্ট মুছে ফেলা হয়েছে।');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatBn.trim()) return;

    addCategory({
      name_bn: newCatBn,
      name_en: newCatEn || newCatBn,
      slug: newCatSlug || newCatBn.toLowerCase().replace(/\s+/g, '-'),
      color_code: newCatColor,
    });

    setNewCatBn('');
    setNewCatEn('');
    setNewCatSlug('');
    loadData();
    showSuccess('নতুন ক্যাটাগরি যুক্ত করা হয়েছে!');
  };

  const handleDeleteCategoryItem = (id: number) => {
    deleteCategory(id);
    loadData();
    showSuccess('🗑️ ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে।');
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCatBn.trim()) return;

    addSubcategory({
      category_id: Number(newSubCatParentId),
      name_bn: newSubCatBn,
      name_en: newSubCatEn || newSubCatBn,
      slug: newSubCatSlug || newSubCatBn.toLowerCase().replace(/\s+/g, '-'),
    });

    setNewSubCatBn('');
    setNewSubCatEn('');
    setNewSubCatSlug('');
    loadData();
    showSuccess('নতুন সাব-ক্যাটাগরি যুক্ত করা হয়েছে!');
  };

  const handleDeleteSubcategoryItem = (id: number) => {
    deleteSubcategory(id);
    loadData();
    showSuccess('🗑️ সাব-ক্যাটাগরি মুছে ফেলা হয়েছে।');
  };

  const handleSaveAdsense = () => {
    updateSiteConfig({
      adsense_client_id: adsenseClientId,
      adsense_enabled: adsenseEnabled,
    });
    loadData();
    showSuccess('Google AdSense কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim()) return;

    addAd({
      title: newAdTitle,
      slot: newAdSlot,
      type: newAdCode ? 'adsense_code' : 'image',
      image_url: newAdImage || 'https://picsum.photos/seed/adbanner/970/90',
      redirect_url: newAdRedirectUrl || 'https://matribhumitv.com',
      ad_code: newAdCode || '',
      status: 'active',
    });

    setNewAdTitle('');
    setNewAdImage('');
    setNewAdCode('');
    loadData();
    showSuccess('নতুন বিজ্ঞাপন ব্যানার সফলভাবে তৈরি ও সক্রিয় করা হয়েছে!');
  };

  const handleDeleteAdUnit = (id: number) => {
    deleteAd(id);
    loadData();
    showSuccess('🗑️ বিজ্ঞাপন ব্যানার মুছে ফেলা হয়েছে।');
  };

  const handleAdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setNewAdImage(result);
          showSuccess(`বিজ্ঞাপন ছবি "${file.name}" লোড হয়েছে!`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSiteLogo(result);
          showSuccess('লোগো সফলভাবে আপলোড হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSiteFavicon(result);
          showSuccess('ফেভিকন/আইকন আপলোড হয়েছে!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSiteSettings = () => {
    updateSiteConfig({
      site_name: siteName,
      site_slogan: siteSlogan,
      editor_name: editorName,
      publisher_name: publisherName,
      email: siteEmail,
      phone: sitePhone,
      address: siteAddress,
      logo_url: siteLogo,
      favicon_url: siteFavicon,
      live_stream_url: liveStreamUrl,
      live_stream_title: liveStreamTitle,
      live_stream_active: liveStreamActive,
    });
    loadData();
    showSuccess('ওয়েবসাইট সেটিংস ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveDesignSections = () => {
    updateSiteConfig({
      primary_color: primaryColor,
      font_family: fontFamily,
      header_style: headerStyle,
      show_top_ticker: showTopTicker,
      show_breaking_bar: showBreakingBar,
      enable_lead_section: enableLeadSection,
      enable_bangla_special: enableBanglaSpecial,
      enable_category_grid: enableCategoryGrid,
      enable_video_gallery: enableVideoGallery,
    });
    loadData();
    showSuccess('ওয়েবসাইটের ডিজাইন, থিম ও সেকশন কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!');
  };

  if (!mounted || !authChecked || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col items-center gap-4 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-lg font-bold text-white">মাতৃভূমি টিভি সিএমএস</h2>
          <p className="text-slate-400 text-xs">প্রমাণীকরণ যাচাই করা হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-black text-white">মাতৃভূমি টিভি</h1>
            <p className="text-[11px] text-red-400 font-semibold">অ্যাডমিন কন্ট্রোল প্যানেল</p>
          </div>
        </div>

        {/* User Profile info */}
        <div className="p-4 mx-4 my-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 font-bold flex items-center justify-center border border-red-500/30">
            {adminName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-white truncate">{adminName}</p>
            <p className="text-[10px] text-slate-400 font-mono">{adminRole} | Online</p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="p-4 space-y-1.5 flex-1 text-xs font-bold overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>পরিসংখ্যান ও ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'news' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>সংবাদ পোস্ট করুন</span>
          </button>

          <button
            onClick={() => setActiveTab('all_news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all_news' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>সকল নিউজ</span>
          </button>

          <button
            onClick={() => setActiveTab('approval')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'approval' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>অনুমোদন কিউ</span>
            </div>
            {posts.filter(p => p.approval_status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                {posts.filter(p => p.approval_status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('category')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'category' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ক্যাটাগরি কন্ট্রোল</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ইউজার ম্যানেজমেন্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'ads' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>বিজ্ঞাপন ও অ্যাডসেন্স</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>পোর্টাল সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'design' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>থিম ও ডিজাইন</span>
          </button>

          <button
            onClick={() => setActiveTab('cpanel')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'cpanel' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-black' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>cPanel & MySQL এক্সপোর্ট</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl font-bold text-xs transition-colors border border-red-900/50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট করুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors md:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>মাতৃভূমি টিভি অ্যাডমিন ড্যাশবোর্ড</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">LIVE CMS</span>
              </h2>
              <p className="text-xs text-slate-400">আপনার নিউজ পোর্টালের রিয়েল-টাইম অপারেশনাল কন্ট্রোল সেন্টার</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white">{autoDate}</p>
              <p className="text-[11px] text-slate-400">{autoTime}</p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-red-600/25 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">লাইভ সাইট দেখুন</span>
            </Link>
          </div>
        </header>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 px-6 py-3 flex items-center gap-2 text-xs font-semibold shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="p-6 md:p-8 space-y-6 flex-1 bg-slate-950">
          
          {/* TAB 0: OVERVIEW & STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">মোট সংবাদ</p>
                    <h3 className="text-3xl font-black text-white">{totalPosts} টি</h3>
                    <p className="text-[11px] text-emerald-400 font-semibold">প্রকাশিত: {publishedPosts} টি</p>
                  </div>
                  <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/30">
                    <Newspaper className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">অনুমোদন অপেক্ষমাণ</p>
                    <h3 className="text-3xl font-black text-white">{pendingPosts} টি</h3>
                    <p className="text-[11px] text-amber-400 font-semibold">যাচাই ও প্রকাশের অপেক্ষায়</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">ক্যাটাগরি সংখ্যা</p>
                    <h3 className="text-3xl font-black text-white">{totalCategories} টি</h3>
                    <p className="text-[11px] text-blue-400 font-semibold">ডায়নামিক সেকশন</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <Layers className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">মোট ভিজিটর ভিউস</p>
                    <h3 className="text-3xl font-black text-white">{totalViews.toLocaleString()}</h3>
                    <p className="text-[11px] text-purple-400 font-semibold">সক্রিয় ইউজার: {totalUsers} জন</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/30">
                    <Eye className="w-7 h-7" />
                  </div>
                </div>

              </div>

              {/* Quick Shortcuts & System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 lg:col-span-2 shadow-xl">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span>দ্রুত কার্যকরী শর্টকাট (Quick Actions)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setActiveTab('news')}
                      className="p-4 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-3.5 text-left transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">নতুন সংবাদ প্রকাশ করুন</p>
                        <p className="text-[11px] text-slate-400">শিরোনাম, ছবি ও ভিডিও যুক্ত করুন</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('approval')}
                      className="p-4 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-3.5 text-left transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">সংবাদ অনুমোদন করুন</p>
                        <p className="text-[11px] text-slate-400">{pendingPosts}টি সংবাদ যাচাই অপেক্ষমাণ</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('category')}
                      className="p-4 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-3.5 text-left transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">ক্যাটাগরি কন্ট্রোল</p>
                        <p className="text-[11px] text-slate-400">নতুন ক্যাটাগরি ও কালার কোড</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('design')}
                      className="p-4 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center gap-3.5 text-left transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">থিম ও ডিজাইন কনফিগারেশন</p>
                        <p className="text-[11px] text-slate-400">সেকশন ও কালার পরিবর্তন</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>সিস্টেম স্ট্যাটাস</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-300 font-semibold">সার্ভার স্ট্যাটাস:</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[11px]">অনলাইন</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-300 font-semibold">ডাটাবেজ সিঙ্ক:</span>
                      <span className="text-emerald-400 font-bold">রিয়েল-টাইম মেমোরি</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-slate-300 font-semibold">নিরাপত্তা স্তর:</span>
                      <span className="text-blue-400 font-bold">প্রটেক্টেড (Admin)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Posts preview */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white">সর্বশেষ প্রকাশিত সংবাদসমূহ</h3>
                  <button onClick={() => setActiveTab('news')} className="text-xs text-red-500 hover:text-red-400 font-bold cursor-pointer">
                    সব দেখুন ({posts.length}) →
                  </button>
                </div>
                <div className="divide-y divide-slate-800">
                  {posts.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 truncate">
                        <span className="bg-slate-950 text-slate-300 font-bold px-2.5 py-1 rounded-lg text-[10px] border border-slate-800">
                          {p.category_name_bn}
                        </span>
                        <span className="font-bold text-white truncate">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-slate-400">
                        <span>{formatBanglaDate(p.published_at)}</span>
                        <button
                          onClick={() => handleStartEditPost(p)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          এডিট
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: NEWS POST & MANAGEMENT */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-in fade-in">
              
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {editingPostId ? <Edit className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-red-500" />}
                    <span>{editingPostId ? `সংবাদ এডিট ও আপডেট করুন (ID: ${editingPostId})` : 'নতুন সংবাদ তৈরি ও প্রকাশ করুন'}</span>
                  </h3>
                  {editingPostId && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-xl text-slate-200 font-semibold cursor-pointer"
                    >
                      এডিট বাতিল করুন
                    </button>
                  )}
                </div>

                {/* Auto Date and Time Banner */}
                <div className="bg-red-950/60 border border-red-900/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-red-200 shadow-inner">
                  <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>প্রকাশের তারিখ (অটো): <b>{autoDate}</b></span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>প্রকাশের সময় (অটো): <b>{autoTime}</b></span>
                  </div>
                  <span className="text-[11px] bg-red-600 text-white px-2.5 py-1 rounded-lg font-bold shadow-xs">সিস্টেম জোন (BST)</span>
                </div>

                <form onSubmit={handleSaveNews} className="space-y-5 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-3">
                      <label className="block font-bold text-slate-300 mb-1.5">সংবাদের শিরোনাম (Title) *</label>
                      <input
                        type="text"
                        required
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="সংবাদের আকর্ষণীয় মূল শিরোনাম লিখুন..."
                        className="w-full border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">নিউজ ক্যাটাগরি (Category) *</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => {
                          const catId = Number(e.target.value);
                          setNewsCategory(catId);
                          setNewsSubcategory('');
                        }}
                        className="w-full border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      >
                        {availableCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_bn} ({c.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">সাব-ক্যাটাগরি (Subcategory)</label>
                      <select
                        value={newsSubcategory}
                        onChange={(e) => setNewsSubcategory(e.target.value ? Number(e.target.value) : '')}
                        className="w-full border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      >
                        <option value="">-- সাব-ক্যাটাগরি নির্বাচন করুন (ঐচ্ছিক) --</option>
                        {getSubcategories(Number(newsCategory)).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name_bn} ({sub.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-red-500" />
                          <span>প্রতিবেদক / রিপোর্টার নির্বাচন (Reporter) *</span>
                        </span>
                        <span className="text-[10px] text-red-400 font-semibold">গোল ছবিসহ নিউজে যুক্ত হবে</span>
                      </label>
                      <select
                        value={selectedReporterId}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'custom') {
                            setSelectedReporterId('custom');
                          } else {
                            const id = Number(val);
                            setSelectedReporterId(id);
                            const user = usersList.find((u) => u.id === id);
                            if (user) {
                              setNewsReporter(user.name);
                              setNewsReporterAvatar(user.avatar || '');
                              setNewsReporterDesignation(user.designation || '');
                            }
                          }
                        }}
                        className="w-full border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      >
                        {usersList.map((u) => (
                          <option key={u.id} value={u.id}>
                            👤 {u.name} — {u.designation || u.role}
                          </option>
                        ))}
                        <option value="custom">➕ নতুন / অন্য রিপোর্টারের নাম লিখুন ও ছবি দিন</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Reporter Name & Photo Input if selected 'custom' */}
                  {selectedReporterId === 'custom' && (
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4 animate-in fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1.5">কাস্টম রিপোর্টারের নাম *</label>
                          <input
                            type="text"
                            required
                            value={newsReporter}
                            onChange={(e) => setNewsReporter(e.target.value)}
                            placeholder="রিপোর্টারের নাম লিখুন..."
                            className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1.5">পদবী / বিশেষায়িত ক্ষেত্র (Designation)</label>
                          <input
                            type="text"
                            value={newsReporterDesignation}
                            onChange={(e) => setNewsReporterDesignation(e.target.value)}
                            placeholder="যেমন: বিশেষ প্রতিবেদক / খুলনা ব্যুরো প্রধান"
                            className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1.5">রিপোর্টারের গোল প্রোফাইল ছবি আপলোড (Reporter Avatar)</label>
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-2 transition-colors">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>ডিভাইস থেকে ছবি আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCustomReporterAvatarUpload(file);
                              }}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="url"
                            value={newsReporterAvatar}
                            onChange={(e) => setNewsReporterAvatar(e.target.value)}
                            placeholder="অথবা অনলাইন ছবির লিঙ্ক দিন..."
                            className="flex-1 min-w-[200px] border border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Selected Reporter Visual Preview */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          (selectedReporterId !== 'custom'
                            ? usersList.find((u) => u.id === Number(selectedReporterId))?.avatar
                            : newsReporterAvatar) ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                        }
                        alt="Reporter"
                        className="w-10 h-10 rounded-full object-cover border-2 border-red-500 shadow-sm shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>
                            {selectedReporterId !== 'custom'
                              ? usersList.find((u) => u.id === Number(selectedReporterId))?.name
                              : (newsReporter || 'রিপোর্টারের নাম')}
                          </span>
                          <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                            {selectedReporterId !== 'custom'
                              ? usersList.find((u) => u.id === Number(selectedReporterId))?.role
                              : 'রিপোর্টার'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {selectedReporterId !== 'custom'
                            ? (usersList.find((u) => u.id === Number(selectedReporterId))?.designation || 'বার্তা বিভাগ')
                            : (newsReporterDesignation || 'বিশেষ প্রতিনিধি')}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>নিউজের নিচে গোল ছবি ও নাম দেখাবে</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">সাবটাইটেল / সংক্ষিপ্ত সারাংশ (Subtitle / Summary)</label>
                    <textarea
                      rows={2}
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      placeholder="হোমপেজ ও কার্ডে প্রদর্শনের জন্য সাবটাইটেল বা সংক্ষিপ্ত সারাংশ দিন..."
                      className="w-full border border-slate-700 rounded-xl p-3.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white"
                    />
                  </div>

                  {/* Rich Text Editor Content Box */}
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300">
                      বিস্তারিত সংবাদ টেক্সট ও কন্টেন্ট বক্স (Rich Text Content & Image Embed) *
                    </label>
                    <RichTextEditor
                      value={newsContent}
                      onChange={setNewsContent}
                      placeholder="এখানে সংবাদের বিস্তারিত বিবরণ লিখুন। টেক্সট সিলেক্ট করে বোল্ড, ইটালিক, রঙ, হেডিং দিতে পারেন এবং কন্টেন্টের ভেতরে ছবি ও ক্যাপশন যুক্ত করতে পারেন..."
                      minHeight="260px"
                    />
                  </div>

                  {/* Image & Video Upload / URL Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-800">
                    
                    <div className="space-y-3 bg-slate-950 p-4.5 rounded-xl border border-slate-800">
                      <label className="block font-bold text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          <span>ফিচার ছবি (Featured Image Upload / Link) *</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          PNG, JPG, WEBP, GIF
                        </span>
                      </label>

                      {/* Dropzone & File Selector */}
                      <div 
                        onDragOver={handleImageDragOver}
                        onDragLeave={handleImageDragLeave}
                        onDrop={handleImageDrop}
                        className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                          featureDragActive ? 'border-red-500 bg-red-950/20' : 'border-slate-700 hover:border-slate-600 bg-slate-900/60'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-red-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-200">
                              কম্পিউটার/ডিভাইস থেকে ছবি ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              জেপিজি, পিএনজি, ওয়েবপি সহ সকল ইমেজ ফরম্যাট সমর্থিত (আপলোডের সাথে সাথে ক্রপ ইউটিলিটি ওপেন হবে)
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                            <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-2 transition-colors shadow-md">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>ছবি আপলোড ও ক্রপ</span>
                              <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml" 
                                onChange={handleImageFileChange} 
                                className="hidden" 
                              />
                            </label>
                            {newsImage && (
                              <button
                                type="button"
                                onClick={handleOpenCropperForExisting}
                                className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Crop className="w-3.5 h-3.5" />
                                <span>ছবি ক্রপ / রিসাইজ</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="block text-slate-400 text-[11px] font-medium mb-1">
                          অথবা অনলাইন ছবির লিঙ্ক (Image URL):
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newsImage}
                            onChange={(e) => setNewsImage(e.target.value)}
                            placeholder="https://..."
                            className="flex-1 border border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                          {newsImage && (
                            <button
                              type="button"
                              onClick={handleOpenCropperForExisting}
                              className="bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                              title="বর্তমান ছবিটি ১৬:৯ বা ৪:৩ রেশিওতে ক্রপ করুন"
                            >
                              <Crop className="w-3.5 h-3.5" />
                              <span>ক্রপ</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Selected Image Thumbnail Preview with Caption */}
                      {newsImage && (
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pb-1.5 border-b border-slate-800">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>সিলেক্টেড ছবি প্রিভিউ (১৬:৯ রেশিও)</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={handleOpenCropperForExisting}
                                className="text-amber-400 hover:text-amber-300 hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                              >
                                <Crop className="w-3 h-3" />
                                <span>পুনরায় ক্রপ করুন</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewsImage('')}
                                className="text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                              >
                                ছবি মুছে ফেলুন
                              </button>
                            </div>
                          </div>
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={newsImage}
                              alt="Feature Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {newsImageCaption && (
                            <p className="text-[11px] text-slate-400 italic text-center pt-1 border-t border-slate-800/80">
                              ক্যাপশন: &ldquo;{newsImageCaption}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      <div className="pt-1">
                        <label className="block text-slate-400 text-[11px] font-medium mb-1">
                          ফিচার ইমেজের ক্যাপশন (ইটালিক মোডে শো হবে):
                        </label>
                        <input
                          type="text"
                          value={newsImageCaption}
                          onChange={(e) => setNewsImageCaption(e.target.value)}
                          placeholder="যেমন: ফাইল ছবি / মাতৃভূমি টিভি প্রতিনিধি"
                          className="w-full border border-slate-700 rounded-lg px-3.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-950 p-4.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-3">
                        <label className="block font-bold text-slate-300 flex items-center gap-2">
                          <Video className="w-4 h-4 text-red-500" />
                          <span>সংবাদের ভিডিও (Video Embed / YouTube URL)</span>
                        </label>
                        <input
                          type="text"
                          value={newsVideoUrl}
                          onChange={(e) => setNewsVideoUrl(e.target.value)}
                          placeholder="যেমন: https://www.youtube.com/embed/..."
                          className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl cursor-pointer text-[11px] inline-flex items-center gap-1.5 transition-colors">
                            <Video className="w-4 h-4" />
                            <span>ভিডিও ফাইল সিলেক্ট</span>
                            <input type="file" accept="video/*" onChange={handleSimulatedVideoUpload} className="hidden" />
                          </label>
                          <span className="text-[11px] text-slate-500">এমবেড লিঙ্ক বা ভিডিও</span>
                        </div>
                      </div>

                      {newsVideoUrl && (
                        <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <p className="text-[11px] font-semibold text-slate-400 mb-1.5">ভিডিও প্রিভিউ লিঙ্ক:</p>
                          <p className="text-xs text-blue-400 font-mono truncate">{newsVideoUrl}</p>
                        </div>
                      )}
                    </div>

                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">প্রতিবেদক বা সংবাদদাতার নাম</label>
                    <input
                      type="text"
                      value={newsReporter}
                      onChange={(e) => setNewsReporter(e.target.value)}
                      className="w-full md:w-1/2 border border-slate-700 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                    />
                  </div>

                  {/* Badges & Positions */}
                  <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-800">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isLead}
                        onChange={(e) => setIsLead(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">মূল লিড নিউজ (Main Lead)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isSubLead}
                        onChange={(e) => setIsSubLead(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">সাব-লিড (Sub Lead)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">ব্রেকিং নিউজ টিকার</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isSpecial}
                        onChange={(e) => setIsSpecial(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">মাতৃভূমি স্পেশাল</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPostId ? 'সংবাদ আপডেট করুন' : 'সংবাদ প্রকাশ করুন'}</span>
                    </button>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল করুন
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 1.5: ALL NEWS LIST & BULK MANAGEMENT */}
          {activeTab === 'all_news' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Existing News List & Bulk Management */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Newspaper className="w-4 h-4 text-red-500" />
                      <span>সংবাদ তালিকা ও বাল্ক অ্যাকশন ম্যানেজমেন্ট</span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">
                        {filteredManagementPosts.length} / {posts.length}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">চেকবক্স সিলেক্ট করে একসাথে একাধিক সংবাদ অনুমোদন, বাতিল বা ডিলিট করুন</p>
                  </div>

                  {/* Quick stats pills */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                      অনুমোদিত: {posts.filter(p => p.approval_status === 'approved' || !p.approval_status).length}
                    </span>
                    <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2.5 py-1 rounded-lg font-bold">
                      অপেক্ষমাণ: {posts.filter(p => p.approval_status === 'pending').length}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar for News */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={newsSearchTerm}
                      onChange={(e) => setNewsSearchTerm(e.target.value)}
                      placeholder="শিরোনাম, প্রতিবেদক বা বিভাগের নাম দিয়ে খুঁজুন..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-red-500"
                    />
                    {newsSearchTerm && (
                      <button
                        onClick={() => setNewsSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={newsFilterCategory}
                      onChange={(e) => setNewsFilterCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="all">সকল বিভাগ (All Categories)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name_bn}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={newsFilterStatus}
                      onChange={(e) => setNewsFilterStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="all">সকল স্ট্যাটাস (All Status)</option>
                      <option value="approved">অনুমোদিত (Approved)</option>
                      <option value="pending">অপেক্ষমাণ (Pending)</option>
                      <option value="rejected">বাতিল (Rejected)</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Action Toolbar Banner (Active when items selected) */}
                {selectedNewsIds.length > 0 && (
                  <div className="bg-red-950/80 border-2 border-red-600/80 p-3.5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-xs text-white font-bold">
                      <CheckCheck className="w-4 h-4 text-red-400" />
                      <span>{selectedNewsIds.length}টি সংবাদ নির্বাচিত হয়েছে</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={handleBulkApproveNews}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        title="নির্বাচিত সকল সংবাদ অনুমোদন ও প্রকাশ করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>একসাথে অনুমোদন</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkMarkPendingNews}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="নির্বাচিত সংবাদসমূহকে অপেক্ষমাণ কিউতে রাখুন"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>অপেক্ষমাণ করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkRejectNews}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                        title="নির্বাচিত সংবাদসমূহ বাতিল করুন"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>বাতিল</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkDeleteNews}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        title="নির্বাচিত সংবাদসমূহ স্থায়ীভাবে মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>একসাথে ডিলিট ({selectedNewsIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedNewsIds([])}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        ✕ ক্লিয়ার
                      </button>
                    </div>
                  </div>
                )}

                {/* Master select bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-bold hover:text-white">
                    <input
                      type="checkbox"
                      checked={isAllNewsSelected}
                      onChange={handleToggleSelectAllNews}
                      className="w-4 h-4 rounded text-red-600 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <span>বর্তমান তালিকার সব সিলেক্ট করুন ({filteredManagementPosts.length})</span>
                  </label>

                  <span className="text-[11px] text-slate-400">
                    {selectedNewsIds.length > 0 ? `${selectedNewsIds.length}টি নির্বাচিত` : 'কোনোটি নির্বাচিত নয়'}
                  </span>
                </div>

                {/* News Post Items */}
                <div className="divide-y divide-slate-800 max-h-[520px] overflow-y-auto pr-1">
                  {filteredManagementPosts.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      কোনো সংবাদ পাওয়া যায়নি। ফিল্টার বা সার্চ চেক করুন।
                    </div>
                  ) : (
                    filteredManagementPosts.map((p) => {
                      const isSelected = selectedNewsIds.includes(p.id);
                      const status = p.approval_status || 'approved';
                      return (
                        <div 
                          key={p.id} 
                          className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs px-3 rounded-xl transition-colors ${
                            isSelected ? 'bg-red-950/30 border border-red-900/50' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectNews(p.id)}
                              className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-red-600 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                            />
                            
                            <span className="bg-slate-950 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px] shrink-0 border border-slate-800">
                              {p.category_name_bn}
                            </span>
                            
                            {p.is_lead && <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">LEAD</span>}
                            {p.is_breaking && <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">BREAKING</span>}
                            
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {status === 'approved' ? 'অনুমোদিত' : status === 'pending' ? 'অপেক্ষমাণ' : 'বাতিল'}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white truncate text-xs">{p.title}</p>
                              <p className="text-[11px] text-slate-400 truncate">
                                প্রকাশ: {formatBanglaDate(p.published_at)} | প্রতিবেদক: <span className="text-slate-300 font-semibold">{p.reporter_name}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditPost(p)}
                              className="px-3 py-1.5 bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600 hover:text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>এডিট</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(p.id)}
                              className="px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>ডিলিট</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: APPROVAL QUEUE */}
          {activeTab === 'approval' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>অপেক্ষমাণ সংবাদ অনুমোদন কিউ ({pendingPostsList.length})</span>
                    </h3>
                    <p className="text-xs text-slate-400">রিপোর্টারদের জমাকৃত সংবাদ পর্যালোচনার পর অনুমোদন ও প্রকাশের ব্যবস্থা।</p>
                  </div>

                  {pendingPostsList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleBulkApprovePendingQueue}
                        disabled={selectedPendingIds.length === 0}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          selectedPendingIds.length > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>নির্বাচিত অনুমোদন ({selectedPendingIds.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkRejectPendingQueue}
                        disabled={selectedPendingIds.length === 0}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          selectedPendingIds.length > 0
                            ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>নির্বাচিত বাতিল ({selectedPendingIds.length})</span>
                      </button>
                    </div>
                  )}
                </div>

                {pendingPostsList.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-dashed border-slate-800">
                    বর্তমানে কোনো অপেক্ষমাণ সংবাদ নেই।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Select all pending bar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-bold hover:text-white">
                        <input
                          type="checkbox"
                          checked={isAllPendingSelected}
                          onChange={handleToggleSelectAllPending}
                          className="w-4 h-4 rounded text-red-600 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <span>সবগুলো অপেক্ষমাণ সংবাদ নির্বাচন করুন</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {selectedPendingIds.length}টি নির্বাচিত
                      </span>
                    </div>

                    {pendingPostsList.map((p) => {
                      const isSelected = selectedPendingIds.includes(p.id);
                      return (
                        <div 
                          key={p.id} 
                          className={`p-4 bg-slate-950 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs transition-colors ${
                            isSelected ? 'border-red-500 ring-1 ring-red-500/30' : 'border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectPending(p.id)}
                              className="w-4 h-4 mt-1 rounded text-red-600 bg-slate-900 border-slate-700 cursor-pointer shrink-0"
                            />
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-red-950 text-red-300 font-bold px-2.5 py-0.5 rounded border border-red-900">{p.category_name_bn}</span>
                                <span className="text-slate-400 font-medium">প্রতিবেদক: {p.reporter_name}</span>
                              </div>
                              <h4 className="font-bold text-white text-sm">{p.title}</h4>
                              <p className="text-slate-400 line-clamp-2">{p.summary}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handleApprovePost(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>অনুমোদন ও প্রকাশ</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectPost(p.id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY & SUBCATEGORY CONTROL */}
          {activeTab === 'category' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Category Creation Form */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>নতুন মূল ক্যাটাগরি তৈরি করুন</span>
                </h3>

                <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ক্যাটাগরি নাম (বাংলা) *</label>
                      <input
                        type="text"
                        required
                        value={newCatBn}
                        onChange={(e) => setNewCatBn(e.target.value)}
                        placeholder="যেমন: প্রযুক্তি"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ক্যাটাগরি নাম (ইংরেজি)</label>
                      <input
                        type="text"
                        value={newCatEn}
                        onChange={(e) => setNewCatEn(e.target.value)}
                        placeholder="যেমন: Technology"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ব্যানার কালার কোড</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newCatColor}
                          onChange={(e) => setNewCatColor(e.target.value)}
                          className="w-11 h-10 rounded-xl border border-slate-700 cursor-pointer bg-slate-950 p-1"
                        />
                        <input
                          type="text"
                          value={newCatColor}
                          onChange={(e) => setNewCatColor(e.target.value)}
                          className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono bg-slate-950 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    ক্যাটাগরি যুক্ত করুন
                  </button>
                </form>
              </div>

              {/* Subcategory Creation Form */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <List className="w-4 h-4 text-amber-500" />
                  <span>নতুন সাব-ক্যাটাগরি তৈরি করুন</span>
                </h3>

                <form onSubmit={handleCreateSubcategory} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">মূল ক্যাটাগরি নির্বাচন করুন *</label>
                      <select
                        value={newSubCatParentId}
                        onChange={(e) => setNewSubCatParentId(Number(e.target.value))}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_bn} ({c.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">সাব-ক্যাটাগরি নাম (বাংলা) *</label>
                      <input
                        type="text"
                        required
                        value={newSubCatBn}
                        onChange={(e) => setNewSubCatBn(e.target.value)}
                        placeholder="যেমন: স্মার্টফোন / আর্টিফিশিয়াল ইন্টেলিজেন্স"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">সাব-ক্যাটাগরি নাম (ইংরেজি)</label>
                      <input
                        type="text"
                        value={newSubCatEn}
                        onChange={(e) => setNewSubCatEn(e.target.value)}
                        placeholder="যেমন: Smartphones"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-amber-600/30"
                  >
                    সাব-ক্যাটাগরি যুক্ত করুন
                  </button>
                </form>
              </div>

              {/* Category & Subcategory List */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white">সকল ক্যাটাগরি ও সাব-ক্যাটাগরি তালিকা ({categories.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const subList = getSubcategories(cat.id);
                    return (
                      <div key={cat.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: cat.color_code }} />
                            <span className="font-bold text-white text-sm">{cat.name_bn}</span>
                            <span className="text-slate-400 text-[11px]">({cat.name_en})</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCategoryItem(cat.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-900 rounded-lg cursor-pointer transition-colors"
                            title="ক্যাটাগরি ডিলিট"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {subList.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                            <p className="text-[11px] font-semibold text-slate-400">সাব-ক্যাটাগরি ({subList.length}):</p>
                            <div className="flex flex-wrap gap-1.5">
                              {subList.map((sub) => (
                                <span key={sub.id} className="inline-flex items-center gap-1.5 bg-slate-900 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] border border-slate-800">
                                  <span>{sub.name_bn}</span>
                                  <button
                                    onClick={() => handleDeleteSubcategoryItem(sub.id)}
                                    className="text-slate-500 hover:text-red-400 cursor-pointer"
                                    title="মুছুন"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USER & REPORTER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-500" />
                    <span>নতুন সাংবাদিক / রিপোর্টার / ইউজার অ্যাকাউন্ট তৈরি করুন</span>
                  </h3>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800 font-semibold">
                    ছবি ও পদবীযুক্ত প্রোফাইল
                  </span>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">পূর্ণ নাম (Full Name) *</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">সাংবাদিকের পদবী / বিট (Designation) *</label>
                      <input
                        type="text"
                        value={newUserDesignation}
                        onChange={(e) => setNewUserDesignation(e.target.value)}
                        placeholder="যেমন: বিশেষ প্রতিনিধি / জ্যেষ্ঠ প্রতিবেদক"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">লগইন ইউজার আইডি (Login Username / ID) *</label>
                      <input
                        type="text"
                        required
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                        placeholder="যেমন: reporter_tanvir বা tanvir"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">লগইন পাসওয়ার্ড (Login Password) *</label>
                      <input
                        type="text"
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="যেমন: Tanvir@2026 বা reporter123"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">অ্যাকাউন্ট রোল (Role) *</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="Reporter">সাংবাদিক / রিপোর্টার (Reporter)</option>
                        <option value="Editor">সংবাদ সম্পাদক (Editor)</option>
                        <option value="Admin">প্রধান প্রশাসক (Admin)</option>
                        <option value="Reader">সাধারণ পাঠক (Reader)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="reporter@matribhumitv.com"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">মোবাইল / ফোন নম্বর (Phone)</label>
                      <input
                        type="tel"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">সংক্ষিপ্ত পরিচিতি (Short Bio)</label>
                      <input
                        type="text"
                        value={newUserBio}
                        onChange={(e) => setNewUserBio(e.target.value)}
                        placeholder="সাংবাদিকতার অভিজ্ঞতা বা সংক্ষিপ্ত বিবরণ..."
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Multi-Category Assignment for Reporters */}
                    <div className="md:col-span-3 border-t border-slate-800/80 pt-4">
                      <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>রিপোর্টারের ক্যাটাগরি অ্যাসাইনমেন্ট (অনুমোদিত ক্যাটাগরি সমূহ) *</span>
                        <span className="text-[10px] text-amber-500 font-semibold">একাধিক সিলেক্ট করা যাবে</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-3">সাংবাদিকটি শুধুমাত্র তার জন্য বরাদ্দকৃত ক্যাটাগরির সংবাদ লিখতে, সম্পাদনা বা প্রকাশ করতে পারবেন। কোনো ক্যাটাগরি সিলেক্ট না করলে সকল ক্যাটাগরি অনুমোদিত থাকবে।</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {categories.map((c) => {
                          const isChecked = newUserAllowedCats.includes(c.slug);
                          return (
                            <label
                              key={c.id}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                                isChecked
                                  ? 'bg-red-950/40 border-red-800 text-red-200'
                                  : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewUserAllowedCats([...newUserAllowedCats, c.slug]);
                                  } else {
                                    setNewUserAllowedCats(newUserAllowedCats.filter((slug) => slug !== c.slug));
                                  }
                                }}
                                className="accent-red-600 w-3.5 h-3.5"
                              />
                              <span className="font-bold text-xs">{c.name_bn}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Permissions / Access Control level */}
                    <div className="md:col-span-3 border-t border-slate-800/80 pt-4">
                      <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>রিপোর্টারের অনুমতি ও কাজের পরিধি নির্ধারণ (Permissions Control)</span>
                        <span className="text-[10px] text-amber-500 font-semibold">অ্যাডমিন কন্ট্রোল</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-3">রিপোর্টার ড্যাশবোর্ড থেকে কতটুকু কাজ করতে পারবেন তা নির্দিষ্ট করে দিন:</p>
                      <div className="flex flex-wrap gap-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                        {[
                          { key: 'post', label: 'নতুন সংবাদ পোস্ট করতে পারবেন' },
                          { key: 'edit', label: 'নিজের সংবাদ এডিট করতে পারবেন' },
                          { key: 'update', label: 'নিজের সংবাদ আপডেট করতে পারবেন' },
                          { key: 'approve', label: 'সরাসরি সংবাদ অনুমোদন/পাবলিশ করতে পারবেন' },
                        ].map((perm) => {
                          const isChecked = newUserPermissions.includes(perm.key);
                          return (
                            <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewUserPermissions([...newUserPermissions, perm.key]);
                                  } else {
                                    setNewUserPermissions(newUserPermissions.filter((k) => k !== perm.key));
                                  }
                                }}
                                className="accent-red-600 w-4 h-4"
                              />
                              <span className="font-bold text-xs">{perm.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reporter Avatar Upload Box */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <label className="block font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-500" />
                        <span>রিপোর্টার / ইউজারের গোল প্রোফাইল ছবি (Avatar Photo Upload)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">নিউজ ও লেখকের বক্সে প্রদর্শনযোগ্য</span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Avatar circular preview */}
                      <div className="relative group shrink-0">
                        <img
                          src={newUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-md ring-4 ring-slate-800"
                        />
                        <span className="absolute bottom-0 right-0 bg-red-600 text-white p-1 rounded-full text-[9px] shadow-sm">
                          📷
                        </span>
                      </div>

                      {/* Upload controls */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-2 transition-colors shadow-md">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>কম্পিউটার/মোবাইল থেকে ছবি আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUserAvatarUpload(file);
                              }}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="url"
                            value={newUserAvatar}
                            onChange={(e) => setNewUserAvatar(e.target.value)}
                            placeholder="অথবা সরাসরি ছবির ওয়েব লিঙ্ক দিন..."
                            className="flex-1 min-w-[220px] border border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                          />
                        </div>

                        {/* Quick sample avatars */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>স্যাম্পল ছবি:</span>
                          <button
                            type="button"
                            onClick={() => setNewUserAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80')}
                            className="text-red-400 hover:underline cursor-pointer"
                          >
                            পোর্ট্রেট ১
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setNewUserAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80')}
                            className="text-red-400 hover:underline cursor-pointer"
                          >
                            পোর্ট্রেট ২
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setNewUserAvatar('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80')}
                            className="text-red-400 hover:underline cursor-pointer"
                          >
                            পোর্ট্রেট ৩
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setNewUserAvatar('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80')}
                            className="text-red-400 hover:underline cursor-pointer"
                          >
                            পোর্ট্রেট ৪
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>রিপোর্টার অ্যাকাউন্ট সংরক্ষণ করুন</span>
                  </button>
                </form>
              </div>

              {/* User List with Avatars, Search, and Post Count Badges */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-500" />
                      <span>সকল নিবন্ধিত সাংবাদিক, সম্পাদক ও ইউজার তালিকা</span>
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {filteredUsersList.length} / {usersList.length} জন
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">নাম বা পদবি দিয়ে দ্রুত খুঁজুন এবং সংশ্লিষ্ট সাংবাদিকের মোট প্রকাশিত নিউজ সংখ্যা দেখুন</p>
                  </div>
                </div>

                {/* User Search Bar & Filter */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="নাম, পদবি (Designation), ইমেইল বা মোবাইল দিয়ে সাংবাদিক খুঁজুন..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none focus:border-red-500"
                    />
                    {userSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Role filter pills */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">রোল ফিল্টার:</span>
                    {(['all', 'Reporter', 'Editor', 'Admin', 'Reader'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setUserFilterRole(role)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          userFilterRole === role
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {role === 'all' ? 'সকল (All)' : role === 'Reporter' ? 'রিপোর্টার' : role === 'Editor' ? 'সম্পাদক' : role === 'Admin' ? 'প্রশাসক' : 'পাঠক'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-slate-800 max-h-[550px] overflow-y-auto pr-1">
                  {filteredUsersList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      কোনো সাংবাদিক বা ইউজার খুঁজে পাওয়া যায়নি। অনুসন্ধান পরিবর্তন করুন।
                    </div>
                  ) : (
                    filteredUsersList.map((u) => {
                      const postStats = getReporterPostStats(u.id);
                      return (
                        <div key={u.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-950/40 px-3 rounded-xl transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                              alt={u.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 shadow-sm shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-white text-sm truncate">{u.name}</span>
                                
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                  u.role === 'Admin' ? 'bg-red-950 text-red-300 border border-red-900' :
                                  u.role === 'Editor' ? 'bg-amber-950 text-amber-300 border border-amber-900' :
                                  u.role === 'Reporter' ? 'bg-blue-950 text-blue-300 border border-blue-900' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {u.role}
                                </span>

                                {/* Reporter Post Count Badge */}
                                <span 
                                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-slate-200 border border-slate-700 shadow-sm shrink-0"
                                  title={`মোট প্রকাশিত: ${postStats.published}টি | অপেক্ষমাণ: ${postStats.pending}টি`}
                                >
                                  <Newspaper className="w-3 h-3 text-red-400" />
                                  <span>{postStats.published}টি সংবাদ প্রকাশিত</span>
                                  {postStats.pending > 0 && (
                                    <span className="text-amber-400 ml-0.5 font-normal">({postStats.pending} অপেক্ষমাণ)</span>
                                  )}
                                </span>
                              </div>

                              <p className="text-red-400 font-semibold text-[11px] mt-0.5 truncate">
                                {u.designation || (u.role === 'Admin' ? 'প্রধান প্রশাসক' : u.role === 'Editor' ? 'বার্তা সম্পাদক' : 'স্টাফ রিপোর্টার')}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[11px] mt-1">
                                <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-amber-300 font-bold">
                                  ID: {u.username || u.email.split('@')[0]}
                                </span>
                                {u.password && (
                                  <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
                                    Pass: {u.password}
                                  </span>
                                )}
                                <span>{u.email}</span>
                                {u.phone && <span>• {u.phone}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                            {/* Copy Credentials Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyCredentials(u)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-[11px] flex items-center gap-1.5 border shadow-sm ${
                                copiedUserId === u.id
                                  ? 'bg-emerald-600 text-white border-emerald-500'
                                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-500/50'
                              }`}
                              title="ইউজার আইডি ও পাসওয়ার্ড কপি করুন"
                            >
                              {copiedUserId === u.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-white" />
                                  <span>কপি হয়েছে!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                                  <span>আইডি-পাসওয়ার্ড</span>
                                </>
                              )}
                            </button>

                            {/* Edit User Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEditUser(u)}
                              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl font-bold transition-all cursor-pointer text-[11px] flex items-center gap-1.5 shadow-sm"
                              title="রিপোর্টার তথ্য, আইডি ও পাসওয়ার্ড সম্পাদনা করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>এডিট</span>
                            </button>

                            {/* Status Badge & Toggle */}
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              u.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}>
                              {u.status === 'active' ? 'সক্রিয়' : 'সাসপেন্ড'}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-[11px] border ${
                                u.status === 'active'
                                  ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-800/60'
                                  : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60'
                              }`}
                              title={u.status === 'active' ? 'অ্যাকাউন্ট সাময়িক স্থগিত করুন' : 'অ্যাকাউন্ট পুনরায় সক্রিয় করুন'}
                            >
                              {u.status === 'active' ? 'সাসপেন্ড করুন' : 'সক্রিয় করুন'}
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUserAccount(u.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl border border-transparent hover:border-red-800 transition-colors cursor-pointer"
                              title="ইউজার অ্যাকাউন্ট মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADSENSE & CUSTOM ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Google AdSense Card */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Google AdSense অটো এডস ও ক্লায়েন্ট আইডি কনফিগারেশন</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">Google AdSense Publisher ID (Client ID)</label>
                    <input
                      type="text"
                      value={adsenseClientId}
                      onChange={(e) => setAdsenseClientId(e.target.value)}
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      className="w-full md:w-1/2 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono bg-slate-950 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer pt-2 bg-slate-950 p-4 rounded-xl border border-slate-800 w-fit">
                    <input
                      type="checkbox"
                      checked={adsenseEnabled}
                      onChange={(e) => setAdsenseEnabled(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-200">ওয়েবসাইটে Google AdSense অটো অ্যাড প্রদর্শন সক্রিয় রাখুন</span>
                  </label>

                  <button
                    onClick={handleSaveAdsense}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                  >
                    অ্যাডসেন্স সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </div>

              {/* Create Custom Banner Ad Card */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-red-500" />
                  <span>নতুন কাস্টম ব্যানার বিজ্ঞাপন তৈরি ও ইমেজ আপলোড</span>
                </h3>

                <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">বিজ্ঞাপনের নাম / ক্লায়েন্ট নাম *</label>
                      <input
                        type="text"
                        required
                        value={newAdTitle}
                        onChange={(e) => setNewAdTitle(e.target.value)}
                        placeholder="যেমন: ওয়ালটন স্মার্ট টিভি বিশেষ অফার"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">বিজ্ঞাপন স্লট / অবস্থান *</label>
                      <select
                        value={newAdSlot}
                        onChange={(e) => setNewAdSlot(e.target.value as AdUnit['slot'])}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="lead_top_iccb">লিড সংবাদের উপরে (হেডার ব্যানার 970x90)</option>
                        <option value="middle_square">সাইডবার স্কয়ার ব্যানার (300x250)</option>
                        <option value="bottom_full">ফুটার বটম ব্যানার (970x90 / 728x90)</option>
                        <option value="content_inline">নিউজ কন্টেন্টের মাঝের ব্যানার (728x90)</option>
                        <option value="video_under">ভিডিও গ্যালারির নিচে ব্যানার</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ক্লিক রিডাইরেক্ট লিঙ্ক (Destination URL)</label>
                      <input
                        type="url"
                        value={newAdRedirectUrl}
                        onChange={(e) => setNewAdRedirectUrl(e.target.value)}
                        placeholder="https://clientwebsite.com"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">বিজ্ঞাপন ইমেজ ফাইল আপলোড (PNG/JPG/WEBP/GIF)</label>
                      <div className="flex items-center gap-2">
                        <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer text-xs inline-flex items-center gap-1.5 transition-colors shrink-0">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ইমেজ ফাইল নির্বাচন করুন</span>
                          <input type="file" accept="image/*" onChange={handleAdImageUpload} className="hidden" />
                        </label>
                        <input
                          type="text"
                          value={newAdImage}
                          onChange={(e) => setNewAdImage(e.target.value)}
                          placeholder="অথবা ইমেজ URL..."
                          className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {newAdImage && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <p className="text-[11px] font-semibold text-emerald-400">সিলেক্টেড ব্যানার প্রিভিউ:</p>
                      <div className="max-h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={newAdImage} alt="Ad Preview" className="max-h-28 object-contain" />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    নতুন বিজ্ঞাপন প্রকাশ করুন
                  </button>
                </form>
              </div>

              {/* Active Ads List */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white">বিজ্ঞাপন ব্যানার ও স্লট তালিকা ({ads.length})</h3>
                <div className="divide-y divide-slate-800">
                  {ads.map((ad) => (
                    <div key={ad.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-white">{ad.title}</p>
                        <p className="text-slate-400 font-mono text-[11px]">
                          স্লট: <span className="text-amber-300 font-semibold">{ad.slot}</span> | ইমপ্রেশন: {ad.impressions} | ক্লিক: {ad.clicks}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-3 py-1 rounded-full text-[10px]">
                          {ad.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                        <button
                          onClick={() => handleDeleteAdUnit(ad.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                          title="বিজ্ঞাপন মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SITE SETTINGS & BRANDING */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
                পোর্টাল ব্র্যান্ডিং, লোগো, লাইভ সম্প্রচার ও অফিসিয়াল তথ্য
              </h3>

              <div className="space-y-5 text-xs">
                {/* Branding & Logo Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300">পোর্টাল নাম (Site Name)</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300">স্লোগান (Site Slogan)</label>
                    <input
                      type="text"
                      value={siteSlogan}
                      onChange={(e) => setSiteSlogan(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300 flex items-center justify-between">
                      <span>লোগো আপলোড (PNG/JPG/SVG)</span>
                      {siteLogo && <span className="text-[10px] text-emerald-400">আপলোডেড</span>}
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-1.5 transition-colors shrink-0">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>লোগো ফাইল দিন</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                      <input
                        type="text"
                        value={siteLogo}
                        onChange={(e) => setSiteLogo(e.target.value)}
                        placeholder="বা লোগো URL..."
                        className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-300">ফেভিকন / আইকন আপলোড</label>
                    <div className="flex items-center gap-2">
                      <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3.5 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-1.5 transition-colors shrink-0">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>আইকন ফাইল</span>
                        <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                      </label>
                      <input
                        type="text"
                        value={siteFavicon}
                        onChange={(e) => setSiteFavicon(e.target.value)}
                        placeholder="বা Favicon URL..."
                        className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Stream Settings */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" />
                    <span>মাতৃভূমি টিভি ২৪/৭ লাইভ সম্প্রচার কনফিগারেশন</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">লাইভ স্ট্রিম শিরোনাম</label>
                      <input
                        type="text"
                        value={liveStreamTitle}
                        onChange={(e) => setLiveStreamTitle(e.target.value)}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">লাইভ স্ট্রিম এমবেড লিঙ্ক (YouTube Embed)</label>
                      <input
                        type="text"
                        value={liveStreamUrl}
                        onChange={(e) => setLiveStreamUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={liveStreamActive}
                      onChange={(e) => setLiveStreamActive(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-200">হোমপেজে লাইভ টিভি সম্প্রচার সক্রিয় রাখুন</span>
                  </label>
                </div>

                {/* Editorial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">সম্পাদক (Editor Name)</label>
                    <input
                      type="text"
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">প্রকাশক (Publisher Name)</label>
                    <input
                      type="text"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ইমেইল ঠিকানা</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ফোন নম্বর</label>
                    <input
                      type="text"
                      value={sitePhone}
                      onChange={(e) => setSitePhone(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">অফিস ঠিকানা</label>
                  <textarea
                    rows={2}
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  onClick={handleSaveSiteSettings}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: DESIGN & SECTIONS */}
          {activeTab === 'design' && (
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 animate-in fade-in">
              <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
                ওয়েবসাইট থিম, রঙ ও বিভিন্ন সেকশন দৃশ্যমানতা নিয়ন্ত্রণ
              </h3>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">প্রধান কালার (Primary Accent)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-11 h-10 rounded-xl border border-slate-700 cursor-pointer bg-slate-950 p-1"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">ফন্ট স্টাইল (Typography)</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as any)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white font-semibold"
                    >
                      <option value="serif">ঐতিহ্যবাহী ক্লাসিক (Serif / SolaimanLipi)</option>
                      <option value="sans">মডার্ন সান্স-সেরিফ (Sans / Inter)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">হেডার লেআউট স্টাইল</label>
                    <select
                      value={headerStyle}
                      onChange={(e) => setHeaderStyle(e.target.value as any)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white font-semibold"
                    >
                      <option value="classic">ক্লাসিক সংবাদ লেআউট</option>
                      <option value="modern">মডার্ন লেআউট</option>
                      <option value="centered">সেন্টার্ড লোগো লেআউট</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-white">হোমপেজ সেকশনসমূহ দৃশ্যমান রাখুন:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={showTopTicker} onChange={(e) => setShowTopTicker(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">টপ কারেন্সি/তারিখ বার</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={showBreakingBar} onChange={(e) => setShowBreakingBar(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">ব্রেকিং নিউজ টিকার বার</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={enableLeadSection} onChange={(e) => setEnableLeadSection(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">লিড নিউজ ও সাব-লিড সেকশন</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={enableBanglaSpecial} onChange={(e) => setEnableBanglaSpecial(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">মাতৃভূমি স্পেশাল সেকশন</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={enableCategoryGrid} onChange={(e) => setShowTopTicker(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">ক্যাটাগরি নিউজ গ্রিড</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input type="checkbox" checked={enableVideoGallery} onChange={(e) => setEnableVideoGallery(e.target.checked)} className="rounded text-red-600" />
                      <span className="font-bold text-slate-200">ভিডিও গ্যালারি সেকশন</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveDesignSections}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  ডিজাইন ও সেকশন সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

          {/* cPanel & MySQL Export Tab */}
          {activeTab === 'cpanel' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Server className="w-6 h-6 text-red-500" />
                      <span>cPanel হোস্টিং ও MySQL ডাটাবেস এক্সপোর্ট সেন্টার</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      ওয়েবসাইটটি যেকোনো cPanel বা লিনাক্স সার্ভারে হোস্ট করার জন্য ১-ক্লিকে ফুল MySQL ডাটাবেস ডাম্প (.sql ফাইল) ডাউনলোড করুন এবং ধাপভিত্তিক নির্দেশিকা অনুসরণ করুন।
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const sqlContent = generateMySQLDump(posts, categories, getSubcategories(), usersList, siteConfig, ads);
                      const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `matribhumi_news_db_${new Date().toISOString().slice(0, 10)}.sql`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      showSuccess('MySQL ডাটাবেস ডাম্প (SQL ফাইল) সফলভাবে ডাউনলোড হয়েছে!');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    <span>💾 MySQL ডাটাবেস ফাইল ডাউনলোড (.sql)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-red-400 font-mono uppercase font-bold">মোট নিউজ রেকর্ড</span>
                    <h4 className="text-lg font-black text-white">{posts.length}টি প্রস্তুত পোস্ট</h4>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">ক্যাটাগরি ও সাব-ক্যাটাগরি</span>
                    <h4 className="text-lg font-black text-white">{categories.length}টি ক্যাটাগরি | {getSubcategories().length}টি সাব-ক্যাটাগরি</h4>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">নিবন্ধিত রিপোর্টার ও অ্যাডমিন</span>
                    <h4 className="text-lg font-black text-white">{usersList.length}জন সক্রিয় ইউজার</h4>
                  </div>
                </div>
              </div>

              {/* Comprehensive Step-by-Step Guide for cPanel Hosting */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-500" />
                  <span>cPanel এ ওয়েবসাইট হোস্ট করার ধাপে ধাপে পরিপূর্ণ নির্দেশিকা (Step-by-Step Hosting Guide)</span>
                </h3>

                <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
                  
                  {/* Step 1 */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                        ১
                      </span>
                      <h4 className="text-sm font-bold text-white">ধাপ ১: cPanel এ MySQL ডাটাবেস তৈরি ও SQL ফাইল ইমপোর্ট করা</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-2">
                      <li>আপনার cPanel ড্যাশবোর্ডে প্রবেশ করুন এবং <strong className="text-white font-mono">MySQL Database Wizard</strong> অপশনে যান।</li>
                      <li>নতুন ডাটাবেসের একটি নাম লিখুন (যেমন: <code className="bg-slate-900 text-red-400 px-2 py-0.5 rounded font-mono">user_matribhumidb</code>) এবং <em>Next Step</em> চাপুন।</li>
                      <li>নতুন ডাটাবেস ইউজার নেম ও একটি শক্তিশালী পাসওয়ার্ড তৈরি করুন (পাসওয়ার্ডটি নিরাপদ স্থানে সংরক্ষণ করুন)।</li>
                      <li><strong className="text-white">ALL PRIVILEGES</strong> বক্সে টিক দিয়ে <em>Make Changes</em> বাটনে চাপুন।</li>
                      <li>cPanel হোম থেকে <strong className="text-white font-mono">phpMyAdmin</strong> অপশনে যান এবং বাম পাশ থেকে তৈরি করা ডাটাবেসটি নির্বাচন করুন।</li>
                      <li>উপরের <strong className="text-white">Import</strong> ট্যাবে ক্লিক করে এই পেইজ থেকে ডাউনলোড করা <code className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-mono">matribhumi_news_db.sql</code> ফাইলটি ব্রাউজ করে নির্বাচন করুন এবং নিচে <strong>Go</strong> বাটনে চাপুন।</li>
                    </ol>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                        ২
                      </span>
                      <h4 className="text-sm font-bold text-white">ধাপ ২: প্রজেক্ট সোর্স কোড (ZIP) আপলোড করা</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-2">
                      <li>আপনার ডেভেলপমেন্ট এডিটর / AI Studio এর উপরে ডানপাশের <strong className="text-white">Settings → Export to ZIP</strong> বাটনে ক্লিক করে প্রজেক্টের পুরো জিপ ফাইলটি পিসিতে সেভ করুন।</li>
                      <li>cPanel এর <strong className="text-white font-mono">File Manager</strong> এ যান এবং <code className="bg-slate-900 text-red-400 px-2 py-0.5 rounded font-mono">public_html</code> ফোল্ডারে (বা আপনার ডোমেইনের নির্দিষ্ট ফোল্ডারে) প্রবেশ করুন।</li>
                      <li><strong className="text-white">Upload</strong> বাটনে ক্লিক করে জিপ ফাইলটি আপলোড সম্পন্ন করুন।</li>
                      <li>ফাইল আপলোড শেষে জিপ ফাইলটির উপরে রাইট ক্লিক করে <strong className="text-white">Extract</strong> চেপে সমস্ত ফাইল আনজিপ করুন।</li>
                    </ol>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                        ৩
                      </span>
                      <h4 className="text-sm font-bold text-white">ধাপ ৩: cPanel এ Node.js Application রান করা</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-2">
                      <li>cPanel এর <strong className="text-white font-mono">Software</strong> সেকশনে গিয়ে <strong className="text-white font-mono">Setup Node.js App</strong> এ ক্লিক করুন।</li>
                      <li><strong className="text-white font-mono">Create Application</strong> বাটনে চাপুন।</li>
                      <li><strong className="text-white">Node.js version</strong>: ১৮ বা ২০ সিলেক্ট করুন (যেমন Node.js 18.x / 20.x)।</li>
                      <li><strong className="text-white">Application mode</strong>: <code className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono">Production</code> বেছে নিন।</li>
                      <li><strong className="text-white">Application root</strong>: <code className="bg-slate-900 text-red-400 px-2 py-0.5 rounded font-mono">public_html</code> টাইপ করুন।</li>
                      <li><strong className="text-white">Application URL</strong>: আপনার কাঙ্ক্ষিত প্রধান ডোমেইন নির্বাচন করুন (যেমন <code className="bg-slate-900 text-sky-400 px-2 py-0.5 rounded font-mono">matribhumitv.com</code>)।</li>
                      <li><strong className="text-white">Application startup file</strong>: <code className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-mono">server.js</code> অথবা <code className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-mono">npm start</code> দিন।</li>
                      <li>অ্যাপ্লিকেশন সেভ করার পর উপর থেকে <strong className="text-white font-mono">Run npm install</strong> বাটনে ক্লিক করুন যাতে সমস্ত ডিপেনডেন্সি অটো ইনস্টল হয়ে যায়।</li>
                    </ol>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                        ৪
                      </span>
                      <h4 className="text-sm font-bold text-white">ধাপ ৪: পরিবেশ ভ্যারিয়েবল (.env) ফিলআপ ও অ্যাডসেন্স ads.txt</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-2">
                      <li>File Manager এ <code className="bg-slate-900 text-red-400 px-2 py-0.5 rounded font-mono">.env</code> ফাইল খুলুন (যদি লুকিয়ে থাকে তবে File Manager Settings থেকে <em>Show Hidden Files (dotfiles)</em> এ টিক দিন)।</li>
                      <li>ফাইলে নিচের মত ভ্যারিয়েবলগুলো যোগ করে সেভ করুন:
                        <pre className="bg-slate-900 text-amber-300 p-3 rounded-xl border border-slate-800 font-mono text-[11px] mt-1.5 overflow-x-auto">
{`NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here`}
                        </pre>
                      </li>
                      <li>Google AdSense ডোমেইন ভ্যালিডেশনের জন্য <code className="bg-slate-900 text-red-400 px-2 py-0.5 rounded font-mono">public_html/ads.txt</code> ফাইল তৈরি করুন এবং আপনার গুগল পাবলিশার আইডি বসান:
                        <pre className="bg-slate-900 text-sky-300 p-3 rounded-xl border border-slate-800 font-mono text-[11px] mt-1.5">
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
                        </pre>
                      </li>
                    </ol>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                        ৫
                      </span>
                      <h4 className="text-sm font-bold text-white">ধাপ ৫: ওয়েবসাইট রি-স্টার্ট ও লাইভ টেস্টিং</h4>
                    </div>
                    <p className="text-slate-300">
                      cPanel এর Node.js App ইন্টারফেসে ফিরে গিয়ে <strong className="text-white">Restart Application</strong> বাটনে ক্লিক করুন। আপনার ওয়েবসাইট <code className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-mono">https://matribhumitv.com</code> এ সম্পূর্ণ সচল ও প্রস্তুত হয়ে যাবে!
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Image Cropper Modal for Featured Images & Avatars */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperSourceImage}
        onCropComplete={handleCropComplete}
        initialAspectRatio={cropperTarget === 'featured' ? '16:9' : '1:1'}
        title={
          cropperTarget === 'featured'
            ? 'ফিচার ছবি ক্রপ ও অ্যাসপেক্ট রেশিও অ্যাডজাস্ট'
            : 'প্রোফাইল ফটো ক্রপ ও সাইজিং'
        }
      />

      {/* Edit User / Reporter Modal */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={editUserAvatar || editingUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow"
                />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{editingUser.name} - তথ্য ও পাসওয়ার্ড সম্পাদনা</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800 font-mono">
                      ID #{editingUser.id}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    ইউজার আইডি, পাসওয়ার্ড, ক্যাটাগরি পারমিশন ও পদবী আপডেট করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditUser} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">পূর্ণ নাম (Full Name) *</label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">সাংবাদিকের পদবী / বিট (Designation) *</label>
                  <input
                    type="text"
                    required
                    value={editUserDesignation}
                    onChange={(e) => setEditUserDesignation(e.target.value)}
                    placeholder="যেমন: বিশেষ প্রতিনিধি / জ্যেষ্ঠ প্রতিবেদক"
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">লগইন ইউজার আইডি (Login Username / User ID) *</label>
                  <input
                    type="text"
                    required
                    value={editUserUsername}
                    onChange={(e) => setEditUserUsername(e.target.value)}
                    placeholder="যেমন: reporter_tanvir"
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 font-mono font-bold text-amber-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>লগইন পাসওয়ার্ড (Password) *</span>
                    <button
                      type="button"
                      onClick={() => setShowEditUserPassword(!showEditUserPassword)}
                      className="text-[10px] text-blue-400 hover:underline cursor-pointer"
                    >
                      {showEditUserPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type={showEditUserPassword ? 'text' : 'password'}
                      required
                      value={editUserPassword}
                      onChange={(e) => setEditUserPassword(e.target.value)}
                      placeholder="যেমন: Tanvir@2026"
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 pr-20 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setEditUserPassword(`Tv${Math.floor(1000 + Math.random() * 9000)}@2026`)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold rounded-lg border border-slate-700"
                      title="নতুন পাসওয়ার্ড তৈরি করুন"
                    >
                      জেনারেট
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">অ্যাকাউন্ট রোল (Role) *</label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as any)}
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Reporter">সাংবাদিক / রিপোর্টার (Reporter)</option>
                    <option value="Editor">সংবাদ সম্পাদক (Editor)</option>
                    <option value="Admin">প্রধান প্রশাসক (Admin)</option>
                    <option value="Reader">সাধারণ পাঠক (Reader)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">ইমেইল ঠিকানা *</label>
                  <input
                    type="email"
                    required
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    placeholder="reporter@matribhumitv.com"
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">মোবাইল নম্বর (Phone)</label>
                  <input
                    type="tel"
                    value={editUserPhone}
                    onChange={(e) => setEditUserPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">সংক্ষিপ্ত পরিচিতি (Short Bio)</label>
                  <input
                    type="text"
                    value={editUserBio}
                    onChange={(e) => setEditUserBio(e.target.value)}
                    placeholder="সাংবাদিকতার অভিজ্ঞতা..."
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Avatar Upload in Edit Modal */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="block font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-400" />
                    <span>প্রোফাইল ছবি পরিবর্তন ও ক্রপ (Avatar Image)</span>
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={editUserAvatar || editingUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow ring-2 ring-slate-800 shrink-0"
                  />
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer text-xs inline-flex items-center gap-2 transition-colors shadow-md">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড ও ক্রপ</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEditUserAvatarUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={editUserAvatar}
                        onChange={(e) => setEditUserAvatar(e.target.value)}
                        placeholder="অথবা সরাসরি ওয়েব ইমেজ লিংক দিন..."
                        className="flex-1 min-w-[200px] border border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Category Assignment */}
              <div className="border-t border-slate-800/80 pt-4">
                <label className="block font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>অনুমোদিত ক্যাটাগরি সমূহ (Allowed Categories)</span>
                  <span className="text-[10px] text-amber-400 font-semibold">একাধিক নির্বাচন করুন</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {categories.map((c) => {
                    const isChecked = editUserAllowedCats.includes(c.slug);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'bg-blue-950/50 border-blue-700 text-blue-200'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditUserAllowedCats([...editUserAllowedCats, c.slug]);
                            } else {
                              setEditUserAllowedCats(editUserAllowedCats.filter((slug) => slug !== c.slug));
                            }
                          }}
                          className="accent-blue-600 w-3.5 h-3.5"
                        />
                        <span className="font-bold text-xs">{c.name_bn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Permissions Control */}
              <div className="border-t border-slate-800/80 pt-4">
                <label className="block font-bold text-slate-300 mb-1.5">
                  অনুমতি নির্ধারণ (Permissions Control)
                </label>
                <div className="flex flex-wrap gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 mt-2">
                  {[
                    { key: 'post', label: 'নতুন সংবাদ পোস্ট' },
                    { key: 'edit', label: 'সংবাদ এডিট' },
                    { key: 'update', label: 'সংবাদ আপডেট' },
                    { key: 'approve', label: 'সরাসরি অনুমোদন ও প্রকাশ' },
                  ].map((perm) => {
                    const isChecked = editUserPermissions.includes(perm.key);
                    return (
                      <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditUserPermissions([...editUserPermissions, perm.key]);
                            } else {
                              setEditUserPermissions(editUserPermissions.filter((k) => k !== perm.key));
                            }
                          }}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="font-bold text-xs">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
