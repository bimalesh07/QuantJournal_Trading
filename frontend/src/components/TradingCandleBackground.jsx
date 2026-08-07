import React, { useEffect, useRef } from 'react';

export default function TradingCandleBackground() {
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

    // Generate floating candlesticks
    const candlesCount = Math.floor(width / 45);
    const candles = Array.from({ length: candlesCount }).map((_, i) => {
      const isGreen = Math.random() > 0.45;
      const candleWidth = 14 + Math.random() * 12;
      const bodyHeight = 30 + Math.random() * 80;
      const wickTop = 15 + Math.random() * 35;
      const wickBottom = 15 + Math.random() * 35;
      const x = i * 48 + 20;
      const y = Math.random() * (height - 200) + 100;
      const speed = 0.25 + Math.random() * 0.45;

      return {
        x,
        y,
        width: candleWidth,
        height: bodyHeight,
        wickTop,
        wickBottom,
        isGreen,
        speed,
        opacity: 0.12 + Math.random() * 0.25,
        priceLabel: isGreen ? `+${(Math.random() * 2.5).toFixed(2)}%` : `-${(Math.random() * 2.1).toFixed(2)}%`
      };
    });

    // Floating price ticker bubbles
    const tickers = [
      { text: '🇮🇳 NIFTY 24,560.80', x: width * 0.15, y: height * 0.25, vx: 0.3, vy: -0.15 },
      { text: '⚡ BTC/USD $68,450.00', x: width * 0.75, y: height * 0.2, vx: -0.25, vy: 0.2 },
      { text: '🏆 GOLD $2,418.50', x: width * 0.4, y: height * 0.75, vx: 0.2, vy: -0.25 },
      { text: '🇮🇳 BANK NIFTY 52,400.10', x: width * 0.82, y: height * 0.7, vx: -0.35, vy: -0.15 },
      { text: '💎 ETH/USD $3,520.40', x: width * 0.1, y: height * 0.8, vx: 0.25, vy: 0.3 }
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Isometric Trading Grid Background Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 60;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Moving Japanese Candlesticks
      candles.forEach((c) => {
        c.y -= c.speed;
        if (c.y + c.height + c.wickBottom < 0) {
          c.y = height + 100;
          c.isGreen = Math.random() > 0.45;
        }

        const color = c.isGreen ? '#10b981' : '#f43f5e';
        const shadowColor = c.isGreen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';

        ctx.save();
        ctx.globalAlpha = c.opacity;
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 12;

        // Draw Wick Line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c.x + c.width / 2, c.y - c.wickTop);
        ctx.lineTo(c.x + c.width / 2, c.y + c.height + c.wickBottom);
        ctx.stroke();

        // Draw Candle Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, c.width, c.height, 4);
        ctx.fill();

        ctx.restore();
      });

      // 3. Draw Floating Ticker Price Bubbles
      tickers.forEach((t) => {
        t.x += t.vx;
        t.y += t.vy;

        if (t.x < 50 || t.x > width - 150) t.vx *= -1;
        if (t.y < 50 || t.y > height - 100) t.vy *= -1;

        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      });

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
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity"
    />
  );
}
