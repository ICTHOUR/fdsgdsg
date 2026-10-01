'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Image as ImageIcon, 
  Palette, Type, Heading1, Heading2, Heading3, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, List, ListOrdered, 
  Quote, Eye, Code, Edit3, X, Check, Link as LinkIcon, Upload, FolderUp, Trash2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const COLOR_PRESETS = [
  { name: 'ডিফল্ট', value: '#1e293b' },
  { name: 'লাল', value: '#dc2626' },
  { name: 'নীল', value: '#2563eb' },
  { name: 'সবুজ', value: '#16a34a' },
  { name: 'সোনালী', value: '#d97706' },
  { name: 'বেগুনি', value: '#7c3aed' },
  { name: 'ধূসর', value: '#475569' },
];

const FONT_SIZES = [
  { label: '১২px (খুব ছোট)', value: '12px' },
  { label: '১৪px (ছোট)', value: '14px' },
  { label: '১৬px (স্বাভাবিক)', value: '16px' },
  { label: '১৮px (মাঝারি)', value: '18px' },
  { label: '২১px (বড়)', value: '21px' },
  { label: '২৪px (বিশাল)', value: '24px' },
];

const SAMPLE_IMAGE_PRESETS = [
  { label: 'সংবাদ সম্মেলন', url: 'https://picsum.photos/seed/pressconf26/800/450', caption: 'রাজধানীতে আয়োজিত সংবাদ সম্মেলনে বক্তব্য রাখছেন নেতৃবৃন্দ' },
  { label: 'জাতীয় সংসদ', url: 'https://picsum.photos/seed/parliament26/800/450', caption: 'জাতীয় সংসদের অধিবেশন কক্ষ' },
  { label: 'খেলাধুলা ও ক্রিকেট', url: 'https://picsum.photos/seed/sportsmatch26/800/450', caption: 'মাঠে উল্লাসরত খেলোয়াড়দের দৃশ্য' },
  { label: 'অর্থনীতি ও বাজার', url: 'https://picsum.photos/seed/economyport26/800/450', caption: 'ব্যস্ততম বাণিজ্য ও অর্থনৈতিক কার্যক্রম' },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'সংবাদের বিস্তারিত কন্টেন্ট এখানে লিখুন...',
  minHeight = '280px',
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'html' | 'preview'>('editor');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Image Modal State
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlignment, setImageAlignment] = useState<'center' | 'full' | 'left' | 'right'>('center');
  const [dragActive, setDragActive] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal HTML value with external value safely
  useEffect(() => {
    if (editorRef.current && activeTab === 'editor') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '<p><br></p>';
      }
    }
  }, [value, activeTab]);

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Helper to execute native rich text commands
  const execCmd = (command: string, valueArg: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, valueArg);
    handleEditorInput();
  };

  // Format Handlers
  const handleBold = () => execCmd('bold');
  const handleItalic = () => execCmd('italic');
  const handleUnderline = () => execCmd('underline');
  const handleStrikethrough = () => execCmd('strikeThrough');
  
  const handleHeading = (level: 1 | 2 | 3) => {
    execCmd('formatBlock', `<h${level}>`);
  };

  const handleParagraph = () => {
    execCmd('formatBlock', '<p>');
  };

  const handleQuote = () => {
    execCmd('formatBlock', '<blockquote>');
  };

  const handleAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    const cmdMap = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull'
    };
    execCmd(cmdMap[align]);
  };

  const handleList = (ordered = false) => {
    execCmd(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const handleApplyColor = (colorHex: string) => {
    execCmd('foreColor', colorHex);
    setShowColorPicker(false);
  };

  const handleApplyFontSize = (sizePx: string) => {
    const sel = window.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizePx;
      span.textContent = range.toString() || 'নির্দিষ্ট আকারের টেক্সট';
      range.deleteContents();
      range.insertNode(span);
      handleEditorInput();
    }
    setShowFontSizePicker(false);
  };

  // Process File Drag / Upload
  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrl(result);
        if (!imageAlt) {
          setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  // Insert HTML block nicely at cursor in contentEditable div or append in raw text
  const insertHTMLAtCursor = (html: string) => {
    if (activeTab === 'editor' && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel && sel.getRangeAt && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        
        const el = document.createElement('div');
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node;
        while ((node = el.firstChild)) {
          frag.appendChild(node);
        }
        range.insertNode(frag);
        handleEditorInput();
        return;
      }
    }
    
    // Fallback or HTML tab insertion
    onChange(value + html);
  };

  const handleInsertImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    let alignClass = 'text-center my-4';
    let imgClass = 'w-full max-w-[720px] mx-auto rounded-xl shadow-md border border-slate-200';

    if (imageAlignment === 'full') {
      alignClass = 'my-5 w-full';
      imgClass = 'w-full rounded-xl shadow-md';
    } else if (imageAlignment === 'left') {
      alignClass = 'float-left mr-5 mb-4 max-w-[320px]';
      imgClass = 'w-full rounded-xl shadow-sm border border-slate-200';
    } else if (imageAlignment === 'right') {
      alignClass = 'float-right ml-5 mb-4 max-w-[320px]';
      imgClass = 'w-full rounded-xl shadow-sm border border-slate-200';
    }

    const captionHtml = imageCaption.trim()
      ? `<figcaption class="italic text-xs sm:text-sm text-slate-500 mt-2 text-center font-sans leading-relaxed">${imageCaption.trim()}</figcaption>`
      : '';

    const imgTag = `\n<figure class="${alignClass}">
  <img src="${imageUrl.trim()}" alt="${imageAlt.trim() || 'নিউজ ছবি'}" class="${imgClass}" />
  ${captionHtml}
</figure>\n`;

    insertHTMLAtCursor(imgTag);

    setShowImageModal(false);
    setImageUrl('');
    setImageCaption('');
    setImageAlt('');
    setImageAlignment('center');
  };

  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950 text-slate-200">
      
      {/* Top Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap items-center justify-between gap-1.5 text-xs">
        
        {/* Left Formatting Group */}
        <div className="flex flex-wrap items-center gap-1">
          
          {/* Text Style Dropdown */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded px-1 py-0.5 border border-slate-700">
            <button
              type="button"
              onClick={handleParagraph}
              className="px-2 py-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-medium cursor-pointer"
              title="স্বাভাবিক অনুচ্ছেদ"
            >
              अनुच्छेद
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => handleHeading(1)}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-bold cursor-pointer"
              title="শিরোনাম ১ (H1)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => handleHeading(2)}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-bold cursor-pointer"
              title="উপ-শিরোনাম ২ (H2)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => handleHeading(3)}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-bold cursor-pointer"
              title="উপ-শিরোনাম ৩ (H3)"
            >
              H3
            </button>
          </div>

          {/* Bold, Italic, Underline, Strikethrough */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded px-1 py-0.5 border border-slate-700">
            <button
              type="button"
              onClick={handleBold}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="বোল্ড"
            >
              <Bold className="w-3.5 h-3.5 font-bold" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="ইটালিক"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleUnderline}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="আন্ডারলাইন"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleStrikethrough}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="স্ট্রাইকথ্রু"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Size Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFontSizePicker(!showFontSizePicker);
                setShowColorPicker(false);
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded text-slate-200 cursor-pointer"
              title="ফন্ট সাইজ পরিবর্তন"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>ফন্ট সাইজ</span>
            </button>

            {showFontSizePicker && (
              <div className="absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1.5 z-50 min-w-[140px] space-y-1 animate-in fade-in">
                {FONT_SIZES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => handleApplyFontSize(f.value)}
                    className="w-full text-left px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 text-xs cursor-pointer block"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowFontSizePicker(false);
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded text-slate-200 cursor-pointer"
              title="টেক্সট কালার পরিবর্তন"
            >
              <Palette className="w-3.5 h-3.5 text-red-400" />
              <span>টেক্সট কালার</span>
            </button>

            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 min-w-[170px] space-y-2 animate-in fade-in">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">রঙের প্যালেট</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => handleApplyColor(c.value)}
                      className="w-6 h-6 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* Alignment */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded px-1 py-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => handleAlign('left')}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="বামে সাজান"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('center')}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="মাঝে সাজান"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('right')}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="ডানে সাজান"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleAlign('justify')}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="উভয় পাশে সমান"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5 bg-slate-800 rounded px-1 py-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => handleList(false)}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="বুলেট লিস্ট"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleList(true)}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="সংখ্যাযুক্ত লিস্ট"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleQuote}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer"
              title="উদ্ধৃতি (Blockquote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* IMAGE INSERT BUTTON */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded shadow-xs cursor-pointer transition-colors"
            title="মূল কন্টেন্টে ছবি যুক্ত করুন"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>+ ছবি যুক্ত করুন</span>
          </button>

        </div>

        {/* Right View Modes Group */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
              activeTab === 'editor' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>সম্পাদনা (ভিজুয়াল)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
              activeTab === 'html' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>এইচটিএমএল কোড</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
              activeTab === 'preview' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>লাইভ প্রিভিউ</span>
          </button>
        </div>

      </div>

      {/* Editor Body */}
      <div className="p-3 bg-slate-950">
        {activeTab === 'editor' ? (
          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleEditorInput}
            style={{ minHeight, outline: 'none' }}
            className="w-full bg-slate-950 text-slate-100 text-sm leading-relaxed p-4 overflow-y-auto rounded-lg border border-slate-800 focus:border-red-500/50 transition-colors markdown-body"
            placeholder={placeholder}
          />
        ) : activeTab === 'html' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="এখানে সরাসরি এইচটিএমএল বা টেক্সট লিখুন..."
            style={{ minHeight }}
            className="w-full bg-slate-900 text-yellow-300 font-mono text-xs leading-relaxed p-4 focus:outline-hidden resize-y border border-slate-800 rounded-lg"
          />
        ) : (
          <div 
            style={{ minHeight }}
            className="w-full bg-white text-slate-900 text-sm leading-relaxed p-5 rounded-lg overflow-y-auto border border-slate-200"
          >
            {value.trim() ? (
              <div 
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: value }} 
              />
            ) : (
              <p className="text-slate-400 italic text-center py-10">কোনো কন্টেন্ট লেখা হয়নি। কন্টেন্ট লিখতে &apos;সম্পাদনা (ভিজুয়াল)&apos; ট্যাবে ফিরে যান।</p>
            )}
          </div>
        )}
      </div>

      {/* Quick Tips Footer */}
      <div className="bg-slate-900/80 border-t border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <span>টিপস: ভিজ্যুয়াল মোডে সরাসরি ছবি রেন্ডার হবে (কোনো কোড লিঙ্ক দেখাবে না)। টাইপ করুন স্বাভাবিকভাবে।</span>
        <span>অক্ষর সংখ্যা: {value.length}</span>
      </div>

      {/* MODAL: IMAGE INSERTION WITH CAPTION & DIRECT FILE UPLOAD */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-600/20 text-red-500 rounded-lg">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">কন্টেন্টে সরাসরি ছবি যুক্ত করুন</h3>
                  <p className="text-[11px] text-slate-400">ডিভাইস থেকে ফাইল নির্বাচন করুন বা অনলাইন ইমেজের লিঙ্ক দিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setImageUploadMode('upload')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  imageUploadMode === 'upload'
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>ডিভাইস থেকে আপলোড</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUploadMode('url')}
                className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  imageUploadMode === 'url'
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>অনলাইন লিঙ্ক (URL)</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 text-xs">
              
              {imageUploadMode === 'upload' ? (
                <div className="space-y-3">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-red-500 bg-red-500/10'
                        : imageUrl
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : 'border-slate-700 hover:border-slate-500 bg-slate-950/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                      onChange={handleFileUploadChange}
                      className="hidden"
                    />

                    {imageUrl ? (
                      <div className="space-y-2">
                        <div className="relative inline-block max-h-44 overflow-hidden rounded-lg border border-slate-700 shadow-md">
                          <img
                            src={imageUrl}
                            alt="আপলোড করা ছবি"
                            className="max-h-44 mx-auto object-contain"
                          />
                        </div>
                        <p className="text-emerald-400 font-bold text-xs flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>ছবিটি সফলভাবে লোড হয়েছে!</span>
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-full mx-auto flex items-center justify-center">
                          <FolderUp className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-sm">
                            ছবি আপলোড করতে ক্লিক করুন অথবা ফাইল এখানে টেনে আনুন (Drag & Drop)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      ছবির অনলাইন লিঙ্ক (Image URL) *
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500 font-mono"
                    />
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 mb-1.5">নমুনা ছবি:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setImageUrl(preset.url);
                            setImageCaption(preset.caption);
                            setImageAlt(preset.label);
                          }}
                          className="text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded p-2 text-[11px] cursor-pointer text-slate-300 hover:text-white"
                        >
                          <div className="font-bold text-red-400">{preset.label}</div>
                          <div className="text-[10px] text-slate-400 truncate">{preset.caption}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Caption Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ছবির ক্যাপশন (Image Caption)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ফাইল ছবি - মাতৃভূমি টিভি"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Position and Alt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ছবির বর্ণনা (Alt Text)
                  </label>
                  <input
                    type="text"
                    placeholder="সংবাদের ছবির বিবরণ"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    কন্টেন্টে ছবির পজিশন (Alignment)
                  </label>
                  <select
                    value={imageAlignment}
                    onChange={(e) => setImageAlignment(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500 font-semibold"
                  >
                    <option value="center">মাঝখানে (Center)</option>
                    <option value="full">সম্পূর্ণ চওড়া (Full Width)</option>
                    <option value="left">বামে (Float Left)</option>
                    <option value="right">ডানে (Float Right)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleInsertImageSubmit}
                  disabled={!imageUrl.trim()}
                  className={`px-5 py-2 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md transition-colors flex items-center gap-1.5 ${
                    imageUrl.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>কন্টেন্টে যুক্ত করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
