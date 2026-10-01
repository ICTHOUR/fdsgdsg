'use client';

import React, { useState } from 'react';
import { 
  X, Plus, Edit, Trash2, CheckCircle2, Sliders, Image as ImageIcon, 
  DollarSign, FileText, Layers, Save, Video, Calendar, Clock, Bold, Italic, List, Quote, TrendingUp, Users, Eye, Newspaper, ShieldCheck,
  Key, Copy, Check, Search
} from 'lucide-react';
import { 
  Post, Category, Subcategory, AdUnit, SiteConfig, UserAccount, 
  addPost, updatePost, deletePost, addCategory, updateCategory, updateSiteConfig,
  getUsers, addUser, updateUser, updateUserStatus, deleteUser, approvePost, rejectPost, deleteCategory,
  getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory,
  getAds, addAd, updateAd, deleteAd
} from '@/lib/newsData';
import { formatBanglaDate, formatBanglaTime } from '@/lib/utils';
import { generateMySQLDump } from '@/lib/mysqlExport';
import { RichTextEditor } from './RichTextEditor';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  categories: Category[];
  ads: AdUnit[];
  siteConfig: SiteConfig;
  onDataChanged: () => void;
}

export const AdminDeskModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  posts,
  categories,
  ads,
  siteConfig,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'approval' | 'category' | 'users' | 'ads' | 'settings' | 'design'>('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New / Edit News Post Form State
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<number>(categories[0]?.id || 1);
  const [newsSubcategory, setNewsSubcategory] = useState<number | ''>('');
  const [newsReporter, setNewsReporter] = useState('স্টাফ রিপোর্টার');
  const [selectedReporterId, setSelectedReporterId] = useState<number | 'custom'>('custom');
  const [newsReporterAvatar, setNewsReporterAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [newsReporterDesignation, setNewsReporterDesignation] = useState('স্টাফ রিপোর্টার');
  const [newsImage, setNewsImage] = useState('https://picsum.photos/seed/newpost/800/450');
  const [newsImageCaption, setNewsImageCaption] = useState('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [isLead, setIsLead] = useState(false);
  const [isSubLead, setIsSubLead] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);

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
  const [newUserAvatar, setNewUserAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [newUserDesignation, setNewUserDesignation] = useState('স্টাফ রিপোর্টার');
  const [newUserBio, setNewUserBio] = useState('');
  const [newUserAllowedCats, setNewUserAllowedCats] = useState<string[]>([]);
  const [newUserPermissions, setNewUserPermissions] = useState<string[]>(['post', 'edit', 'update']);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserUsername, setEditUserUsername] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserRole, setEditUserRole] = useState<'Admin' | 'Reporter' | 'Editor' | 'Reader'>('Reporter');
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const [editUserDesignation, setEditUserDesignation] = useState('');
  const [editUserBio, setEditUserBio] = useState('');
  const [editUserAllowedCats, setEditUserAllowedCats] = useState<string[]>([]);
  const [editUserPermissions, setEditUserPermissions] = useState<string[]>(['post', 'edit', 'update']);
  const [copiedUserId, setCopiedUserId] = useState<number | null>(null);
  const [showEditUserPassword, setShowEditUserPassword] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterRole, setUserFilterRole] = useState<'all' | 'Reporter' | 'Editor' | 'Admin' | 'Reader'>('all');

  // Category Form & Edit State
  const [newCatBn, setNewCatBn] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatColor, setNewCatColor] = useState('#DC2626');
  const [editingCatId, setEditingCatId] = useState<number | null>(null);
  const [editCatBn, setEditCatBn] = useState('');
  const [editCatEn, setEditCatEn] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatColor, setEditCatColor] = useState('#DC2626');

  // Subcategory Form & Edit State
  const [subcategoriesList, setSubcategoriesList] = useState<Subcategory[]>(getSubcategories());
  const [newSubParentId, setNewSubParentId] = useState<number>(categories[0]?.id || 1);
  const [newSubBn, setNewSubBn] = useState('');
  const [newSubEn, setNewSubEn] = useState('');
  const [newSubSlug, setNewSubSlug] = useState('');
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [editSubParentId, setEditSubParentId] = useState<number>(1);
  const [editSubBn, setEditSubBn] = useState('');
  const [editSubEn, setEditSubEn] = useState('');
  const [editSubSlug, setEditSubSlug] = useState('');

  // Banner Ads State
  const [adsList, setAdsList] = useState<AdUnit[]>(getAds());
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdSlot, setNewAdSlot] = useState('top_header');
  const [newAdType, setNewAdType] = useState<'image' | 'adsense' | 'custom'>('image');
  const [newAdImageUrl, setNewAdImageUrl] = useState('https://picsum.photos/seed/adbanner/970/90');
  const [newAdRedirectUrl, setNewAdRedirectUrl] = useState('https://matrivumi.tv');
  const [newAdCode, setNewAdCode] = useState('');
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [editAdTitle, setEditAdTitle] = useState('');
  const [editAdSlot, setEditAdSlot] = useState('top_header');
  const [editAdType, setEditAdType] = useState<'image' | 'adsense' | 'custom'>('image');
  const [editAdImageUrl, setEditAdImageUrl] = useState('');
  const [editAdRedirectUrl, setEditAdRedirectUrl] = useState('');
  const [editAdCode, setEditAdCode] = useState('');
  const [editAdStatus, setEditAdStatus] = useState<'active' | 'inactive'>('active');

  // AdSense & Ads Configuration State
  const [adsenseClientId, setAdsenseClientId] = useState(siteConfig.adsense_client_id || 'ca-pub-811400024240001');
  const [adsenseEnabled, setAdsenseEnabled] = useState(siteConfig.adsense_enabled ?? true);

  // Extended Site Config State
  const [siteLogoUrl, setSiteLogoUrl] = useState(siteConfig.logo_url || '');
  const [siteName, setSiteName] = useState(siteConfig.site_name || 'মাতৃভূমি টিভি');
  const [siteSlogan, setSiteSlogan] = useState(siteConfig.site_slogan || 'সত্যের পাশে সবসময়');
  const [siteUrl, setSiteUrl] = useState(siteConfig.site_url || 'matrivumi.tv');
  const [editorName, setEditorName] = useState(siteConfig.editor_name || 'মো: রায়ান');
  const [publisherName, setPublisherName] = useState(siteConfig.publisher_name || 'আল-আমীন সানা');
  const [newsEditorName, setNewsEditorName] = useState(siteConfig.news_editor_name || 'মিরাজ হাওলাদার');
  const [siteEmail, setSiteEmail] = useState(siteConfig.email || 'news@matrivumi.tv');
  const [sitePhone, setSitePhone] = useState(siteConfig.phone || '০১৯১৩৪৪৯৯৯৭');
  const [siteAddress, setSiteAddress] = useState(siteConfig.address || 'কাকরাইল, ঢাকা-১০০০, বাংলাদেশ');
  const [copyrightText, setCopyrightText] = useState(siteConfig.copyright_text || '© ২০২৬ মাতৃভূমি টিভি (matrivumi.tv)। সর্বস্বত্ব সংরক্ষিত।');
  const [liveStreamUrl, setLiveStreamUrl] = useState(siteConfig.live_stream_url || 'https://www.youtube.com/embed/jfKfPfyJRdk');
  const [liveStreamTitle, setLiveStreamTitle] = useState(siteConfig.live_stream_title || 'মাতৃভূমি টিভি লাইভ সম্প্রচার');
  const [liveStreamActive, setLiveStreamActive] = useState(siteConfig.live_stream_active ?? true);

  // Design & Section Toggles State
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primary_color || '#DC2626');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>(siteConfig.font_family || 'serif');
  const [headerStyle, setHeaderStyle] = useState<'classic' | 'modern' | 'centered'>(siteConfig.header_style || 'classic');
  const [showTopTicker, setShowTopTicker] = useState(siteConfig.show_top_ticker ?? true);
  const [showBreakingBar, setShowBreakingBar] = useState(siteConfig.show_breaking_bar ?? true);
  const [enableLiveSection, setEnableLiveSection] = useState(siteConfig.enable_live_section ?? true);
  const [enableLeadSection, setEnableLeadSection] = useState(siteConfig.enable_lead_section ?? true);
  const [enableBanglaSpecial, setEnableBanglaSpecial] = useState(siteConfig.enable_bangla_special ?? true);
  const [enableCategoryGrid, setEnableCategoryGrid] = useState(siteConfig.enable_category_grid ?? true);
  const [enableThreeColumn, setEnableThreeColumn] = useState(siteConfig.enable_three_column ?? true);
  const [enableLifestylePhoto, setEnableLifestylePhoto] = useState(siteConfig.enable_lifestyle_photo ?? true);
  const [enableVideoGallery, setEnableVideoGallery] = useState(siteConfig.enable_video_gallery ?? true);
  const [enableMoreNews, setEnableMoreNews] = useState(siteConfig.enable_more_news ?? true);

  if (!isOpen) return null;

  // Statistics calculations
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.approval_status === 'approved' || !p.approval_status).length;
  const pendingPosts = posts.filter(p => p.approval_status === 'pending').length;
  const totalCategories = categories.length;
  const totalUsers = usersList.length;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 12450);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;

    let finalReporterName = newsReporter;
    let finalReporterAvatar = newsReporterAvatar;
    let finalReporterDesignation = newsReporterDesignation;
    let finalReporterId = 1;

    if (selectedReporterId !== 'custom') {
      const u = usersList.find(usr => usr.id === selectedReporterId);
      if (u) {
        finalReporterId = u.id;
        finalReporterName = u.name;
        finalReporterAvatar = u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
        finalReporterDesignation = u.designation || (u.role === 'Admin' ? 'প্রধান সম্পাদক' : u.role === 'Editor' ? 'বার্তা সম্পাদক' : 'স্টাফ রিপোর্টার');
      }
    }

    if (editingPostId !== null) {
      updatePost(editingPostId, {
        title: newsTitle,
        summary: newsSummary || newsTitle,
        content: newsContent || newsSummary || newsTitle,
        category_id: Number(newsCategory),
        subcategory_id: newsSubcategory ? Number(newsSubcategory) : null,
        reporter_id: finalReporterId,
        reporter_name: finalReporterName,
        reporter_avatar: finalReporterAvatar,
        reporter_designation: finalReporterDesignation,
        image: newsImage,
        image_caption: newsImageCaption,
        video_url: newsVideoUrl || null,
        is_lead: isLead,
        is_sub_lead: isSubLead,
        is_breaking: isBreaking,
        is_special: isSpecial,
      });
      showSuccess('সংবাদ সফলভাবে আপডেট করা হয়েছে!');
      setEditingPostId(null);
    } else {
      addPost({
        title: newsTitle,
        summary: newsSummary || newsTitle,
        content: newsContent || newsSummary || newsTitle,
        category_id: Number(newsCategory),
        subcategory_id: newsSubcategory ? Number(newsSubcategory) : null,
        reporter_id: finalReporterId,
        reporter_name: finalReporterName,
        reporter_avatar: finalReporterAvatar,
        reporter_designation: finalReporterDesignation,
        image: newsImage,
        image_caption: newsImageCaption,
        video_url: newsVideoUrl || null,
        is_lead: isLead,
        is_sub_lead: isSubLead,
        is_breaking: isBreaking,
        is_special: isSpecial,
        approval_status: 'approved',
      });
      showSuccess('নতুন সংবাদ সফলভাবে প্রকাশ করা হয়েছে!');
    }

    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setNewsImageCaption('');
    setNewsSubcategory('');
    setNewsVideoUrl('');
    setIsLead(false);
    setIsSubLead(false);
    setIsBreaking(false);
    setIsSpecial(false);

    onDataChanged();
  };

  const handleStartEditPost = (p: Post) => {
    setEditingPostId(p.id);
    setNewsTitle(p.title);
    setNewsSummary(p.summary);
    setNewsContent(p.content);
    setNewsCategory(p.category_id);
    setNewsSubcategory(p.subcategory_id || '');
    setNewsReporter(p.reporter_name || 'স্টাফ রিপোর্টার');
    setNewsReporterAvatar(p.reporter_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
    setNewsReporterDesignation(p.reporter_designation || 'স্টাফ রিপোর্টার');
    if (p.reporter_id && usersList.some(u => u.id === p.reporter_id)) {
      setSelectedReporterId(p.reporter_id);
    } else {
      setSelectedReporterId('custom');
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
    setNewsImageCaption('');
    setNewsSubcategory('');
    setNewsVideoUrl('');
    setIsLead(false);
    setIsSubLead(false);
    setIsBreaking(false);
    setIsSpecial(false);
  };

  const handleUserAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewUserAvatar(result);
        showSuccess(`"${file.name}" সফলভাবে ইউজারের ছবি হিসেবে লোড হয়েছে!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomReporterAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewsReporterAvatar(result);
        showSuccess(`"${file.name}" সফলভাবে রিপোর্টারের গোল ছবি হিসেবে লোড হয়েছে!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const insertFormatting = (tag: string) => {
    if (tag === 'bold') {
      setNewsContent(prev => prev + '**বোল্ড টেক্সট**');
    } else if (tag === 'italic') {
      setNewsContent(prev => prev + '*ইটালিক টেক্সট*');
    } else if (tag === 'quote') {
      setNewsContent(prev => prev + '\n> এখানে বিশেষ উদ্ধৃতি লিখুন...\n');
    } else if (tag === 'bullet') {
      setNewsContent(prev => prev + '\n• পয়েন্ট ১\n• পয়েন্ট ২\n');
    }
  };

  const handleRealImageUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showSuccess('⚠️ অনুগ্রহ করে ছবি ফাইল নির্বাচন করুন (PNG, JPG, JPEG, WEBP, GIF, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setNewsImage(result);
        showSuccess(`"${file.name}" সফলভাবে ফিচার ছবি হিসেবে যুক্ত হয়েছে!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    onDataChanged();
    showSuccess('সংবাদটি সফলভাবে অনুমোদিত ও প্রকাশিত হয়েছে!');
  };

  const handleRejectPost = (id: number) => {
    rejectPost(id);
    onDataChanged();
    showSuccess('সংবাদটি বাতিল করা হয়েছে।');
  };

  const handleDeletePost = (id: number) => {
    deletePost(id);
    onDataChanged();
    showSuccess('🗑️ সংবাদ মুছে ফেলা হয়েছে!');
  };

  const handleCopyCredentials = (u: UserAccount) => {
    const username = u.username || u.email.split('@')[0];
    const password = u.password || 'reporter123';
    const text = `মাদারল্যান্ড / মাতৃভূমি টিভি লগইন তথ্য:\nনাম: ${u.name}\nরোল: ${u.role}\nইউজার আইডি: ${username}\nপাসওয়ার্ড: ${password}\nলগইন পেজ: /admin-login`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUserId(u.id);
      setTimeout(() => setCopiedUserId(null), 3000);
      showSuccess(`📋 "${u.name}"-এর আইডি (${username}) ও পাসওয়ার্ড কপি করা হয়েছে!`);
    } else {
      showSuccess(`ID: ${username} | Pass: ${password}`);
    }
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
      designation: newUserDesignation.trim() || (newUserRole === 'Admin' ? 'প্রধান প্রশাসক' : newUserRole === 'Editor' ? 'সহকারী সম্পাদক' : 'স্টাফ রিপোর্টার'),
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
    setNewUserDesignation('স্টাফ রিপোর্টার');
    setNewUserBio('');
    setNewUserAllowedCats([]);
    setNewUserPermissions(['post', 'edit', 'update']);
    onDataChanged();
    showSuccess(`নতুন অ্যাকাউন্ট তৈরি হয়েছে! (ID: ${generatedUsername}, Pass: ${generatedPassword})`);
  };

  const handleStartEditUser = (u: UserAccount) => {
    setEditingUserId(u.id);
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
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId === null || !editUserName.trim() || !editUserEmail.trim()) {
      showSuccess('⚠️ নাম এবং ইমেইল পূরণ করুন!');
      return;
    }

    updateUser(editingUserId, {
      name: editUserName.trim(),
      username: editUserUsername.trim(),
      password: editUserPassword.trim(),
      email: editUserEmail.trim(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      designation: editUserDesignation.trim(),
      avatar: editUserAvatar,
      bio: editUserBio.trim() || undefined,
      allowed_categories: editUserAllowedCats,
      permissions: editUserPermissions,
    });

    setEditingUserId(null);
    setUsersList([...getUsers()]);
    onDataChanged();
    showSuccess(`✅ ইউজার "${editUserName}" এর তথ্য ও পাসওয়ার্ড আপডেট হয়েছে!`);
  };

  const handleToggleUserStatus = (id: number, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    updateUserStatus(id, nextStatus);
    setUsersList([...getUsers()]);
    onDataChanged();
    showSuccess(`ইউজার স্ট্যাটাস পরিবর্তন করে "${nextStatus === 'active' ? 'সক্রিয়' : 'সাসপেন্ডেড'}" করা হয়েছে।`);
  };

  const handleDeleteUserAccount = (id: number) => {
    deleteUser(id);
    setUsersList([...getUsers()]);
    onDataChanged();
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
    onDataChanged();
    showSuccess('নতুন ক্যাটাগরি যুক্ত করা হয়েছে!');
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatBn(cat.name_bn);
    setEditCatEn(cat.name_en);
    setEditCatSlug(cat.slug);
    setEditCatColor(cat.color_code || '#DC2626');
  };

  const handleSaveCategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCatId === null || !editCatBn.trim()) return;

    updateCategory(editingCatId, {
      name_bn: editCatBn,
      name_en: editCatEn || editCatBn,
      slug: editCatSlug || editCatBn.toLowerCase().replace(/\s+/g, '-'),
      color_code: editCatColor,
    });

    setEditingCatId(null);
    onDataChanged();
    showSuccess('ক্যাটাগরি আপডেট করা হয়েছে!');
  };

  const handleDeleteCategoryItem = (id: number) => {
    deleteCategory(id);
    onDataChanged();
    showSuccess('🗑️ ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে।');
  };

  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubBn.trim()) return;

    addSubcategory({
      category_id: Number(newSubParentId),
      name_bn: newSubBn,
      name_en: newSubEn || newSubBn,
      slug: newSubSlug || newSubBn.toLowerCase().replace(/\s+/g, '-'),
    });

    setNewSubBn('');
    setNewSubEn('');
    setNewSubSlug('');
    setSubcategoriesList([...getSubcategories()]);
    onDataChanged();
    showSuccess('নতুন সাব-ক্যাটাগরি সফলভাবে যুক্ত করা হয়েছে!');
  };

  const handleStartEditSubcategory = (sub: Subcategory) => {
    setEditingSubId(sub.id);
    setEditSubParentId(sub.category_id);
    setEditSubBn(sub.name_bn);
    setEditSubEn(sub.name_en);
    setEditSubSlug(sub.slug);
  };

  const handleSaveSubcategoryEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubId === null || !editSubBn.trim()) return;

    updateSubcategory(editingSubId, {
      category_id: Number(editSubParentId),
      name_bn: editSubBn,
      name_en: editSubEn || editSubBn,
      slug: editSubSlug || editSubBn.toLowerCase().replace(/\s+/g, '-'),
    });

    setEditingSubId(null);
    setSubcategoriesList([...getSubcategories()]);
    onDataChanged();
    showSuccess('সাব-ক্যাটাগরি আপডেট করা হয়েছে!');
  };

  const handleDeleteSubcategoryItem = (id: number) => {
    deleteSubcategory(id);
    setSubcategoriesList([...getSubcategories()]);
    onDataChanged();
    showSuccess('🗑️ সাব-ক্যাটাগরি মুছে ফেলা হয়েছে।');
  };

  // Banner Ads Handlers
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdTitle.trim()) return;

    addAd({
      title: newAdTitle,
      slot: newAdSlot,
      type: newAdType,
      image_url: newAdImageUrl,
      redirect_url: newAdRedirectUrl,
      ad_code: newAdCode,
      status: 'active',
    });

    setNewAdTitle('');
    setNewAdImageUrl('https://picsum.photos/seed/adbanner/970/90');
    setNewAdRedirectUrl('https://matribhumitv.com');
    setNewAdCode('');
    setAdsList([...getAds()]);
    onDataChanged();
    showSuccess('নতুন ব্যানার বিজ্ঞাপন সফলভাবে তৈরি করা হয়েছে!');
  };

  const handleStartEditAd = (ad: AdUnit) => {
    setEditingAdId(ad.id);
    setEditAdTitle(ad.title);
    setEditAdSlot(ad.slot);
    setEditAdType((ad.type as 'image' | 'adsense' | 'custom') || 'image');
    setEditAdImageUrl(ad.image_url || '');
    setEditAdRedirectUrl(ad.redirect_url || '');
    setEditAdCode(ad.ad_code || '');
    setEditAdStatus((ad.status as 'active' | 'inactive') || 'active');
  };

  const handleSaveAdEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAdId === null || !editAdTitle.trim()) return;

    updateAd(editingAdId, {
      title: editAdTitle,
      slot: editAdSlot,
      type: editAdType,
      image_url: editAdImageUrl,
      redirect_url: editAdRedirectUrl,
      ad_code: editAdCode,
      status: editAdStatus,
    });

    setEditingAdId(null);
    setAdsList([...getAds()]);
    onDataChanged();
    showSuccess('বিজ্ঞাপন সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleToggleAdStatus = (ad: AdUnit) => {
    const nextStatus = ad.status === 'active' ? 'inactive' : 'active';
    updateAd(ad.id, { status: nextStatus });
    setAdsList([...getAds()]);
    onDataChanged();
    showSuccess(`বিজ্ঞাপনটি "${nextStatus === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}" করা হয়েছে।`);
  };

  const handleDeleteAdItem = (id: number) => {
    deleteAd(id);
    setAdsList([...getAds()]);
    onDataChanged();
    showSuccess('🗑️ বিজ্ঞাপন মুছে ফেলা হয়েছে।');
  };

  const handleDownloadSqlDump = () => {
    try {
      const subcategories = getSubcategories();
      const users = getUsers();
      const sql = generateMySQLDump(posts, categories, subcategories, users, siteConfig, ads);
      
      const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `matrivumi_tv_mysql_dump_${new Date().toISOString().slice(0, 10)}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess('উৎপন্ন করা MySQL ডেটাবেজ ডাম্প (.sql) সফলভাবে ডাউনলোড করা হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('ডাটাবেজ ডাম্প তৈরি করতে সমস্যা হয়েছে।');
    }
  };

  const handleLogoFileUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে ছবি ফাইল নির্বাচন করুন (PNG, JPG, WEBP, SVG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setSiteLogoUrl(result);
        showSuccess(`"${file.name}" সফলভাবে লোগো হিসেবে লোড হয়েছে!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdsense = () => {
    updateSiteConfig({
      adsense_client_id: adsenseClientId,
      adsense_enabled: adsenseEnabled,
    });
    onDataChanged();
    showSuccess('Google AdSense কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveSiteSettings = () => {
    updateSiteConfig({
      logo_url: siteLogoUrl,
      site_name: siteName,
      site_slogan: siteSlogan,
      site_url: siteUrl,
      editor_name: editorName,
      publisher_name: publisherName,
      news_editor_name: newsEditorName,
      email: siteEmail,
      phone: sitePhone,
      address: siteAddress,
      copyright_text: copyrightText,
      live_stream_url: liveStreamUrl,
      live_stream_title: liveStreamTitle,
      live_stream_active: liveStreamActive,
    });
    onDataChanged();
    showSuccess('ওয়েবসাইট, লাইভ টিভি ও লোগো সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleSaveDesignSections = () => {
    updateSiteConfig({
      primary_color: primaryColor,
      font_family: fontFamily,
      header_style: headerStyle,
      show_top_ticker: showTopTicker,
      show_breaking_bar: showBreakingBar,
      enable_live_section: enableLiveSection,
      enable_lead_section: enableLeadSection,
      enable_bangla_special: enableBanglaSpecial,
      enable_category_grid: enableCategoryGrid,
      enable_three_column: enableThreeColumn,
      enable_lifestyle_photo: enableLifestylePhoto,
      enable_video_gallery: enableVideoGallery,
      enable_more_news: enableMoreNews,
    });
    onDataChanged();
    showSuccess('ওয়েবসাইটের ডিজাইন, থিম ও সেকশন কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                <span>মাতৃভূমি টিভি এডমিন কন্ট্রোল সেন্টার</span>
                <span className="bg-red-600/30 text-red-400 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">PRO CMS v3.5</span>
              </h3>
              <p className="text-xs text-slate-400">
                নিউজ প্রকাশ, এডিট, রিয়েল-টাইম পরিসংখ্যান এবং সম্পূর্ণ পোর্টাল ম্যানেজমেন্ট
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-1 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>পরিসংখ্যান ও ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'news'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>সংবাদ পোস্ট ও ম্যানেজমেন্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('approval')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'approval'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>অনুমোদন কিউ ({posts.filter(p => p.approval_status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('category')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'category'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ক্যাটাগরি কন্ট্রোল</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'users'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>ইউজার ম্যানেজমেন্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ads'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>বিজ্ঞাপন ও অ্যাডসেন্স</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>পোর্টাল সেটিংস</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'design'
                ? 'border-red-600 text-red-500 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>থিম ও ডিজাইন</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 text-slate-100">
          
          {/* TAB 0: STATISTICS & OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">মোট সংবাদ সংখ্যা</p>
                    <h4 className="text-2xl font-black text-white">{totalPosts} টি</h4>
                    <p className="text-[11px] text-emerald-400 font-semibold">↑ প্রকাশিত: {publishedPosts} টি</p>
                  </div>
                  <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center border border-red-500/30">
                    <Newspaper className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">অনুমোদন অপেক্ষমাণ</p>
                    <h4 className="text-2xl font-black text-white">{pendingPosts} টি</h4>
                    <p className="text-[11px] text-amber-400 font-semibold">যাচাই সাপেক্ষে প্রকাশযোগ্য</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">নিউজ ক্যাটাগরি</p>
                    <h4 className="text-2xl font-black text-white">{totalCategories} টি</h4>
                    <p className="text-[11px] text-blue-400 font-semibold">ডায়নামিক ক্যাটাগরি গ্রিড</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold">মোট ভিজিটর / ভিউস</p>
                    <h4 className="text-2xl font-black text-white">{totalViews.toLocaleString()}</h4>
                    <p className="text-[11px] text-purple-400 font-semibold">সক্রিয় ইউজার: {totalUsers} জন</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>

              </div>

              {/* Quick Actions & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Quick Actions */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 lg:col-span-2 shadow-lg">
                  <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span>দ্রুত কার্যকরী শর্টকাট (Quick Actions)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      onClick={() => setActiveTab('news')}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 bg-red-600/20 text-red-500 rounded-lg flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">নতুন সংবাদ প্রকাশ করুন</p>
                        <p className="text-[11px] text-slate-400">শিরোনাম, ছবি ও ভিডিওসহ</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('approval')}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">অপেক্ষমাণ সংবাদ অনুমোদন</p>
                        <p className="text-[11px] text-slate-400">{pendingPosts}টি সংবাদ অপেক্ষমাণ</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('category')}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">ক্যাটাগরি কন্ট্রোল</p>
                        <p className="text-[11px] text-slate-400">নতুন ক্যাটাগরি ও রঙ পরিবর্তন</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('design')}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-3 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">থিম ও ডিজাইন কনফিগারেশন</p>
                        <p className="text-[11px] text-slate-400">কালার ও সেকশন টগল</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-lg">
                  <h4 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>সিস্টেম হেলথ ও স্ট্যাটাস</span>
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                      <span className="text-slate-300 font-semibold">সার্ভার স্ট্যাটাস:</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[11px]">অনলাইন (Active)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                      <span className="text-slate-300 font-semibold">ডাটাবেজ সিঙ্ক:</span>
                      <span className="text-emerald-400 font-bold">রিয়েল-টাইম মেমোরি</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                      <span className="text-slate-300 font-semibold">নিরাপত্তা স্তর:</span>
                      <span className="text-blue-400 font-bold">প্রটেক্টেড (Admin/Editor)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                      <span className="text-slate-300 font-semibold">টাইম জোন:</span>
                      <span className="text-slate-300 font-mono">BST (Dhaka)</span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadSqlDump}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm shadow-red-600/20"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>MySQL Database (.sql) ডাউনলোড</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Posts preview */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-black text-white">সর্বশেষ প্রকাশিত সংবাদসমূহ</h4>
                  <button onClick={() => setActiveTab('news')} className="text-xs text-red-500 hover:text-red-400 font-bold cursor-pointer">
                    সব দেখুন ({posts.length}) →
                  </button>
                </div>
                <div className="divide-y divide-slate-800">
                  {posts.slice(0, 5).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 truncate">
                        <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          {p.category_name_bn}
                        </span>
                        <span className="font-bold text-white truncate">{p.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-slate-400">
                        <span>{formatBanglaDate(p.published_at)}</span>
                        <button
                          onClick={() => handleStartEditPost(p)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer"
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

          {/* TAB 1: NEWS MANAGEMENT */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              
              {/* News Form (Create or Edit) */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {editingPostId ? <Edit className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-red-500" />}
                    <span>{editingPostId ? `সংবাদ এডিট ও আপডেট করুন (ID: ${editingPostId})` : 'নতুন সংবাদ তৈরি ও প্রকাশ করুন'}</span>
                  </h4>
                  {editingPostId && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-200 font-semibold cursor-pointer"
                    >
                      এডিট বাতিল করুন
                    </button>
                  )}
                </div>

                {/* Auto Date and Time Banner */}
                <div className="bg-red-950/60 border border-red-900/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-red-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>প্রকাশের তারিখ (অটো): <b>{autoDate}</b></span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span>প্রকাশের সময় (অটো): <b>{autoTime}</b></span>
                  </div>
                  <span className="text-[11px] bg-red-600 text-white px-2.5 py-0.5 rounded font-bold shadow-xs">সিস্টেম জোন (BST)</span>
                </div>

                <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="block font-bold text-slate-300 mb-1">সংবাদের শিরোনাম (Title) *</label>
                      <input
                        type="text"
                        required
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="সংবাদের আকর্ষণীয় মূল শিরোনাম লিখুন..."
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">নিউজ ক্যাটাগরি (Category) *</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => {
                          const catId = Number(e.target.value);
                          setNewsCategory(catId);
                          setNewsSubcategory('');
                        }}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_bn} ({c.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">সাব-ক্যাটাগরি (Subcategory)</label>
                      <select
                        value={newsSubcategory}
                        onChange={(e) => setNewsSubcategory(e.target.value ? Number(e.target.value) : '')}
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                      >
                        <option value="">-- সাব-ক্যাটাগরি নির্বাচন করুন (ঐচ্ছিক) --</option>
                        {getSubcategories(Number(newsCategory)).map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name_bn} ({sub.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Reporter Selector Section */}
                    <div className="md:col-span-3 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-red-500" />
                          <span>নিউজ রিপোর্টার ও ছবি নির্বাচন (Reporter Attribution & Circular Avatar) *</span>
                        </label>
                        <span className="text-[11px] text-slate-400">খবরের নিচে গোল ছবি ও নাম প্রদর্শিত হবে</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">নিবন্ধিত রিপোর্টার / ইউজার তালিকা থেকে বেছে নিন:</label>
                          <select
                            value={selectedReporterId}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'custom') {
                                setSelectedReporterId('custom');
                              } else {
                                const usrId = Number(val);
                                setSelectedReporterId(usrId);
                                const found = usersList.find(u => u.id === usrId);
                                if (found) {
                                  setNewsReporter(found.name);
                                  setNewsReporterAvatar(found.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
                                  setNewsReporterDesignation(found.designation || (found.role === 'Admin' ? 'প্রধান সম্পাদক' : found.role === 'Editor' ? 'বার্তা সম্পাদক' : 'স্টাফ রিপোর্টার'));
                                }
                              }
                            }}
                            className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-semibold"
                          >
                            <option value="custom">✏️ কাস্টম রিপোর্টার বা উৎস ম্যানুয়ালি লিখুন</option>
                            {usersList.map((usr) => (
                              <option key={usr.id} value={usr.id}>
                                👤 {usr.name} — ({usr.designation || usr.role})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">রিপোর্টারের নাম (Reporter Name):</label>
                          <input
                            type="text"
                            required
                            value={newsReporter}
                            onChange={(e) => setNewsReporter(e.target.value)}
                            placeholder="যেমন: তানভীর আহমেদ / নিজস্ব প্রতিবেদক"
                            className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      {/* Custom Reporter Details & Live Avatar Preview */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 shrink-0">
                          <img
                            src={newsReporterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt="Reporter Preview"
                            className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-md ring-2 ring-slate-800"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{newsReporter || 'রিপোর্টারের নাম'}</p>
                            <p className="text-[11px] text-red-400">{newsReporterDesignation || 'পদবী'}</p>
                          </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                          <div>
                            <input
                              type="text"
                              value={newsReporterDesignation}
                              onChange={(e) => setNewsReporterDesignation(e.target.value)}
                              placeholder="পদবী (যেমন: জ্যেষ্ঠ প্রতিবেদক)"
                              className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-xl cursor-pointer text-[11px] inline-flex items-center gap-1 transition-colors shrink-0">
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>ছবি আপলোড</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleCustomReporterAvatarUpload(f);
                                }}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="url"
                              value={newsReporterAvatar}
                              onChange={(e) => setNewsReporterAvatar(e.target.value)}
                              placeholder="ছবির লিঙ্ক..."
                              className="w-full border border-slate-700 rounded-xl px-2.5 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সাবটাইটেল / সংক্ষিপ্ত সারাংশ (Subtitle / Summary)</label>
                    <textarea
                      rows={2}
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      placeholder="হোমপেজ ও কার্ডে প্রদর্শনের জন্য সাবটাইটেল বা সংক্ষিপ্ত সারাংশ দিন..."
                      className="w-full border border-slate-700 rounded-xl p-3 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white"
                    />
                  </div>

                  {/* Rich Text Editor Content Box */}
                  <div className="space-y-1.5">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                    
                    {/* Image Input & Upload */}
                    <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-500" />
                        <span>সংবাদের ছবি (Image URL / Upload)</span>
                      </label>
                      <input
                        type="text"
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        placeholder="ছবির লিংক (URL) এখানে পেস্ট করুন..."
                        className="w-full border border-slate-700 rounded-lg px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-lg cursor-pointer text-[11px] inline-flex items-center gap-1 transition-colors">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>ডিভাইস থেকে ছবি আপলোড</span>
                          <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                        </label>
                        <span className="text-[11px] text-slate-500">অথবা ইউআরএল</span>
                      </div>
                      <div className="pt-2">
                        <label className="block text-slate-400 text-[11px] font-medium mb-1">
                          ফিচার ইমেজের ক্যাপশন (ইটালিক মোডে শো হবে):
                        </label>
                        <input
                          type="text"
                          value={newsImageCaption}
                          onChange={(e) => setNewsImageCaption(e.target.value)}
                          placeholder="যেমন: ফাইল ছবি / মাতৃভূমি টিভি প্রতিনিধি"
                          className="w-full border border-slate-700 rounded-lg px-3 py-1.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Video Input & Upload */}
                    <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <label className="block font-bold text-slate-300 flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-red-500" />
                        <span>সংবাদের ভিডিও (Video URL / YouTube Embed)</span>
                      </label>
                      <input
                        type="text"
                        value={newsVideoUrl}
                        onChange={(e) => setNewsVideoUrl(e.target.value)}
                        placeholder="যেমন: https://www.youtube.com/embed/..."
                        className="w-full border border-slate-700 rounded-lg px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-1.5 rounded-lg cursor-pointer text-[11px] inline-flex items-center gap-1 transition-colors">
                          <Video className="w-3.5 h-3.5" />
                          <span>ভিডিও ফাইল আপলোড</span>
                          <input type="file" accept="video/*" onChange={handleSimulatedVideoUpload} className="hidden" />
                        </label>
                        <span className="text-[11px] text-slate-500">ইউটিউব বা লিংক</span>
                      </div>
                    </div>

                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">প্রতিবেদক বা সংবাদদাতার নাম</label>
                    <input
                      type="text"
                      value={newsReporter}
                      onChange={(e) => setNewsReporter(e.target.value)}
                      className="w-full md:w-1/2 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white font-semibold"
                    />
                  </div>

                  {/* Badges & Positions */}
                  <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isLead}
                        onChange={(e) => setIsLead(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">মূল লিড নিউজ (Main Lead)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isSubLead}
                        onChange={(e) => setIsSubLead(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">সাব-লিড (Sub Lead)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={isBreaking}
                        onChange={(e) => setIsBreaking(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span className="font-bold text-slate-200">শীর্ষ ব্রেকিং নিউজ (Ticker)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
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
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-lg shadow-red-600/30 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPostId ? 'সংবাদ আপডেট করুন' : 'সংবাদ প্রকাশ করুন'}</span>
                    </button>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল করুন
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Existing News List with Full CRUD Actions */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">প্রকাশিত সংবাদ তালিকা ও ম্যানেজমেন্ট ({posts.length})</h4>
                  <span className="text-xs text-slate-400">এডিট বা ডিলিট করতে নিচের বাটনগুলোতে ক্লিক করুন</span>
                </div>

                <div className="divide-y divide-slate-800 max-h-[420px] overflow-y-auto">
                  {posts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-800/50 px-3 rounded-xl transition-colors">
                      <div className="flex items-center gap-3 flex-1 truncate">
                        <span className="bg-slate-800 text-slate-200 font-bold px-2 py-1 rounded text-[10px] shrink-0">
                          {p.category_name_bn}
                        </span>
                        {p.is_lead && <span className="bg-red-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">LEAD</span>}
                        {p.is_breaking && <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">BREAKING</span>}
                        <div className="truncate">
                          <p className="font-bold text-white truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-400">প্রকাশ: {formatBanglaDate(p.published_at)} | প্রতিবেদক: {p.reporter_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleStartEditPost(p)}
                          className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="এডিট করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>এডিট</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ডিলিট</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: PENDING NEWS APPROVAL */}
          {activeTab === 'approval' && (
            <div className="space-y-4">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>অপেক্ষমাণ সংবাদ অনুমোদন কিউ ({posts.filter(p => p.approval_status === 'pending').length})</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  রিপোর্টার বা ইউজারদের জমাকৃত সংবাদগুলো অ্যাডমিন কর্তৃক অনুমোদনের পরই হোমপেজ ও নির্দিষ্ট ক্যাটাগরিতে দৃশ্যমান হবে।
                </p>

                {posts.filter(p => p.approval_status === 'pending').length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs bg-slate-950 rounded-xl border border-dashed border-slate-800">
                    বর্তমানে কোনো অপেক্ষমাণ সংবাদ নেই।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {posts.filter(p => p.approval_status === 'pending').map((p) => (
                      <div key={p.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-950 text-red-300 border border-red-800 font-bold px-2 py-0.5 rounded">{p.category_name_bn}</span>
                            <span className="text-slate-400">প্রতিবেদক: {p.reporter_name}</span>
                          </div>
                          <h5 className="font-bold text-white text-sm">{p.title}</h5>
                          <p className="text-slate-400 line-clamp-2">{p.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleApprovePost(p.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>অনুমোদন ও প্রকাশ</span>
                          </button>
                          <button
                            onClick={() => handleRejectPost(p.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md"
                          >
                            বাতিল
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CATEGORY CONTROL */}
          {activeTab === 'category' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>নতুন নিউজ ক্যাটাগরি তৈরি করুন</span>
                </h4>

                <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি নাম (বাংলা) *</label>
                      <input
                        type="text"
                        required
                        value={newCatBn}
                        onChange={(e) => setNewCatBn(e.target.value)}
                        placeholder="যেমন: প্রযুক্তি"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি নাম (ইংরেজি)</label>
                      <input
                        type="text"
                        value={newCatEn}
                        onChange={(e) => setNewCatEn(e.target.value)}
                        placeholder="যেমন: Technology"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500 bg-slate-950 text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ব্যানার কালার কোড</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newCatColor}
                          onChange={(e) => setNewCatColor(e.target.value)}
                          className="w-10 h-9 rounded-xl border border-slate-700 cursor-pointer bg-slate-950"
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
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                  >
                    ক্যাটাগরি যুক্ত করুন
                  </button>
                </form>
              </div>

              {/* Category Edit Modal / Form if editing */}
              {editingCatId !== null && (
                <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/50 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span>ক্যাটাগরি এডিট করুন</span>
                    </h4>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                    >
                      বাতিল করুন
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategoryEdit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি নাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          value={editCatBn}
                          onChange={(e) => setEditCatBn(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 bg-slate-950 text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি নাম (ইংরেজি)</label>
                        <input
                          type="text"
                          value={editCatEn}
                          onChange={(e) => setEditCatEn(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 bg-slate-950 text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">স্লাগ (URL Slug)</label>
                        <input
                          type="text"
                          value={editCatSlug}
                          onChange={(e) => setEditCatSlug(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 bg-slate-950 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">ব্যানার কালার</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={editCatColor}
                            onChange={(e) => setEditCatColor(e.target.value)}
                            className="w-10 h-9 rounded-xl border border-slate-700 cursor-pointer bg-slate-950"
                          />
                          <input
                            type="text"
                            value={editCatColor}
                            onChange={(e) => setEditCatColor(e.target.value)}
                            className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono bg-slate-950 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                      >
                        আপডেট সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Categories Table */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white">সকল ক্যাটাগরি তালিকা</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0" style={{ backgroundColor: cat.color_code }} />
                        <div>
                          <span className="font-bold text-white block">{cat.name_bn}</span>
                          <span className="text-slate-400 text-[10px]">slug: {cat.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEditCategory(cat)}
                          className="text-amber-400 hover:text-amber-300 p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                          title="এডিট"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoryItem(cat.id)}
                          className="text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                          title="ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBCATEGORIES MANAGEMENT SECTION */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>সাব-ক্যাটাগরি ম্যানেজমেন্ট (Subcategories)</span>
                  </h4>
                  <span className="text-[11px] text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 font-semibold">
                    মোট সাব-ক্যাটাগরি: {subcategoriesList.length} টি
                  </span>
                </div>

                {/* Create / Edit Subcategory Form */}
                <form onSubmit={editingSubId !== null ? handleSaveSubcategoryEdit : handleCreateSubcategory} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-200">
                    {editingSubId !== null ? `সাব-ক্যাটাগরি এডিট করুন (ID: ${editingSubId})` : 'নতুন সাব-ক্যাটাগরি যুক্ত করুন'}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">মূল ক্যাটাগরি (Parent Category) *</label>
                      <select
                        value={editingSubId !== null ? editSubParentId : newSubParentId}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (editingSubId !== null) setEditSubParentId(val);
                          else setNewSubParentId(val);
                        }}
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name_bn} ({c.name_en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">সাব-ক্যাটাগরি নাম (বাংলা) *</label>
                      <input
                        type="text"
                        required
                        value={editingSubId !== null ? editSubBn : newSubBn}
                        onChange={(e) => {
                          if (editingSubId !== null) setEditSubBn(e.target.value);
                          else setNewSubBn(e.target.value);
                        }}
                        placeholder="যেমন: ক্রিকেট"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">সাব-ক্যাটাগরি নাম (ইংরেজি)</label>
                      <input
                        type="text"
                        value={editingSubId !== null ? editSubEn : newSubEn}
                        onChange={(e) => {
                          if (editingSubId !== null) setEditSubEn(e.target.value);
                          else setNewSubEn(e.target.value);
                        }}
                        placeholder="যেমন: Cricket"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">স্লাগ (URL Slug)</label>
                      <input
                        type="text"
                        value={editingSubId !== null ? editSubSlug : newSubSlug}
                        onChange={(e) => {
                          if (editingSubId !== null) setEditSubSlug(e.target.value);
                          else setNewSubSlug(e.target.value);
                        }}
                        placeholder="যেমন: cricket"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                    >
                      {editingSubId !== null ? 'সাব-ক্যাটাগরি আপডেট সংরক্ষণ' : 'সাব-ক্যাটাগরি যুক্ত করুন'}
                    </button>
                    {editingSubId !== null && (
                      <button
                        type="button"
                        onClick={() => setEditingSubId(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    )}
                  </div>
                </form>

                {/* Subcategories List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {subcategoriesList.map((sub) => {
                    const parentCat = categories.find((c) => c.id === sub.category_id);
                    return (
                      <div key={sub.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-semibold">
                            {parentCat?.name_bn || 'ক্যাটাগরি'}
                          </span>
                          <p className="font-bold text-white mt-1">{sub.name_bn}</p>
                          <p className="text-[10px] text-slate-400 font-mono">slug: {sub.slug}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEditSubcategory(sub)}
                            className="text-amber-400 hover:text-amber-300 p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                            title="এডিট"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategoryItem(sub.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                            title="ডিলিট"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-red-500" />
                    <span>নতুন সাংবাদিক / রিপোর্টার / ইউজার অ্যাকাউন্ট তৈরি করুন</span>
                  </h4>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                    ছবি ও পদবীযুক্ত প্রোফাইল
                  </span>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পূর্ণ নাম *</label>
                      <input
                        type="text"
                        required
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">সাংবাদিকের পদবী / বিট</label>
                      <input
                        type="text"
                        value={newUserDesignation}
                        onChange={(e) => setNewUserDesignation(e.target.value)}
                        placeholder="যেমন: বিশেষ প্রতিনিধি / জ্যেষ্ঠ প্রতিবেদক"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">লগইন ইউজার আইডি (Username / ID) *</label>
                      <input
                        type="text"
                        required
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                        placeholder="যেমন: reporter_tanvir"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">লগইন পাসওয়ার্ড (Password) *</label>
                      <input
                        type="text"
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="যেমন: Tanvir@2026 বা reporter123"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">অ্যাকাউন্ট রোল (Role) *</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="Reporter">সাংবাদিক / রিপোর্টার (Reporter)</option>
                        <option value="Editor">সংবাদ সম্পাদক (Editor)</option>
                        <option value="Admin">প্রধান প্রশাসক (Admin)</option>
                        <option value="Reader">সাধারণ পাঠক (Reader)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ইমেইল ঠিকানা *</label>
                      <input
                        type="email"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="reporter@matribhumitv.com"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="tel"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        placeholder="+880 1700-000000"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত পরিচিতি (Bio)</label>
                      <input
                        type="text"
                        value={newUserBio}
                        onChange={(e) => setNewUserBio(e.target.value)}
                        placeholder="সংক্ষিপ্ত বিবরণ..."
                        className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* Multi-Category selection */}
                    <div className="md:col-span-3 border-t border-slate-800/80 pt-3">
                      <label className="block font-bold text-slate-300 mb-1">অনুমোদিত ক্যাটাগরি সমূহ (Allowed Categories)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                        {categories.map((c) => {
                          const isChecked = newUserAllowedCats.includes(c.slug);
                          return (
                            <label
                              key={c.id}
                              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs ${
                                isChecked ? 'bg-red-950/40 border-red-800 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) setNewUserAllowedCats([...newUserAllowedCats, c.slug]);
                                  else setNewUserAllowedCats(newUserAllowedCats.filter((s) => s !== c.slug));
                                }}
                                className="accent-red-600 w-3.5 h-3.5"
                              />
                              <span>{c.name_bn}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Avatar Upload */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                    <img
                      src={newUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow-md ring-2 ring-slate-800 shrink-0"
                    />
                    <div className="flex-1 flex flex-wrap items-center gap-2 w-full">
                      <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-[11px] inline-flex items-center gap-1.5 transition-colors">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>প্রোফাইল ছবি আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUserAvatarUpload(f);
                          }}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="url"
                        value={newUserAvatar}
                        onChange={(e) => setNewUserAvatar(e.target.value)}
                        placeholder="ছবির লিঙ্ক..."
                        className="flex-1 min-w-[200px] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                  >
                    ইউজার অ্যাকাউন্ট তৈরি করুন
                  </button>
                </form>
              </div>

              {/* User Edit Form if editing */}
              {editingUserId !== null && (
                <div className="bg-slate-900 p-6 rounded-xl border border-amber-500/50 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span>ইউজার প্রোফাইল ও পাসওয়ার্ড এডিট করুন (ID #{editingUserId})</span>
                    </h4>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="text-slate-400 hover:text-white text-xs underline cursor-pointer"
                    >
                      বাতিল করুন
                    </button>
                  </div>

                  <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">পূর্ণ নাম *</label>
                        <input
                          type="text"
                          required
                          value={editUserName}
                          onChange={(e) => setEditUserName(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">সাংবাদিকের পদবী / বিট</label>
                        <input
                          type="text"
                          value={editUserDesignation}
                          onChange={(e) => setEditUserDesignation(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">লগইন ইউজার আইডি (Username / ID) *</label>
                        <input
                          type="text"
                          required
                          value={editUserUsername}
                          onChange={(e) => setEditUserUsername(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1 flex items-center justify-between">
                          <span>লগইন পাসওয়ার্ড (Password) *</span>
                          <button
                            type="button"
                            onClick={() => setShowEditUserPassword(!showEditUserPassword)}
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            {showEditUserPassword ? 'লুকান' : 'দেখুন'}
                          </button>
                        </label>
                        <div className="relative">
                          <input
                            type={showEditUserPassword ? 'text' : 'password'}
                            required
                            value={editUserPassword}
                            onChange={(e) => setEditUserPassword(e.target.value)}
                            className="w-full border border-slate-700 rounded-xl px-3 py-2.5 pr-16 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setEditUserPassword(`Tv${Math.floor(1000 + Math.random() * 9000)}@2026`)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-slate-800 text-amber-300 text-[10px] font-bold rounded"
                          >
                            জেনারেট
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">অ্যাকাউন্ট রোল (Role) *</label>
                        <select
                          value={editUserRole}
                          onChange={(e) => setEditUserRole(e.target.value as any)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500 font-semibold"
                        >
                          <option value="Reporter">সাংবাদিক / রিপোর্টার (Reporter)</option>
                          <option value="Editor">সংবাদ সম্পাদক (Editor)</option>
                          <option value="Admin">প্রধান প্রশাসক (Admin)</option>
                          <option value="Reader">সাধারণ পাঠক (Reader)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">ইমেইল ঠিকানা *</label>
                        <input
                          type="email"
                          required
                          value={editUserEmail}
                          onChange={(e) => setEditUserEmail(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                        <input
                          type="tel"
                          value={editUserPhone}
                          onChange={(e) => setEditUserPhone(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত পরিচিতি (Bio)</label>
                        <input
                          type="text"
                          value={editUserBio}
                          onChange={(e) => setEditUserBio(e.target.value)}
                          className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Multi-Category selection for Edit */}
                      <div className="md:col-span-3 border-t border-slate-800/80 pt-3">
                        <label className="block font-bold text-slate-300 mb-1">অনুমোদিত ক্যাটাগরি সমূহ</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                          {categories.map((c) => {
                            const isChecked = editUserAllowedCats.includes(c.slug);
                            return (
                              <label
                                key={c.id}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs ${
                                  isChecked ? 'bg-amber-950/40 border-amber-800 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) setEditUserAllowedCats([...editUserAllowedCats, c.slug]);
                                    else setEditUserAllowedCats(editUserAllowedCats.filter((s) => s !== c.slug));
                                  }}
                                  className="accent-amber-600 w-3.5 h-3.5"
                                />
                                <span>{c.name_bn}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Avatar Upload for Edit */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                      <img
                        src={editUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-md ring-2 ring-slate-800 shrink-0"
                      />
                      <div className="flex-1 flex flex-wrap items-center gap-2 w-full">
                        <label className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer text-[11px] inline-flex items-center gap-1.5 transition-colors">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>নতুন ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) setEditUserAvatar(ev.target.result as string);
                                };
                                reader.readAsDataURL(f);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="url"
                          value={editUserAvatar}
                          onChange={(e) => setEditUserAvatar(e.target.value)}
                          placeholder="ছবির লিঙ্ক..."
                          className="flex-1 min-w-[200px] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                      >
                        ইউজার আপডেট সংরক্ষণ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users List Table */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white">সকল নিবন্ধিত ইউজার অ্যাকাউন্ট তালিকা ({usersList.length})</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
                      className="bg-slate-950 border border-slate-700 text-white px-3 py-1 text-xs rounded-lg focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
                  {usersList
                    .filter((u) => {
                      if (!userSearchQuery.trim()) return true;
                      const q = userSearchQuery.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        (u.username && u.username.toLowerCase().includes(q)) ||
                        u.email.toLowerCase().includes(q)
                      );
                    })
                    .map((u) => (
                    <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-950/40 px-2 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            <span>{u.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'Admin' ? 'bg-red-950 text-red-300 border border-red-800' :
                              u.role === 'Editor' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              u.role === 'Reporter' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {u.role}
                            </span>
                          </p>
                          <p className="text-red-400 text-[11px] font-medium">{u.designation || 'স্টাফ রিপোর্টার'}</p>
                          <div className="flex flex-wrap items-center gap-2 text-slate-400 font-mono text-[10px] mt-0.5">
                            <span className="text-amber-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              ID: {u.username || u.email.split('@')[0]}
                            </span>
                            {u.password && (
                              <span className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                Pass: {u.password}
                              </span>
                            )}
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        {/* Copy ID/Pass Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyCredentials(u)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-[10px] flex items-center gap-1 border ${
                            copiedUserId === u.id
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-slate-700'
                          }`}
                          title="আইডি ও পাসওয়ার্ড কপি করুন"
                        >
                          {copiedUserId === u.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUserId === u.id ? 'কপি হয়েছে' : 'কপি'}</span>
                        </button>

                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {u.status === 'active' ? 'সক্রিয়' : 'সাসপেন্ড'}
                        </span>

                        <button
                          onClick={() => handleStartEditUser(u)}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          title="এডিট"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>এডিট</span>
                        </button>
                        
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer text-[11px]"
                        >
                          {u.status === 'active' ? 'সাসপেন্ড' : 'সক্রিয়'}
                        </button>

                        <button
                          onClick={() => handleDeleteUserAccount(u.id)}
                          className="p-1.5 text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
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

          {/* TAB: GOOGLE ADSENSE & ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <h4 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Google AdSense অটো এডস ও ক্লায়েন্ট আইডি কনফিগারেশন</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Google AdSense Publisher ID (Client ID)</label>
                    <input
                      type="text"
                      value={adsenseClientId}
                      onChange={(e) => setAdsenseClientId(e.target.value)}
                      placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                      className="w-full md:w-1/2 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono bg-slate-950 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
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
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2 shadow-md"
                  >
                    অ্যাডসেন্স সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </div>

              {/* Banner Ads Management */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>কাস্টম বিজ্ঞাপন ব্যানার ও স্পন্সরশিপ ম্যানেজমেন্ট</span>
                  </h4>
                  <span className="text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 font-semibold">
                    মোট ব্যানার: {adsList.length} টি
                  </span>
                </div>

                {/* Create / Edit Banner Ad Form */}
                <form onSubmit={editingAdId !== null ? handleSaveAdEdit : handleCreateAd} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-200">
                    {editingAdId !== null ? `বিজ্ঞাপন এডিট করুন (ID: ${editingAdId})` : 'নতুন ব্যানার বিজ্ঞাপন যুক্ত করুন'}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিজ্ঞাপনের শিরোনাম (Ad Title) *</label>
                      <input
                        type="text"
                        required
                        value={editingAdId !== null ? editAdTitle : newAdTitle}
                        onChange={(e) => {
                          if (editingAdId !== null) setEditAdTitle(e.target.value);
                          else setNewAdTitle(e.target.value);
                        }}
                        placeholder="যেমন: ওয়ালটন ফ্রিজ অফার"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিজ্ঞাপন স্লট (Placement Slot) *</label>
                      <select
                        value={editingAdId !== null ? editAdSlot : newAdSlot}
                        onChange={(e) => {
                          if (editingAdId !== null) setEditAdSlot(e.target.value);
                          else setNewAdSlot(e.target.value);
                        }}
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-semibold"
                      >
                        <option value="top_header">টপ হেডার ব্যানার (Top Header 970x90)</option>
                        <option value="lead_top_iccb">লিড সংবাদের উপরে ব্যানার (Lead Top 728x90)</option>
                        <option value="sidebar_top">ডান সাইডবার ব্যানার (Sidebar 300x250)</option>
                        <option value="between_special_housing">স্পেশাল সেকশন ব্যানার (Between Special)</option>
                        <option value="between_economy_tissue">অর্থনীতি ও প্রযুক্তি ব্যানার</option>
                        <option value="footer_top">ফুটার টপ ব্যানার (Footer 970x90)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিজ্ঞাপনের ধরন (Type)</label>
                      <select
                        value={editingAdId !== null ? editAdType : newAdType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          if (editingAdId !== null) setEditAdType(val);
                          else setNewAdType(val);
                        }}
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-semibold"
                      >
                        <option value="image">ইমেজ ব্যানার ও লিঙ্ক (Image Banner)</option>
                        <option value="adsense">গুগল অ্যাডসেন্স কোড (AdSense Script)</option>
                        <option value="custom">কাস্টম এইচটিএমএল (Custom HTML)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-slate-300 mb-1">ব্যানার ছবির লিংক (Image URL)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={editingAdId !== null ? editAdImageUrl : newAdImageUrl}
                          onChange={(e) => {
                            if (editingAdId !== null) setEditAdImageUrl(e.target.value);
                            else setNewAdImageUrl(e.target.value);
                          }}
                          placeholder="https://picsum.photos/seed/ad/970/90"
                          className="flex-1 border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                        <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl cursor-pointer text-xs font-semibold shrink-0">
                          <span>আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    if (editingAdId !== null) setEditAdImageUrl(ev.target.result as string);
                                    else setNewAdImageUrl(ev.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(f);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">রিডাইরেক্ট লিঙ্ক (Click URL)</label>
                      <input
                        type="url"
                        value={editingAdId !== null ? editAdRedirectUrl : newAdRedirectUrl}
                        onChange={(e) => {
                          if (editingAdId !== null) setEditAdRedirectUrl(e.target.value);
                          else setNewAdRedirectUrl(e.target.value);
                        }}
                        placeholder="https://advertiser-site.com"
                        className="w-full border border-slate-700 rounded-xl px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                    >
                      {editingAdId !== null ? 'বিজ্ঞাপন আপডেট সংরক্ষণ' : 'বিজ্ঞাপন তৈরি করুন'}
                    </button>
                    {editingAdId !== null && (
                      <button
                        type="button"
                        onClick={() => setEditingAdId(null)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                    )}
                  </div>
                </form>

                {/* Banner Ads List */}
                <div className="divide-y divide-slate-800 max-h-[350px] overflow-y-auto">
                  {adsList.map((ad) => (
                    <div key={ad.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        {ad.image_url && (
                          <img
                            src={ad.image_url}
                            alt={ad.title}
                            className="w-16 h-8 object-cover rounded border border-slate-700 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-white">{ad.title}</p>
                          <p className="text-slate-400 font-mono text-[11px]">
                            স্লট: <span className="text-amber-400">{ad.slot}</span> | ইমপ্রেশন: {ad.impressions} | ক্লিক: {ad.clicks}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          ad.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {ad.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>

                        <button
                          onClick={() => handleStartEditAd(ad)}
                          className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          title="এডিট"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>এডিট</span>
                        </button>

                        <button
                          onClick={() => handleToggleAdStatus(ad)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                          {ad.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        </button>

                        <button
                          onClick={() => handleDeleteAdItem(ad.id)}
                          className="p-1.5 text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
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

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <h4 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>লোগো, সম্পাদকীয় নেতৃত্ব ও সাইট কনফিগারেশন</span>
                <span className="text-xs text-red-400 font-normal">এডমিন প্যানেল থেকে সমস্ত কন্টেন্ট ও তথ্য পরিবর্তনযোগ্য</span>
              </h4>

              <div className="space-y-5 text-xs">
                
                {/* 1. LOGO UPLOAD & BRANDING SECTION */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    <span>ওয়েবসাইট অফিশিয়াল লোগো (Website Logo)</span>
                  </h5>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-44 h-16 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center p-2 shrink-0 overflow-hidden">
                      {siteLogoUrl ? (
                        <img src={siteLogoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-center text-[10px] text-slate-500">
                          ডিফল্ট টেক্সট লোগো সক্রিয়
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-lg cursor-pointer text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs">
                          <ImageIcon className="w-4 h-4" />
                          <span>নতুন লোগো ছবি আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleLogoFileUpload(f);
                            }}
                            className="hidden"
                          />
                        </label>
                        {siteLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setSiteLogoUrl('')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            লোগো সরান (টেক্সট লোগো)
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={siteLogoUrl}
                        onChange={(e) => setSiteLogoUrl(e.target.value)}
                        placeholder="অথবা লোগোর সরাসরি ইমেজ লিঙ্ক (URL) পেস্ট করুন..."
                        className="w-full border border-slate-700 rounded-lg px-3 py-2 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SITE NAME & SLOGAN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সাইটের নাম (Site Title)</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="যেমন: মাতৃভূমি টিভি"
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">স্লোগান (Slogan)</label>
                    <input
                      type="text"
                      value={siteSlogan}
                      onChange={(e) => setSiteSlogan(e.target.value)}
                      placeholder="যেমন: সত্যের পাশে সবসময়"
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ওয়েবসাইট ডোমেইন / URL</label>
                    <input
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="যেমন: matrivumi.tv"
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                {/* 3. EDITORIAL LEADERSHIP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">প্রকাশক (Publisher)</label>
                    <input
                      type="text"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সম্পাদক (Editor)</label>
                    <input
                      type="text"
                      value={editorName}
                      onChange={(e) => setEditorName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">বার্তা সম্পাদক (News Editor)</label>
                    <input
                      type="text"
                      value={newsEditorName}
                      onChange={(e) => setNewsEditorName(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>
                </div>

                {/* 4. CONTACT DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">অফিসিয়াল ইমেইল</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ফোন / মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={sitePhone}
                      onChange={(e) => setSitePhone(e.target.value)}
                      className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">যোগাযোগের ঠিকানা (অফিস ঠিকানা)</label>
                  <textarea
                    rows={2}
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl p-3 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">কপিরাইট টেক্সট (Copyright Text)</label>
                  <input
                    type="text"
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-950 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* 5. LIVE TV & STREAMING SETTINGS */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h5 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-500" />
                    <span>মাতৃভূমি টিভি লাইভ সম্প্রচার সেটিংস (Live Stream Video)</span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">লাইভ সম্প্রচার শিরোনাম</label>
                      <input
                        type="text"
                        value={liveStreamTitle}
                        onChange={(e) => setLiveStreamTitle(e.target.value)}
                        placeholder="যেমন: মাতৃভূমি টিভি লাইভ সম্প্রচার"
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ইউটিউব লাইভ এম্বেড লিঙ্ক (YouTube Embed URL)</label>
                      <input
                        type="url"
                        value={liveStreamUrl}
                        onChange={(e) => setLiveStreamUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs bg-slate-900 text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={liveStreamActive}
                      onChange={(e) => setLiveStreamActive(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-200">হোমপেজে লাইভ টিভি প্লেয়ার সক্রিয় রাখুন</span>
                  </label>
                </div>

                <button
                  onClick={handleSaveSiteSettings}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>সমস্ত সেটিংস ও তথ্য সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: DESIGN & SECTIONS */}
          {activeTab === 'design' && (
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-6">
              <h4 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
                ওয়েবসাইট থিম, রঙ ও বিভিন্ন সেকশন দৃশ্যমানতা নিয়ন্ত্রণ
              </h4>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">প্রধান কালার (Primary Accent)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-9 rounded-xl border border-slate-700 cursor-pointer bg-slate-950"
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
                    <label className="block font-bold text-slate-300 mb-1">ফন্ট স্টাইল (Typography)</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value as any)}
                      className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white font-semibold"
                    >
                      <option value="serif">ঐতিহ্যবাহী ক্লাসিক (Serif / SolaimanLipi)</option>
                      <option value="sans">মডার্ন সান্স-সেরিফ (Sans / Inter)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">হেডার লেআউট স্টাইল</label>
                    <select
                      value={headerStyle}
                      onChange={(e) => setHeaderStyle(e.target.value as any)}
                      className="w-full border border-slate-700 rounded-xl px-3 py-2.5 text-xs bg-slate-950 text-white font-semibold"
                    >
                      <option value="classic">ক্লাসিক সংবাদ লেআউট</option>
                      <option value="modern">মডার্ন লেআউট</option>
                      <option value="centered">সেন্টার্ড লোগো লেআউট</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <h5 className="font-bold text-white">হোমপেজ সেকশনসমূহ দৃশ্যমান রাখুন:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={showTopTicker} onChange={(e) => setShowTopTicker(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">টপ কারেন্সি/তারিখ বার</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={showBreakingBar} onChange={(e) => setShowBreakingBar(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">ব্রেকিং নিউজ টিকার বার</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={enableLeadSection} onChange={(e) => setEnableLeadSection(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">লিড নিউজ ও সাব-লিড সেকশন</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={enableBanglaSpecial} onChange={(e) => setEnableBanglaSpecial(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">মাতৃভূমি স্পেশাল সেকশন</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={enableCategoryGrid} onChange={(e) => setEnableCategoryGrid(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">ক্যাটাগরি নিউজ গ্রিড</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input type="checkbox" checked={enableVideoGallery} onChange={(e) => setEnableVideoGallery(e.target.checked)} className="rounded text-red-600 w-4 h-4" />
                      <span className="font-bold text-slate-200">ভিডিও গ্যালারি সেকশন</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSaveDesignSections}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2 shadow-md"
                >
                  ডিজাইন ও সেকশন সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
