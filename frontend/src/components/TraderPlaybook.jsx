import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Image as ImageIcon, 
  CheckSquare, 
  Sparkles, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Tag, 
  Zap, 
  Check, 
  Clock,
  HelpCircle,
  FileCode,
  Upload,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Download,
  Search,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import RichNoteEditor from './RichNoteEditor';
import FormattedTextDisplay from './FormattedTextDisplay';

export default function TraderPlaybook({ theme = 'dark' }) {
  const isLight = theme === 'light';
  const [lightboxState, setLightboxState] = useState({ isOpen: false, imageUrl: '', title: '' });
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, type: 'concept', id: null, title: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  
  // Search & Filter & Layout States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Daily Notes State
  const [dailyNotes, setDailyNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('tradeTrack_daily_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Playbook Setups Library State
  const [setups, setSetups] = useState(() => {
    try {
      const saved = localStorage.getItem('tradeTrack_setups_library');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          title: 'Fair Value Gap (FVG) Sweep',
          category: 'ICT / Price Action',
          description: 'Wait for 15m displacement that leaves an imbalance (FVG). Enter on 5m retracement into the gap with stop loss below displacement swing.',
          checklist: ['HTF Bias Alignment', 'Clear 15m Displacement', '5m FVG Entry Trigger'],
          imageUrl: ''
        },
        {
          id: 2,
          title: 'Breakout & Retest',
          category: 'Chart Pattern',
          description: 'Wait for key support/resistance breakout with strong volume. Enter on first retest of broken level.',
          checklist: ['Strong Breakout Candle', 'Volume Spike', 'Retest Rejection Candle'],
          imageUrl: ''
        },
        {
          id: 3,
          title: 'NIFTY / BankNifty Liquidity Grab',
          category: 'Indian F&O',
          description: 'Wait for morning opening candle to sweep previous day high/low. Enter counter-trend when price closes back inside range.',
          checklist: ['Previous Day High/Low Sweep', 'Rejection Wick', 'Strict 1:2 RRR Target'],
          imageUrl: ''
        }
      ];
    } catch {
      return [];
    }
  });

  // Rich Concept Notes & Case Studies State (MS Word / Notion Style)
  const [conceptNotes, setConceptNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('tradeTrack_concept_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 101,
          title: 'What is Inducement (IDM) & How to Identify Valid Sweep?',
          topic: 'ICT & Smart Money Concepts',
          explanation: `1. Definition of Inducement (IDM):\nInducement is the first internal high/low formed after a market structure break. Retail traders buy/sell at this first pullback, creating liquidity.\n\n2. When is IDM Valid?\n- Valid IDM must be taken out BEFORE looking for an Order Block or FVG entry.\n- If IDM is not taken out, the setup has LOW probability of success.\n\n3. Entry Execution Rules:\n- Wait for candle wick or body to sweep the IDM liquidity point.\n- Check 15m HTF bias alignment.\n- Target liquidity above previous swing high/low.`,
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
          dateAdded: '2026-08-07'
        },
        {
          id: 102,
          title: 'Order Block (OB) Validation Rules & Imbalance Confluence',
          topic: 'Order Block Masterclass',
          explanation: `1. What makes an Order Block High Probability?\n- It MUST cause a Displacement (Break of Structure - BOS).\n- It MUST leave a Fair Value Gap (FVG) right next to it.\n- It MUST sweep liquidity before forming.\n\n2. Invalidation Criteria:\n- If price closes completely past the Order Block body, the setup is INVALIDated immediately. Do not hold or hope.`,
          imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
          dateAdded: '2026-08-06'
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeSubTab, setActiveSubTab] = useState('concepts'); // 'concepts' | 'daily' | 'setups'

  // Form state for creating/editing a Setup rule
  const [isAddingSetup, setIsAddingSetup] = useState(false);
  const [editingSetupId, setEditingSetupId] = useState(null);
  const [newSetup, setNewSetup] = useState({
    title: '',
    category: 'Price Action',
    customCategory: '',
    description: '',
    checklistText: '',
    imageUrl: ''
  });

  // Form state for creating/editing a Concept Note
  const [isAddingConcept, setIsAddingConcept] = useState(false);
  const [editingConceptId, setEditingConceptId] = useState(null);
  const [newConcept, setNewConcept] = useState({
    title: '',
    topic: 'ICT & Smart Money Concepts',
    customTopic: '',
    explanation: '',
    imageUrl: ''
  });

  const [conceptImagePreview, setConceptImagePreview] = useState('');

  // Derived available custom & default topics/categories
  const availableTopics = Array.from(new Set(conceptNotes.map(c => c.topic).filter(Boolean)));
  const availableSetupCategories = Array.from(new Set(setups.map(s => s.category).filter(Boolean)));

  // Current day note inputs
  const currentNote = dailyNotes[selectedDate] || { morningBias: '', newsEvents: '', eveningReview: '', rating: 5 };

  useEffect(() => {
    try {
      localStorage.setItem('tradeTrack_daily_notes', JSON.stringify(dailyNotes));
    } catch (e) {
      console.error('Failed to save daily notes:', e);
    }
  }, [dailyNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('tradeTrack_setups_library', JSON.stringify(setups));
    } catch (e) {
      console.error('Failed to save setups library:', e);
    }
  }, [setups]);

  useEffect(() => {
    try {
      localStorage.setItem('tradeTrack_concept_notes', JSON.stringify(conceptNotes));
    } catch (e) {
      console.error('Failed to save concept notes:', e);
    }
  }, [conceptNotes]);

  const handleUpdateCurrentNote = (field, value) => {
    setDailyNotes(prev => ({
      ...prev,
      [selectedDate]: {
        ...currentNote,
        [field]: value
      }
    }));
  };

  const handleSaveSetup = (e) => {
    e.preventDefault();
    if (!newSetup.title.trim()) return;

    const finalCategory = (newSetup.category === 'CUSTOM' ? newSetup.customCategory : newSetup.category).trim() || 'Price Action';

    const checklistArr = newSetup.checklistText
      ? newSetup.checklistText.split('\n').filter(line => line.trim())
      : ['Confirm Risk Rule', 'HTF Bias Match'];

    if (editingSetupId) {
      setSetups(prev => prev.map(s => {
        if (s.id === editingSetupId) {
          return {
            ...s,
            title: newSetup.title.trim(),
            category: finalCategory,
            description: newSetup.description,
            checklist: checklistArr,
            imageUrl: newSetup.imageUrl
          };
        }
        return s;
      }));
    } else {
      const setupObj = {
        id: Date.now(),
        title: newSetup.title.trim(),
        category: finalCategory,
        description: newSetup.description,
        checklist: checklistArr,
        imageUrl: newSetup.imageUrl
      };
      setSetups(prev => [setupObj, ...prev]);
    }

    setNewSetup({ title: '', category: 'Price Action', customCategory: '', description: '', checklistText: '', imageUrl: '' });
    setEditingSetupId(null);
    setIsAddingSetup(false);
  };

  const handleStartEditSetup = (setup) => {
    const defaultCategories = [
      'Indian F&O',
      'ICT / Smart Money',
      'Price Action',
      'Crypto',
      'Forex & Commodities'
    ];
    const isCustom = !defaultCategories.includes(setup.category);

    setNewSetup({
      title: setup.title || '',
      category: isCustom ? 'CUSTOM' : setup.category,
      customCategory: isCustom ? setup.category : '',
      description: setup.description || '',
      checklistText: (setup.checklist || []).join('\n'),
      imageUrl: setup.imageUrl || ''
    });
    setEditingSetupId(setup.id);
    setIsAddingSetup(true);
  };

  const handleCancelSetupForm = () => {
    setIsAddingSetup(false);
    setEditingSetupId(null);
    setNewSetup({ title: '', category: 'Price Action', customCategory: '', description: '', checklistText: '', imageUrl: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConceptImagePreview(reader.result);
        setNewConcept(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveConcept = (e) => {
    e.preventDefault();
    if (!newConcept.title.trim()) return;

    const finalTopic = (newConcept.topic === 'CUSTOM' ? newConcept.customTopic : newConcept.topic).trim() || 'General Concept';

    if (editingConceptId) {
      setConceptNotes(prev => prev.map(c => {
        if (c.id === editingConceptId) {
          return {
            ...c,
            title: newConcept.title.trim(),
            topic: finalTopic,
            explanation: newConcept.explanation,
            imageUrl: newConcept.imageUrl || conceptImagePreview
          };
        }
        return c;
      }));
    } else {
      const conceptObj = {
        id: Date.now(),
        title: newConcept.title.trim(),
        topic: finalTopic,
        explanation: newConcept.explanation,
        imageUrl: newConcept.imageUrl || conceptImagePreview,
        dateAdded: new Date().toISOString().slice(0, 10)
      };
      setConceptNotes(prev => [conceptObj, ...prev]);
    }

    setNewConcept({ title: '', topic: 'ICT & Smart Money Concepts', customTopic: '', explanation: '', imageUrl: '' });
    setConceptImagePreview('');
    setEditingConceptId(null);
    setIsAddingConcept(false);
  };

  const handleStartEditConcept = (concept) => {
    const defaultTopics = [
      'ICT & Smart Money Concepts',
      'Indian F&O Price Action',
      'Chart Pattern & Breakout',
      'Risk Management & Psychology'
    ];
    const isCustom = !defaultTopics.includes(concept.topic);

    setNewConcept({
      title: concept.title || '',
      topic: isCustom ? 'CUSTOM' : concept.topic,
      customTopic: isCustom ? concept.topic : '',
      explanation: concept.explanation || '',
      imageUrl: concept.imageUrl || ''
    });
    setConceptImagePreview(concept.imageUrl || '');
    setEditingConceptId(concept.id);
    setIsAddingConcept(true);
  };

  const handleCancelConceptForm = () => {
    setIsAddingConcept(false);
    setEditingConceptId(null);
    setNewConcept({ title: '', topic: 'ICT & Smart Money Concepts', customTopic: '', explanation: '', imageUrl: '' });
    setConceptImagePreview('');
  };

  const handleDeleteSetup = (id, title = 'setup rule') => {
    setDeleteModalState({
      isOpen: true,
      type: 'setup',
      id: id,
      title: `Delete setup "${title}"?`
    });
  };

  const handleDeleteConcept = (id, title = 'concept note') => {
    setDeleteModalState({
      isOpen: true,
      type: 'concept',
      id: id,
      title: `Delete concept "${title}"?`
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'concept') {
      setConceptNotes(prev => prev.filter(c => c.id !== deleteModalState.id));
    } else if (deleteModalState.type === 'setup') {
      setSetups(prev => prev.filter(s => s.id !== deleteModalState.id));
    }
  };

  // Export Playbook Notes & Images to PDF
  const handleExportPlaybookPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 15;

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('TradeTrack PRO - Personal Trading Playbook & Vault', 14, 16);

      doc.setTextColor(226, 232, 240);
      doc.setFontSize(9);
      doc.text(`Export Date: ${new Date().toLocaleDateString()} | Total Notes: ${conceptNotes.length}`, pageWidth - 14, 16, { align: 'right' });

      y = 35;

      conceptNotes.forEach((concept, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Concept Card Title Box
        doc.setFillColor(241, 245, 249);
        doc.rect(14, y, pageWidth - 28, 10, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. [${concept.topic}] ${concept.title}`, 18, y + 7);

        y += 16;

        // Explanation text lines
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');

        const splitLines = doc.splitTextToSize(concept.explanation, pageWidth - 32);
        splitLines.forEach(line => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 16, y);
          y += 5.5;
        });

        y += 12;
      });

      doc.save(`TradeTrack_Playbook_Notes_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Error generating PDF report. Please try again.');
    }
  };

  // Filtered Concept Notes
  const filteredConcepts = conceptNotes.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || c.topic === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Playbook Navigation Bar */}
      <div className={`border rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
              <span>Trader Playbook & Knowledge Vault</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 uppercase font-bold">
                PRIVATE DOCK
              </span>
            </h2>
            <p className={`text-xs mt-0.5 font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Log daily market biases, news notes, setups, IDM/FVG logic & chart case studies in one place.
            </p>
          </div>
        </div>

        {/* Right Controls: Sub-Tab Buttons & PDF Export */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          <button
            onClick={handleExportPlaybookPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-300/40"
            title="Download PDF of Playbook Notes & Logic"
          >
            <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            <span>Export Playbook PDF</span>
          </button>

          {/* Sub-Tab Controls */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 overflow-x-auto [scrollbar-width:none] max-w-full ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1320] border-white/10'
          }`}>
            <button
              onClick={() => setActiveSubTab('concepts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'concepts'
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Concepts ({conceptNotes.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'daily'
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily Journal</span>
            </button>

            <button
              onClick={() => setActiveSubTab('setups')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === 'setups'
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md font-black'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Setups ({setups.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* VIEW 1: DAILY JOURNAL NOTES */}
      {activeSubTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          
          {/* Left Column: Date Selector & Quick Rating */}
          <div className={`border rounded-2xl p-5 shadow-xl space-y-5 transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
          }`}>
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Select Trading Date</span>
              </h3>
              <span className="text-xs text-emerald-500 font-bold">Auto-Saved</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 block font-sans">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono focus:border-cyan-400 outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                }`}
              />
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0D1220] border-white/10'
            }`}>
              <span className="text-xs font-bold block">Daily Discipline Self-Rating</span>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleUpdateCurrentNote('rating', star)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border font-bold text-xs transition-all cursor-pointer ${
                      star <= (currentNote.rating || 5)
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                        : isLight ? 'bg-slate-200 border-slate-300 text-slate-400' : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-slate-700' : 'bg-gradient-to-br from-cyan-950/40 via-[#0A1A24] to-[#080C16] border-cyan-500/30 text-slate-300'
            }`}>
              <div className="flex items-center gap-1.5 text-cyan-500 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Pro Tip for Traders</span>
              </div>
              <p className="text-[11px] font-sans leading-relaxed">
                Log your morning bias before market open (NIFTY/Gold/Crypto) to avoid impulse FOMO trades during live volatility.
              </p>
            </div>
          </div>

          {/* Right Column: Pre-Market & Post-Market Notes Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Pre-Market Bias & News */}
            <div className={`border rounded-2xl p-5 shadow-xl space-y-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-cyan-500" />
                  <span>Pre-Market Bias & News Events ({selectedDate})</span>
                </h3>
              </div>

              <div className="space-y-4 font-sans text-xs">
                <RichNoteEditor
                  label="Morning Market Bias & Key Levels (NIFTY, BankNifty, Gold, Crypto)"
                  placeholder="Record morning market bias, key liquidity pools, and setup levels..."
                  rows={4}
                  isLight={isLight}
                  value={currentNote.morningBias || ''}
                  onChange={(val) => handleUpdateCurrentNote('morningBias', val)}
                />

                <div>
                  <label className="text-slate-400 block mb-1.5 font-mono font-bold">Economic News Calendar Events & Risk Warnings</label>
                  <input
                    type="text"
                    placeholder=""
                    value={currentNote.newsEvents || ''}
                    onChange={(e) => handleUpdateCurrentNote('newsEvents', e.target.value)}
                    className={`w-full border rounded-xl p-3 text-sm font-mono focus:border-cyan-400 outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Post-Market Review & Lessons */}
            <div className={`border rounded-2xl p-5 shadow-xl space-y-4 transition-colors ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Evening Post-Market Retrospective</span>
                </h3>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <RichNoteEditor
                  label="Trading Performance Retrospective & Psychological Lessons"
                  placeholder="Record trading performance, mistakes, discipline lessons..."
                  rows={4}
                  isLight={isLight}
                  value={currentNote.eveningReview || ''}
                  onChange={(val) => handleUpdateCurrentNote('eveningReview', val)}
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: CONCEPTS & LOGIC NOTES (MS WORD / NOTION STYLE WITH ORGANIZED CONTROLS) */}
      {activeSubTab === 'concepts' && (
        <div className="space-y-5 font-mono">
          
          {/* Streamlined Filter & Action Toolbar */}
          <div className={`border rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
          }`}>
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
              <Filter className="w-3.5 h-3.5 text-cyan-500 shrink-0 mr-1" />
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  categoryFilter === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black'
                    : isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-[#0E1320] text-slate-400 border border-white/10 hover:text-white'
                }`}
              >
                All Notes ({conceptNotes.length})
              </button>
              {availableTopics.map((top) => (
                <button
                  key={top}
                  onClick={() => setCategoryFilter(top)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === top
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-black'
                      : isLight ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-[#0E1320] text-slate-400 border border-white/10 hover:text-white'
                  }`}
                >
                  {top}
                </button>
              ))}
            </div>

            {/* Right Group: Search + View Switcher + Create Note Button */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap md:flex-nowrap">
              
              {/* Search Bar Input */}
              <div className="relative w-full md:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs font-mono outline-none focus:border-cyan-400 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                  }`}
                />
              </div>

              {/* View Mode Switcher (Grid vs Compact List) */}
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1320] border-white/10'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'
                      : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View (Cards)"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    viewMode === 'compact'
                      ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'
                      : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Compact List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setEditingConceptId(null);
                  setNewConcept({ title: '', topic: 'ICT & Smart Money Concepts', customTopic: '', explanation: '', imageUrl: '' });
                  setConceptImagePreview('');
                  setIsAddingConcept(true);
                }}
                className="px-3.5 py-1.5 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-cyan-300/40 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Create Note</span>
              </button>

            </div>

          </div>

          {/* New / Edit Concept Form Modal */}
          {isAddingConcept && (
            <form onSubmit={handleSaveConcept} className={`border border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn ${
              isLight ? 'bg-white text-slate-900' : 'bg-[#080C16] text-white'
            }`}>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h4 className="text-base font-bold text-cyan-500 flex items-center gap-2">
                  {editingConceptId ? <Edit3 className="w-5 h-5 text-cyan-400" /> : <FileCode className="w-5 h-5 text-cyan-500" />}
                  <span>{editingConceptId ? 'Edit Trading Concept & Logic Note' : 'Write New Trading Concept & Logic Note (MS Word Style)'}</span>
                </h4>
                <button type="button" onClick={handleCancelConceptForm} className="text-slate-400 hover:text-white text-xs cursor-pointer">Cancel</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Concept Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter concept title..."
                    value={newConcept.title}
                    onChange={(e) => setNewConcept(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-cyan-400 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Topic Category</label>
                  <select
                    value={newConcept.topic}
                    onChange={(e) => setNewConcept(prev => ({ ...prev, topic: e.target.value }))}
                    className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-cyan-400 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  >
                    <option value="ICT & Smart Money Concepts">ICT & Smart Money Concepts (IDM / OB / FVG)</option>
                    <option value="Indian F&O Price Action">Indian F&O Price Action (NIFTY/BankNifty)</option>
                    <option value="Chart Pattern & Breakout">Chart Pattern & Breakout Logic</option>
                    <option value="Risk Management & Psychology">Risk Management & Psychology Rules</option>
                    {availableTopics.filter(t => ![
                      'ICT & Smart Money Concepts',
                      'Indian F&O Price Action',
                      'Chart Pattern & Breakout',
                      'Risk Management & Psychology',
                      'CUSTOM'
                    ].includes(t)).map(customTop => (
                      <option key={customTop} value={customTop}>{customTop} (Saved Category)</option>
                    ))}
                    <option value="CUSTOM">+ Add Custom Category / Topic...</option>
                  </select>

                  {newConcept.topic === 'CUSTOM' && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name (e.g. Scalping Strategy, Volume Delta)..."
                      value={newConcept.customTopic}
                      onChange={(e) => setNewConcept(prev => ({ ...prev, customTopic: e.target.value }))}
                      className={`w-full mt-2 border rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-cyan-500/40 text-cyan-300 font-bold'
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Chart Image Upload Attachment */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 block font-bold">Chart Screenshot Attachment (File Upload or Image URL)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <label className={`flex-1 border border-dashed hover:border-cyan-400 rounded-xl p-3 flex items-center justify-center gap-2 text-xs cursor-pointer transition-all ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-[#0E1320] border-white/20 text-slate-300'
                    }`}>
                      <Upload className="w-4 h-4 text-cyan-500" />
                      <span>Upload Chart Image File</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  <input
                    type="url"
                    placeholder="https://..."
                    value={newConcept.imageUrl}
                    onChange={(e) => {
                      setNewConcept(prev => ({ ...prev, imageUrl: e.target.value }));
                      setConceptImagePreview(e.target.value);
                    }}
                    className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-cyan-400 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  />
                </div>

                {/* Preview Image */}
                {(conceptImagePreview || newConcept.imageUrl) && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-white/20 max-h-48 w-full bg-slate-950">
                    <img src={conceptImagePreview || newConcept.imageUrl} alt="Chart Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>

              {/* Multi-Line Deep Explanation Note Rich Text Editor */}
              <RichNoteEditor
                label="Detailed Logic Explanation & Entry Rules"
                placeholder="Write detailed entry logic, key rules, and highlight important words (e.g., IDM, FVG, Liquidity)..."
                rows={8}
                required
                isLight={isLight}
                value={newConcept.explanation}
                onChange={(val) => setNewConcept(prev => ({ ...prev, explanation: val }))}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelConceptForm}
                  className="px-4 py-3 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-xl border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 rounded-xl shadow-lg font-mono cursor-pointer"
                >
                  {editingConceptId ? 'Update Concept Note' : 'Save Concept Note to Vault'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW MODE 1: GRID VIEW (VISUAL CARDS) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all relative group ${
                    isLight ? 'bg-white border-slate-200 text-slate-900 hover:border-cyan-500' : 'bg-[#080C16] border-white/10 hover:border-cyan-500/40 text-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 text-[9.5px] font-bold bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 rounded-md uppercase tracking-wider inline-block">
                          {concept.topic}
                        </span>
                        <h4 className="text-base sm:text-lg font-extrabold mt-1.5 leading-snug">{concept.title}</h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEditConcept(concept)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                          title="Edit Concept Note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConcept(concept.id, concept.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Concept Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Chart Screenshot Display (Click to open Zoom Inspector) */}
                    {concept.imageUrl && (
                      <div
                        onClick={() => setLightboxState({ isOpen: true, imageUrl: concept.imageUrl, title: concept.title })}
                        className="rounded-xl overflow-hidden border border-white/15 bg-slate-950 relative group/img max-h-64 cursor-pointer hover:border-cyan-400/60 transition-all shadow-md"
                        title="Click to Zoom In & Inspect Chart"
                      >
                        <img src={concept.imageUrl} alt={concept.title} className="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs font-bold">
                          <Maximize2 className="w-4 h-4 text-cyan-400" />
                          <span>Click to Zoom & Inspect</span>
                        </div>
                      </div>
                    )}

                    {/* Formatted Multi-Line Explanation Text */}
                    <div className={`p-4 rounded-xl border font-sans text-xs space-y-2 leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0B0F1A] border-white/10 text-slate-300'
                    }`}>
                      <FormattedTextDisplay content={concept.explanation} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Added: {concept.dateAdded || 'Recently'}</span>
                    <span className="text-cyan-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                      Verified Trading Logic
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 2: COMPACT ACCORDION LIST VIEW (PERFECT FOR 15+ NOTES!) */}
          {viewMode === 'compact' && (
            <div className="space-y-3">
              {filteredConcepts.map((concept, idx) => {
                const isExpanded = expandedNoteId === concept.id;
                return (
                  <div
                    key={concept.id}
                    className={`border rounded-2xl shadow-lg transition-all overflow-hidden ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
                    }`}
                  >
                    {/* Accordion Row Header */}
                    <div
                      onClick={() => setExpandedNoteId(isExpanded ? null : concept.id)}
                      className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-500 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded uppercase mr-2">
                            {concept.topic}
                          </span>
                          <span className="font-extrabold text-sm text-slate-100 dark:text-white">{concept.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">{concept.dateAdded || 'Recently'}</span>
                        <div className="p-1 rounded-lg bg-slate-800/40 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Accordion Expanded Content */}
                    {isExpanded && (
                      <div className="p-5 border-t border-white/10 space-y-4 animate-fadeIn">
                        {concept.imageUrl && (
                          <div
                            onClick={() => setLightboxState({ isOpen: true, imageUrl: concept.imageUrl, title: concept.title })}
                            className="rounded-xl overflow-hidden border border-white/15 max-h-72 bg-slate-950 cursor-pointer relative group/img"
                          >
                            <img src={concept.imageUrl} alt={concept.title} className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                              <Maximize2 className="w-4 h-4 text-cyan-400" />
                              <span>Click to Zoom Chart</span>
                            </div>
                          </div>
                        )}

                        <div className={`p-4 rounded-xl border font-sans text-xs space-y-2 leading-relaxed ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0B0F1A] border-white/10 text-slate-300'
                        }`}>
                          <FormattedTextDisplay content={concept.explanation} />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleStartEditConcept(concept)}
                            className="px-3 py-1.5 rounded-lg text-xs text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Concept Note</span>
                          </button>
                          <button
                            onClick={() => handleDeleteConcept(concept.id, concept.title)}
                            className="px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Concept Note</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: SETUPS & RULES LIBRARY */}
      {activeSubTab === 'setups' && (
        <div className="space-y-6 font-mono">
          
          {/* Header Action Row */}
          <div className={`border rounded-2xl p-4 shadow-xl flex justify-between items-center transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080C16] border-white/10 text-white'
          }`}>
            <div>
              <h3 className="text-lg font-bold">Custom Strategy & Setup Playbook ({setups.length} Rules)</h3>
              <p className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Document your exact entry triggers, FVG rules & price action setups.</p>
            </div>

            <button
              onClick={() => {
                setEditingSetupId(null);
                setNewSetup({ title: '', category: 'Price Action', customCategory: '', description: '', checklistText: '', imageUrl: '' });
                setIsAddingSetup(true);
              }}
              className="px-4 py-2.5 text-xs font-mono font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:scale-105 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer border border-cyan-300/40"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Add New Setup Rule</span>
            </button>
          </div>

          {/* New / Edit Setup Modal Form */}
          {isAddingSetup && (
            <form onSubmit={handleSaveSetup} className={`border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn ${
              isLight ? 'bg-white text-slate-900' : 'bg-[#080C16] text-white'
            }`}>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h4 className="text-base font-bold text-cyan-500 flex items-center gap-2">
                  {editingSetupId ? <Edit3 className="w-4 h-4 text-cyan-400" /> : <Sparkles className="w-4 h-4" />}
                  <span>{editingSetupId ? 'Edit Setup Playbook Entry' : 'Create New Setup Playbook Entry'}</span>
                </h4>
                <button type="button" onClick={handleCancelSetupForm} className="text-slate-400 hover:text-white text-xs cursor-pointer">Cancel</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Setup Title Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter setup title..."
                    value={newSetup.title}
                    onChange={(e) => setNewSetup(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full border rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Market Category</label>
                  <select
                    value={newSetup.category}
                    onChange={(e) => setNewSetup(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full border rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                    }`}
                  >
                    <option value="Indian F&O">Indian F&O (NIFTY/BankNifty)</option>
                    <option value="ICT / Smart Money">ICT / Smart Money Concepts (FVG/OB)</option>
                    <option value="Price Action">Price Action / Breakout</option>
                    <option value="Crypto">Crypto Setup</option>
                    <option value="Forex & Commodities">Forex & Commodities (Gold/Silver)</option>
                    {availableSetupCategories.filter(c => ![
                      'Indian F&O',
                      'ICT / Smart Money',
                      'Price Action',
                      'Crypto',
                      'Forex & Commodities',
                      'CUSTOM'
                    ].includes(c)).map(customCat => (
                      <option key={customCat} value={customCat}>{customCat} (Saved Category)</option>
                    ))}
                    <option value="CUSTOM">+ Add Custom Category...</option>
                  </select>

                  {newSetup.category === 'CUSTOM' && (
                    <input
                      type="text"
                      required
                      placeholder="Type custom market category name (e.g. Options Buying, Harmonic Patterns)..."
                      value={newSetup.customCategory}
                      onChange={(e) => setNewSetup(prev => ({ ...prev, customCategory: e.target.value }))}
                      className={`w-full mt-2 border rounded-xl p-2 text-xs outline-none focus:border-cyan-400 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-cyan-500/40 text-cyan-300 font-bold'
                      }`}
                    />
                  )}
                </div>
              </div>

              <RichNoteEditor
                label="Description & Entry Execution Trigger Rules"
                placeholder="Describe strategy execution trigger rules and key setups..."
                rows={3}
                required
                isLight={isLight}
                value={newSetup.description}
                onChange={(val) => setNewSetup(prev => ({ ...prev, description: val }))}
              />

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">Pre-Trade Checklist Items (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="HTF Bias Alignment&#10;Clear 15m Displacement&#10;5m FVG Entry Trigger"
                  value={newSetup.checklistText}
                  onChange={(e) => setNewSetup(prev => ({ ...prev, checklistText: e.target.value }))}
                  className={`w-full border rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#0E1320] border-white/15 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelSetupForm}
                  className="px-4 py-2.5 text-xs font-mono font-bold text-slate-400 hover:text-white rounded-xl border border-white/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl shadow-lg font-mono cursor-pointer"
                >
                  {editingSetupId ? 'Update Setup Rule' : 'Save Setup to Playbook'}
                </button>
              </div>
            </form>
          )}

          {/* Playbook Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {setups.map((setup) => (
              <div
                key={setup.id}
                className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all relative group ${
                  isLight ? 'bg-white border-slate-200 text-slate-900 hover:border-cyan-500' : 'bg-[#080C16] border-white/10 hover:border-cyan-500/40 text-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-cyan-500/20 text-cyan-500 border border-cyan-500/30 rounded uppercase tracking-wider block w-max">
                        {setup.category}
                      </span>
                      <h4 className="text-base font-extrabold mt-1">{setup.title}</h4>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEditSetup(setup)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                        title="Edit Setup Rule"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSetup(setup.id, setup.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete setup"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className={`text-xs font-sans leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {setup.description}
                  </p>

                  {/* Checklist */}
                  {setup.checklist && setup.checklist.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mandatory Rules Checklist</span>
                      <div className="space-y-1 text-xs font-mono">
                        {setup.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Trade Strategy Model</span>
                  <span className="text-emerald-500 font-bold">Active in Journal</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Image Lightbox Zoom Modal */}
      <ImageLightboxModal
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
        imageUrl={lightboxState.imageUrl}
        title={lightboxState.title}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteModalState.title || 'Delete Item?'}
        message="Are you sure you want to permanently delete this item from your vault? This action cannot be undone."
        theme={theme}
      />

    </div>
  );
}
