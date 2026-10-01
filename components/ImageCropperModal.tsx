'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Check, RotateCw, ZoomIn, ZoomOut, RefreshCw, 
  Maximize2, Crop, Move, Sparkles, Image as ImageIcon, FlipHorizontal
} from 'lucide-react';

export type AspectRatioType = '16:9' | '4:3' | '1:1' | '3:2' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  initialAspectRatio?: AspectRatioType;
  title?: string;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  initialAspectRatio = '16:9',
  title = 'সংবাদের ছবির ফ্রেম ও ক্রপ অ্যাডজাস্টমেন্ট (Image Cropper)'
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgNaturalSize, setImgNaturalSize] = useState<{ width: number; height: number }>({ width: 800, height: 450 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset settings when image is loaded in modal
  const [prevImageKey, setPrevImageKey] = useState<string>('');
  
  if (isOpen && prevImageKey !== `${imageSrc}-${isOpen}`) {
    setPrevImageKey(`${imageSrc}-${isOpen}`);
    setZoom(1);
    setRotation(0);
    setIsFlipped(false);
    setPan({ x: 0, y: 0 });
    setAspectRatio(initialAspectRatio);
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNaturalSize({ width: img.naturalWidth || 800, height: img.naturalHeight || 450 });
  };

  const getAspectNumeric = (ratio: AspectRatioType): number => {
    switch (ratio) {
      case '16:9': return 16 / 9;
      case '4:3': return 4 / 3;
      case '1:1': return 1;
      case '3:2': return 3 / 2;
      case 'free': return imgNaturalSize.width / (imgNaturalSize.height || 1);
      default: return 16 / 9;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setIsFlipped(false);
    setPan({ x: 0, y: 0 });
  };

  const handleSaveCrop = () => {
    if (!imageRef.current) return;
    const img = imageRef.current;

    // Target output dimensions based on aspect ratio
    const targetAspect = getAspectNumeric(aspectRatio);
    let targetWidth = 960;
    let targetHeight = Math.round(targetWidth / targetAspect);

    if (aspectRatio === '1:1') {
      targetWidth = 500;
      targetHeight = 500;
    } else if (aspectRatio === '4:3') {
      targetWidth = 800;
      targetHeight = 600;
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Save context
    ctx.save();

    // Center canvas for transformations
    ctx.translate(targetWidth / 2, targetHeight / 2);

    // Apply rotation & flip
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(isFlipped ? -1 : 1, 1);

    // Calculate crop box scaling relative to preview container
    const previewContainer = containerRef.current;
    let scaleFactor = 1;
    if (previewContainer) {
      const rect = previewContainer.getBoundingClientRect();
      scaleFactor = targetWidth / Math.max(rect.width, 100);
    }

    // Apply pan offset adjusted by zoom and target canvas scale
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);

    // Base drawing size maintaining natural ratio multiplied by user zoom
    const naturalRatio = img.naturalWidth / (img.naturalHeight || 1);
    let drawW: number;
    let drawH: number;

    if (naturalRatio > targetAspect) {
      drawH = targetHeight * zoom;
      drawW = drawH * naturalRatio;
    } else {
      drawW = targetWidth * zoom;
      drawH = drawW / naturalRatio;
    }

    // Draw the image centered
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    // Export as optimized high-quality image
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {aspectRatio.toUpperCase()}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">ছবির কাঙ্ক্ষিত অনুপাত (Aspect Ratio) নির্বাচন করে ড্র্যাগ ও জুম করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-950/60">
          
          {/* Aspect Ratio Selector Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              অ্যাসপেক্ট রেশিও প্রিসেট (Aspect Ratio Presets):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setAspectRatio('16:9'); handleReset(); }}
                className={`px-3 py-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs">16:9 (স্ট্যান্ডার্ড)</span>
                <span className="text-[10px] opacity-80">মূল সংবাদ ও লিড</span>
              </button>

              <button
                type="button"
                onClick={() => { setAspectRatio('4:3'); handleReset(); }}
                className={`px-3 py-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  aspectRatio === '4:3'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs">4:3 (ম্যাগাজিন)</span>
                <span className="text-[10px] opacity-80">কলাম ও বিনোদন</span>
              </button>

              <button
                type="button"
                onClick={() => { setAspectRatio('1:1'); handleReset(); }}
                className={`px-3 py-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  aspectRatio === '1:1'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs">1:1 (বর্গাকার)</span>
                <span className="text-[10px] opacity-80">প্রোফাইল / স্কয়ার</span>
              </button>

              <button
                type="button"
                onClick={() => { setAspectRatio('3:2'); handleReset(); }}
                className={`px-3 py-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  aspectRatio === '3:2'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs">3:2 (ফটোগ্রাফি)</span>
                <span className="text-[10px] opacity-80">ডিএসএলআর ফটো</span>
              </button>

              <button
                type="button"
                onClick={() => { setAspectRatio('free'); handleReset(); }}
                className={`px-3 py-2.5 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                  aspectRatio === 'free'
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs">মুক্ত সাইজ (Free)</span>
                <span className="text-[10px] opacity-80">মূল সাইজ বজায় রাখুন</span>
              </button>
            </div>
          </div>

          {/* Interactive Crop Viewport Frame */}
          <div className="relative w-full flex items-center justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-hidden select-none min-h-[260px] sm:min-h-[340px]">
            
            <div
              ref={containerRef}
              style={{
                aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '4:3' ? '4/3' : aspectRatio === '1:1' ? '1/1' : aspectRatio === '3:2' ? '3/2' : 'auto',
                width: '100%',
                maxWidth: aspectRatio === '1:1' ? '320px' : '560px',
              }}
              className={`relative overflow-hidden rounded-xl border-2 border-red-500 shadow-2xl bg-black cursor-grab active:cursor-grabbing transition-all ${
                isDragging ? 'ring-4 ring-red-500/30' : ''
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Grid Overlay for Rule of Thirds */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 border border-red-500/40 opacity-70">
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-r border-b border-white/20"></div>
                <div className="border-b border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div className="border-r border-white/20"></div>
                <div></div>
              </div>

              {/* Centered Image with dynamic transformations */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop Preview"
                  onLoad={handleImageLoad}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                    transformOrigin: 'center center',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  }}
                  className="select-none pointer-events-none"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Pan Prompt Badge */}
              <div className="absolute bottom-2 left-2 z-20 pointer-events-none bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
                <Move className="w-3 h-3 text-red-400" />
                <span>মাউস বা আঙুল দিয়ে ড্র্যাগ করে পজিশন করুন</span>
              </div>
            </div>
          </div>

          {/* Controls: Zoom, Rotate, Flip, Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
            
            {/* Zoom Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4 text-red-500" />
                  <span>জুম লেভেল (Zoom Level):</span>
                </span>
                <span className="text-white font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
                  title="জুম আউট"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3.0, Number((z + 0.1).toFixed(2))))}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
                  title="জুম ইন"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transformations: Rotate, Flip, Reset */}
            <div className="space-y-2">
              <span className="block text-slate-300 font-bold">টুলস ও রোটেশন (Rotate & Flip):</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>ঘোরান (90°)</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlip}
                  className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FlipHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  <span>উল্টান (Flip)</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="রিসেট করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ক্রপ করার পর স্বয়ংক্রিয়ভাবে হাই-রেজ্যুলুশন ফরম্যাটে সংরক্ষিত হবে</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>ক্রপ ও প্রয়োগ করুন (Apply Crop)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
