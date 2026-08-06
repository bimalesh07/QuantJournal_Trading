import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2, Move } from 'lucide-react';

export default function ChartLightboxModal({ isOpen, onClose, imageUrl, title = 'Chart Snapshot' }) {
  if (!isOpen || !imageUrl) return null;

  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [imageUrl, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.4, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.4, 0.8));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Mouse Drag / Pan 360° Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.8), 5));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fadeIn select-none overflow-hidden">
      
      {/* Lightbox Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-auto">
        
        {/* Title & Zoom Info */}
        <div className="flex items-center gap-2.5 bg-[#151921]/90 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-md shadow-2xl">
          <Maximize2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold font-mono text-white tracking-wide">{title}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-medium">
            {Math.round(zoomLevel * 100)}% Zoom
          </span>
          {rotation > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-medium">
              {rotation}° Rotated
            </span>
          )}
          <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1 font-mono">
            <Move className="w-3.5 h-3.5 text-slate-400" /> Drag to Pan 360° | Scroll to Zoom
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 bg-[#151921]/90 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md shadow-2xl">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 5}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer disabled:opacity-40"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.8}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer disabled:opacity-40"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 text-purple-300 hover:text-white hover:bg-purple-950/40 rounded-lg transition-all cursor-pointer"
            title="Rotate 90° Right"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            title="Reset View (100% & Center)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <div className="w-[1px] h-5 bg-slate-800 mx-1"></div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive 360° Drag & Pan Image Canvas */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={(e) => {
          if (e.target === containerRef.current) onClose();
        }}
        className={`w-full h-full flex items-center justify-center overflow-hidden p-8 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <img
          src={imageUrl}
          alt={title}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="max-w-[85vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-800/80 pointer-events-auto"
        />
      </div>

    </div>
  );
}
