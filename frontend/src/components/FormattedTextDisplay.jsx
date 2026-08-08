import React from 'react';

/**
 * Component to safely parse and display formatted text with rich highlights,
 * headers/big fonts, bold/italic, bullet lists, callout boxes, and tags.
 */
export default function FormattedTextDisplay({ content = '', className = '' }) {
  if (!content) return null;

  // Convert basic markdown/HTML-like patterns into formatted JSX elements
  const lines = String(content).split('\n');

  // Helper to parse line-level formatting (bold, italic, mark/highlight, tags)
  const parseInlineStyles = (text) => {
    if (!text) return null;

    // Replace custom markdown highlight ==word== with HTML mark tag
    let processedText = text.replace(/==(.*?)==/g, '<mark class="bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-bold border border-amber-500/40">$1</mark>');
    
    const elements = [];
    let lastIdx = 0;
    
    // Pattern to match <mark ...>...</mark>, <b>...</b>, <strong>...</strong>, <i>...</i>, <span ...>...</span>, **...**
    const regex = /(<mark[^>]*>.*?<\/mark>|<b>.*?<\/b>|<strong>.*?<\/strong>|<i>.*?<\/i>|<span[^>]*>.*?<\/span>|\*\*(.*?)\*\*|\*(.*?)\*)/g;
    let match;

    while ((match = regex.exec(processedText)) !== null) {
      // Add preceding plain text
      if (match.index > lastIdx) {
        elements.push(processedText.substring(lastIdx, match.index));
      }

      const fullMatch = match[0];
      const boldText = match[2];
      const italicText = match[3];

      if (boldText !== undefined) {
        elements.push(<strong key={match.index} className="font-extrabold text-cyan-300">{boldText}</strong>);
      } else if (italicText !== undefined) {
        elements.push(<em key={match.index} className="italic text-slate-300">{italicText}</em>);
      } else if (fullMatch.startsWith('<mark')) {
        const innerMatch = fullMatch.match(/<mark[^>]*class="([^"]*)"[^>]*>(.*?)<\/mark>/) || fullMatch.match(/<mark[^>]*>(.*?)<\/mark>/);
        if (innerMatch && innerMatch[2]) {
          const customClass = innerMatch[1] || "bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded font-bold border border-amber-500/40";
          elements.push(
            <mark key={match.index} className={customClass}>
              {innerMatch[2]}
            </mark>
          );
        } else {
          const contentOnly = fullMatch.replace(/<\/?mark[^>]*>/g, '');
          elements.push(
            <mark key={match.index} className="bg-yellow-500/30 text-yellow-200 px-1.5 py-0.5 rounded font-bold border border-yellow-500/40">
              {contentOnly}
            </mark>
          );
        }
      } else if (fullMatch.startsWith('<span')) {
        const spanMatch = fullMatch.match(/<span[^>]*class="([^"]*)"[^>]*>(.*?)<\/span>/) || fullMatch.match(/<span[^>]*>(.*?)<\/span>/);
        if (spanMatch && spanMatch[2]) {
          const spanClass = spanMatch[1] || "font-bold text-white";
          elements.push(
            <span key={match.index} className={spanClass}>
              {spanMatch[2]}
            </span>
          );
        } else {
          elements.push(fullMatch.replace(/<\/?span[^>]*>/g, ''));
        }
      } else if (fullMatch.startsWith('<b>') || fullMatch.startsWith('<strong>')) {
        const inner = fullMatch.replace(/<\/?(b|strong)>/g, '');
        elements.push(<strong key={match.index} className="font-extrabold text-cyan-300">{inner}</strong>);
      } else if (fullMatch.startsWith('<i>')) {
        const inner = fullMatch.replace(/<\/?i>/g, '');
        elements.push(<em key={match.index} className="italic text-slate-300">{inner}</em>);
      } else {
        elements.push(fullMatch);
      }

      lastIdx = regex.lastIndex;
    }

    if (lastIdx < processedText.length) {
      elements.push(processedText.substring(lastIdx));
    }

    return elements.length > 0 ? elements : processedText;
  };

  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={index} className="h-2" />;
        }

        // Header 1 / Big Font (# Header)
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={index} className="text-base sm:text-lg font-black text-cyan-300 tracking-wide mt-3 mb-1 border-b border-cyan-500/20 pb-1">
              {parseInlineStyles(trimmed.slice(2))}
            </h2>
          );
        }

        // Header 2 / Sub-Header (## Header)
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={index} className="text-sm sm:text-base font-bold text-emerald-400 mt-2.5 mb-1">
              {parseInlineStyles(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet list (- item or * item)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={index} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
              <div className="text-xs sm:text-sm text-slate-200">
                {parseInlineStyles(trimmed.slice(2))}
              </div>
            </div>
          );
        }

        // Numbered list (1. item, 2. item)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={index} className="flex items-start gap-2 pl-2 my-0.5">
              <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 min-w-[18px]">
                {numMatch[1]}.
              </span>
              <div className="text-xs sm:text-sm text-slate-200">
                {parseInlineStyles(numMatch[2])}
              </div>
            </div>
          );
        }

        // Callout / Note Box (> Note: ...)
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={index} className="my-2 p-3 rounded-xl bg-cyan-950/40 border-l-4 border-cyan-400 text-cyan-200 text-xs sm:text-sm font-medium shadow-inner">
              {parseInlineStyles(trimmed.slice(2))}
            </blockquote>
          );
        }

        // Regular Paragraph
        return (
          <p key={index} className="text-xs sm:text-sm text-slate-200">
            {parseInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}
