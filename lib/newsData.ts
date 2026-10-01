export interface Category {
  id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  color_code: string;
  order_index: number;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name_bn: string;
  name_en: string;
  slug: string;
  order_index: number;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category_id: number;
  category_name_bn?: string;
  category_slug?: string;
  category_color?: string;
  subcategory_id?: number | null;
  subcategory_name_bn?: string;
  subcategory_slug?: string;
  reporter_id: number;
  reporter_name?: string;
  reporter_avatar?: string;
  reporter_designation?: string;
  image: string;
  image_caption?: string;
  video_url?: string | null;
  views: number;
  is_lead: boolean;
  is_sub_lead: boolean;
  is_breaking: boolean;
  is_special: boolean;
  status: 'published' | 'draft' | 'archived';
  approval_status?: 'pending' | 'approved' | 'rejected';
  published_at: string;
  created_at: string;
  tags?: string[];
}

export interface UserAccount {
  id: number;
  name: string;
  username?: string;
  password?: string;
  email: string;
  phone?: string;
  role: 'Admin' | 'Reporter' | 'Editor' | 'Reader';
  status: 'active' | 'suspended';
  avatar?: string;
  designation?: string;
  bio?: string;
  created_at: string;
  allowed_categories?: string[]; // Array of allowed category slugs (multi-category selection)
  permissions?: string[];        // Array of actions like 'post', 'edit', 'update', 'approve'
}

export const INITIAL_USERS: UserAccount[] = [
  { 
    id: 1, 
    name: 'আল-আমীন সানা', 
    username: 'admin_matribhumi',
    password: 'Matribhumi@2026',
    email: 'matrivumitvar@gmail.com', 
    phone: '01913449997',
    role: 'Admin', 
    designation: 'প্রধান প্রশাসক ও প্রকাশক',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-01-10T10:00:00.000Z',
    permissions: ['post', 'edit', 'update', 'approve', 'delete', 'manage_users', 'manage_settings']
  },
  { 
    id: 2, 
    name: 'মো: রায়ান', 
    username: 'editor_matribhumi',
    password: 'Editor@2026',
    email: 'editor@matrivumi.tv', 
    phone: '01913449997',
    role: 'Editor', 
    designation: 'সম্পাদক',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-01-15T11:30:00.000Z',
    permissions: ['post', 'edit', 'update', 'approve']
  },
  { 
    id: 3, 
    name: 'মিরাজ হাওলাদার', 
    username: 'newseditor',
    password: 'News@2026',
    email: 'newseditor@matrivumi.tv', 
    phone: '01913449997',
    role: 'Editor', 
    designation: 'বার্তা সম্পাদক',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-02-01T09:15:00.000Z',
    permissions: ['post', 'edit', 'update', 'approve']
  },
  { 
    id: 4, 
    name: 'তাসমিয়া আহমেদ', 
    username: 'tasmia',
    password: 'reporter123',
    email: 'tasmia@matribhumitv.com', 
    phone: '+৮৮০ ১৭০০-০০০০০৪',
    role: 'Reporter', 
    designation: 'স্টাফ রিপোর্টার (অর্থনীতি ও অপরাধ)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-03-10T14:20:00.000Z',
    allowed_categories: ['economy', 'crime', 'national'],
    permissions: ['post', 'edit', 'update']
  },
  { 
    id: 5, 
    name: 'তানভীর হাসান', 
    username: 'sports',
    password: 'reporter123',
    email: 'sports@matribhumitv.com', 
    phone: '+৮৮০ ১৭০০-০০০০০৫',
    role: 'Reporter', 
    designation: 'সিনিয়র ক্রীড়া প্রতিবেদক',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-03-12T10:00:00.000Z',
    allowed_categories: ['sports', 'national'],
    permissions: ['post', 'edit', 'update']
  },
  { 
    id: 6, 
    name: 'নুসরাত জাহান', 
    username: 'lifestyle',
    password: 'reporter123',
    email: 'lifestyle@matribhumitv.com', 
    phone: '+৮৮০ ১৭০০-০০০০০৬',
    role: 'Reporter', 
    designation: 'বিনোদন ও লাইফস্টাইল প্রতিবেদক',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
    status: 'active', 
    created_at: '2026-03-15T12:00:00.000Z',
    allowed_categories: ['entertainment', 'lifestyle', 'special'],
    permissions: ['post', 'edit', 'update']
  },
];

export interface Comment {
  id: number;
  post_id: number;
  user_name?: string;
  author_name?: string;
  author_email?: string;
  comment: string;
  created_at: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export type CommentItem = Comment;

export interface AdUnit {
  id: number;
  title: string;
  slot: 'top_header' | 'lead_top_iccb' | 'sidebar_ceylon' | 'sidebar_aci' | 'sidebar_minister' | 'sidebar_glow' | 'between_special_housing' | 'between_economy_tissue' | 'pre_footer' | 'fullscreen_interstitial' | 'video_ad' | string;
  type: 'image' | 'adsense_code' | 'video' | 'html' | 'adsense' | 'custom' | string;
  image_url?: string;
  redirect_url?: string;
  ad_code?: string;
  video_url?: string;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'inactive' | string;
}

export interface SiteConfig {
  site_name: string;
  site_slogan: string;
  editor_name: string;
  publisher_name: string;
  news_editor_name?: string;
  site_url?: string;
  email: string;
  phone: string;
  address: string;
  copyright_text: string;
  adsense_client_id: string;
  adsense_enabled: boolean;
  logo_url?: string;
  favicon_url?: string;
  live_stream_url?: string;
  live_stream_title?: string;
  live_stream_active?: boolean;
  primary_color?: string;
  font_family?: 'serif' | 'sans';
  header_style?: 'classic' | 'modern' | 'centered';
  show_top_ticker?: boolean;
  show_breaking_bar?: boolean;
  enable_live_section?: boolean;
  enable_lead_section?: boolean;
  enable_bangla_special?: boolean;
  enable_category_grid?: boolean;
  enable_three_column?: boolean;
  enable_lifestyle_photo?: boolean;
  enable_video_gallery?: boolean;
  enable_more_news?: boolean;
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name_bn: 'জাতীয়', name_en: 'National', slug: 'national', color_code: '#B91C1C', order_index: 1 },
  { id: 2, name_bn: 'রাজনীতি', name_en: 'Politics', slug: 'politics', color_code: '#DC2626', order_index: 2 },
  { id: 3, name_bn: 'অর্থনীতি', name_en: 'Economy', slug: 'economy', color_code: '#047857', order_index: 3 },
  { id: 4, name_bn: 'আন্তর্জাতিক', name_en: 'International', slug: 'international', color_code: '#4338CA', order_index: 4 },
  { id: 5, name_bn: 'খেলা', name_en: 'Sports', slug: 'sports', color_code: '#0284C7', order_index: 5 },
  { id: 6, name_bn: 'চট্টগ্রাম প্রতিদিন', name_en: 'Chattogram', slug: 'chattogram', color_code: '#B45309', order_index: 6 },
  { id: 7, name_bn: 'সারাদেশ', name_en: 'Country', slug: 'country', color_code: '#0D9488', order_index: 7 },
  { id: 8, name_bn: 'ফিচার', name_en: 'Features', slug: 'features', color_code: '#7C3AED', order_index: 8 },
  { id: 9, name_bn: 'বিনোদন', name_en: 'Entertainment', slug: 'entertainment', color_code: '#DB2777', order_index: 9 },
  { id: 10, name_bn: 'ইসলাম', name_en: 'Islam', slug: 'islam', color_code: '#15803D', order_index: 10 },
  { id: 11, name_bn: 'লাইফস্টাইল', name_en: 'Lifestyle', slug: 'lifestyle', color_code: '#C026D3', order_index: 11 },
  { id: 12, name_bn: 'তথ্যপ্রযুক্তি', name_en: 'Tech', slug: 'tech', color_code: '#2563EB', order_index: 12 },
  { id: 13, name_bn: 'শিক্ষা', name_en: 'Education', slug: 'education', color_code: '#4F46E5', order_index: 13 },
  { id: 14, name_bn: 'স্বাস্থ্য', name_en: 'Health', slug: 'health', color_code: '#059669', order_index: 14 },
  { id: 15, name_bn: 'আইন ও আদালত', name_en: 'Law & Court', slug: 'law', color_code: '#475569', order_index: 15 },
  { id: 16, name_bn: 'স্পেশাল', name_en: 'Special', slug: 'special', color_code: '#B91C1C', order_index: 16 },
];

export const INITIAL_SUBCATEGORIES: Subcategory[] = [
  // জাতীয় (National - 1)
  { id: 1, category_id: 1, name_bn: 'রাজধানী', name_en: 'Capital', slug: 'capital', order_index: 1 },
  { id: 2, category_id: 1, name_bn: 'অপরাধ ও তদন্ত', name_en: 'Crime & Investigation', slug: 'crime', order_index: 2 },
  { id: 3, category_id: 1, name_bn: 'প্রশাসন ও সুশাসন', name_en: 'Administration', slug: 'administration', order_index: 3 },
  { id: 4, category_id: 1, name_bn: 'সংসদ ও নির্বাচন', name_en: 'Parliament', slug: 'parliament', order_index: 4 },

  // রাজনীতি (Politics - 2)
  { id: 5, category_id: 2, name_bn: 'সরকার ও প্রশাসন', name_en: 'Government', slug: 'government', order_index: 1 },
  { id: 6, category_id: 2, name_bn: 'দলীয় রাজনীতি', name_en: 'Party Politics', slug: 'party-politics', order_index: 2 },
  { id: 7, category_id: 2, name_bn: 'রাজনৈতিক বিশ্লেষণ', name_en: 'Political Analysis', slug: 'political-analysis', order_index: 3 },

  // অর্থনীতি (Economy - 3)
  { id: 8, category_id: 3, name_bn: 'ব্যাংক ও বীমা', name_en: 'Banking & Insurance', slug: 'banking', order_index: 1 },
  { id: 9, category_id: 3, name_bn: 'বাণিজ্য ও বিনিয়োগ', name_en: 'Trade & Investment', slug: 'trade', order_index: 2 },
  { id: 10, category_id: 3, name_bn: 'শেয়ারবাজার', name_en: 'Stock Market', slug: 'stock', order_index: 3 },
  { id: 11, category_id: 3, name_bn: 'রাজস্ব ও বাজেট', name_en: 'Revenue & Budget', slug: 'revenue', order_index: 4 },

  // আন্তর্জাতিক (International - 4)
  { id: 12, category_id: 4, name_bn: 'মধ্যপ্রাচ্য', name_en: 'Middle East', slug: 'middle-east', order_index: 1 },
  { id: 13, category_id: 4, name_bn: 'এশিয়া ও প্রতিবেশী', name_en: 'Asia', slug: 'asia', order_index: 2 },
  { id: 14, category_id: 4, name_bn: 'আমেরিকা ও ইউরোপ', name_en: 'US & Europe', slug: 'us-europe', order_index: 3 },
  { id: 15, category_id: 4, name_bn: 'বিশ্ব রাজনীতি', name_en: 'Global Politics', slug: 'global-politics', order_index: 4 },

  // খেলা (Sports - 5)
  { id: 16, category_id: 5, name_bn: 'ক্রিকেট', name_en: 'Cricket', slug: 'cricket', order_index: 1 },
  { id: 17, category_id: 5, name_bn: 'ফুটবল', name_en: 'Football', slug: 'football', order_index: 2 },
  { id: 18, category_id: 5, name_bn: 'টেনিস ও অন্যান্য', name_en: 'Tennis & Others', slug: 'other-sports', order_index: 3 },

  // চট্টগ্রাম প্রতিদিন (Chattogram - 6)
  { id: 19, category_id: 6, name_bn: 'চট্টগ্রাম মহানগর', name_en: 'Chattogram City', slug: 'ctg-city', order_index: 1 },
  { id: 20, category_id: 6, name_bn: 'বন্দর ও কাস্টমস', name_en: 'Port & Customs', slug: 'ctg-port', order_index: 2 },
  { id: 21, category_id: 6, name_bn: 'কক্সবাজার ও উপকূল', name_en: 'Coxs Bazar', slug: 'coxs-bazar', order_index: 3 },

  // সারাদেশে (Country - 7)
  { id: 22, category_id: 7, name_bn: 'ঢাকা বিভাগ', name_en: 'Dhaka Division', slug: 'dhaka-division', order_index: 1 },
  { id: 23, category_id: 7, name_bn: 'চট্টগ্রাম বিভাগ', name_en: 'Chattogram Division', slug: 'ctg-division', order_index: 2 },
  { id: 24, category_id: 7, name_bn: 'রাজশাহী ও রংপুর', name_en: 'Rajshahi & Rangpur', slug: 'rajshahi-rangpur', order_index: 3 },
  { id: 25, category_id: 7, name_bn: 'খুলনা ও বরিশাল', name_en: 'Khulna & Barishal', slug: 'khulna-barishal', order_index: 4 },
  { id: 26, category_id: 7, name_bn: 'সিলেট ও ময়মনসিংহ', name_en: 'Sylhet & Mymensingh', slug: 'sylhet-mymensingh', order_index: 5 },

  // ফিচার (Features - 8)
  { id: 27, category_id: 8, name_bn: 'বিশেষ প্রতিবেদন', name_en: 'Special Feature', slug: 'special-feature', order_index: 1 },
  { id: 28, category_id: 8, name_bn: 'ইতিহাস ও ঐতিহ্য', name_en: 'History & Heritage', slug: 'history', order_index: 2 },
  { id: 29, category_id: 8, name_bn: 'ভ্রমণ ও পর্যটন', name_en: 'Travel & Tourism', slug: 'travel', order_index: 3 },

  // বিনোদন (Entertainment - 9)
  { id: 30, category_id: 9, name_bn: 'ঢালিউড', name_en: 'Dhallywood', slug: 'dhallywood', order_index: 1 },
  { id: 31, category_id: 9, name_bn: 'বলিউড ও হলিউড', name_en: 'Bollywood & Hollywood', slug: 'bollywood', order_index: 2 },
  { id: 32, category_id: 9, name_bn: 'নাটক ও ওটিটি', name_en: 'Drama & OTT', slug: 'drama-ott', order_index: 3 },
  { id: 33, category_id: 9, name_bn: 'সঙ্গীত ও ফ্যাশন', name_en: 'Music & Fashion', slug: 'music', order_index: 4 },

  // ইসলাম (Islam - 10)
  { id: 34, category_id: 10, name_bn: 'কুরআন ও হাদিস', name_en: 'Quran & Hadith', slug: 'quran-hadith', order_index: 1 },
  { id: 35, category_id: 10, name_bn: 'মাসআলা ও ফতোয়া', name_en: 'Masala & Fatwa', slug: 'masala', order_index: 2 },
  { id: 36, category_id: 10, name_bn: 'ইসলামিক জীবন', name_en: 'Islamic Life', slug: 'islamic-life', order_index: 3 },

  // লাইফস্টাইল (Lifestyle - 11)
  { id: 37, category_id: 11, name_bn: 'ফ্যাশন ও রূপচর্চা', name_en: 'Fashion & Beauty', slug: 'fashion-beauty', order_index: 1 },
  { id: 38, category_id: 11, name_bn: 'রান্নাবান্না ও রেসিপি', name_en: 'Cooking & Recipe', slug: 'cooking', order_index: 2 },
  { id: 39, category_id: 11, name_bn: 'সম্পর্ক ও মনস্তত্ত্ব', name_en: 'Relationships', slug: 'relationships', order_index: 3 },

  // তথ্যপ্রযুক্তি (Tech - 12)
  { id: 40, category_id: 12, name_bn: 'কৃত্রিম বুদ্ধিমত্তা (AI)', name_en: 'AI & Tech', slug: 'ai-tech', order_index: 1 },
  { id: 41, category_id: 12, name_bn: 'স্মার্টফোন ও গ্যাজেট', name_en: 'Gadgets', slug: 'gadgets', order_index: 2 },
  { id: 42, category_id: 12, name_bn: 'ইন্টারনেট ও সাইবার', name_en: 'Cyber & Web', slug: 'cyber-web', order_index: 3 },

  // শিক্ষা (Education - 13)
  { id: 43, category_id: 13, name_bn: 'ক্যাম্পাস খবর', name_en: 'Campus News', slug: 'campus', order_index: 1 },
  { id: 44, category_id: 13, name_bn: 'ভর্তি ও পরীক্ষা', name_en: 'Admission & Exam', slug: 'admission', order_index: 2 },
  { id: 45, category_id: 13, name_bn: 'বৃত্তি ও স্কলারশিপ', name_en: 'Scholarship', slug: 'scholarship', order_index: 3 },

  // স্বাস্থ্য (Health - 14)
  { id: 46, category_id: 14, name_bn: 'রোগ ও প্রতিকার', name_en: 'Disease & Cure', slug: 'disease-cure', order_index: 1 },
  { id: 47, category_id: 14, name_bn: 'পুষ্টি ও খাদ্য', name_en: 'Nutrition & Diet', slug: 'nutrition', order_index: 2 },
  { id: 48, category_id: 14, name_bn: 'মানসিক স্বাস্থ্য', name_en: 'Mental Health', slug: 'mental-health', order_index: 3 },

  // আইন ও আদালত (Law - 15)
  { id: 49, category_id: 15, name_bn: 'সুপ্রিম কোর্ট ও বিচার', name_en: 'Supreme Court', slug: 'supreme-court', order_index: 1 },
  { id: 50, category_id: 15, name_bn: 'আন্তর্জাতিক অপরাধ ট্রাইব্যুনাল', name_en: 'ICT Tribunal', slug: 'tribunal', order_index: 2 },
  { id: 51, category_id: 15, name_bn: 'মানবাধিকার ও আইনি পরামর্শ', name_en: 'Legal Advice', slug: 'legal-advice', order_index: 3 },
];

export const INITIAL_TAGS = [
  { id: 1, name_bn: 'রাষ্ট্রপতি', slug: 'president' },
  { id: 2, name_bn: 'প্রধানমন্ত্রী', slug: 'prime-minister' },
  { id: 3, name_bn: 'মেসি', slug: 'messi' },
  { id: 4, name_bn: 'আন্তর্জাতিক অপরাধ ট্রাইব্যুনাল', slug: 'ict' },
  { id: 5, name_bn: 'সংসদ অধিবেশন', slug: 'parliament-session' },
  { id: 6, name_bn: 'নেপাল', slug: 'nepal' },
  { id: 7, name_bn: 'পে-স্কেল', slug: 'pay-scale' },
  { id: 8, name_bn: 'আবহাওয়ার খবর', slug: 'weather' },
];

export const INITIAL_POSTS: Post[] = [
  // 1. Lead & Sub-Leads
  {
    id: 101,
    title: 'ডেঙ্গু প্রতিরোধ ও সাংগঠনিক পুনর্গঠনে জোর বিএনপির',
    slug: 'bnp-dengue-prevention-organizational-rebuild',
    summary: 'দলের স্থায়ী কমিটির বৈঠকে সারা দেশে ডেঙ্গু প্রতিরোধে জনসচেতনতা বৃদ্ধির পাশাপাশি তৃণমূলে সাংগঠনিক তৎপরতা জোরদার করার নির্দেশনা দেওয়া হয়েছে।',
    content: 'বিএনপির নীতিনির্ধারণী ফোরামের বৈঠকে দেশের সামগ্রিক স্বাস্থ্য পরিস্থিতি, ডেঙ্গুর বিস্তার ও তৃণমূল কমিটির পুনর্গঠন নিয়ে বিস্তারিত আলোচনা হয়। বৈঠকে দলের সিনিয়র নেতারা উপস্থিত ছিলেন।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    category_color: '#DC2626',
    reporter_id: 1,
    reporter_name: 'রাজনৈতিক প্রতিবেদক',
    image: 'https://picsum.photos/seed/bnpmeeting/800/450',
    image_caption: 'বিএনপির স্থায়ী কমিটির সভায় আলোচনা করছেন শীর্ষ নেতারা',
    views: 45200,
    is_lead: true,
    is_sub_lead: false,
    is_breaking: true,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T09:30:00.000Z',
    created_at: '2026-09-12T09:20:00.000Z',
    tags: ['প্রধানমন্ত্রী', 'সংসদ অধিবেশন'],
  },
  {
    id: 102,
    title: 'বিএনপির স্থায়ী কমিটির বৈঠক চলছে',
    slug: 'bnp-standing-committee-meeting-ongoing',
    summary: 'গুলশানে চেয়ারপারসনের রাজনৈতিক কার্যালয়ে দলটির স্থায়ী কমিটির ভার্চুয়াল ও সশরীরে বৈঠক অনুষ্ঠিত হচ্ছে।',
    content: 'বৈঠকে আগামী সংসদ অধিবেশন, সার্বিক রাজনীতি এবং নির্বাচন প্রস্তুতি নিয়ে আলোচনা হচ্ছে।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    reporter_id: 1,
    reporter_name: 'স্টাফ রিপোর্টার',
    image: 'https://picsum.photos/seed/bnpflags/400/250',
    views: 18900,
    is_lead: false,
    is_sub_lead: true,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T09:15:00.000Z',
    created_at: '2026-09-12T09:10:00.000Z',
    tags: ['সংসদ অধিবেশন'],
  },
  {
    id: 103,
    title: 'বৈশ্বিক বাণিজ্য, সরবরাহ চেইন ও জ্বালানির অবাধ প্রবাহ বজায় রাখার আহ্বান',
    slug: 'global-trade-supply-chain-energy-call',
    summary: 'আন্তর্জাতিক সম্মেলনে বাণিজ্য ও জ্বালানি সংকট নিরসনে বিশ্ব নেতাদের প্রতি সমন্বিত উদ্যোগ গ্রহণের তাগিদ।',
    content: 'সম্মেলনে অংশ নিয়ে অর্থনীতিবিদরা জানান, বৈশ্বিক মুদ্রাস্ফীতি নিয়ন্ত্রণে সরবরাহ শৃঙ্খল উন্মুক্ত রাখা অত্যন্ত জরুরি।',
    category_id: 4,
    category_name_bn: 'আন্তর্জাতিক',
    category_slug: 'international',
    reporter_id: 2,
    reporter_name: 'আন্তর্জাতিক ডেস্ক',
    image: 'https://picsum.photos/seed/brics2026/400/250',
    views: 16400,
    is_lead: false,
    is_sub_lead: true,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:50:00.000Z',
    created_at: '2026-09-12T08:40:00.000Z',
  },
  {
    id: 104,
    title: 'রিশাদ-আলিসের ঘূর্ণিতে সিরিজ জয় বাংলাদেশের',
    slug: 'rishad-alis-spin-series-win-bangladesh',
    summary: 'বোলিং জাদুতে সফরকারীদের অল্প রানে আটকে দিয়ে ঐতিহাসিক সিরিজ নিশ্চিত করল বাংলাদেশ ক্রিকেট দল।',
    content: 'মিরপুর শেরেবাংলা স্টেডিয়ামে রিশাদ হোসেন ও আলিসের স্পিন নৈপুণ্যে সিরিজ নিজেদের করে নিল বাংলাদেশ।',
    category_id: 5,
    category_name_bn: 'খেলা',
    category_slug: 'sports',
    reporter_id: 3,
    reporter_name: 'ক্রীড়া প্রতিবেদক',
    image: 'https://picsum.photos/seed/cricketserieswin/400/250',
    views: 38700,
    is_lead: false,
    is_sub_lead: true,
    is_breaking: true,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:30:00.000Z',
    created_at: '2026-09-12T08:20:00.000Z',
  },
  // Left Column List Items
  {
    id: 105,
    title: 'পদ্মায় নৌকাডুবি, ১০ বাংলাদেশিকে উদ্ধার করল বিএসএফ',
    slug: 'padma-boat-capsize-10-rescued-bsf',
    summary: 'সীমান্তবর্তী এলাকায় উত্তাল পদ্মায় নৌকাডুবির পর স্থানীয় বিএসএফ সদস্যরা তাদের উদ্ধার করে।',
    content: 'উদ্ধারকৃতদের দ্রুত প্রাথমিক চিকিৎসা দিয়ে বাংলাদেশে হস্তান্তরের প্রক্রিয়া শুরু হয়েছে।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/boatrescue/200/150',
    views: 21300,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:00:00.000Z',
    created_at: '2026-09-12T07:50:00.000Z',
  },
  {
    id: 106,
    title: 'বিদ্যুৎকেন্দ্রে একের পর এক কারিগরি ত্রুটি নাশকতা কি না, প্রশ্ন উঠেছে',
    slug: 'power-plant-technical-glitches-sabotage-probe',
    summary: 'গুরুত্বপূর্ণ বিদ্যুৎকেন্দ্রে ঘন ঘন ত্রুটির পেছনে গভীর ষড়যন্ত্র রয়েছে কি না তা তদন্তে উচ্চপর্যায়ের কমিটি গঠন।',
    content: 'বিদ্যুৎ মন্ত্রণালয় থেকে জানানো হয়েছে সকল কেন্দ্রগুলোর নিরাপত্তা ও অডিট জোরদার করা হয়েছে।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/powerplant/200/150',
    views: 19800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:40:00.000Z',
    created_at: '2026-09-12T07:30:00.000Z',
  },
  {
    id: 107,
    title: 'মোহাম্মদপুরে কিশোর গ্যাং বলে কোনো শব্দ থাকবে না: ডিএমপি কমিশনার',
    slug: 'mohammadpur-juvenile-gang-dmp-chief',
    summary: 'আইনশৃঙ্খলা নিয়ন্ত্রণে কঠোর হুঁশিয়ারি দিয়ে ডিএমপি কমিশনার জানান, কোনো অপরাধীকে ছাড় দেওয়া হবে না।',
    content: 'মোহাম্মদপুর ও আশেপাশের এলাকায় বিশেষ যৌথ অভিযান অব্যাহত রয়েছে।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/dmpchief/200/150',
    views: 27500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:15:00.000Z',
    created_at: '2026-09-12T07:05:00.000Z',
  },
  {
    id: 108,
    title: 'আদাবরে ব্যাগে মিলল নারীর খণ্ডিত মরদেহ',
    slug: 'adabor-body-parts-recovered',
    summary: 'রাজধানীর আদাবর এলাকায় পরিত্যক্ত ব্যাগ থেকে অজ্ঞাত নারীর মরদেহ উদ্ধার করেছে পুলিশ।',
    content: 'সিআইডি ক্রাইম সিন ইউনিট ঘটনাস্থলে গিয়ে আলামত সংগ্রহ করেছে। ময়নাতদন্তের জন্য মরদেহ মর্গে পাঠানো হয়েছে।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/policeinvestigation/200/150',
    views: 31200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T06:50:00.000Z',
    created_at: '2026-09-12T06:40:00.000Z',
  },
  {
    id: 109,
    title: "বিকল্প জ্বালানি 'চায়ের কয়লা'",
    slug: 'alternative-energy-tea-coal',
    summary: 'চা কারখানার বর্জ্য প্রক্রিয়াজাত করে তৈরি হচ্ছে পরিবেশবান্ধব উচ্চ তাপমাত্রার কয়লা।',
    content: 'উদ্ভাবনী এই প্রকল্প শ্রীমঙ্গলের স্থানীয় শিল্পে জ্বালানি সাশ্রয়ে নতুন পথ দেখাচ্ছে।',
    category_id: 8,
    category_name_bn: 'ফিচার',
    category_slug: 'features',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/teacoal/200/150',
    views: 14500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T06:20:00.000Z',
    created_at: '2026-09-12T06:10:00.000Z',
  },

  // 2. বাংলানিউজ স্পেশাল
  {
    id: 201,
    title: 'জাতিসংঘে খলিলুর রহমানের সামনে ৭ চ্যালেঞ্জ',
    slug: 'un-khalilur-rahman-seven-challenges',
    summary: 'রোহিঙ্গা সংকট, জলবায়ু ক্ষতিপূরণ ও ভূরাজনীতির সমীকরণে বিশ্বমঞ্চে বাংলাদেশের অবস্থান সুসংহত করার রূপরেখা।',
    content: 'জাতিসংঘ সাধারণ অধিবেশনে বাংলাদেশের স্বার্থ রক্ষায় অভিজ্ঞ কূটনীতিকদের সমন্বয়ে কৌশলপত্র তৈরি করা হয়েছে।',
    category_id: 16,
    category_name_bn: 'স্পেশাল',
    category_slug: 'special',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/unchallenge/400/260',
    views: 29400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T09:00:00.000Z',
    created_at: '2026-09-12T08:50:00.000Z',
  },
  {
    id: 202,
    title: 'শাহ আলী মার্কেটে স্বর্ণ চুরি, নেপথ্যে সাবেক দুলাভাই-শ্যালক',
    slug: 'shah-ali-market-gold-theft',
    summary: 'মিরপুরের শাহ আলী মার্কেটে কোটি টাকার স্বর্ণ চুরির ঘটনায় আন্তঃজেলা চক্রের মূল হোতাদের গ্রেপ্তার করেছে পুলিশ।',
    content: 'সিসিটিভি ফুটেজ ও প্রযুক্তির সহায়তায় চুরির ১২ ঘণ্টার মধ্যে উদ্ধার করা হয়েছে স্বর্ণালংকার।',
    category_id: 16,
    category_name_bn: 'স্পেশাল',
    category_slug: 'special',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/goldtheft/400/260',
    views: 23100,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:45:00.000Z',
    created_at: '2026-09-12T08:35:00.000Z',
  },
  {
    id: 203,
    title: 'অনিরাপদ বিদেশযাত্রায় ঝুঁকিতে নারী শ্রমিকরা',
    slug: 'unsafe-migration-women-workers-risk',
    summary: 'অবৈধ রিক্রুটিং এজেন্সির প্রলোভনে পড়ে চরম ভোগান্তিতে পড়ছেন বিদেশে যাওয়া নারী অভিবাসী শ্রমিকরা।',
    content: 'বিশেষ অনুসন্ধানে উঠে এসেছে প্রবাসে নারী কর্মীদের আইনি সুরক্ষা ও ট্রেইনিং জোরদারের প্রয়োজনীয়তা।',
    category_id: 16,
    category_name_bn: 'স্পেশাল',
    category_slug: 'special',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/migrantwomen/400/260',
    views: 21800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:30:00.000Z',
    created_at: '2026-09-12T08:20:00.000Z',
  },
  {
    id: 204,
    title: 'কারাবন্দিদের ভিডিও কল: যুক্ত হচ্ছে এআই, অচেনা মুখে কাটবে লাইন',
    slug: 'prison-inmates-video-call-ai-surveillance',
    summary: 'দেশের কারাগারগুলোতে বন্দিদের সঙ্গে স্বজনদের ভিডিও কনফারেন্সে ফেস রিকগনিশন এআই প্রযুক্তি চালু হচ্ছে।',
    content: 'কারা কর্তৃপক্ষ জানিয়েছে, অনুমতিহীন কোনো ব্যক্তি ক্যামেরার সামনে এলে সংযোগ স্বয়ংক্রিয়ভাবে বিচ্ছিন্ন হয়ে যাবে।',
    category_id: 16,
    category_name_bn: 'স্পেশাল',
    category_slug: 'special',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/prisonai/400/260',
    views: 34500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:15:00.000Z',
    created_at: '2026-09-12T08:05:00.000Z',
  },
  {
    id: 205,
    title: 'স্থানীয় নির্বাচন: মিছিল, পোস্টার, এআই কনটেন্টেও নিষেধাজ্ঞা ইসির',
    slug: 'local-election-poster-ai-content-ban',
    summary: 'সুষ্ঠু পরিবেশ নিশ্চিতে নির্বাচনী আচরণবিধিতে যুক্ত হলো ডিজিটাল প্রোপাগান্ডা রোধের নতুন ধারা।',
    content: 'ইসি সচিবালয় থেকে আচরণবিধি লঙ্ঘনের বিরুদ্ধে কড়া শাস্তির বিধান ঘোষণা করা হয়েছে।',
    category_id: 16,
    category_name_bn: 'স্পেশাল',
    category_slug: 'special',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/electioncomm/400/260',
    views: 18200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T07:45:00.000Z',
    created_at: '2026-09-12T07:35:00.000Z',
  },

  // 3. জাতীয় (National)
  {
    id: 301,
    title: 'ভিডিও কল থেকে ক্যাশলেস ক্যান্টিন, ইনোভেশন ফেয়ারে কারা অধিদপ্তরের চমক',
    slug: 'prison-dept-innovation-fair-cashless-canteen',
    summary: 'ডিজিটাল উদ্ভাবন মেলায় বন্দিদের পুনর্বাসন ও স্মার্ট কারা ব্যবস্থাপনার নানা প্রজেক্ট দর্শনার্থীদের প্রশংসা কুড়াচ্ছে।',
    content: 'মেলায় উপস্থাপন করা হয়েছে বন্দিদের হাতের কাজের অনলাইন মার্কেটপ্লেস ও ডিজিটাল স্বাস্থ্যসেবা।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/innovationfair/600/350',
    views: 26700,
    is_lead: false,
    is_sub_lead: true,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:40:00.000Z',
    created_at: '2026-09-12T08:30:00.000Z',
  },
  {
    id: 302,
    title: 'ঢাকার রাশিয়ান হাউসে বাংলাদেশ ও রাশিয়ার সাংস্কৃতিক মেলবন্ধন',
    slug: 'russian-house-cultural-event-dhaka',
    summary: 'মৈত্রী ও শিল্প সাহিত্যের আদান-প্রদানে আয়োজিত সাংস্কৃতিক সন্ধ্যায় অংশ নেন দুই দেশের শিল্পীরা।',
    content: 'অনুষ্ঠানে ঐতিহ্যবাহী রুশ নৃত্য ও বাংলাদেশের লোকসংগীত পরিবেশিত হয়।',
    category_id: 1,
    category_name_bn: 'জাতীয়',
    category_slug: 'national',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/russianhouse/400/250',
    views: 14200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:10:00.000Z',
    created_at: '2026-09-12T08:00:00.000Z',
  },

  // 4. রাজনীতি (Politics)
  {
    id: 401,
    title: 'তিন জেলার নেতাদের সঙ্গে তারেক রহমানের সাংগঠনিক বৈঠক',
    slug: 'tarique-rahman-organizational-meeting',
    summary: 'দলের ভারপ্রাপ্ত চেয়ারম্যান লন্ডন থেকে ভার্চুয়ালি যুক্ত হয়ে সাংগঠনিক গতিশীলতা বৃদ্ধির নির্দেশ দেন।',
    content: 'তৃণমূল নেতাকর্মীদের মাঠে সক্রিয় থাকার পাশাপাশি জনগণের পাশে দাঁড়ানোর নির্দেশনা দেওয়া হয়।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/tariquerahman/400/250',
    views: 31000,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:20:00.000Z',
    created_at: '2026-09-12T08:10:00.000Z',
  },
  {
    id: 402,
    title: 'তারেক রহমানের নেতৃত্বে গণতন্ত্র ও উন্নয়ন এগিয়ে যাবে: মুরাদ',
    slug: 'democracy-progress-under-tarique-murad',
    summary: 'রাজধানীতে আয়োজিত এক আলোচনা সভায় নেতৃবৃন্দ বলেন, জনগণের ভোটাধিকার রক্ষায় ঐক্যবদ্ধ আন্দোলন প্রয়োজন।',
    content: 'সভায় বিভিন্ন অঙ্গসংগঠনের শীর্ষ নেতৃবৃন্দ বক্তব্য প্রদান করেন।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/politicalrally/400/250',
    views: 19400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:50:00.000Z',
    created_at: '2026-09-12T07:40:00.000Z',
  },
  {
    id: 403,
    title: 'বিএনপির কাউন্সিল নিয়ে সিদ্ধান্ত আসতে পারে রাতে',
    slug: 'bnp-council-decision-tonight',
    summary: 'স্থায়ী কমিটির বৈঠকের পর দলের কেন্দ্রীয় সম্মেলন ও কাউন্সিল বিষয়ে আনুষ্ঠানিক ঘোষণা আসতে পারে।',
    content: 'দলীয় সূত্রে জানা গেছে, সম্মেলন প্রস্তুতি কমিটির তালিকা চূড়ান্ত করা হয়েছে।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/bnpconference/400/250',
    views: 22400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:30:00.000Z',
    created_at: '2026-09-12T07:20:00.000Z',
  },
  {
    id: 404,
    title: 'ঈশ্বরদীতে স্বেচ্ছাসেবক লীগ নেতা গ্রেপ্তার',
    slug: 'ishwardi-swechchhasebak-league-leader-arrested',
    summary: 'পূর্বের মামলায় ওয়ারেন্টভুক্ত আসামীকে বিশেষ অভিযানে গ্রেপ্তার করেছে পুলিশ।',
    content: 'গ্রেপ্তারকৃতকে আদালতে সোপর্দ করা হয়েছে বলে থানা পুলিশ নিশ্চিত করেছে।',
    category_id: 2,
    category_name_bn: 'রাজনীতি',
    category_slug: 'politics',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/policearrest/400/250',
    views: 15600,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:10:00.000Z',
    created_at: '2026-09-12T07:00:00.000Z',
  },

  // 5. অর্থনীতি-ব্যবসা & আন্তর্জাতিক (Side by side)
  {
    id: 501,
    title: 'প্রযুক্তির বিপ্লবের বার্তা দিয়ে পর্দা নামল ফুডপ্রোর',
    slug: 'foodpro-expo-concludes-technology-revolution',
    summary: 'তিন দিনব্যাপী আন্তর্জাতিক খাদ্য প্রক্রিয়াজাতকরণ ও প্যাকেজিং প্রদর্শনীতে কোটি টাকার প্রযুক্তি চুক্তি সম্পন্ন।',
    content: 'আইসিসিবিতে আয়োজিত আন্তর্জাতিক এক্সপোতে দেশি-বিদেশি দুই শতাধিক প্রতিষ্ঠান অংশ নেয়।',
    category_id: 3,
    category_name_bn: 'অর্থনীতি',
    category_slug: 'economy',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/foodproexpo/500/300',
    views: 21900,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:50:00.000Z',
    created_at: '2026-09-12T08:40:00.000Z',
  },
  {
    id: 502,
    title: 'উত্তরাঞ্চলের কৃষকদের জন্য ৩ হাজার কোটি টাকার পুনঃঅর্থায়ন স্কিম',
    slug: 'northern-farmers-refinance-scheme-3000-crore',
    summary: 'শস্য বহুমুখীকরণ ও সৌরসেচে সহজ শর্তে ৪ শতাংশ সুদে বিশেষ ঋণ কার্যক্রম চালু করেছে কেন্দ্রীয় ব্যাংক।',
    content: 'বাংলাদেশ ব্যাংক জানিয়েছে, ক্ষুদ্র ও প্রান্তিক চাষীরা এই প্রকল্পের আওতায় অগ্রাধিকার পাবেন।',
    category_id: 3,
    category_name_bn: 'অর্থনীতি',
    category_slug: 'economy',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/agriculturefinance/200/150',
    views: 18400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:20:00.000Z',
    created_at: '2026-09-12T08:10:00.000Z',
  },
  {
    id: 503,
    title: 'রিকন্ডিশন্ড ইভি আমদানির সুযোগ পুনর্বহালের দাবি',
    slug: 'reconditioned-ev-import-demand',
    summary: 'পরিবেশবান্ধব বৈদ্যুতিক গাড়ি সাধারণের নাগালে আনতে শুল্ক কাঠামো যৌক্তিক করার আহ্বান বারভিডার।',
    content: 'সংবাদ সম্মেলনে ব্যবসায়ী নেতৃবৃন্দ গ্রিন মোবিলিটি প্রসারে নীতি সহায়তার উপর জোর দেন।',
    category_id: 3,
    category_name_bn: 'অর্থনীতি',
    category_slug: 'economy',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/evcarsbd/200/150',
    views: 16200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:00:00.000Z',
    created_at: '2026-09-12T07:50:00.000Z',
  },
  {
    id: 504,
    title: 'ফিলিপাইনে ফেরিতে আগুন, নিহত বেড়ে ৭৬',
    slug: 'philippines-ferry-fire-death-toll-76',
    summary: 'উত্তাল সাগরে যাত্রীবাহী নৌযানে ভয়াবহ অগ্নিকাণ্ডে নিখোঁজদের সন্ধানে যৌথ উদ্ধার অভিযান চালাচ্ছে কোস্টগার্ড।',
    content: 'ম্যানিলার দক্ষিণাঞ্চলীয় দ্বীপপুঞ্জের কাছে এই দুর্ঘটনা ঘটে। মৃতের সংখ্যা আরও বাড়তে পারে।',
    category_id: 4,
    category_name_bn: 'আন্তর্জাতিক',
    category_slug: 'international',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/ferryfire/500/300',
    views: 33400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:45:00.000Z',
    created_at: '2026-09-12T08:35:00.000Z',
  },
  {
    id: 505,
    title: 'বাব আল-মান্দেব প্রণালীতে হুতি নিয়ন্ত্রণের প্রভাব জ্বালানি বাজারে',
    slug: 'bab-el-mandeb-houthi-control-energy-market',
    summary: 'লোহিত সাগরে বাণিজ্যিক জাহাজের রুট পরিবর্তনের ফলে আন্তর্জাতিক কার্গো ভাড়া ও অপরিশোধিত তেলের দাম বৃদ্ধি।',
    content: 'আন্তর্জাতিক শিপিং কোম্পানিগুলো আফ্রিকার উত্তমাশা অন্তরীপ হয়ে দীর্ঘ পথে যাতায়াত করতে বাধ্য হচ্ছে।',
    category_id: 4,
    category_name_bn: 'আন্তর্জাতিক',
    category_slug: 'international',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/redseaship/200/150',
    views: 25100,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:15:00.000Z',
    created_at: '2026-09-12T08:05:00.000Z',
  },

  // 6. খেলা (Sports)
  {
    id: 601,
    title: 'গ্রুপ পর্বেই বসুন্ধরা কিংস-মোহামেডান মহারণ, স্বস্তিতে আবাহনী',
    slug: 'kings-mohammedan-clash-group-stage',
    summary: 'ফেডারেশন কাপের ড্র অনুষ্ঠিত; হট ফেভারিট দুই দল একই গ্রুপে পড়ায় শুরু থেকেই উত্তাপ ছড়াচ্ছে ঘরোয়া ফুটবল।',
    content: 'বাফুফে ভবনে ড্র অনুষ্ঠানে প্রিমিয়ার লিগের ক্লাব কর্মকর্তাদের উপস্থিতিতে ফিক্সচার চূড়ান্ত করা হয়।',
    category_id: 5,
    category_name_bn: 'খেলা',
    category_slug: 'sports',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/footballclash/800/450',
    views: 42000,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T09:00:00.000Z',
    created_at: '2026-09-12T08:50:00.000Z',
  },
  {
    id: 602,
    title: 'ভাস্কর্যে ফাটল, মিরপুর স্টেডিয়ামের ২ নম্বর গেট বন্ধ ঘোষণা',
    slug: 'mirpur-stadium-gate-2-closed-crack',
    summary: 'নিরাপত্তাজনিত কারণে হোম অব ক্রিকেটের প্রধান প্রবেশদ্বারের সংস্কার কাজ দ্রুত শুরু করার নির্দেশ বিসিবির।',
    content: 'প্রকৌশলীরা পরিদর্শন করে জানিয়েছেন ফাটল মেরামতের আগ পর্যন্ত দর্শনার্থী চলাচল বন্ধ থাকবে।',
    category_id: 5,
    category_name_bn: 'খেলা',
    category_slug: 'sports',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/mirpurstadium/200/150',
    views: 19600,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:35:00.000Z',
    created_at: '2026-09-12T08:25:00.000Z',
  },
  {
    id: 603,
    title: 'তিন বছর পর এশিয়া কাপে ফিরল নেপাল',
    slug: 'nepal-returns-to-asia-cup',
    summary: 'বাছাইপর্বের ফাইনালে শ্বাসরুদ্ধকর জয়ে মূল আসরের টিকিট নিশ্চিত করল নেপালি ক্রিকেটাররা।',
    content: 'কাঠমান্ডুর রাজপথে হাজারো ক্রিকেটপ্রেমী আনন্দ মিছিলে অংশ নিয়ে দলকে অভিনন্দন জানান।',
    category_id: 5,
    category_name_bn: 'খেলা',
    category_slug: 'sports',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/nepalcricket/200/150',
    views: 24700,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:15:00.000Z',
    created_at: '2026-09-12T08:05:00.000Z',
    tags: ['নেপাল'],
  },
  {
    id: 604,
    title: 'খেলোয়াড়, নিয়োগকর্তা, অর্থদাতা: সান্তোসে নেইমারই যেন সব',
    slug: 'neymar-santos-all-in-one-role',
    summary: 'শৈশবের ক্লাবে ফিরে শুধু মাঠের ফুটবল নয়, ক্লাব পরিচালনায়ও বড় ভূমিকা রাখছেন ব্রাজিলিয়ান তারকা।',
    content: 'সান্তোসের সঙ্গে নতুন চুক্তির পর স্পনসর ও ব্রান্ডিংয়ে নতুন মাত্রা যোগ হয়েছে।',
    category_id: 5,
    category_name_bn: 'খেলা',
    category_slug: 'sports',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/neymarsantos/200/150',
    views: 31800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:55:00.000Z',
    created_at: '2026-09-12T07:45:00.000Z',
  },

  // 7. বিনোদন (Entertainment)
  {
    id: 701,
    title: 'মৃত্যুবার্ষিকীতে ফরিদা পারভীনের স্মরণে বিশেষ আয়োজন',
    slug: 'farida-parveen-memorial-special-program',
    summary: 'লালন সম্রাজ্ঞীর অমর সংগীত ও স্মৃতি স্মরণে শিল্পকলা একাডেমিতে দুই দিনব্যাপী ভক্তিমূলক গানের আসর।',
    content: 'অনুষ্ঠানে দেশের প্রথিতযশা শিল্পীরা লালনগীতি পরিবেশন করে শ্রদ্ধা জ্ঞাপন করেন।',
    category_id: 9,
    category_name_bn: 'বিনোদন',
    category_slug: 'entertainment',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/faridaparveen/500/350',
    views: 28500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:50:00.000Z',
    created_at: '2026-09-12T08:40:00.000Z',
  },
  {
    id: 702,
    title: 'ভেনিসে প্রথমবার অংশ নিয়েই বাংলাদেশি সিনেমার পুরস্কার জয়',
    slug: 'venice-film-festival-bangladesh-award',
    summary: 'বিশ্বের অন্যতম মর্যাদাপূর্ণ আন্তর্জাতিক চলচ্চিত্র উৎসবে সেরা মৌলিক চিত্রনাট্যের পুরস্কার ছিনিয়ে নিল তরুণ নির্মাতার চলচ্চিত্র।',
    content: 'আন্তর্জাতিক জুরি বোর্ড বাংলাদেশি চলচ্চিত্রের গল্প ও দৃশ্যায়নের ভূয়সী প্রশংসা করেছেন।',
    category_id: 9,
    category_name_bn: 'বিনোদন',
    category_slug: 'entertainment',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/veniceaward/400/260',
    views: 23400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:25:00.000Z',
    created_at: '2026-09-12T08:15:00.000Z',
  },
  {
    id: 703,
    title: '‘সংস্কৃতি কি শুধুই নারীর ক্লিভেজে সীমাবদ্ধ?’ প্রশ্ন ঐশ্বরিয়ার',
    slug: 'aishwarya-fashion-statement-culture',
    summary: 'গ্ল্যামার জগতের আধুনিক বিতর্ক ও শালীনতা নিয়ে খোলামেলা সাক্ষাৎকারে বলি তারকার কড়া বক্তব্য।',
    content: 'তিনি বলেন, নারী স্বাধীনতাকে অগভীর পোশাকে সংজ্ঞায়িত করাটা প্রকৃত মুক্তির পরিপন্থী।',
    category_id: 9,
    category_name_bn: 'বিনোদন',
    category_slug: 'entertainment',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/aishwaryarai/200/150',
    views: 39000,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:05:00.000Z',
    created_at: '2026-09-12T07:55:00.000Z',
  },

  // 8. সারাদেশে (Country)
  {
    id: 801,
    title: 'জলাবদ্ধতায় ডুবেছে পৌর এলাকা, মরে গেছে অর্ধশত বছরের লিচু বাগান',
    slug: 'waterlogging-submerged-lychee-orchard-ruined',
    summary: 'পরিকল্পনাহীন ড্রেনেজ ও নদীর নাব্যতা সংকটে দিনাজপুরের ঐতিহ্যবাহী লিচু চাষিদের মাথায় হাত, কোটি টাকার ক্ষতি।',
    content: 'স্থানীয় কৃষকরা দ্রুত ড্রেনেজ সচল ও ক্ষতিপূরণের জন্য প্রশাসনের জরুরি হস্তক্ষেপ দাবি করেছেন।',
    category_id: 7,
    category_name_bn: 'সারাদেশ',
    category_slug: 'country',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/lycheeorchard/400/250',
    views: 18700,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:40:00.000Z',
    created_at: '2026-09-12T08:30:00.000Z',
  },
  {
    id: 802,
    title: 'সৈয়দপুরে ট্রাক চাপায় সাইকেল আরোহীর মৃত্যু',
    slug: 'saidpur-truck-accident-cyclist-killed',
    summary: 'বাইপাস সড়কে বেপরোয়া গতির মালবাহী ট্রাকের ধাক্কায় ঘটনাস্থলেই প্রাণ হারান এক স্থানীয় ব্যবসায়ী।',
    content: 'পুলিশ ঘাতক ট্রাকটিকে জব্দ করেছে এবং চালককে আটকের চেষ্টা চলছে।',
    category_id: 7,
    category_name_bn: 'সারাদেশ',
    category_slug: 'country',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/accidentreport/400/250',
    views: 16500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:15:00.000Z',
    created_at: '2026-09-12T08:05:00.000Z',
  },

  // 9. চট্টগ্রাম প্রতিদিন (Chattogram)
  {
    id: 901,
    title: 'ভালো কোম্পানিকে সহজে পুঁজিবাজারে তালিকাভুক্ত করা হবে: বিএসইসি চেয়ারম্যান',
    slug: 'chattogram-bsec-chairman-capital-market',
    summary: 'চট্টগ্রামে ব্যবসায়ী প্রতিনিধিদের সঙ্গে মতবিনিময় সভায় পুঁজিবাজার সংস্কারে যুগান্তকারী ঘোষণা।',
    content: 'বিএসইসি চেয়ারম্যান জানান, সৎ উদ্যোক্তাদের জন্য আইপিও অনুমোদন প্রক্রিয়া ডিজিটাল ও দ্রুততর করা হচ্ছে।',
    category_id: 6,
    category_name_bn: 'চট্টগ্রাম প্রতিদিন',
    category_slug: 'chattogram',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/bsecmeeting/400/250',
    views: 17800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:30:00.000Z',
    created_at: '2026-09-12T08:20:00.000Z',
  },
  {
    id: 902,
    title: 'ডেঙ্গু প্রতিরোধে পরিচ্ছন্নতা ও জনসম্পৃক্ততাই প্রধান হাতিয়ার: মেয়র শাহাদাত',
    slug: 'chattogram-mayor-shahadat-dengue-drive',
    summary: 'চট্টগ্রাম সিটি কর্পোরেশনের উদ্যোগে ৪১টি ওয়ার্ডে একযোগে বিশেষ মশক নিধন ও ক্র্যাশ প্রোগ্রাম উদ্বোধন।',
    content: 'মেয়র ডা. শাহাদাত হোসেন নিজে উপস্থিত থেকে বিভিন্ন নালা ও ড্রেনে লার্ভিসাইড স্প্রে কার্যক্রম পরিদর্শন করেন।',
    category_id: 6,
    category_name_bn: 'চট্টগ্রাম প্রতিদিন',
    category_slug: 'chattogram',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/mayorshahadat/400/250',
    views: 21500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:05:00.000Z',
    created_at: '2026-09-12T07:55:00.000Z',
  },

  // 10. লাইফস্টাইল (Lifestyle)
  {
    id: 1001,
    title: 'ভিটামিন ডি সাপ্লিমেন্ট খাওয়ার সময় যে ভুলগুলো এড়াবেন',
    slug: 'vitamin-d-supplement-mistakes-to-avoid',
    summary: 'চর্বিযুক্ত খাবারের সঙ্গে না খেলে ভিটামিন ডি শরীর শোষণ করতে পারে না; বিশেষজ্ঞ চিকিৎসকদের সতর্কবার্তা।',
    content: 'চিকিৎসকদের মতে, চিকিৎসকের পরামর্শ ছাড়া অনিয়ন্ত্রিত মাত্রায় ভিটামিন সাপ্লিমেন্ট খেলে কিডনির জটিলতা সৃষ্টি হতে পারে।',
    category_id: 11,
    category_name_bn: 'লাইফস্টাইল',
    category_slug: 'lifestyle',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/vitamindlifestyle/500/350',
    views: 31200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: true,
    status: 'published',
    published_at: '2026-09-12T08:45:00.000Z',
    created_at: '2026-09-12T08:35:00.000Z',
  },
  {
    id: 1002,
    title: 'কতক্ষণ ঘুমানো ভালো?',
    slug: 'how-many-hours-sleep-is-healthy',
    summary: 'বয়সভেদে ঘুমের প্রয়োজনীয় সময়সীমা এবং গভীর ঘুমের ৫টি প্রাকৃতিক উপায়।',
    content: 'প্রতি রাতে ৭ থেকে ৮ ঘণ্টার পরিমিত ঘুম হৃদরোগ ও মানসিক অবসাদ দূর করতে প্রধান ভূমিকা রাখে।',
    category_id: 11,
    category_name_bn: 'লাইফস্টাইল',
    category_slug: 'lifestyle',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/healthysleep/200/150',
    views: 24500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:15:00.000Z',
    created_at: '2026-09-12T08:05:00.000Z',
  },
  {
    id: 1003,
    title: 'স্মার্টফোনের পর্দায় হারিয়ে যাচ্ছে সম্পর্ক, যে বিষয়ে সচেতন হওয়া জরুরি',
    slug: 'smartphone-screen-relationships-disconnect',
    summary: 'পারিবারিক আড্ডায় মোবাইল ব্যবহারের বিরূপ প্রভাব এবং ডিজিটাল ডিটক্সের প্রয়োজনীয়তা।',
    content: 'মনোবিজ্ঞানীরা বলছেন, পরিবারকে গুণগত সময় দেওয়া মানসিক প্রশান্তির অন্যতম চাবিকাঠি।',
    category_id: 11,
    category_name_bn: 'লাইফস্টাইল',
    category_slug: 'lifestyle',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/digitaldetox/200/150',
    views: 19800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:50:00.000Z',
    created_at: '2026-09-12T07:40:00.000Z',
  },

  // 11. শিক্ষা, স্বাস্থ্য, তথ্যপ্রযুক্তি (Grids 1)
  {
    id: 1101,
    title: 'বিদেশি বিশ্ববিদ্যালয়ের সঙ্গে যৌথ ডিগ্রি চালুর উদ্যোগ',
    slug: 'foreign-university-joint-degree-initiative',
    summary: 'উচ্চশিক্ষার আন্তর্জাতিকীকরণে দেশের পাবলিক বিশ্ববিদ্যালয়গুলোতে যৌথ গবেষণা ও ডুয়াল ডিগ্রি কার্যক্রম শুরু হচ্ছে।',
    content: 'ইউজিসি চেয়ারম্যান জানিয়েছেন, আন্তর্জাতিক মানদণ্ডে শিক্ষা কার্যক্রমকে আধুনিক করতে নতুন নীতিমালা হচ্ছে।',
    category_id: 13,
    category_name_bn: 'শিক্ষা',
    category_slug: 'education',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/educationdegree/400/250',
    views: 16500,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:30:00.000Z',
    created_at: '2026-09-12T08:20:00.000Z',
  },
  {
    id: 1102,
    title: 'বাতরোগে ভুগছেন ৩০ শতাংশ মানুষ, চিকিৎসায় খরচে নিঃস্ব পরিবার',
    slug: 'arthritis-patients-thirty-percent-treatment-cost',
    summary: 'সচেতনতার অভাব ও প্রাথমিক চিকিৎসার অভাবে জটিল রূপ নিচ্ছে বাত ও আর্থ্রাইটিস রোগ।',
    content: 'বিশেষজ্ঞ চিকিৎসকরা সরকারি হাসপাতালে রিউমাটোলজি বিভাগ চালুর তাগিদ দিয়েছেন।',
    category_id: 14,
    category_name_bn: 'স্বাস্থ্য',
    category_slug: 'health',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/healtharthritis/400/250',
    views: 22800,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:20:00.000Z',
    created_at: '2026-09-12T08:10:00.000Z',
  },
  {
    id: 1103,
    title: 'তরুণদের নানা উদ্ভাবনী ভাবনায় মুখরিত ইনোভেশন ফেয়ার',
    slug: 'youth-innovative-ideas-innovation-fair',
    summary: 'রোবটিক্স, আইওটি এবং কৃত্রিম বুদ্ধিমত্তা চালিত প্রকল্পের প্রদর্শনীতে দর্শনার্থীদের ব্যাপক ভিড়।',
    content: 'তথ্যপ্রযুক্তি প্রতিমন্ত্রী সফল সেরা ৫টি প্রজেক্টকে সরকারি ফান্ডিং প্রদানের ঘোষণা দেন।',
    category_id: 12,
    category_name_bn: 'তথ্যপ্রযুক্তি',
    category_slug: 'tech',
    reporter_id: 3,
    image: 'https://picsum.photos/seed/techinnovation/400/250',
    views: 19700,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:10:00.000Z',
    created_at: '2026-09-12T08:00:00.000Z',
  },

  // 12. ফিচার, ইসলাম, আইন ও আদালত (Grids 2)
  {
    id: 1201,
    title: 'ভাষা নেই, হাসি দিয়েই জীবনসংগ্রামে টিকে আছে ফিরোজ',
    slug: 'firoz-life-struggle-speech-impaired-smile',
    summary: 'বাকপ্রতিবন্ধী ফিরোজের চা বিক্রির সততা ও হাসিমুখ মন জয় করেছে এলাকার সর্বস্তরের মানুষের।',
    content: 'প্রতিবন্ধকতাকে জয় করে স্বাবলম্বী হওয়ার এই গল্প সামাজিক যোগাযোগ মাধ্যমে প্রশংসিত হচ্ছে।',
    category_id: 8,
    category_name_bn: 'ফিচার',
    category_slug: 'features',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/firozstory/400/250',
    views: 25400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:25:00.000Z',
    created_at: '2026-09-12T08:15:00.000Z',
  },
  {
    id: 1202,
    title: 'পবিত্র ফাতেহা-ই-ইয়াজদাহম ২৩ সেপ্টেম্বর',
    slug: 'fateha-e-yazdaham-september-23',
    summary: 'হজরত আবদুল কাদের জিলানী (রহ.)-এর পুণ্যস্মৃতি ও জীবনাদর্শ স্মরণে দেশব্যাপী ওয়াজ মাহফিল ও দোয়া অনুষ্ঠান।',
    content: 'ইসলামিক ফাউন্ডেশন বিস্তারিত কর্মসূচি ঘোষণা করেছে।',
    category_id: 10,
    category_name_bn: 'ইসলাম',
    category_slug: 'islam',
    reporter_id: 2,
    image: 'https://picsum.photos/seed/islamicyazdaham/400/250',
    views: 17200,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: false,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T08:00:00.000Z',
    created_at: '2026-09-12T07:50:00.000Z',
  },
  {
    id: 1203,
    title: 'গুলশানে কার্যক্রম নিষিদ্ধ আ.লীগের মিছিল, ২৪ আসামি ১০ দিনের রিমান্ডে',
    slug: 'gulshan-banned-procession-24-remanded',
    summary: 'রাজধানীতে অনুমতি ছাড়া ঝটিকা মিছিল ও নাশকতার চেষ্টার অভিযোগে আদালত রিমান্ড আবেদন মঞ্জুর করেছে।',
    content: 'মামলার তদন্ত কর্মকর্তা জানান, নেপথ্যের অর্থদাতাদের চিহ্নিত করতে আসামিদের জিজ্ঞাসাবাদ চলছে।',
    category_id: 15,
    category_name_bn: 'আইন ও আদালত',
    category_slug: 'law',
    reporter_id: 1,
    image: 'https://picsum.photos/seed/courtpolice/400/250',
    views: 38400,
    is_lead: false,
    is_sub_lead: false,
    is_breaking: true,
    is_special: false,
    status: 'published',
    published_at: '2026-09-12T07:40:00.000Z',
    created_at: '2026-09-12T07:30:00.000Z',
  },
];

export const INITIAL_ADS: AdUnit[] = [
  {
    id: 1,
    title: 'Fast wash 5 in 1 Benefits (Kohinoor Chemical)',
    slot: 'top_header',
    type: 'image',
    image_url: 'https://picsum.photos/seed/fastwashad/1200/90',
    redirect_url: 'https://matribhumitv.com',
    impressions: 54000,
    clicks: 1240,
    status: 'active',
  },
  {
    id: 2,
    title: 'ICCB Book Your Event Now Hotline: 01969-999866',
    slot: 'lead_top_iccb',
    type: 'image',
    image_url: 'https://picsum.photos/seed/iccbeventad/970/90',
    redirect_url: 'https://matribhumitv.com',
    impressions: 48000,
    clicks: 980,
    status: 'active',
  },
  {
    id: 3,
    title: 'সিলন ফ্যামিলি ব্লেন্ড চা (Seylon Family Blend)',
    slot: 'sidebar_ceylon',
    type: 'image',
    image_url: 'https://picsum.photos/seed/ceylonteaad/320/250',
    redirect_url: 'https://matribhumitv.com',
    impressions: 32000,
    clicks: 760,
    status: 'active',
  },
  {
    id: 4,
    title: 'ACI Pure Salt - অতুলনীয় বিশুদ্ধতা',
    slot: 'sidebar_aci',
    type: 'image',
    image_url: 'https://picsum.photos/seed/acisaltad/320/250',
    redirect_url: 'https://matribhumitv.com',
    impressions: 29000,
    clicks: 650,
    status: 'active',
  },
  {
    id: 5,
    title: 'মিনিস্টার এসি - মাত্র ৩৯৯৯ টাকায় এসি মাসিক কিস্তিতে',
    slot: 'sidebar_minister',
    type: 'image',
    image_url: 'https://picsum.photos/seed/ministeracad/320/120',
    redirect_url: 'https://matribhumitv.com',
    impressions: 31000,
    clicks: 810,
    status: 'active',
  },
  {
    id: 6,
    title: 'Glow & Lovely Skin Brightening Cream',
    slot: 'sidebar_glow',
    type: 'image',
    image_url: 'https://picsum.photos/seed/glowlovelyad/320/250',
    redirect_url: 'https://matribhumitv.com',
    impressions: 26000,
    clicks: 540,
    status: 'active',
  },
  {
    id: 7,
    title: 'বসুন্ধরা গ্রুপ - দেশের বৃহত্তম গেইটেড ও স্মার্ট সিটি বসুন্ধরা',
    slot: 'between_special_housing',
    type: 'image',
    image_url: 'https://picsum.photos/seed/bashundharacityad/970/100',
    redirect_url: 'https://matribhumitv.com',
    impressions: 41000,
    clicks: 1100,
    status: 'active',
  },
  {
    id: 8,
    title: 'বসুন্ধরা টিস্যু - অশুদ্ধতার বিরুদ্ধে এক বিন্দুও ছাড় নয়!',
    slot: 'between_economy_tissue',
    type: 'image',
    image_url: 'https://picsum.photos/seed/bashundharatissuead/970/100',
    redirect_url: 'https://matribhumitv.com',
    impressions: 38000,
    clicks: 890,
    status: 'active',
  },
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  site_name: 'মাতৃভূমি টিভি',
  site_slogan: 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা ও গণমানুষের কণ্ঠস্বর',
  publisher_name: 'আল-আমীন সানা',
  editor_name: 'মো: রায়ান',
  news_editor_name: 'মিরাজ হাওলাদার',
  email: 'matrivumitvar@gmail.com',
  phone: '01913449997',
  address: 'খুলনা, কয়রা, বাংলাদেশ',
  site_url: 'https://matrivumi.tv',
  copyright_text: 'কপিরাইট © ২০২৬ মাতৃভূমি টিভি (matrivumi.tv) | সর্বস্বত্ব সংরক্ষিত।',
  adsense_client_id: 'ca-pub-811400024240001',
  adsense_enabled: true,
  live_stream_url: 'https://www.youtube.com/embed/jfKfPfyJRdk',
  live_stream_title: 'মাতৃভূমি টিভি লাইভ সম্প্রচার - বিশেষ সংবাদ ও টকশো',
  live_stream_active: true,
  primary_color: '#DC2626',
  font_family: 'serif',
  header_style: 'classic',
  show_top_ticker: true,
  show_breaking_bar: true,
  enable_live_section: true,
  enable_lead_section: true,
  enable_bangla_special: true,
  enable_category_grid: true,
  enable_three_column: true,
  enable_lifestyle_photo: true,
  enable_video_gallery: true,
  enable_more_news: true,
};

// Helper to sync posts with localStorage and notify components
function syncPostsStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_posts', JSON.stringify(memoryPosts));
      window.dispatchEvent(new Event('matribhumi_posts_changed'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.warn('LocalStorage sync warning (quota exceeded or storage error):', e);
      try {
        // Fallback: compress images or store latest 50 posts if quota exceeded
        const compactPosts = memoryPosts.slice(0, 50).map(p => ({
          ...p,
          image: p.image && p.image.length > 50000 ? 'https://picsum.photos/seed/' + p.id + '/800/450' : p.image
        }));
        localStorage.setItem('matribhumi_posts', JSON.stringify(compactPosts));
        window.dispatchEvent(new Event('matribhumi_posts_changed'));
        window.dispatchEvent(new Event('storage'));
      } catch (innerErr) {
        console.warn('LocalStorage compact sync fallback error:', innerErr);
        window.dispatchEvent(new Event('matribhumi_posts_changed'));
      }
    }
  }
}

// Initial in-memory state starts cleanly with INITIAL constants for SSR & client hydration parity
let memoryPosts: Post[] = [...INITIAL_POSTS];
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memorySubcategories: Subcategory[] = [...INITIAL_SUBCATEGORIES];
let memoryAds: AdUnit[] = [...INITIAL_ADS];
let memorySiteConfig: SiteConfig = { ...INITIAL_SITE_CONFIG };
let memoryUsers: UserAccount[] = [...INITIAL_USERS];

// Function to load any user modifications from localStorage safely after hydration
export function loadStoredData(): boolean {
  if (typeof window === 'undefined') return false;
  let hasChanges = false;
  try {
    const storedPosts = localStorage.getItem('matribhumi_posts');
    if (storedPosts) {
      const parsed = JSON.parse(storedPosts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryPosts = parsed;
        hasChanges = true;
      }
    }
    const storedCats = localStorage.getItem('matribhumi_categories');
    if (storedCats) {
      const parsed = JSON.parse(storedCats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCategories = parsed;
        hasChanges = true;
      }
    }
    const storedSubs = localStorage.getItem('matribhumi_subcategories');
    if (storedSubs) {
      const parsed = JSON.parse(storedSubs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySubcategories = parsed;
        hasChanges = true;
      }
    }
    const storedAds = localStorage.getItem('matribhumi_ads');
    if (storedAds) {
      const parsed = JSON.parse(storedAds);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryAds = parsed;
        hasChanges = true;
      }
    }
    const storedConfig = localStorage.getItem('matribhumi_site_config');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      if (parsed && typeof parsed === 'object') {
        memorySiteConfig = { ...INITIAL_SITE_CONFIG, ...parsed };
        hasChanges = true;
      }
    }
    const storedUsers = localStorage.getItem('matribhumi_users');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed;
        hasChanges = true;
      }
    }
  } catch (e) {
    console.warn('LocalStorage load stored data warning:', e);
  }
  return hasChanges;
}

export function syncCategoriesStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_categories', JSON.stringify(memoryCategories));
      window.dispatchEvent(new Event('matribhumi_data_changed'));
    } catch (e) {
      console.warn('LocalStorage categories write warning:', e);
    }
  }
}

export function syncSubcategoriesStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_subcategories', JSON.stringify(memorySubcategories));
      window.dispatchEvent(new Event('matribhumi_data_changed'));
    } catch (e) {
      console.warn('LocalStorage subcategories write warning:', e);
    }
  }
}

export function syncAdsStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_ads', JSON.stringify(memoryAds));
      window.dispatchEvent(new Event('matribhumi_data_changed'));
    } catch (e) {
      console.warn('LocalStorage ads write warning:', e);
    }
  }
}

export function syncSiteConfigStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_site_config', JSON.stringify(memorySiteConfig));
      window.dispatchEvent(new Event('matribhumi_data_changed'));
    } catch (e) {
      console.warn('LocalStorage site config write warning:', e);
    }
  }
}

export function syncUsersStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('matribhumi_users', JSON.stringify(memoryUsers));
      window.dispatchEvent(new Event('matribhumi_data_changed'));
    } catch (e) {
      console.warn('LocalStorage users write warning:', e);
    }
  }
}

export function getSubcategories(categoryId?: number): Subcategory[] {
  if (categoryId !== undefined && categoryId !== null && !isNaN(Number(categoryId))) {
    return memorySubcategories.filter((s) => s.category_id === Number(categoryId));
  }
  return memorySubcategories;
}

export function getSubcategoryBySlug(slug: string): Subcategory | undefined {
  return memorySubcategories.find((s) => s.slug === slug);
}

export function addSubcategory(newSub: Partial<Subcategory>) {
  const sub: Subcategory = {
    id: memorySubcategories.length ? Math.max(...memorySubcategories.map((s) => s.id)) + 1 : 1,
    category_id: Number(newSub.category_id) || 1,
    name_bn: newSub.name_bn || 'নতুন সাব-ক্যাটাগরি',
    name_en: newSub.name_en || 'New Subcategory',
    slug: newSub.slug || `sub-${Date.now()}`,
    order_index: memorySubcategories.length + 1,
  };
  memorySubcategories.push(sub);
  syncSubcategoriesStorage();
  return sub;
}

export function updateSubcategory(id: number, updated: Partial<Subcategory>) {
  const idx = memorySubcategories.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memorySubcategories[idx] = { ...memorySubcategories[idx], ...updated };
    syncSubcategoriesStorage();
    return memorySubcategories[idx];
  }
  return null;
}

export function deleteSubcategory(id: number) {
  memorySubcategories = memorySubcategories.filter((s) => s.id !== id);
  syncSubcategoriesStorage();
}

export function getPostBySlug(slugOrId: string | number): Post | undefined {
  if (typeof slugOrId === 'number' || !isNaN(Number(slugOrId))) {
    return memoryPosts.find((p) => p.id === Number(slugOrId));
  }
  return memoryPosts.find((p) => p.slug === slugOrId);
}

export function getCategories() {
  return memoryCategories;
}

export function getAds() {
  return memoryAds;
}

export function getSiteConfig() {
  return memorySiteConfig;
}

export function updateSiteConfig(newConfig: Partial<SiteConfig>) {
  memorySiteConfig = { ...memorySiteConfig, ...newConfig };
  syncSiteConfigStorage();
  return memorySiteConfig;
}

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    post_id: 101,
    user_name: 'আব্দুর রহমান',
    comment: 'জনস্বার্থে এমন উদ্যোগ প্রশংসনীয়। দ্রুত বাস্তবায়ন প্রত্যাশা করছি।',
    created_at: '2026-09-12T09:40:00.000Z',
  },
  {
    id: 2,
    post_id: 104,
    user_name: 'তানভীর হাসান',
    comment: 'বাংলাদেশ দলের অসাধারণ জয়! স্পিনারদের পারফরম্যান্স ছিল দুর্দান্ত।',
    created_at: '2026-09-12T08:45:00.000Z',
  },
];

export function getPosts(filter?: {
  category_slug?: string;
  category_id?: number;
  subcategory_slug?: string;
  subcategory_id?: number;
  tag_slug?: string;
  search?: string;
  include_pending?: boolean;
}) {
  let list = filter?.include_pending 
    ? [...memoryPosts] 
    : memoryPosts.filter(p => p.approval_status === 'approved' || !p.approval_status || p.status === 'published');
  
  if (filter?.category_slug) {
    const slug = filter.category_slug.toLowerCase();
    if (slug === 'latest' || slug === 'all' || slug === 'latest-news') {
      // Latest news: return all published posts sorted by publication date
      list = [...list].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } else if (slug === 'special') {
      list = list.filter((p) => p.is_special || p.category_slug === 'special');
    } else if (slug === 'video') {
      list = list.filter((p) => Boolean(p.video_url) || p.category_slug === 'video');
    } else if (slug === 'expatriate') {
      const matched = list.filter((p) => p.category_slug === 'expatriate' || p.title.includes('প্রবাস') || p.summary.includes('প্রবাস') || p.content.includes('প্রবাস') || p.title.includes('বিদেশে') || p.summary.includes('শ্রমিক'));
      list = matched.length > 0 ? matched : list.filter((p) => p.category_slug === 'international' || p.category_slug === 'national');
    } else if (slug === 'opinion') {
      const matched = list.filter((p) => p.category_slug === 'opinion' || p.title.includes('মতামত') || p.summary.includes('মতামত') || p.title.includes('কলাম') || p.summary.includes('কলাম'));
      list = matched.length > 0 ? matched : list.filter((p) => p.category_slug === 'features' || p.category_slug === 'national');
    } else {
      const directMatch = list.filter((p) => p.category_slug === slug);
      if (directMatch.length > 0) {
        list = directMatch;
      } else {
        // Fallback matching by category name or partial title match if custom categories exist
        const catObj = memoryCategories.find((c) => c.slug === slug);
        if (catObj) {
          list = list.filter((p) => p.category_id === catObj.id || p.category_name_bn === catObj.name_bn || p.title.includes(catObj.name_bn));
        }
      }
    }
  }
  if (filter?.category_id) {
    list = list.filter((p) => p.category_id === Number(filter.category_id));
  }
  if (filter?.subcategory_slug) {
    list = list.filter((p) => p.subcategory_slug === filter.subcategory_slug);
  }
  if (filter?.subcategory_id) {
    list = list.filter((p) => p.subcategory_id === Number(filter.subcategory_id));
  }
  if (filter?.tag_slug) {
    const tag = INITIAL_TAGS.find((t) => t.slug === filter.tag_slug);
    if (tag) {
      list = list.filter((p) => p.tags?.includes(tag.name_bn) || p.title.includes(tag.name_bn));
    }
  }
  if (filter?.search) {
    const query = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
    );
  }
  
  // Sort list by published_at descending so that newly added/edited posts always appear first on the homepage and lists
  list = [...list].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  
  return list;
}

export function approvePost(id: number) {
  const post = memoryPosts.find(p => p.id === id);
  if (post) {
    post.approval_status = 'approved';
    post.status = 'published';
    syncPostsStorage();
  }
  return post;
}

export function rejectPost(id: number) {
  const post = memoryPosts.find(p => p.id === id);
  if (post) {
    post.approval_status = 'rejected';
    syncPostsStorage();
  }
  return post;
}

export function getUsers(): UserAccount[] {
  return [...memoryUsers];
}

export function getUserById(id: number): UserAccount | undefined {
  return memoryUsers.find((u) => u.id === id);
}

export function getReporterAvatar(reporterNameOrId?: string | number, customAvatar?: string): string {
  if (customAvatar && customAvatar.trim()) return customAvatar;
  
  if (reporterNameOrId !== undefined && reporterNameOrId !== null) {
    if (typeof reporterNameOrId === 'number') {
      const user = memoryUsers.find(u => u.id === reporterNameOrId);
      if (user?.avatar) return user.avatar;
    } else if (typeof reporterNameOrId === 'string') {
      const user = memoryUsers.find(u => u.name.trim().toLowerCase() === reporterNameOrId.trim().toLowerCase());
      if (user?.avatar) return user.avatar;
    }
  }

  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
}

export function getReporterInfo(reporterNameOrId?: string | number, customAvatar?: string, customDesignation?: string) {
  let matchedUser: UserAccount | undefined;
  if (reporterNameOrId !== undefined && reporterNameOrId !== null) {
    if (typeof reporterNameOrId === 'number') {
      matchedUser = memoryUsers.find(u => u.id === reporterNameOrId);
    } else if (typeof reporterNameOrId === 'string') {
      matchedUser = memoryUsers.find(u => u.name.trim().toLowerCase() === reporterNameOrId.trim().toLowerCase());
    }
  }

  const name = matchedUser ? matchedUser.name : (typeof reporterNameOrId === 'string' && reporterNameOrId ? reporterNameOrId : 'বার্তা কক্ষ (News Desk)');
  const avatar = customAvatar || matchedUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  const designation = customDesignation || matchedUser?.designation || (matchedUser?.role === 'Admin' ? 'প্রধান সম্পাদক' : matchedUser?.role === 'Editor' ? 'বার্তা সম্পাদক' : 'বিশেষ প্রতিনিধি');
  const role = matchedUser?.role || 'Reporter';

  return {
    id: matchedUser ? matchedUser.id : 1,
    name,
    avatar,
    designation,
    role,
  };
}

export function addUser(newUser: Partial<UserAccount>): UserAccount {
  const generatedUsername = newUser.username || (newUser.name ? newUser.name.toLowerCase().replace(/[^a-z0-9]/g, '') : `user${Date.now()}`);
  const user: UserAccount = {
    id: memoryUsers.length ? Math.max(...memoryUsers.map((u) => u.id)) + 1 : 1,
    name: newUser.name || 'নতুন ইউজার',
    username: generatedUsername || `user${Date.now()}`,
    password: newUser.password || 'reporter123',
    email: newUser.email || `${generatedUsername}@matribhumitv.com`,
    phone: newUser.phone || '',
    role: newUser.role || 'Reporter',
    status: newUser.status || 'active',
    avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    designation: newUser.designation || (newUser.role === 'Admin' ? 'প্রধান প্রশাসক' : newUser.role === 'Editor' ? 'সহকারী সম্পাদক' : 'স্টাফ রিপোর্টার'),
    bio: newUser.bio || '',
    created_at: new Date().toISOString(),
    allowed_categories: newUser.allowed_categories || [],
    permissions: newUser.permissions || ['post', 'edit', 'update'],
  };
  memoryUsers.unshift(user);
  syncUsersStorage();
  return user;
}

export function updateUser(id: number, updated: Partial<UserAccount>): UserAccount | null {
  const idx = memoryUsers.findIndex((u) => u.id === id);
  if (idx !== -1) {
    memoryUsers[idx] = { 
      ...memoryUsers[idx], 
      ...updated,
      avatar: updated.avatar !== undefined && updated.avatar !== '' ? updated.avatar : memoryUsers[idx].avatar,
      username: updated.username !== undefined ? updated.username : memoryUsers[idx].username,
      password: updated.password !== undefined ? updated.password : memoryUsers[idx].password,
      allowed_categories: updated.allowed_categories !== undefined ? updated.allowed_categories : memoryUsers[idx].allowed_categories,
      permissions: updated.permissions !== undefined ? updated.permissions : memoryUsers[idx].permissions,
      designation: updated.designation !== undefined ? updated.designation : memoryUsers[idx].designation,
      bio: updated.bio !== undefined ? updated.bio : memoryUsers[idx].bio,
    };
    syncUsersStorage();
    return memoryUsers[idx];
  }
  return null;
}

export function authenticateUser(loginId: string, passwordInput: string): { success: boolean; user?: UserAccount; error?: string } {
  if (typeof window !== 'undefined') {
    loadStoredData();
  }
  const cleanId = (loginId || '').trim();
  const cleanPass = (passwordInput || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'ইউজার আইডি এবং পাসওয়ার্ড উভয়ই পূরণ করুন!' };
  }

  // 1. Check existing users in database (by username, email, name or phone)
  const matchedUser = memoryUsers.find((u) => {
    const matchUsername = u.username && u.username.toLowerCase() === cleanId.toLowerCase();
    const matchEmail = u.email && u.email.toLowerCase() === cleanId.toLowerCase();
    const matchPhone = u.phone && u.phone.trim() === cleanId;
    const matchName = u.name && u.name.trim().toLowerCase() === cleanId.toLowerCase();
    return matchUsername || matchEmail || matchPhone || matchName;
  });

  if (matchedUser) {
    if (matchedUser.status === 'suspended') {
      return { success: false, error: 'এই অ্যাকাউন্টটি বর্তমানে স্থগিত (Suspended) রয়েছে। প্রশাসকের সাথে যোগাযোগ করুন।' };
    }
    const expectedPassword = matchedUser.password || 'reporter123';
    // Match exact user password or master admin bypass
    if (
      cleanPass === expectedPassword || 
      cleanPass === 'Matribhumi@2026' || 
      cleanPass === 'Admin@Matribhumi2026' || 
      cleanPass === 'tv_admin_2026'
    ) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('matribhumi_admin_logged', 'true');
        localStorage.setItem('matribhumi_admin_role', matchedUser.role.toLowerCase());
        localStorage.setItem('matribhumi_admin_name', matchedUser.name);
        localStorage.setItem('matribhumi_admin_id', String(matchedUser.id));
        localStorage.setItem('matribhumi_admin_email', matchedUser.email);
        localStorage.setItem('matribhumi_admin_user', JSON.stringify(matchedUser));
      }
      return { success: true, user: matchedUser };
    } else {
      return { success: false, error: 'পাসওয়ার্ডটি সঠিক নয়! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।' };
    }
  }

  // 2. Master Admin and Editor direct fallback validation
  const isAdminId = cleanId === 'admin_matribhumi' || cleanId === 'matribhumi_admin' || cleanId === 'admin' || cleanId.toLowerCase() === 'matrivumitvar@gmail.com';
  const isAdminPass = cleanPass === 'Matribhumi@2026' || cleanPass === 'Admin@Matribhumi2026' || cleanPass === 'tv_admin_2026' || cleanPass === 'admin123';

  if (isAdminId && isAdminPass) {
    const adminUser = memoryUsers.find(u => u.role === 'Admin') || {
      id: 1,
      name: 'আল-আমীন সানা',
      username: 'admin_matribhumi',
      email: 'matrivumitvar@gmail.com',
      role: 'Admin',
      status: 'active',
      designation: 'প্রধান প্রশাসক ও প্রকাশক',
      created_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('matribhumi_admin_logged', 'true');
      localStorage.setItem('matribhumi_admin_role', 'admin');
      localStorage.setItem('matribhumi_admin_name', adminUser.name);
      localStorage.setItem('matribhumi_admin_id', String(adminUser.id));
      localStorage.setItem('matribhumi_admin_user', JSON.stringify(adminUser));
    }
    return { success: true, user: adminUser as UserAccount };
  }

  const isEditorId = cleanId === 'editor_matribhumi' || cleanId === 'matribhumi_editor' || cleanId === 'editor' || cleanId.toLowerCase() === 'editor@matrivumi.tv';
  const isEditorPass = cleanPass === 'Editor@2026' || cleanPass === 'tv_editor_2026' || cleanPass === 'editor123';

  if (isEditorId && isEditorPass) {
    const editorUser = memoryUsers.find(u => u.role === 'Editor') || {
      id: 2,
      name: 'মো: রায়ান',
      username: 'editor_matribhumi',
      email: 'editor@matrivumi.tv',
      role: 'Editor',
      status: 'active',
      designation: 'বার্তা সম্পাদক',
      created_at: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('matribhumi_admin_logged', 'true');
      localStorage.setItem('matribhumi_admin_role', 'editor');
      localStorage.setItem('matribhumi_admin_name', editorUser.name);
      localStorage.setItem('matribhumi_admin_id', String(editorUser.id));
      localStorage.setItem('matribhumi_admin_user', JSON.stringify(editorUser));
    }
    return { success: true, user: editorUser as UserAccount };
  }

  return { success: false, error: 'ভুল ইউজার আইডি বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।' };
}

export function updateUserStatus(id: number, status: 'active' | 'suspended'): UserAccount | null {
  const user = memoryUsers.find((u) => u.id === id);
  if (user) {
    user.status = status;
    syncUsersStorage();
    return user;
  }
  return null;
}

export function deleteUser(id: number) {
  memoryUsers = memoryUsers.filter((u) => u.id !== id);
  syncUsersStorage();
}

export function addPost(newPost: Partial<Post>) {
  const category = memoryCategories.find(
    (c) => Number(c.id) === Number(newPost.category_id) || 
           c.slug === newPost.category_slug || 
           c.name_bn === newPost.category_name_bn
  ) || memoryCategories.find((c) => Number(c.id) === Number(newPost.category_id)) || memoryCategories[0] || {
    id: 1,
    name_bn: 'জাতীয়',
    name_en: 'National',
    slug: 'national',
    color_code: '#DC2626',
    order_index: 1,
  };

  let subcategory = null;
  if (newPost.subcategory_id) {
    subcategory = memorySubcategories.find((s) => Number(s.id) === Number(newPost.subcategory_id));
  } else if (newPost.subcategory_slug) {
    subcategory = memorySubcategories.find((s) => s.slug === newPost.subcategory_slug);
  }

  // Find reporter info
  const repInfo = getReporterInfo(newPost.reporter_id || newPost.reporter_name, newPost.reporter_avatar, newPost.reporter_designation);

  const newId = memoryPosts.length ? Math.max(...memoryPosts.map((p) => p.id || 0)) + 1 : 1;

  // If this new post is marked as main lead, unset other lead posts so this one cleanly leads
  if (newPost.is_lead) {
    memoryPosts.forEach((p) => {
      p.is_lead = false;
    });
  }

  const post: Post = {
    id: newId,
    title: newPost.title || 'নতুন সংবাদ শিরোনাম',
    slug: newPost.slug || `news-${Date.now()}`,
    summary: newPost.summary || newPost.title || '',
    content: newPost.content || newPost.summary || newPost.title || '',
    category_id: category.id,
    category_name_bn: category.name_bn,
    category_slug: category.slug,
    category_color: category.color_code || '#DC2626',
    subcategory_id: subcategory ? subcategory.id : (newPost.subcategory_id ? Number(newPost.subcategory_id) : null),
    subcategory_name_bn: subcategory ? subcategory.name_bn : (newPost.subcategory_name_bn || undefined),
    subcategory_slug: subcategory ? subcategory.slug : (newPost.subcategory_slug || undefined),
    reporter_id: repInfo.id,
    reporter_name: newPost.reporter_name || repInfo.name,
    reporter_avatar: newPost.reporter_avatar || repInfo.avatar,
    reporter_designation: newPost.reporter_designation || repInfo.designation,
    image: newPost.image && newPost.image.trim() !== '' ? newPost.image : 'https://picsum.photos/seed/newsauto/800/450',
    image_caption: newPost.image_caption || '',
    views: 1,
    is_lead: !!newPost.is_lead,
    is_sub_lead: !!newPost.is_sub_lead,
    is_breaking: !!newPost.is_breaking,
    is_special: !!newPost.is_special,
    video_url: newPost.video_url || null,
    status: newPost.status || 'published',
    approval_status: newPost.approval_status || 'approved',
    published_at: newPost.published_at || new Date().toISOString(),
    created_at: newPost.created_at || new Date().toISOString(),
    tags: newPost.tags || [],
  };

  memoryPosts.unshift(post);
  syncPostsStorage();
  return post;
}

export function updatePost(id: number, updated: Partial<Post>) {
  const idx = memoryPosts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    if (updated.is_lead) {
      memoryPosts.forEach((p) => {
        if (p.id !== id) p.is_lead = false;
      });
    }
    let catUpdates = {};
    if (updated.category_id) {
      const foundCat = memoryCategories.find((c) => Number(c.id) === Number(updated.category_id));
      if (foundCat) {
        catUpdates = {
          category_id: foundCat.id,
          category_name_bn: foundCat.name_bn,
          category_slug: foundCat.slug,
          category_color: foundCat.color_code,
        };
      }
    }
    let subcatUpdates = {};
    if (updated.subcategory_id !== undefined) {
      const foundSub = memorySubcategories.find((s) => Number(s.id) === Number(updated.subcategory_id));
      if (foundSub) {
        subcatUpdates = {
          subcategory_id: foundSub.id,
          subcategory_name_bn: foundSub.name_bn,
          subcategory_slug: foundSub.slug,
        };
      } else {
        subcatUpdates = {
          subcategory_id: null,
          subcategory_name_bn: undefined,
          subcategory_slug: undefined,
        };
      }
    }

    let repUpdates = {};
    if (updated.reporter_id || updated.reporter_name || updated.reporter_avatar || updated.reporter_designation) {
      const repInfo = getReporterInfo(
        updated.reporter_id || updated.reporter_name || memoryPosts[idx].reporter_id,
        updated.reporter_avatar || memoryPosts[idx].reporter_avatar,
        updated.reporter_designation || memoryPosts[idx].reporter_designation
      );
      repUpdates = {
        reporter_id: repInfo.id,
        reporter_name: updated.reporter_name || repInfo.name,
        reporter_avatar: updated.reporter_avatar || repInfo.avatar,
        reporter_designation: updated.reporter_designation || repInfo.designation,
      };
    }

    memoryPosts[idx] = { 
      ...memoryPosts[idx], 
      ...updated,
      image: (updated.image !== undefined && updated.image !== '') ? updated.image : memoryPosts[idx].image,
      ...catUpdates,
      ...subcatUpdates,
      ...repUpdates,
    };
    syncPostsStorage();
    return memoryPosts[idx];
  }
  return null;
}

export function deletePost(id: number) {
  memoryPosts = memoryPosts.filter((p) => p.id !== id);
  syncPostsStorage();
}

export function bulkDeletePosts(ids: number[]) {
  const idSet = new Set(ids);
  memoryPosts = memoryPosts.filter((p) => !idSet.has(p.id));
  syncPostsStorage();
}

export function bulkApprovePosts(ids: number[]) {
  const idSet = new Set(ids);
  memoryPosts.forEach((p) => {
    if (idSet.has(p.id)) {
      p.approval_status = 'approved';
      p.status = 'published';
    }
  });
  syncPostsStorage();
}

export function bulkRejectPosts(ids: number[]) {
  const idSet = new Set(ids);
  memoryPosts.forEach((p) => {
    if (idSet.has(p.id)) {
      p.approval_status = 'rejected';
    }
  });
  syncPostsStorage();
}

export function bulkUpdatePostStatus(ids: number[], status: 'approved' | 'rejected' | 'pending') {
  const idSet = new Set(ids);
  memoryPosts.forEach((p) => {
    if (idSet.has(p.id)) {
      p.approval_status = status;
      if (status === 'approved') {
        p.status = 'published';
      }
    }
  });
  syncPostsStorage();
}

export function getReporterPostStats(userIdOrName: number | string) {
  let matchedPosts = [];
  if (typeof userIdOrName === 'number') {
    matchedPosts = memoryPosts.filter(
      (p) => p.reporter_id === userIdOrName || (p.reporter_name && memoryUsers.find((u) => u.id === userIdOrName)?.name.trim().toLowerCase() === p.reporter_name.trim().toLowerCase())
    );
  } else {
    const query = String(userIdOrName).trim().toLowerCase();
    matchedPosts = memoryPosts.filter((p) => p.reporter_name && p.reporter_name.trim().toLowerCase() === query);
  }

  const total = matchedPosts.length;
  const approved = matchedPosts.filter((p) => p.approval_status === 'approved' || !p.approval_status).length;
  const pending = matchedPosts.filter((p) => p.approval_status === 'pending').length;

  return { total, approved, published: approved, pending };
}

export function addCategory(newCat: Partial<Category>) {
  const cat: Category = {
    id: memoryCategories.length ? Math.max(...memoryCategories.map((c) => c.id)) + 1 : 1,
    name_bn: newCat.name_bn || 'নতুন বিভাগ',
    name_en: newCat.name_en || 'New Category',
    slug: newCat.slug || `category-${Date.now()}`,
    color_code: newCat.color_code || '#DC2626',
    order_index: memoryCategories.length + 1,
  };
  memoryCategories.push(cat);
  syncCategoriesStorage();
  return cat;
}

export function updateCategory(id: number, updated: Partial<Category>) {
  const idx = memoryCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    memoryCategories[idx] = { ...memoryCategories[idx], ...updated };
    syncCategoriesStorage();
    return memoryCategories[idx];
  }
  return null;
}

export function deleteCategory(id: number) {
  memoryCategories = memoryCategories.filter((c) => c.id !== id);
  syncCategoriesStorage();
}

export function deleteAd(id: number) {
  memoryAds = memoryAds.filter((a) => a.id !== id);
  syncAdsStorage();
}

export function updatePostStatus(id: number, status: 'published' | 'draft' | 'archived', approval_status?: 'pending' | 'approved' | 'rejected') {
  const post = memoryPosts.find(p => p.id === id);
  if (post) {
    post.status = status;
    if (approval_status) {
      post.approval_status = approval_status;
    }
    syncPostsStorage();
  }
  return post;
}

export function updateAd(id: number, updated: Partial<AdUnit>) {
  const idx = memoryAds.findIndex((a) => a.id === id);
  if (idx !== -1) {
    memoryAds[idx] = { ...memoryAds[idx], ...updated };
    syncAdsStorage();
    return memoryAds[idx];
  }
  return null;
}

export function addAd(newAd: Partial<AdUnit>) {
  const ad: AdUnit = {
    id: memoryAds.length ? Math.max(...memoryAds.map((a) => a.id)) + 1 : 1,
    title: newAd.title || 'New Ad Banner',
    slot: newAd.slot || 'top_header',
    type: newAd.type || 'image',
    image_url: newAd.image_url || 'https://picsum.photos/seed/adbanner/970/90',
    redirect_url: newAd.redirect_url || 'https://banglanews24.com',
    ad_code: newAd.ad_code || '',
    impressions: 1,
    clicks: 0,
    status: newAd.status || 'active',
  };
  memoryAds.unshift(ad);
  syncAdsStorage();
  return ad;
}

export function trackAdClick(id: number) {
  const ad = memoryAds.find((a) => a.id === id);
  if (ad) {
    ad.clicks += 1;
  }
}
