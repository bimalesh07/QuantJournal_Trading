import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles } from 'lucide-react';

export default function ImageLightboxModal({ isOpen, onClose, imageUrl, title = 'Chart Screenshot Preview' }) {
  if (!isOpen || !imageUrl) return null;

  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setZoomLevel(1);
  }, [imageUrl, isOpen]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Lightbox Container Card */}
      <div className="relative max-w-6xl w-full max-h-[92vh] flex flex-col bg-[#070A14] border border-white/20 rounded-2xl shadow-2xl overflow-hidden font-mono">
        
        {/* Header Bar with Title & Controls */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D1220] border-b border-white/10 shrink-0 z-10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Maximize2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-wide truncate">{title}</h3>
          </div>

          {/* Zoom Controls Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-[#141A29] px-2 py-1 rounded-xl border border-white/10 text-xs text-slate-300">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="font-bold text-cyan-300 px-2 min-w-[50px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-slate-200 transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Zoomable Image Viewport Container */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[#04060C] select-none [scrollbar-width:thin]">
          <div
            className="transition-transform duration-300 ease-out origin-center cursor-grab active:cursor-grabbing max-w-full max-h-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-2.5 bg-[#0D1220] border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between font-sans">
          <span>Use Zoom (+) / (-) buttons or scroll to inspect chart details & technical setups</span>
          <span className="font-mono text-cyan-400 font-bold">Interactive Chart Inspector</span>
        </div>

      </div>

    </div>
  );
}
