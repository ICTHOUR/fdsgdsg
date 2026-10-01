-- ============================================================================
-- Banglanews24 Complete MySQL Database Schema
-- Optimized for MySQL 8.0+ / MariaDB 10.4+
-- Encoding: UTF-8 Unicode (utf8mb4 / utf8mb4_unicode_ci for flawless Bangla text)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table structure for `users`
-- Roles: admin (full access), reporter (write/manage own posts), viewer (commenting)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'reporter', 'viewer') NOT NULL DEFAULT 'reporter',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `designation` VARCHAR(100) DEFAULT 'Staff Reporter',
  `bio` TEXT DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `status` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `categories`
-- Standard Banglanews24 primary categories
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_bn` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `color_code` VARCHAR(20) DEFAULT '#DC2626',
  `order_index` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_in_menu` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_categories_slug` (`slug`),
  INDEX `idx_categories_order` (`order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `subcategories`
-- Sub-sections under primary categories (e.g. Cricket under Sports)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `subcategories`;
CREATE TABLE `subcategories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `name_bn` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `order_index` INT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_subcategories_category` (`category_id`),
  INDEX `idx_subcategories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `posts` / `news`
-- Core news content table with flags: lead, breaking, special, video
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` VARCHAR(1000) DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `subcategory_id` INT UNSIGNED DEFAULT NULL,
  `reporter_id` INT UNSIGNED NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `image_caption` VARCHAR(500) DEFAULT NULL,
  `video_url` VARCHAR(500) DEFAULT NULL,
  `views` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `is_lead` TINYINT(1) NOT NULL DEFAULT 0,
  `is_sub_lead` TINYINT(1) NOT NULL DEFAULT 0,
  `is_breaking` TINYINT(1) NOT NULL DEFAULT 0,
  `is_special` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
  `published_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_posts_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_posts_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_posts_slug` (`slug`),
  INDEX `idx_posts_category_status` (`category_id`, `status`),
  INDEX `idx_posts_published_at` (`published_at` DESC),
  INDEX `idx_posts_lead` (`is_lead`, `status`, `published_at` DESC),
  INDEX `idx_posts_breaking` (`is_breaking`, `status`, `published_at` DESC),
  INDEX `idx_posts_special` (`is_special`, `status`),
  INDEX `idx_posts_views` (`views` DESC),
  FULLTEXT KEY `ft_posts_search` (`title`, `summary`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `tags`
-- Keywords and trending tags for navigation bar
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_bn` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `is_trending` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tags_trending` (`is_trending`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `post_tags`
-- Many-to-many relationship table between posts and tags
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `post_tags`;
CREATE TABLE `post_tags` (
  `post_id` BIGINT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  CONSTRAINT `fk_post_tags_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_post_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_post_tags_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `ads`
-- Advertisement management (Google AdSense script & Custom Image Banners)
-- Slots: header_banner, sidebar_top, sidebar_bottom, between_sections, in_article, footer_banner
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ads`;
CREATE TABLE `ads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `slot` ENUM('header_banner', 'sidebar_top', 'sidebar_bottom', 'between_sections', 'in_article', 'footer_banner') NOT NULL,
  `type` ENUM('image', 'adsense_code', 'custom_html') NOT NULL DEFAULT 'image',
  `image_url` VARCHAR(500) DEFAULT NULL,
  `redirect_url` VARCHAR(500) DEFAULT NULL,
  `ad_code` TEXT DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  `end_date` DATE DEFAULT NULL,
  `impressions` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `clicks` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'paused', 'expired') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_ads_slot_status` (`slot`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `comments`
-- Reader comments with moderation status
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `author_name` VARCHAR(150) NOT NULL,
  `author_email` VARCHAR(191) NOT NULL,
  `comment` TEXT NOT NULL,
  `status` ENUM('approved', 'pending', 'spam', 'rejected') NOT NULL DEFAULT 'approved',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_comments_post_status` (`post_id`, `status`),
  INDEX `idx_comments_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table structure for `settings`
-- Key-value store for site identity, SEO, contact, and social channels
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key_name` VARCHAR(100) NOT NULL UNIQUE,
  `key_value` TEXT DEFAULT NULL,
  `group_name` VARCHAR(50) NOT NULL DEFAULT 'general',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_settings_key` (`key_name`),
  INDEX `idx_settings_group` (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INITIAL SEED DATA (Banglanews24 Archetype)
-- ============================================================================

-- 1. Insert Default Users (Admin & Reporters)
-- Password for all default accounts is 'Admin@12345' (bcrypt hashed)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `designation`) VALUES
(1, 'প্রধান সম্পাদক (Editor-in-Chief)', 'admin@banglanews24.com', '$2a$10$wN083Z2XGk9O18bTskx23.Gf9HjS4P6eR21BvLqweR9.X1w6K29u2', 'admin', 'Chief Editor'),
(2, 'বিশেষ প্রতিনিধি (Special Correspondent)', 'reporter@banglanews24.com', '$2a$10$wN083Z2XGk9O18bTskx23.Gf9HjS4P6eR21BvLqweR9.X1w6K29u2', 'reporter', 'Senior Staff Reporter'),
(3, 'ক্রীড়া প্রতিবেদক (Sports Desk)', 'sports@banglanews24.com', '$2a$10$wN083Z2XGk9O18bTskx23.Gf9HjS4P6eR21BvLqweR9.X1w6K29u2', 'reporter', 'Sports Editor');

-- 2. Insert Standard Categories
INSERT INTO `categories` (`id`, `name_bn`, `name_en`, `slug`, `order_index`, `color_code`) VALUES
(1, 'জাতীয়', 'National', 'national', 1, '#B91C1C'),
(2, 'রাজনীতি', 'Politics', 'politics', 2, '#1E40AF'),
(3, 'অর্থনীতি', 'Economy', 'economy', 3, '#047857'),
(4, 'আন্তর্জাতিক', 'International', 'international', 4, '#4338CA'),
(5, 'খেলা', 'Sports', 'sports', 5, '#0284C7'),
(6, 'চট্টগ্রাম প্রতিদিন', 'Chattogram', 'chattogram', 6, '#B45309'),
(7, 'সারাদেশ', 'Country', 'country', 7, '#0D9488'),
(8, 'ফিচার', 'Features', 'features', 8, '#7C3AED'),
(9, 'বিনোদন', 'Entertainment', 'entertainment', 9, '#DB2777'),
(10, 'ইসলাম ও জীবন', 'Islam & Life', 'islam', 10, '#15803D'),
(11, 'লাইফস্টাইল', 'Lifestyle', 'lifestyle', 11, '#C026D3'),
(12, 'তথ্যপ্রযুক্তি', 'Tech', 'tech', 12, '#2563EB');

-- 3. Insert Subcategories
INSERT INTO `subcategories` (`id`, `category_id`, `name_bn`, `name_en`, `slug`, `order_index`) VALUES
(1, 5, 'ক্রিকেট', 'Cricket', 'cricket', 1),
(2, 5, 'ফুটবল', 'Football', 'football', 2),
(3, 2, 'সরকার ও প্রশাসন', 'Government', 'government', 1),
(4, 3, 'ব্যাংক ও বীমা', 'Banking', 'banking', 1),
(5, 9, 'ঢালিউড', 'Dhallywood', 'dhallywood', 1),
(6, 12, 'কৃত্রিম বুদ্ধিমত্তা', 'AI & Tech', 'ai-tech', 1);

-- 4. Insert Trending Tags
INSERT INTO `tags` (`id`, `name_bn`, `name_en`, `slug`, `is_trending`) VALUES
(1, 'নির্বাচন ২০২৬', 'Election 2026', 'election-2026', 1),
(2, 'বিশ্বকাপ ক্রিকেট', 'World Cup Cricket', 'world-cup-cricket', 1),
(3, 'মুদ্রাস্ফীতি', 'Inflation', 'inflation', 1),
(4, 'মেট্রোরেল', 'Metro Rail', 'metro-rail', 1),
(5, 'ডিজিটাল বাংলাদেশ', 'Digital Bangladesh', 'digital-bangladesh', 0),
(6, 'চট্টগ্রাম বন্দর', 'Chattogram Port', 'chattogram-port', 1);

-- 5. Insert Sample News Posts
INSERT INTO `posts` (`id`, `title`, `slug`, `summary`, `content`, `category_id`, `subcategory_id`, `reporter_id`, `image`, `views`, `is_lead`, `is_sub_lead`, `is_breaking`, `is_special`, `status`) VALUES
(1, 'দেশের অর্থনৈতিক সমৃদ্ধিতে নতুন মহাপরিকল্পনা ঘোষণা প্রধানমন্ত্রীর', 'economic-masterplan-announced-by-pm', 'জাতীয় প্রবৃদ্ধি বৃদ্ধি এবং কর্মসংস্থান সৃষ্টির লক্ষ্যে ৫ বছর মেয়াদী সমন্বিত রোডম্যাপ উন্মোচন করা হয়েছে।', '<p>প্রধানমন্ত্রী আজ জাতীয় অর্থনৈতিক পরিষদের বৈঠকে দেশের সার্বিক অবকাঠামো ও শিল্প খাতের উন্নয়নে এক যুগান্তকারী মহাপরিকল্পনার রূপরেখা তুলে ধরেন। তিনি বলেন, ডিজিটাল রূপান্তরের পাশাপাশি পরিবেশবান্ধব শিল্পায়নে সরকার বিশেষ গুরুত্ব দিচ্ছে। এতে দেশি-বিদেশি বিনিয়োগকারীদের জন্য শতভাগ প্রণোদনার ব্যবস্থা থাকবে।</p><p>এসময় অর্থমন্ত্রী ও পরিকল্পনা কমিশনের শীর্ষ কর্মকর্তারা উপস্থিত ছিলেন। বিশ্লেষকরা মনে করছেন, এই পরিকল্পনার সঠিক বাস্তবায়ন বাংলাদেশকে উচ্চ মধ্যম আয়ের দেশে উন্নীত করতে সহায়ক ভূমিকা পালন করবে।</p>', 1, 3, 1, 'https://picsum.photos/seed/leadnews24/1200/675', 14250, 1, 0, 1, 1, 'published'),

(2, 'টি-২০ সিরিজে অস্ট্রেলিয়ার বিপক্ষে ঐতিহাসিক জয় বাংলাদেশের', 'bangladesh-historic-win-t20-australia', 'শেষ ওভারের টানটান উত্তেজনায় ২ উইকেটে জয় তুলে নিয়ে সিরিজ নিজেদের করল টাইগাররা।', '<p>মিরপুর শের-ই-বাংলা জাতীয় ক্রিকেট স্টেডিয়ামে অস্ট্রেলিয়ার বিপক্ষে শেষ ওভারের রোমাঞ্চকর লড়াইয়ে দুর্দান্ত জয় পেয়েছে বাংলাদেশ। অলরাউন্ড নৈপুণ্যে ম্যাচসেরা নির্বাচিত হন তরুণ পেস অলরাউন্ডার।</p>', 5, 1, 3, 'https://picsum.photos/seed/cricket24/800/450', 18900, 0, 1, 1, 1, 'published'),

(3, 'চট্টগ্রাম বন্দরে কনটেইনার হ্যান্ডলিংয়ে নতুন রেকর্ড সৃষ্টি', 'chattogram-port-record-container-handling', 'আধুনিক গ্যান্ট্রি ক্রেন স্থাপন ও অটোমেশনের ফলে পণ্য খালাসের সময় ৩০ শতাংশ হ্রাস পেয়েছে।', '<p>চট্টগ্রাম বন্দর কর্তৃপক্ষ জানিয়েছে, বিগত অর্থবছরের তুলনায় এবার কনটেইনার হ্যান্ডলিংয়ে ১০ শতাংশ প্রবৃদ্ধি অর্জিত হয়েছে। নতুন টার্মিনাল চালু হওয়ার ফলে জট পুরোপুরি নিরসন হয়েছে।</p>', 6, NULL, 2, 'https://picsum.photos/seed/portctg/800/450', 7840, 0, 1, 0, 0, 'published'),

(4, 'যুক্তরাষ্ট্রে মধ্যবর্তী নির্বাচনের ফলাফল নিয়ে বিশ্ব রাজনীতিতে তোলপাড়', 'us-midterm-election-global-impact', 'সিনেট ও প্রতিনিধি পরিষদে শক্তির ভারসাম্য বদলে যাওয়ায় বৈশ্বিক কূটনীতিতে নতুন সমীকরণ তৈরি হচ্ছে।', '<p>ওয়াশিংটন থেকে প্রাপ্ত তথ্যে দেখা গেছে, অর্থনৈতিক নীতি ও বৈদেশিক সহযোগিতার ক্ষেত্রে উভয় দলের অবস্থান আন্তর্জাতিক অঙ্গনে বড় প্রভাব ফেলছে।</p>', 4, NULL, 1, 'https://picsum.photos/seed/intnews24/800/450', 9310, 0, 1, 0, 0, 'published'),

(5, 'মূল্যস্ফীতি নিয়ন্ত্রণে বাংলাদেশ ব্যাংকের নতুন মুদ্রানীতি কার্যকর', 'bangladesh-bank-new-monetary-policy', 'সুদের হার সমন্বয় এবং ডলারের তারল্য বজায় রাখতে বিশেষ নজরদারি জোরদার।', '<p>বাংলাদেশ ব্যাংকের গভর্নর জানিয়েছেন, নিত্যপণ্যের বাজার স্থিতিশীল রাখা এবং আমদানি-রপ্তানি ভারসাম্য রক্ষায় কার্যকর পদক্ষেপ নেওয়া হয়েছে।</p>', 3, 4, 2, 'https://picsum.photos/seed/economynews24/800/450', 11400, 0, 1, 0, 1, 'published'),

(6, 'কান চলচ্চিত্র উৎসবে প্রশংসিত বাংলাদেশি তরুণ নির্মাতার নতুন স্বল্পদৈর্ঘ্য চলচ্চিত্র', 'cannes-acclaimed-bangladeshi-short-film', 'আন্তর্জাতিক অঙ্গনে বাংলা চলচ্চিত্রের গৌরবময় সাফল্য নিয়ে প্রতিক্রিয়া জানিয়েছেন বিশিষ্ট সংস্কৃতিজনরা।', '<p>চলচ্চিত্রটির হৃদয়স্পর্শী গল্প ও নিখুঁত চিত্রনাট্য বিচারকদের মন জয় করেছে। খুব শীঘ্রই দেশের প্রেক্ষাগৃহে এটি প্রদর্শিত হবে।</p>', 9, 5, 1, 'https://picsum.photos/seed/cannesfilm/800/450', 5620, 0, 0, 0, 0, 'published');

-- 6. Link Tags to Posts
INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1, 1), (1, 3), (1, 4),
(2, 2),
(3, 6),
(5, 3);

-- 7. Insert Banner Ads & Google AdSense Placeholders
INSERT INTO `ads` (`id`, `title`, `slot`, `type`, `image_url`, `redirect_url`, `ad_code`, `status`) VALUES
(1, 'Header Top Leaderboard', 'header_banner', 'image', 'https://picsum.photos/seed/adbannertop/970/90', 'https://banglanews24.com', NULL, 'active'),
(2, 'Sidebar Top Square Ad', 'sidebar_top', 'image', 'https://picsum.photos/seed/adsquare/300/250', 'https://banglanews24.com', NULL, 'active'),
(3, 'Google AdSense In-Article Unit', 'in_article', 'adsense_code', NULL, NULL, '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><!-- Responsive Ad Unit --><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="1234567890" data-ad-format="auto"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>', 'active'),
(4, 'Section Divider Wide Banner', 'between_sections', 'image', 'https://picsum.photos/seed/adwide/970/120', 'https://banglanews24.com', NULL, 'active');

-- 8. Insert Site Settings
INSERT INTO `settings` (`key_name`, `key_value`, `group_name`) VALUES
('site_name_bn', 'বাংলানিউজ২৪ ডটকম', 'general'),
('site_name_en', 'Banglanews24 Portal', 'general'),
('site_tagline', 'সত্যের সন্ধানে নির্ভীক সাংবাদিকতা | ২৪ ঘণ্টা প্রতি মুহূর্তে', 'general'),
('site_logo', '/logo.png', 'general'),
('contact_email', 'news@banglanews24.com', 'contact'),
('contact_phone', '+880 2 9876543, +880 1700-000000', 'contact'),
('office_address', 'বসুন্ধরা আবাসিক এলাকা, বারিধারা, ঢাকা-১২২৯, বাংলাদেশ', 'contact'),
('social_facebook', 'https://facebook.com/banglanews24', 'social'),
('social_youtube', 'https://youtube.com/banglanews24', 'social'),
('social_twitter', 'https://twitter.com/banglanews24', 'social');

SET FOREIGN_KEY_CHECKS = 1;
