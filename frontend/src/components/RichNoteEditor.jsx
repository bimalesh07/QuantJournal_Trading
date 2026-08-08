import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Type, 
  List, 
  Highlighter, 
  Sparkles, 
  MessageSquareQuote, 
  Eye, 
  Edit3,
  Bookmark
} from 'lucide-react';
import FormattedTextDisplay from './FormattedTextDisplay';

/**
 * RichNoteEditor: Provides a rich formatting toolbar (Highlighter, Bold, Big Font/Header,
 * Bullet List, Callout Box, Pill Badges) and Live Preview toggle for note/explanation textareas.
 */
export default function RichNoteEditor({
  value = '',
  onChange,
  placeholder = 'Type your detailed logic or notes here...',
  label = 'Detailed Logic Explanation & Entry Rules',
  rows = 6,
  isLight = false,
  required = false,
  className = ''
}) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const textareaRef = useRef(null);

  // Helper to wrap selected text in textarea or insert syntax at cursor position
  const insertFormatting = (prefix, suffix = '', defaultText = 'highlighted text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || '';
    const selectedText = currentVal.substring(start, end) || defaultText;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    if (onChange) {
      onChange(newVal);
    }

    // Restore focus & set selection inside inserted block
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Field Label & Toolbar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        {label && (
          <label className={`text-xs font-bold font-mono tracking-wide ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {label}
            {required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}

        {/* Tab Toggle: Edit vs Live Preview */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[11px] font-mono font-semibold self-start sm:self-auto ${
          isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/15 text-slate-300'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'edit'
                ? (isLight ? 'bg-white text-cyan-600 shadow-sm font-bold' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold')
                : 'hover:text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? (isLight ? 'bg-white text-cyan-600 shadow-sm font-bold' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold')
                : 'hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className={`border rounded-2xl overflow-hidden transition-all focus-within:border-cyan-400/80 shadow-md ${
          isLight ? 'bg-white border-slate-300' : 'bg-[#0A0E1A] border-white/15'
        }`}>
          {/* Quick Formatting Bar */}
          <div className={`flex items-center gap-1 p-2 border-b overflow-x-auto scrollbar-none text-xs font-mono ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#101625] border-white/10'
          }`}>
            <span className="text-[10px] uppercase text-slate-400 font-bold px-1 select-none shrink-0">
              Format:
            </span>

            {/* Yellow Highlight */}
            <button
              type="button"
              onClick={() => insertFormatting('<mark class="bg-yellow-500/30 text-yellow-200 px-1.5 py-0.5 rounded font-bold border border-yellow-500/40">', '</mark>', 'Yellow Highlight')}
              title="Highlight selected word in Yellow"
              className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/40 flex items-center gap-1 font-bold shrink-0 cursor-pointer"
            >
              <Highlighter className="w-3 h-3 text-yellow-400" />
              <span>Yellow</span>
            </button>

            {/* Cyan Glow Highlight */}
            <button
              type="button"
              onClick={() => insertFormatting('<mark class="bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded font-bold border border-cyan-500/40">', '</mark>', 'Cyan Highlight')}
              title="Highlight selected word in Cyan"
              className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 flex items-center gap-1 font-bold shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Cyan</span>
            </button>

            {/* Green Badge Highlight */}
            <button
              type="button"
              onClick={() => insertFormatting('<mark class="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-bold border border-emerald-500/40">', '</mark>', 'Green Glow')}
              title="Highlight selected word in Emerald Green"
              className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center gap-1 font-bold shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3 h-3 text-emerald-400" />
              <span>Green</span>
            </button>

            <span className="w-px h-4 bg-white/10 mx-1 shrink-0"></span>

            {/* Bold */}
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'Bold Text')}
              title="Make selected text bold"
              className={`p-1.5 rounded-md hover:bg-white/10 shrink-0 cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Header / Big Font */}
            <button
              type="button"
              onClick={() => insertFormatting('# ', '', 'Big Section Title')}
              title="Make line a Big Header"
              className={`p-1.5 rounded-md hover:bg-white/10 shrink-0 cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* Bullet List */}
            <button
              type="button"
              onClick={() => insertFormatting('- ', '', 'Bullet rule item')}
              title="Add bullet list point"
              className={`p-1.5 rounded-md hover:bg-white/10 shrink-0 cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>

            {/* Callout / Note Box */}
            <button
              type="button"
              onClick={() => insertFormatting('> 💡 NOTE: ', '', 'Crucial entry rule or risk warning')}
              title="Add callout note box"
              className={`p-1.5 rounded-md hover:bg-white/10 shrink-0 cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Text Area Input */}
          <textarea
            ref={textareaRef}
            rows={rows}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={`w-full p-4 text-xs sm:text-sm font-mono leading-relaxed outline-none resize-y ${
              isLight ? 'bg-white text-slate-900 placeholder:text-slate-400' : 'bg-[#080C16] text-white placeholder:text-slate-500'
            }`}
          />
        </div>
      ) : (
        /* Live Preview Card */
        <div className={`border rounded-2xl p-5 min-h-[140px] shadow-inner ${
          isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#080C16] border-white/15 text-white'
        }`}>
          {value ? (
            <FormattedTextDisplay content={value} />
          ) : (
            <p className="text-xs text-slate-500 italic font-mono">
              Nothing typed yet. Switch back to Editor to type and format your text!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
