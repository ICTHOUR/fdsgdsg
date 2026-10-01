'use client';

import React, { useState } from 'react';
import { 
  Play, Copy, Check, Terminal, Globe, 
  Send, RefreshCw, Layers, ShieldCheck, Zap
} from 'lucide-react';

interface EndpointDef {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Portal Widgets' | 'News Articles' | 'Advertisements' | 'Categories' | 'Auth & Roles';
  description: string;
  defaultParams?: Record<string, string>;
  defaultBody?: string;
}

const ENDPOINTS: EndpointDef[] = [
  {
    method: 'GET',
    path: '/api/v1/portal/breaking',
    category: 'Portal Widgets',
    description: 'Fetch real-time breaking news marquee ticker items',
    defaultParams: { limit: '8' },
  },
  {
    method: 'GET',
    path: '/api/v1/portal/lead',
    category: 'Portal Widgets',
    description: 'Fetch top main lead article + 4 sub leads for hero grid',
  },
  {
    method: 'GET',
    path: '/api/v1/portal/most-read',
    category: 'Portal Widgets',
    description: 'Fetch most viewed news (সর্বাধিক পঠিত) by timeframe',
    defaultParams: { timeframe: '7d', limit: '8' },
  },
  {
    method: 'GET',
    path: '/api/v1/portal/videos',
    category: 'Portal Widgets',
    description: 'Fetch news with video embeds (ভিডিও গ্যালারি)',
    defaultParams: { limit: '4' },
  },
  {
    method: 'GET',
    path: '/api/v1/portal/trending-tags',
    category: 'Portal Widgets',
    description: 'Fetch trending keyword tags for top navigation header bar',
  },
  {
    method: 'GET',
    path: '/api/v1/portal/home',
    category: 'Portal Widgets',
    description: 'Aggregated bundle (Breaking, Lead, Most-read, Categories, Ads) in 1 payload',
  },
  {
    method: 'GET',
    path: '/api/v1/posts',
    category: 'News Articles',
    description: 'List posts with pagination, category filter & search',
    defaultParams: { page: '1', limit: '6', category_slug: '' },
  },
  {
    method: 'GET',
    path: '/api/v1/posts/1',
    category: 'News Articles',
    description: 'Fetch single post details by slug/ID and increment views',
  },
  {
    method: 'POST',
    path: '/api/v1/posts',
    category: 'News Articles',
    description: 'Publish a new news article (Admin / Reporter role)',
    defaultBody: JSON.stringify({
      title: 'নতুন অর্থনৈতিক পরিকল্পনার দ্বিতীয় ধাপ ঘোষণা',
      summary: 'শিল্প ও প্রযুক্তির আধুনিকায়নে বিশেষ বাজেট বরাদ্দ অনুমোদন।',
      content: '<p>সরকার আজ জাতীয় শিল্প উন্নয়নে দ্বিতীয় পর্যায়ের অর্থায়ন প্যাকেজ ঘোষণা করেছে...</p>',
      category_id: 1,
      is_lead: false,
      is_breaking: true,
      is_special: true,
      tags: ['মুদ্রাস্ফীতি', 'নির্বাচন ২০২৬']
    }, null, 2),
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    category: 'Categories',
    description: 'List all categories with subcategories & post counts',
  },
  {
    method: 'GET',
    path: '/api/v1/ads',
    category: 'Advertisements',
    description: 'List advertisement units and Google AdSense scripts',
  },
  {
    method: 'GET',
    path: '/api/v1/ads/slot/header_banner',
    category: 'Advertisements',
    description: 'Fetch active ad for specific placement slot & track impression',
  },
];

export const ApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [queryParams, setQueryParams] = useState<Record<string, string>>(ENDPOINTS[0].defaultParams || {});
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody || '');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setSelectedEndpoint(ep);
    setQueryParams(ep.defaultParams || {});
    setRequestBody(ep.defaultBody || '');
    setResponseData(null);
    setResponseStatus(null);
  };

  const handleExecuteRequest = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      let url = selectedEndpoint.path;
      const validParams = Object.entries(queryParams).filter(([_, v]) => v.trim() !== '');
      if (validParams.length > 0) {
        const search = new URLSearchParams(validParams as [string, string][]).toString();
        url += `?${search}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake_jwt_token_for_tester_or_guest',
        },
      };

      if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const json = await res.json();

      setResponseStatus(res.status);
      setResponseDuration(Math.round(endTime - startTime));
      setResponseData(JSON.stringify(json, null, 2));
    } catch (err: unknown) {
      const endTime = performance.now();
      setResponseStatus(500);
      setResponseDuration(Math.round(endTime - startTime));
      const message = err instanceof Error ? err.message : 'Unknown Network error';
      setResponseData(JSON.stringify({ error: message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const generateCurl = () => {
    let url = `http://localhost:5000${selectedEndpoint.path}`;
    const validParams = Object.entries(queryParams).filter(([_, v]) => v.trim() !== '');
    if (validParams.length > 0) {
      url += `?${new URLSearchParams(validParams as [string, string][]).toString()}`;
    }

    let curl = `curl -X ${selectedEndpoint.method} "${url}" \\\n  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\\n  -H "Content-Type: application/json"`;
    if (['POST', 'PUT'].includes(selectedEndpoint.method) && requestBody) {
      curl += ` \\\n  -d '${requestBody.replace(/\n/g, '')}'`;
    }
    return curl;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(generateCurl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = Array.from(new Set(ENDPOINTS.map((e) => e.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold font-serif">RESTful API Test Console (Swagger Style)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Banglanews24 Node.js + Express backend REST endpoints with live query execution & cURL generator
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Server: Online (200 OK)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Endpoint Selector Sidebar */}
          <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50 p-4 space-y-6">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-2">
                  {cat}
                </span>
                <div className="space-y-1">
                  {ENDPOINTS.filter((e) => e.category === cat).map((ep, idx) => {
                    const isSelected = selectedEndpoint.path === ep.path && selectedEndpoint.method === ep.method;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectEndpoint(ep)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-red-600 text-white font-semibold shadow-xs'
                            : 'hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            isSelected
                              ? 'bg-white text-red-700'
                              : ep.method === 'GET'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="truncate font-mono">{ep.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Request & Response Playground */}
          <div className="lg:col-span-8 p-6 flex flex-col space-y-6 bg-white">
            {/* Active Endpoint Banner */}
            <div className="bg-slate-900 text-white rounded-lg p-4 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-1 rounded font-bold uppercase ${
                  selectedEndpoint.method === 'GET' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-slate-200 font-semibold">{selectedEndpoint.path}</span>
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>Send Request</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              💡 {selectedEndpoint.description}
            </p>

            {/* Query Parameters Input */}
            {selectedEndpoint.defaultParams && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Query Parameters
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {Object.entries(selectedEndpoint.defaultParams).map(([key, defaultValue]) => (
                    <div key={key} className="space-y-1">
                      <span className="text-[11px] font-mono text-slate-600 font-bold">{key}</span>
                      <input
                        type="text"
                        value={queryParams[key] !== undefined ? queryParams[key] : defaultValue}
                        onChange={(e) => setQueryParams({ ...queryParams, [key]: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono focus:outline-hidden focus:border-red-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body Editor (for POST/PUT) */}
            {['POST', 'PUT'].includes(selectedEndpoint.method) && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  JSON Request Body (application/json)
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}

            {/* Response Output Console */}
            <div className="space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span>Server Response</span>
                  {responseStatus && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        responseStatus >= 200 && responseStatus < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Status: {responseStatus}
                    </span>
                  )}
                  {responseDuration !== null && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ⏱️ {responseDuration} ms
                    </span>
                  )}
                </label>

                <button
                  onClick={copyCurl}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'cURL Copied!' : 'Copy cURL'}</span>
                </button>
              </div>

              <div className="relative flex-1 min-h-[220px] bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-lg overflow-x-auto shadow-inner border border-slate-800">
                {responseData ? (
                  <pre className="text-emerald-400 whitespace-pre-wrap">{responseData}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
                    <Send className="w-6 h-6 mb-2 text-slate-600" />
                    <span>Click &quot;Send Request&quot; to execute endpoint live on the backend</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
