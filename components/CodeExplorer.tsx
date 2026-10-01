'use client';

import React, { useState } from 'react';
import { 
  Folder, FileCode, Copy, Check, ChevronRight, 
  Terminal, Server, Shield, Layers, HardDrive
} from 'lucide-react';

interface FileItem {
  name: string;
  path: string;
  category: string;
  description: string;
  code: string;
}

const BACKEND_FILES: FileItem[] = [
  {
    name: 'config/db.js',
    path: 'backend/config/db.js',
    category: 'Database Connection',
    description: 'mysql2/promise connection pool with keep-alive, BST timezone, and transaction execution wrappers',
    code: `const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'banglanews_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20', 10),
  charset: 'utf8mb4',
  timezone: '+06:00', // Bangladesh Standard Time (BST)
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

async function executeTransaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params),
  executeTransaction,
};`,
  },
  {
    name: 'controllers/portalController.js',
    path: 'backend/controllers/portalController.js',
    category: 'Controllers',
    description: 'Endpoints for Breaking news marquee ticker, 1 Main Lead + 4 Sub-leads, Most Read (সর্বাধিক পঠিত), and Videos',
    code: `const db = require('../config/db');

// 1. Breaking News Ticker (ব্রেকিং নিউজ)
exports.getBreakingNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await db.query(
      "SELECT id, title, slug, published_at FROM posts WHERE is_breaking = 1 AND status = 'published' ORDER BY published_at DESC LIMIT ?",
      [limit]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    next(error);
  }
};

// 2. Top Lead & Sub-Leads Grid (প্রধান ও উপ-প্রধান খবর)
exports.getLeadNews = async (req, res, next) => {
  try {
    const [mainLead] = await db.query(
      "SELECT p.*, c.name_bn as category_name_bn FROM posts p JOIN categories c ON p.category_id = c.id WHERE p.is_lead = 1 AND p.status = 'published' LIMIT 1"
    );
    const [subLeads] = await db.query(
      "SELECT p.*, c.name_bn as category_name_bn FROM posts p JOIN categories c ON p.category_id = c.id WHERE p.is_sub_lead = 1 AND p.status = 'published' ORDER BY p.published_at DESC LIMIT 4"
    );
    res.json({
      success: true,
      data: { main_lead: mainLead[0] || null, sub_leads: subLeads }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Most Read News (সর্বাধিক পঠিত) with 24h / 7d filter
exports.getMostRead = async (req, res, next) => {
  try {
    const timeframe = req.query.timeframe || '7d';
    let intervalSql = timeframe === '24h' ? 'AND p.published_at >= NOW() - INTERVAL 1 DAY' : '';
    const [rows] = await db.query(
      \`SELECT p.id, p.title, p.slug, p.views, c.name_bn as category_name_bn FROM posts p JOIN categories c ON p.category_id = c.id WHERE p.status = 'published' \${intervalSql} ORDER BY p.views DESC LIMIT 8\`
    );
    res.json({ success: true, timeframe, data: rows });
  } catch (error) {
    next(error);
  }
};`,
  },
  {
    name: 'controllers/postController.js',
    path: 'backend/controllers/postController.js',
    category: 'Controllers',
    description: 'News Articles CRUD, Pagination, Category & Tag filtering, Atomic view counter increment',
    code: `const db = require('../config/db');

exports.getAllPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;
    const { category_slug, search } = req.query;

    let where = ["p.status = 'published'"];
    let params = [];
    if (category_slug) {
      where.push('c.slug = ?');
      params.push(category_slug);
    }
    if (search) {
      where.push('(p.title LIKE ? OR p.content LIKE ?)');
      params.push(\`%\${search}%\`, \`%\${search}%\`);
    }

    const [posts] = await db.query(
      \`SELECT p.*, c.name_bn as category_name_bn, u.name as reporter_name 
       FROM posts p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.reporter_id = u.id
       WHERE \${where.join(' AND ')}
       ORDER BY p.published_at DESC LIMIT ? OFFSET ?\`,
      [...params, limit, offset]
    );

    res.json({ success: true, page, limit, data: posts });
  } catch (error) {
    next(error);
  }
};

exports.getPostBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const condition = /^\\d+$/.test(slugOrId) ? 'p.id = ?' : 'p.slug = ?';
    const [rows] = await db.query(
      \`SELECT p.*, c.name_bn as category_name_bn FROM posts p JOIN categories c ON p.category_id = c.id WHERE \${condition} LIMIT 1\`,
      [slugOrId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'সংবাদ পাওয়া যায়নি' });

    // Atomic view counter increment
    await db.query('UPDATE posts SET views = views + 1 WHERE id = ?', [rows[0].id]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};`,
  },
  {
    name: 'controllers/adController.js',
    path: 'backend/controllers/adController.js',
    category: 'Controllers',
    description: 'Ad Management (Header banner, Sidebar top/bottom, In-article Google AdSense, Between-sections strip)',
    code: `const db = require('../config/db');

exports.getAdsBySlot = async (req, res, next) => {
  try {
    const { slotName } = req.params;
    const [rows] = await db.query(
      "SELECT id, title, slot, type, image_url, redirect_url, ad_code FROM ads WHERE slot = ? AND status = 'active' ORDER BY RAND() LIMIT 1",
      [slotName]
    );
    if (rows.length > 0) {
      db.query('UPDATE ads SET impressions = impressions + 1 WHERE id = ?', [rows[0].id]).catch(console.error);
    }
    res.json({ success: true, data: rows.length ? rows[0] : null });
  } catch (error) {
    next(error);
  }
};

exports.trackAdClick = async (req, res, next) => {
  try {
    await db.query('UPDATE ads SET clicks = clicks + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Click tracked' });
  } catch (error) {
    next(error);
  }
};`,
  },
  {
    name: 'middlewares/auth.js',
    path: 'backend/middlewares/auth.js',
    category: 'Security & Middlewares',
    description: 'JWT Bearer token verification & Role-based Access Control (admin, reporter, viewer)',
    code: `const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'অননুমোদিত অ্যাক্সেস (Unauthorized)' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'টোকেন অকার্যকর বা মেয়াদোত্তীর্ণ' });
  }
};

exports.requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'পর্যাপ্ত অনুমতি নেই' });
  }
  next();
};`,
  },
  {
    name: 'server.js & app.js',
    path: 'backend/server.js',
    category: 'Server Entrypoints',
    description: 'Express setup with Helmet, CORS, Morgan, static upload serving, and cPanel Phusion Passenger compatibility',
    code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const apiRouter = require('./routes/api');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Mount Versioned API
app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));

module.exports = app;`,
  },
];

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold font-serif">Node.js & Express Source Code Architecture</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production-grade modular MVC architecture ready for standalone or cPanel Phusion Passenger hosting
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Code Copied!' : 'Copy Active File'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block px-1">
            📁 Backend Codebase Structure
          </span>

          <div className="space-y-1">
            {BACKEND_FILES.map((file, idx) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white font-semibold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-red-600'}`} />
                    <span className="font-mono truncate">{file.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-red-400 font-bold">{selectedFile.path}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{selectedFile.category}</span>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
              Node.js / Express
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 bg-slate-900/80 p-2.5 rounded border border-slate-800">
            ℹ️ {selectedFile.description}
          </p>

          <div className="overflow-x-auto flex-1 font-mono text-xs text-slate-200">
            <pre className="text-emerald-300 whitespace-pre leading-relaxed">{selectedFile.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
