import { INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_USERS, Post, Category, Subcategory, UserAccount, SiteConfig, AdUnit } from './newsData';

function escapeSqlString(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  const escaped = str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `'${escaped}'`;
}

export function generateMySQLDump(
  posts: Post[],
  categories: Category[],
  subcategories: Subcategory[],
  users: UserAccount[],
  siteConfig: SiteConfig,
  adUnits: AdUnit[]
): string {
  const timestamp = new Date().toISOString();

  let sql = `-- ========================================================
-- Matribhumi TV (matribhumitv.com) MySQL Database Dump
-- Generated On: ${timestamp}
-- Compatible with MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- cPanel MySQL / phpMyAdmin Ready
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Table structure for table \`categories\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`name_bn\` VARCHAR(255) NOT NULL,
  \`name_en\` VARCHAR(255) DEFAULT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`color_code\` VARCHAR(50) DEFAULT '#B91C1C',
  \`order_index\` INT(11) DEFAULT 1,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`categories\`
INSERT INTO \`categories\` (\`id\`, \`name_bn\`, \`name_en\`, \`slug\`, \`color_code\`, \`order_index\`) VALUES
`;

  const catValues = (categories.length > 0 ? categories : INITIAL_CATEGORIES).map(
    (c) => `(${c.id}, ${escapeSqlString(c.name_bn)}, ${escapeSqlString(c.name_en)}, ${escapeSqlString(c.slug)}, ${escapeSqlString(c.color_code)}, ${c.order_index})`
  );
  sql += catValues.join(',\n') + ';\n\n';

  sql += `-- --------------------------------------------------------
-- Table structure for table \`subcategories\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`subcategories\`;
CREATE TABLE \`subcategories\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`category_id\` INT(11) NOT NULL,
  \`name_bn\` VARCHAR(255) NOT NULL,
  \`name_en\` VARCHAR(255) DEFAULT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`order_index\` INT(11) DEFAULT 1,
  PRIMARY KEY (\`id\`),
  KEY \`category_id\` (\`category_id\`),
  CONSTRAINT \`fk_subcat_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`subcategories\`
INSERT INTO \`subcategories\` (\`id\`, \`category_id\`, \`name_bn\`, \`name_en\`, \`slug\`, \`order_index\`) VALUES
`;

  const subValues = (subcategories.length > 0 ? subcategories : INITIAL_SUBCATEGORIES).map(
    (s) => `(${s.id}, ${s.category_id}, ${escapeSqlString(s.name_bn)}, ${escapeSqlString(s.name_en)}, ${escapeSqlString(s.slug)}, ${s.order_index})`
  );
  sql += subValues.join(',\n') + ';\n\n';

  sql += `-- --------------------------------------------------------
-- Table structure for table \`users\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(255) NOT NULL,
  \`username\` VARCHAR(100) NOT NULL,
  \`password\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) DEFAULT NULL,
  \`role\` ENUM('Admin', 'Reporter', 'Editor', 'Reader') NOT NULL DEFAULT 'Reporter',
  \`status\` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  \`avatar\` TEXT DEFAULT NULL,
  \`designation\` VARCHAR(255) DEFAULT NULL,
  \`bio\` TEXT DEFAULT NULL,
  \`allowed_categories\` TEXT DEFAULT NULL,
  \`permissions\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`users\`
INSERT INTO \`users\` (\`id\`, \`name\`, \`username\`, \`password\`, \`email\`, \`phone\`, \`role\`, \`status\`, \`avatar\`, \`designation\`, \`bio\`, \`allowed_categories\`, \`permissions\`, \`created_at\`) VALUES
`;

  const userValues = (users.length > 0 ? users : INITIAL_USERS).map(
    (u) => `(${u.id}, ${escapeSqlString(u.name)}, ${escapeSqlString(u.username || u.email.split('@')[0])}, ${escapeSqlString(u.password || 'reporter123')}, ${escapeSqlString(u.email)}, ${escapeSqlString(u.phone)}, ${escapeSqlString(u.role)}, ${escapeSqlString(u.status)}, ${escapeSqlString(u.avatar)}, ${escapeSqlString(u.designation)}, ${escapeSqlString(u.bio)}, ${escapeSqlString(JSON.stringify(u.allowed_categories || []))}, ${escapeSqlString(JSON.stringify(u.permissions || ['post', 'edit', 'update']))}, ${escapeSqlString(u.created_at || new Date().toISOString())})`
  );
  sql += userValues.join(',\n') + ';\n\n';

  sql += `-- --------------------------------------------------------
-- Table structure for table \`posts\` (News Articles)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`posts\`;
CREATE TABLE \`posts\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(500) NOT NULL,
  \`slug\` VARCHAR(500) NOT NULL,
  \`summary\` TEXT DEFAULT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`category_id\` INT(11) NOT NULL,
  \`subcategory_id\` INT(11) DEFAULT NULL,
  \`reporter_id\` INT(11) NOT NULL DEFAULT 1,
  \`reporter_name\` VARCHAR(255) DEFAULT NULL,
  \`reporter_avatar\` TEXT DEFAULT NULL,
  \`reporter_designation\` VARCHAR(255) DEFAULT NULL,
  \`image\` TEXT NOT NULL,
  \`image_caption\` TEXT DEFAULT NULL,
  \`video_url\` VARCHAR(500) DEFAULT NULL,
  \`views\` INT(11) NOT NULL DEFAULT 0,
  \`is_lead\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_sub_lead\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_breaking\` TINYINT(1) NOT NULL DEFAULT 0,
  \`is_special\` TINYINT(1) NOT NULL DEFAULT 0,
  \`status\` ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
  \`approval_status\` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  \`published_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`category_id\` (\`category_id\`),
  KEY \`reporter_id\` (\`reporter_id\`),
  CONSTRAINT \`fk_posts_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`posts\`
INSERT INTO \`posts\` (
  \`id\`, \`title\`, \`slug\`, \`summary\`, \`content\`, \`category_id\`, \`subcategory_id\`,
  \`reporter_id\`, \`reporter_name\`, \`reporter_avatar\`, \`reporter_designation\`,
  \`image\`, \`image_caption\`, \`video_url\`, \`views\`, \`is_lead\`, \`is_sub_lead\`,
  \`is_breaking\`, \`is_special\`, \`status\`, \`approval_status\`, \`published_at\`, \`created_at\`
) VALUES
`;

  const postValues = posts.map(
    (p) => `(${p.id}, ${escapeSqlString(p.title)}, ${escapeSqlString(p.slug)}, ${escapeSqlString(p.summary)}, ${escapeSqlString(p.content)}, ${p.category_id}, ${p.subcategory_id || 'NULL'}, ${p.reporter_id || 1}, ${escapeSqlString(p.reporter_name)}, ${escapeSqlString(p.reporter_avatar)}, ${escapeSqlString(p.reporter_designation)}, ${escapeSqlString(p.image)}, ${escapeSqlString(p.image_caption)}, ${escapeSqlString(p.video_url)}, ${p.views || 0}, ${p.is_lead ? 1 : 0}, ${p.is_sub_lead ? 1 : 0}, ${p.is_breaking ? 1 : 0}, ${p.is_special ? 1 : 0}, ${escapeSqlString(p.status || 'published')}, ${escapeSqlString(p.approval_status || 'approved')}, ${escapeSqlString(p.published_at)}, ${escapeSqlString(p.created_at || p.published_at)})`
  );
  sql += postValues.join(',\n') + ';\n\n';

  sql += `-- --------------------------------------------------------
-- Table structure for table \`ads\` (Banner & AdSense Slots)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`ads\`;
CREATE TABLE \`ads\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`slot\` VARCHAR(100) NOT NULL,
  \`type\` ENUM('image', 'adsense', 'custom') NOT NULL DEFAULT 'image',
  \`image_url\` TEXT DEFAULT NULL,
  \`redirect_url\` TEXT DEFAULT NULL,
  \`ad_code\` TEXT DEFAULT NULL,
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`ads\`
INSERT INTO \`ads\` (\`id\`, \`title\`, \`slot\`, \`type\`, \`image_url\`, \`redirect_url\`, \`ad_code\`, \`status\`, \`created_at\`) VALUES
`;

  const adsValues = (adUnits && adUnits.length > 0 ? adUnits : []).map(
    (a) => `(${a.id}, ${escapeSqlString(a.title)}, ${escapeSqlString(a.slot)}, ${escapeSqlString(a.type || 'image')}, ${escapeSqlString(a.image_url)}, ${escapeSqlString(a.redirect_url)}, ${escapeSqlString(a.ad_code)}, ${escapeSqlString(a.status || 'active')}, ${escapeSqlString(new Date().toISOString())})`
  );
  if (adsValues.length > 0) {
    sql += adsValues.join(',\n') + ';\n\n';
  } else {
    sql += `(1, 'হেডার মেগা ব্যানার', 'top_header', 'image', 'https://picsum.photos/seed/adtop/970/90', 'https://matribhumitv.com', NULL, 'active', NOW());\n\n`;
  }

  sql += `-- --------------------------------------------------------
-- Table structure for table \`site_config\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`site_config\`;
CREATE TABLE \`site_config\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`site_name\` VARCHAR(255) NOT NULL,
  \`site_slogan\` VARCHAR(255) DEFAULT NULL,
  \`editor_name\` VARCHAR(255) DEFAULT NULL,
  \`publisher_name\` VARCHAR(255) DEFAULT NULL,
  \`email\` VARCHAR(255) DEFAULT NULL,
  \`phone\` VARCHAR(100) DEFAULT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`copyright_text\` TEXT DEFAULT NULL,
  \`adsense_client_id\` VARCHAR(255) DEFAULT NULL,
  \`adsense_enabled\` TINYINT(1) DEFAULT 1,
  \`live_stream_url\` TEXT DEFAULT NULL,
  \`live_stream_active\` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table \`site_config\`
INSERT INTO \`site_config\` (
  \`id\`, \`site_name\`, \`site_slogan\`, \`editor_name\`, \`publisher_name\`,
  \`email\`, \`phone\`, \`address\`, \`copyright_text\`, \`adsense_client_id\`, \`adsense_enabled\`,
  \`live_stream_url\`, \`live_stream_active\`
) VALUES (
  1,
  ${escapeSqlString(siteConfig.site_name)},
  ${escapeSqlString(siteConfig.site_slogan)},
  ${escapeSqlString(siteConfig.editor_name)},
  ${escapeSqlString(siteConfig.publisher_name)},
  ${escapeSqlString(siteConfig.email)},
  ${escapeSqlString(siteConfig.phone)},
  ${escapeSqlString(siteConfig.address)},
  ${escapeSqlString(siteConfig.copyright_text)},
  ${escapeSqlString(siteConfig.adsense_client_id)},
  ${siteConfig.adsense_enabled ? 1 : 0},
  ${escapeSqlString(siteConfig.live_stream_url)},
  ${siteConfig.live_stream_active ? 1 : 0}
);

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- END OF SQL DUMP
-- ========================================================
`;

  return sql;
}
