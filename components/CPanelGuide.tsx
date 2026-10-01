'use client';

import React, { useState } from 'react';
import { 
  Server, Database, ShieldCheck, Terminal, Copy, 
  Check, ArrowRight, ExternalLink, Cpu, CheckCircle2
} from 'lucide-react';

export const CPanelGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const HTACCESS_CODE = `<IfModule mod_rewrite.c>
  RewriteEngine On
  # Forward root and API calls to Node.js backend port 5000 or Passenger
  RewriteRule ^$ http://127.0.0.1:5000/ [P,L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]
</IfModule>`;

  const ENV_CONFIG = `NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=cpaneluser_dbadmin
DB_PASSWORD=YourSecurePassword@2026
DB_NAME=cpaneluser_banglanews
DB_CONNECTION_LIMIT=20
JWT_SECRET=super_secret_jwt_key_production_2026
UPLOAD_DIR=uploads`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold font-serif">cPanel Node.js + MySQL Deployment Checklist</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complete step-by-step production setup guide for cPanel Phusion Passenger, MySQL 8.0, and Apache Reverse Proxy
        </p>
      </div>

      {/* Step by Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: MySQL Database in cPanel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center font-mono">1</span>
              <h3 className="text-sm font-bold text-slate-900">MySQL ডাটাবেস ও ব্যবহারকারী তৈরি</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              cPanel এর <strong>MySQL® Databases</strong> এ যান। একটি নতুন ডাটাবেস (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-red-700 font-mono">cpaneluser_newsdb</code>) এবং ব্যবহারকারী তৈরি করে <strong>ALL PRIVILEGES</strong> প্রদান করুন।
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              এরপর <strong>phpMyAdmin</strong> ওপেন করে তৈরি করা ডাটাবেস সিলেক্ট করুন এবং <code className="bg-slate-100 px-1 py-0.5 rounded text-red-700 font-mono">database/schema.sql</code> ফাইলটি Import করুন।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>UTF-8 Bangla (utf8mb4) রেডি</span>
          </div>
        </div>

        {/* Step 2: Setup Node.js App */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center font-mono">2</span>
              <h3 className="text-sm font-bold text-slate-900">cPanel &quot;Setup Node.js App&quot; কনফিগারেশন</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li><strong>Node.js version</strong>: 18.x বা 20.x LTS সিলেক্ট করুন</li>
              <li><strong>Application mode</strong>: Production</li>
              <li><strong>Application root</strong>: <code className="font-mono bg-slate-100 px-1 rounded">backend</code> বা <code className="font-mono bg-slate-100 px-1 rounded">public_html/api</code></li>
              <li><strong>Application startup file</strong>: <code className="font-mono bg-slate-100 px-1 rounded">app.js</code></li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Phusion Passenger কম্প্যাটিবল</span>
          </div>
        </div>

        {/* Step 3: .env Environment File */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center font-mono">3</span>
                <h3 className="text-sm font-bold text-slate-900">.env ফাইল কনফিগারেশন</h3>
              </div>
              <button
                onClick={() => handleCopy(ENV_CONFIG, 'env')}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'env' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'env' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded text-[11px] font-mono overflow-x-auto">
              {ENV_CONFIG}
            </pre>
          </div>
        </div>

        {/* Step 4: .htaccess Proxy Rule */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center font-mono">4</span>
                <h3 className="text-sm font-bold text-slate-900">.htaccess রিভার্স প্রক্সি কনফিগারেশন</h3>
              </div>
              <button
                onClick={() => handleCopy(HTACCESS_CODE, 'htaccess')}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === 'htaccess' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'htaccess' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-amber-300 p-3 rounded text-[11px] font-mono overflow-x-auto">
              {HTACCESS_CODE}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
