import React, { useEffect, useRef } from 'react';

export default function InstitutionalOrderflowCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Dynamic Liquidity & Order Block Zones
    const orderBlocks = [
      { text: '🏛️ INSTITUTIONAL ORDER BLOCK (OB)', y: height * 0.22, speed: 0.3, isBid: true },
      { text: '⚡ FAIR VALUE GAP (FVG) IMPALANCE', y: height * 0.45, speed: -0.25, isBid: false },
      { text: '🎯 LIQUIDITY SWEEP LEVEL $24,560', y: height * 0.72, speed: 0.35, isBid: true },
      { text: '🔒 HIGH FREQUENCY ALGO POOL #09', y: height * 0.85, speed: -0.2, isBid: false }
    ];

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.015;

      // 1. Draw High-Tech Depth Chart Sine Waves (Orderbook Liquidity Curve)
      ctx.save();
      ctx.globalAlpha = 0.15;
      
      // Green Bid Liquidity Wave
      ctx.beginPath();
      ctx.moveTo(0, height * 0.6);
      for (let x = 0; x < width; x += 10) {
        const y = Math.sin(x * 0.005 + phase) * 45 + Math.cos(x * 0.002) * 30 + height * 0.65;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Red Ask Liquidity Wave
      ctx.beginPath();
      ctx.moveTo(0, height * 0.35);
      for (let x = 0; x < width; x += 10) {
        const y = Math.sin(x * 0.006 - phase) * 40 + Math.sin(x * 0.003) * 25 + height * 0.35;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();

      // 2. Draw Floating Smart Money Concept Order Blocks & Liquidity Tags
      orderBlocks.forEach((ob, idx) => {
        ob.y += ob.speed;
        if (ob.y < 50 || ob.y > height - 50) ob.speed *= -1;

        const xPos = (idx % 2 === 0) ? width * 0.08 : width * 0.68;
        const color = ob.isBid ? '#10b981' : '#06b6d4';
        const shadowColor = ob.isBid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)';

        ctx.save();
        ctx.globalAlpha = 0.28;
        
        // Translucent Zone Rect
        ctx.fillStyle = ob.isBid ? 'rgba(16, 185, 129, 0.05)' : 'rgba(6, 182, 212, 0.05)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(xPos, ob.y - 12, 320, 42, 10);
        ctx.fill();
        ctx.stroke();

        // Label Text
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = color;
        ctx.fillText(ob.text, xPos + 16, ob.y + 14);

        ctx.restore();
      });

      // 3. Draw Orderbook Micro-Pulse Ticker Particles
      ctx.save();
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < 25; i++) {
        const px = (i * 75 + phase * 40) % width;
        const py = (Math.sin(i + phase) * 120) + height / 2;
        ctx.fillStyle = i % 2 === 0 ? '#10b981' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85 transition-opacity"
    />
  );
}
