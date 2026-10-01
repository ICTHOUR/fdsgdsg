# 🗞️ Banglanews24 Backend Architecture & Deployment Guide

A robust, production-ready Node.js, Express.js, and MySQL backend architecture modeled after **Banglanews24**, featuring high-throughput connection pooling, role-based authentication, custom banner and Google AdSense management, breaking news ticker, lead news, most-read ranking ("সর্বাধিক পঠিত"), video gallery, and SEO-optimized Bangla unicode routing.

---

## 📁 Project Directory Structure

```
backend/
├── app.js                   # Express application setup & middleware assembly (cPanel entry)
├── server.js                # Server listener and process lifecycle management
├── package.json             # NPM dependencies and scripts
├── .env.example             # Environment variable template
│
├── config/
│   └── db.js                # mysql2/promise connection pool with keep-alive & transactions
│
├── controllers/
│   ├── postController.js    # News CRUD, pagination, filtering, view incrementing, tags
│   ├── portalController.js  # Breaking news ticker, Lead news, Most-read, Video gallery
│   ├── categoryController.js# Category & subcategory tree management
│   ├── adController.js      # Google AdSense & custom image banner placement management
│   ├── commentController.js # Reader comments & moderation
│   ├── authController.js    # JWT authentication with bcrypt password hashing
│   └── settingsController.js# Portal settings & SEO metadata
│
├── middlewares/
│   ├── auth.js              # Token validation and RBAC (admin, reporter, viewer)
│   ├── errorHandler.js      # Global JSON error handling & MySQL constraint catchers
│   └── upload.js            # Multer image storage configuration
│
├── routes/
│   ├── api.js               # Master router aggregating all /api/v1 endpoints
│   ├── postRoutes.js        # /api/v1/posts
│   ├── portalRoutes.js      # /api/v1/portal
│   ├── categoryRoutes.js    # /api/v1/categories
│   ├── adRoutes.js          # /api/v1/ads
│   ├── commentRoutes.js     # /api/v1/comments
│   ├── authRoutes.js        # /api/v1/auth
│   └── settingsRoutes.js    # /api/v1/settings
│
└── database/
    └── schema.sql           # Complete MySQL database schema & Banglanews24 seed data
```

---

## 🗄️ 1. Database Setup (MySQL / MariaDB)

1. Create a new database in **cPanel MySQL Database Wizard** or via MySQL CLI:
   ```sql
   CREATE DATABASE banglanews_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Import `database/schema.sql` using **phpMyAdmin** (`Import` tab) or command line:
   ```bash
   mysql -u your_user -p banglanews_db < database/schema.sql
   ```

### Included Tables
- `users`: Administrator, reporter, and subscriber accounts with role flags.
- `categories`: Primary categories (জাতীয়, রাজনীতি, অর্থনীতি, আন্তর্জাতিক, খেলা, চট্টগ্রাম, সারাদেশ, ইত্যাদি).
- `subcategories`: Hierarchical sub-categories.
- `posts`: Articles with flags `is_lead`, `is_sub_lead`, `is_breaking`, `is_special`, views counter, and full-text index.
- `tags` & `post_tags`: Many-to-many keywords and trending topics bar.
- `ads`: Banner ads and Google AdSense script integration across slots:
  - `header_banner` (Leaderboard 970x90)
  - `sidebar_top` (Medium Rectangle 300x250)
  - `sidebar_bottom` (Half Page 300x600)
  - `between_sections` (Wide Strip 970x120)
  - `in_article` (Responsive In-Feed Google AdSense)
  - `footer_banner`
- `comments`: Reader comments with moderation status (`approved`, `pending`, `spam`).
- `settings`: Key-value configuration for site identity, SEO, contact, and social links.

---

## 🚀 2. cPanel Deployment Guide (Step-by-Step)

### Step 1: Create Database in cPanel
1. Open cPanel and navigate to **MySQL® Databases**.
2. Create a new database: e.g. `cpaneluser_newsdb`.
3. Create a new database user: e.g. `cpaneluser_dbadmin` with a strong password.
4. Add user to database and grant **ALL PRIVILEGES**.
5. Open **phpMyAdmin**, select the database, and import `database/schema.sql`.

### Step 2: Set up "Setup Node.js App" in cPanel
1. In cPanel, find **Software** ➜ **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: Choose `18.x` or `20.x` LTS.
   - **Application mode**: `Production`.
   - **Application root**: `backend` (or your folder path, e.g. `public_html/api` or `news_backend`).
   - **Application URL**: `api.yourdomain.com` or `yourdomain.com/api`.
   - **Application startup file**: `app.js`.
3. Click **Create**.

### Step 3: Upload Files & Configure Environment
1. Use cPanel File Manager or FTP to upload backend files.
2. In the application root, create `.env` and fill in your details:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=cpaneluser_dbadmin
   DB_PASSWORD=YourStrongPasswordHere
   DB_NAME=cpaneluser_newsdb
   JWT_SECRET=production_secret_banglanews_key_2026
   UPLOAD_DIR=uploads
   ```

### Step 4: Run NPM Install
1. In the **Setup Node.js App** page, click **Run NPM Install** (or copy the provided command to enter the virtual environment via cPanel Terminal and run `npm install`).
2. Click **Restart Application**.

### Step 5: Optional `.htaccess` Rule for Passenger / Reverse Proxy
If running behind Apache reverse proxy or Passenger:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^$ http://127.0.0.1:5000/ [P,L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
</IfModule>
```

---

## 📡 3. RESTful API Reference

### 🔴 Banglanews24 Portal Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/portal/breaking` | Fetch breaking news marquee ticker items |
| `GET` | `/api/v1/portal/lead` | Fetch top main lead story + 4 sub leads |
| `GET` | `/api/v1/portal/most-read` | Fetch most read news ("সর্বাধিক পঠিত") by timeframe (`24h`, `7d`, `all`) |
| `GET` | `/api/v1/portal/videos` | Fetch video gallery news with YouTube/MP4 embeds |
| `GET` | `/api/v1/portal/trending-tags` | Fetch trending keyword tags for top navigation bar |
| `GET` | `/api/v1/portal/home` | Aggregated all-in-one payload for fast homepage load |

### 📰 News Articles CRUD
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/posts` | Public | List posts with pagination (`page`, `limit`), filtering by `category_slug`, `tag_slug`, `search`, and status |
| `GET` | `/api/v1/posts/:slugOrId` | Public | Single post details by slug/id (atomically increments view count) |
| `POST` | `/api/v1/posts` | Admin / Reporter | Create new post (supports multipart image upload) |
| `PUT` | `/api/v1/posts/:id` | Admin / Reporter | Update existing post |
| `DELETE` | `/api/v1/posts/:id` | Admin | Delete news post |

### 📢 Advertisement Management
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/ads` | Public | List ads (filterable by `slot` and `status`) |
| `GET` | `/api/v1/ads/slot/:slotName` | Public | Get active ad for a slot and log impression |
| `POST` | `/api/v1/ads/:id/click` | Public | Track ad click counter |
| `POST` | `/api/v1/ads` | Admin | Create new Banner or Google AdSense ad |
| `PUT` | `/api/v1/ads/:id` | Admin | Edit ad code or banner |
| `DELETE` | `/api/v1/ads/:id` | Admin | Delete ad placement |

### 🔐 Authentication & Roles
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Email & password login, returns JWT token |
| `POST` | `/api/v1/auth/register` | User signup |
| `GET` | `/api/v1/auth/me` | Current user profile from token |

---

## 🛡️ Key Features & Optimization
1. **Bangla UTF-8 Support**: Database and connection pool are explicitly configured for `utf8mb4_unicode_ci` to store complex conjunct characters without encoding corruption.
2. **Transaction Safety**: Atomic creation of posts and tag mappings in `db.executeTransaction()`.
3. **Database Performance**: Indexed columns for `slug`, `category_id`, `is_lead`, `is_breaking`, `published_at DESC`, and fulltext search.
4. **Google AdSense Ready**: Supports both raw Google AdSense responsive snippet scripts and image banners with external tracking.
