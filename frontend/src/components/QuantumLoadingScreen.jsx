import React, { useState, useEffect } from 'react';

export default function QuantumLoadingScreen() {
  const [progress, setProgress] = useState(20);
  const [visibleCount, setVisibleCount] = useState(1);

  const candlesData = [
    { body: 'h-8', color: 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]', wickTop: 'h-3', wickBottom: 'h-2', isGreen: true },
    { body: 'h-5', color: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]', wickTop: 'h-2', wickBottom: 'h-3', isGreen: false },
    { body: 'h-12', color: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]', wickTop: 'h-4', wickBottom: 'h-2', isGreen: true },
    { body: 'h-7', color: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]', wickTop: 'h-2', wickBottom: 'h-4', isGreen: true },
    { body: 'h-4', color: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]', wickTop: 'h-1', wickBottom: 'h-2', isGreen: false },
    { body: 'h-16', color: 'bg-gradient-to-t from-emerald-500 via-teal-300 to-cyan-300 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse', wickTop: 'h-5', wickBottom: 'h-3', isGreen: true }
  ];

  useEffect(() => {
    // Top High-Speed Progress Bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 30;
      });
    }, 25);

    // Left-to-Right Candlestick Formation Sequence
    const candleTimer = setInterval(() => {
      setVisibleCount(prev => (prev < candlesData.length ? prev + 1 : candlesData.length));
    }, 45);

    return () => {
      clearInterval(progressTimer);
      clearInterval(candleTimer);
    };
  }, [candlesData.length]);

  return (
    <div className="py-16 px-4 flex items-center justify-center min-h-[40vh] relative overflow-hidden select-none">
      
      {/* Top High-Speed Laser Beam Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#060913]">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-teal-300 shadow-[0_0_20px_rgba(6,182,212,0.9)] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pure Candlesticks Forming Left to Right with Continuous Infinite Up-Down Motion */}
      <div className="flex items-end justify-center gap-4.5 sm:gap-6 h-36">
        {candlesData.slice(0, visibleCount).map((c, idx) => {
          // Staggered bounce speeds for continuous live up-down market motion
          const bounceDuration = `${0.7 + (idx % 4) * 0.25}s`;
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center group transition-all duration-200 animate-bounce"
              style={{ animationDuration: bounceDuration }}
            >
              {/* Top Wick */}
              <div className={`w-0.5 ${c.wickTop} ${c.isGreen ? 'bg-emerald-400' : 'bg-rose-400'} opacity-80 mb-0.5`}></div>
              
              {/* Candle Body */}
              <div className={`w-3.5 sm:w-5 ${c.body} ${c.color} rounded-xs transition-all duration-300`}></div>
              
              {/* Bottom Wick */}
              <div className={`w-0.5 ${c.wickBottom} ${c.isGreen ? 'bg-emerald-400' : 'bg-rose-400'} opacity-80 mt-0.5`}></div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
