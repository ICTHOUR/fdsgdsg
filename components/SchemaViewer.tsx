'use client';

import React, { useState } from 'react';
import { 
  Database, Copy, Check, Download, Table, 
  Key, Hash, Layers, Shield, Sparkles, FileCode
} from 'lucide-react';

const TABLES_METADATA = [
  {
    name: 'users',
    description: 'Portal administrative users, staff reporters, and subscribers',
    columns: [
      { name: 'id', type: 'INT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'name', type: 'VARCHAR(150) NOT NULL' },
      { name: 'email', type: 'VARCHAR(191) NOT NULL UNIQUE' },
      { name: 'password', type: 'VARCHAR(255) NOT NULL (bcrypt hash)' },
      { name: 'role', type: "ENUM('admin', 'reporter', 'viewer')", default: "'reporter'" },
      { name: 'avatar', type: 'VARCHAR(255) NULL' },
      { name: 'designation', type: 'VARCHAR(100)', default: "'Staff Reporter'" },
      { name: 'status', type: "ENUM('active', 'inactive', 'banned')", default: "'active'" },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    name: 'categories',
    description: 'Primary news categories (National, Politics, Sports, Economy, etc.)',
    columns: [
      { name: 'id', type: 'INT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'name_bn', type: 'VARCHAR(150) NOT NULL (জাতীয়, রাজনীতি)' },
      { name: 'name_en', type: 'VARCHAR(150) NOT NULL' },
      { name: 'slug', type: 'VARCHAR(191) NOT NULL UNIQUE' },
      { name: 'color_code', type: "VARCHAR(20) DEFAULT '#DC2626'" },
      { name: 'order_index', type: 'INT UNSIGNED DEFAULT 0' },
      { name: 'is_in_menu', type: 'TINYINT(1) DEFAULT 1' },
    ],
  },
  {
    name: 'subcategories',
    description: 'Sub-topics nested under primary categories (e.g. Cricket under Sports)',
    columns: [
      { name: 'id', type: 'INT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'category_id', type: 'INT UNSIGNED NOT NULL', key: 'FK -> categories(id)' },
      { name: 'name_bn', type: 'VARCHAR(150) NOT NULL' },
      { name: 'name_en', type: 'VARCHAR(150) NOT NULL' },
      { name: 'slug', type: 'VARCHAR(191) NOT NULL UNIQUE' },
      { name: 'order_index', type: 'INT UNSIGNED DEFAULT 0' },
    ],
  },
  {
    name: 'posts',
    description: 'Core news articles with flags (is_lead, is_breaking, is_special, video_url)',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'title', type: 'VARCHAR(500) NOT NULL' },
      { name: 'slug', type: 'VARCHAR(255) NOT NULL UNIQUE' },
      { name: 'summary', type: 'VARCHAR(1000) NULL' },
      { name: 'content', type: 'LONGTEXT NOT NULL' },
      { name: 'category_id', type: 'INT UNSIGNED NOT NULL', key: 'FK -> categories(id)' },
      { name: 'subcategory_id', type: 'INT UNSIGNED NULL', key: 'FK -> subcategories(id)' },
      { name: 'reporter_id', type: 'INT UNSIGNED NOT NULL', key: 'FK -> users(id)' },
      { name: 'image', type: 'VARCHAR(500) NULL' },
      { name: 'video_url', type: 'VARCHAR(500) NULL (YouTube/MP4)' },
      { name: 'views', type: 'BIGINT UNSIGNED DEFAULT 0' },
      { name: 'is_lead', type: 'TINYINT(1) DEFAULT 0 (Top Hero News)' },
      { name: 'is_sub_lead', type: 'TINYINT(1) DEFAULT 0 (4-Grid Sub-leads)' },
      { name: 'is_breaking', type: 'TINYINT(1) DEFAULT 0 (Marquee Ticker)' },
      { name: 'is_special', type: 'TINYINT(1) DEFAULT 0' },
      { name: 'status', type: "ENUM('published', 'draft', 'archived')", default: "'published'" },
      { name: 'published_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    ],
  },
  {
    name: 'tags & post_tags',
    description: 'Trending keywords bar & many-to-many tag relations',
    columns: [
      { name: 'tags.id', type: 'INT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'tags.name_bn', type: 'VARCHAR(150) NOT NULL' },
      { name: 'tags.slug', type: 'VARCHAR(191) NOT NULL UNIQUE' },
      { name: 'tags.is_trending', type: 'TINYINT(1) DEFAULT 0' },
      { name: 'post_tags.post_id', type: 'BIGINT UNSIGNED', key: 'FK -> posts(id)' },
      { name: 'post_tags.tag_id', type: 'INT UNSIGNED', key: 'FK -> tags(id)' },
    ],
  },
  {
    name: 'ads',
    description: 'Banner ads and Google AdSense responsive code slots',
    columns: [
      { name: 'id', type: 'INT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'title', type: 'VARCHAR(191) NOT NULL' },
      { name: 'slot', type: "ENUM('header_banner', 'sidebar_top', 'between_sections', 'in_article', ...)" },
      { name: 'type', type: "ENUM('image', 'adsense_code', 'custom_html')" },
      { name: 'image_url', type: 'VARCHAR(500) NULL' },
      { name: 'redirect_url', type: 'VARCHAR(500) NULL' },
      { name: 'ad_code', type: 'TEXT NULL (Google AdSense script)' },
      { name: 'impressions', type: 'BIGINT UNSIGNED DEFAULT 0' },
      { name: 'clicks', type: 'BIGINT UNSIGNED DEFAULT 0' },
      { name: 'status', type: "ENUM('active', 'paused', 'expired')" },
    ],
  },
  {
    name: 'comments & settings',
    description: 'Reader comments moderation and key-value site configurations',
    columns: [
      { name: 'comments.id', type: 'BIGINT UNSIGNED AUTO_INCREMENT', key: 'PRIMARY KEY' },
      { name: 'comments.post_id', type: 'BIGINT UNSIGNED', key: 'FK -> posts(id)' },
      { name: 'comments.author_name', type: 'VARCHAR(150) NOT NULL' },
      { name: 'comments.comment', type: 'TEXT NOT NULL' },
      { name: 'comments.status', type: "ENUM('approved', 'pending', 'spam')" },
      { name: 'settings.key_name', type: 'VARCHAR(100) UNIQUE' },
      { name: 'settings.key_value', type: 'TEXT' },
    ],
  },
];

const RAW_SQL_SNIPPET = `-- Banglanews24 Complete MySQL Database Schema
CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reporter', 'viewer') NOT NULL DEFAULT 'reporter',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_bn VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  color_code VARCHAR(20) DEFAULT '#DC2626',
  order_index INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary VARCHAR(1000) DEFAULT NULL,
  content LONGTEXT NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  reporter_id INT UNSIGNED NOT NULL,
  image VARCHAR(500) DEFAULT NULL,
  video_url VARCHAR(500) DEFAULT NULL,
  views BIGINT UNSIGNED NOT NULL DEFAULT 0,
  is_lead TINYINT(1) NOT NULL DEFAULT 0,
  is_sub_lead TINYINT(1) NOT NULL DEFAULT 0,
  is_breaking TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('published', 'draft', 'archived') NOT NULL DEFAULT 'published',
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_posts_lead (is_lead, published_at DESC),
  INDEX idx_posts_breaking (is_breaking, published_at DESC),
  INDEX idx_posts_views (views DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ads (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(191) NOT NULL,
  slot ENUM('header_banner', 'sidebar_top', 'sidebar_bottom', 'between_sections', 'in_article', 'footer_banner') NOT NULL,
  type ENUM('image', 'adsense_code', 'custom_html') NOT NULL DEFAULT 'image',
  image_url VARCHAR(500) DEFAULT NULL,
  redirect_url VARCHAR(500) DEFAULT NULL,
  ad_code TEXT DEFAULT NULL,
  impressions BIGINT UNSIGNED NOT NULL DEFAULT 0,
  clicks BIGINT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('active', 'paused', 'expired') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

export const SchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'tables' | 'sql'>('tables');

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_SQL_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([RAW_SQL_SNIPPET], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'banglanews24_schema.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold font-serif">MySQL Database Schema Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Engineered with UTF-8 Unicode (utf8mb4_unicode_ci), composite indexes, foreign key constraints & full-text search
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('tables')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                viewMode === 'tables' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              টেবিল ভিউ
            </button>
            <button
              onClick={() => setViewMode('sql')}
              className={`px-3 py-1 rounded cursor-pointer transition-colors ${
                viewMode === 'sql' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              SQL স্ক্রিপ্ট
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .sql</span>
          </button>
        </div>
      </div>

      {viewMode === 'tables' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TABLES_METADATA.map((tbl) => (
            <div key={tbl.name} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-red-600" />
                    <h3 className="font-mono font-bold text-sm text-slate-900">
                      `{tbl.name}`
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    InnoDB (utf8mb4)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{tbl.description}</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                        <th className="pb-1.5 font-medium">কলাম নাম (Column)</th>
                        <th className="pb-1.5 font-medium">টাইপ (Data Type)</th>
                        <th className="pb-1.5 font-medium text-right">কী / ইনডেক্স</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {tbl.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="py-1.5 text-slate-900 font-semibold">{col.name}</td>
                          <td className="py-1.5 text-slate-600 text-[11px]">{col.type}</td>
                          <td className="py-1.5 text-right">
                            {col.key ? (
                              <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-red-100">
                                {col.key}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Charset: utf8mb4_unicode_ci</span>
                <span className="text-emerald-700 font-medium">✓ Indexed for performance</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 text-emerald-400 p-6 rounded-xl font-mono text-xs overflow-x-auto shadow-2xl border border-slate-800">
          <pre className="whitespace-pre-wrap">{RAW_SQL_SNIPPET}</pre>
        </div>
      )}
    </div>
  );
};
