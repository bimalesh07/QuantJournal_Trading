import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  Sunrise,
  Sunset,
  Star,
  X,
  Trash2,
  CheckCircle2,
  Sparkles,
  Save,
  MessageSquare
} from 'lucide-react';
import { getDailyNotes, saveDailyNote, deleteDailyNote } from '../services/api';
import { getCurrencySymbol } from '../utils/analyticsUtils';

export default function PnLCalendar({ analytics, onSelectDateFilter, trades = [], tradeMode = 'LIVE' }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Daily Journal State
  const [dailyNotesMap, setDailyNotesMap] = useState({});
  const [selectedDateForJournal, setSelectedDateForJournal] = useState(null);
  const [journalFormData, setJournalFormData] = useState({
    pre_market_plan: '',
    post_market_review: '',
    mood: 'DISCIPLINED',
    rating: 4
  });
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const calendarData = (analytics && analytics.calendar_data) ? analytics.calendar_data : {};

  // Year and Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Fetch Daily Notes for the visible month from Backend
  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      try {
        const notes = await getDailyNotes(currentMonthStr);
        if (isMounted && Array.isArray(notes)) {
          const map = {};
          notes.forEach(note => {
            map[note.date] = note;
          });
          setDailyNotesMap(map);
        }
      } catch (err) {
        console.error('Failed to load daily notes:', err);
      }
    };
    fetchNotes();
    return () => { isMounted = false; };
  }, [currentMonthStr]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Open Journal Modal for a specific date
  const handleOpenJournalModal = (dateStr) => {
    setSelectedDateForJournal(dateStr);
    const existingNote = dailyNotesMap[dateStr];
    if (existingNote) {
      setJournalFormData({
        pre_market_plan: existingNote.pre_market_plan || '',
        post_market_review: existingNote.post_market_review || '',
        mood: existingNote.mood || 'DISCIPLINED',
        rating: existingNote.rating || 4
      });
    } else {
      setJournalFormData({
        pre_market_plan: '',
        post_market_review: '',
        mood: 'DISCIPLINED',
        rating: 4
      });
    }
    setSaveSuccessNotice(false);
  };

  // Save Journal Note
  const handleSaveJournal = async (e) => {
    if (e) e.preventDefault();
    if (!selectedDateForJournal) return;

    try {
      setIsSavingNote(true);
      const saved = await saveDailyNote({
        date: selectedDateForJournal,
        pre_market_plan: journalFormData.pre_market_plan,
        post_market_review: journalFormData.post_market_review,
        mood: journalFormData.mood,
        rating: journalFormData.rating
      });

      setDailyNotesMap(prev => ({
        ...prev,
        [selectedDateForJournal]: saved
      }));

      setSaveSuccessNotice(true);
      setTimeout(() => {
        setSaveSuccessNotice(false);
      }, 2500);
    } catch (err) {
      console.error('Failed to save daily note:', err);
      alert('Failed to save daily note. Please check your connection.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Delete Journal Note
  const handleDeleteJournal = async () => {
    const existing = dailyNotesMap[selectedDateForJournal];
    if (!existing || !existing.id) return;

    if (!window.confirm('Are you sure you want to delete this daily journal note?')) return;

    try {
      setIsSavingNote(true);
      await deleteDailyNote(existing.id);
      setDailyNotesMap(prev => {
        const copy = { ...prev };
        delete copy[selectedDateForJournal];
        return copy;
      });
      setSelectedDateForJournal(null);
    } catch (err) {
      console.error('Failed to delete daily note:', err);
      alert('Failed to delete daily note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Generate grid cells
  const gridCells = [];

  // Padding cells before day 1
  for (let i = 0; i < firstDayOfMonth; i++) {
    gridCells.push({ isPadding: true, key: `pad-${i}` });
  }

  // Actual day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = calendarData[formattedDate] || null;
    const noteData = dailyNotesMap[formattedDate] || null;
    gridCells.push({
      isPadding: false,
      dateStr: formattedDate,
      dayNumber: day,
      data: dayData,
      note: noteData,
      key: formattedDate,
    });
  }

  // Calculate Monthly total for the visible month
  let monthlyTotalNet = 0;
  let monthlyTradeCount = 0;

  Object.keys(calendarData).forEach((dateKey) => {
    if (dateKey.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
      monthlyTotalNet += calendarData[dateKey].net_pnl;
      monthlyTradeCount += calendarData[dateKey].trades;
    }
  });

  const moodOptions = [
    { id: 'DISCIPLINED', label: '🎯 Disciplined', color: 'emerald' },
    { id: 'PATIENT', label: '🧘 Patient & Calm', color: 'teal' },
    { id: 'FOMO', label: '🔥 FOMO / Chasing', color: 'amber' },
    { id: 'REVENGE', label: '⚡ Revenge Trading', color: 'rose' },
    { id: 'FEARFUL', label: '😨 Hesitant / Fearful', color: 'purple' },
    { id: 'FRUSTRATED', label: '😤 Frustrated / Tilted', color: 'rose' },
    { id: 'OVERCONFIDENT', label: '🤑 Overconfident', color: 'amber' },
  ];

  const selectedDateTradeData = selectedDateForJournal ? calendarData[selectedDateForJournal] : null;

  return (
    <div className="bg-[#121622]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 space-y-6 shadow-2xl relative font-sans">
      
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800/80">
        
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black font-mono tracking-wide text-white">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  {monthNames[month]}
                </span>{' '}
                <span className="text-slate-300">{year}</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold hidden sm:inline-block">
                Click any day for Pre/Post Market Diary 📝
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              Monthly PnL Grid View & Daily Pre/Post Market Journal
            </p>
          </div>
        </div>

        {/* Navigation & Summary */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="bg-[#181E2C] px-4 py-2 rounded-xl border border-slate-700/80 text-xs sm:text-sm font-mono shadow-md flex items-center gap-2">
            <span className="text-slate-300 font-medium">Month Net PnL:</span>
            <span className={`font-extrabold text-sm sm:text-base ${monthlyTotalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {monthlyTotalNet >= 0 ? '+' : ''}${monthlyTotalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-slate-400 text-xs font-semibold">({monthlyTradeCount} trades)</span>
          </div>

          <button
            onClick={handleToday}
            className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all cursor-pointer shadow-sm font-mono"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-[#181E2C] p-1 rounded-xl border border-slate-700/80 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Responsive Calendar Container with Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 [scrollbar-width:thin] max-w-full">
        <div className="min-w-[640px] sm:min-w-0 space-y-2.5">
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center text-xs font-extrabold text-slate-200 uppercase tracking-widest font-mono">
            {daysOfWeek.map((d) => (
              <div key={d} className="py-2 sm:py-2.5 bg-[#181E2C] rounded-xl border border-slate-800 shadow-md text-emerald-400/90 font-bold text-[10px] sm:text-xs">
                {d}
              </div>
            ))}
          </div>

          {/* Monthly Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {gridCells.map((cell) => {
              if (cell.isPadding) {
                return (
                  <div
                    key={cell.key}
                    className="h-28 sm:h-34 rounded-xl sm:rounded-2xl bg-[#121622]/40 border border-slate-800/30 opacity-20"
                  />
                );
              }

              const hasData = !!cell.data;
              const hasNote = !!cell.note;
              const pnl = hasData ? cell.data.net_pnl : 0;
              const isProfitable = pnl > 0;
              const isLoss = pnl < 0;

              let cardStyle = 'bg-[#141924] border border-slate-800/90 hover:border-slate-700 hover:bg-[#1A2130] text-slate-300';
              if (hasData) {
                if (isProfitable) {
                  cardStyle = 'bg-gradient-to-br from-[#062c21] via-[#0d3d2e] to-[#0a261c] border border-emerald-500/70 text-emerald-300 shadow-lg shadow-emerald-500/20 hover:border-emerald-400 hover:scale-[1.02]';
                } else if (isLoss) {
                  cardStyle = 'bg-gradient-to-br from-[#3b0a12] via-[#4d0f19] to-[#2e070e] border border-rose-500/70 text-rose-300 shadow-lg shadow-rose-500/20 hover:border-rose-400 hover:scale-[1.02]';
                } else {
                  cardStyle = 'bg-[#181E2C] border border-slate-700 text-slate-200 hover:border-slate-500';
                }
              }

              return (
                <div
                  key={cell.key}
                  onClick={() => handleOpenJournalModal(cell.dateStr)}
                  className={`h-28 sm:h-34 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex flex-col justify-between transition-all cursor-pointer shadow-md overflow-hidden relative group ${cardStyle}`}
                >
                  {/* Top Bar of Cell: Day Number + Trade Count Badge + Note Indicator */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] sm:text-xs font-extrabold font-mono px-1.5 py-0.5 rounded-md ${
                        hasData 
                          ? isProfitable ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-sm' : isLoss ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-sm' : 'bg-slate-800 text-slate-200 border border-slate-700'
                          : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                      }`}>
                        {cell.dayNumber}
                      </span>

                      {/* Daily Journal Diary Indicator */}
                      {hasNote && (
                        <span 
                          title="Daily Pre/Post Market Routine Recorded"
                          className="px-1 py-0.5 text-[9px] rounded bg-purple-500/20 border border-purple-400/50 text-purple-300 flex items-center gap-0.5 font-bold"
                        >
                          <BookOpen className="w-2.5 h-2.5" />
                          <span className="hidden sm:inline">Diary</span>
                        </span>
                      )}
                    </div>

                    {hasData && (
                      <span className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-md font-mono font-extrabold border shadow-sm shrink-0 ${
                        isProfitable ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40' : isLoss ? 'bg-rose-400/20 text-rose-300 border-rose-400/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {cell.data.trades}t
                      </span>
                    )}
                  </div>

                  {/* Mid-Row: Note preview snippet if note exists */}
                  {hasNote && (
                    <div className="text-[10px] text-purple-300/80 truncate font-mono italic my-0.5">
                      {cell.note.pre_market_plan ? `🌅 ${cell.note.pre_market_plan}` : cell.note.post_market_review ? `🌙 ${cell.note.post_market_review}` : '📝 Note saved'}
                    </div>
                  )}

                  {/* Bottom: PnL Display */}
                  {hasData ? (
                    <div className="text-right space-y-0.5 truncate">
                      <div className={`text-xs sm:text-sm font-black font-mono truncate ${
                        isProfitable ? 'text-emerald-400 drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]' : isLoss ? 'text-rose-400 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]' : 'text-slate-200'
                      }`}>
                        {isProfitable ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-mono font-bold flex items-center justify-end gap-1">
                        <span className="text-emerald-400">{cell.data.wins}W</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-rose-400">{cell.data.losses}L</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 opacity-80 pt-1">
                      <span>No trades</span>
                      <span className="text-[9px] text-slate-400 group-hover:text-cyan-400 transition-colors">
                        + Note
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* DAILY ROUTINE & PRE/POST-MARKET JOURNAL DIARY MODAL */}
      {/* ========================================================================= */}
      {selectedDateForJournal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#10141D] w-full max-w-2xl border border-slate-800 shadow-2xl rounded-2xl overflow-hidden text-slate-100 font-sans my-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#141926]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono text-white tracking-wide">
                    Daily Trading Routine & Journal
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {new Date(selectedDateForJournal + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDateForJournal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Summary Banner for Date (if trades exist) */}
            {selectedDateTradeData && (
              <div className="px-6 py-3 bg-[#0B0E14] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Day Performance:</span>
                  <span className={`font-black text-sm ${selectedDateTradeData.net_pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedDateTradeData.net_pnl >= 0 ? '+' : ''}${selectedDateTradeData.net_pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-slate-400 font-semibold">
                    ({selectedDateTradeData.trades} trades • {selectedDateTradeData.wins}W / {selectedDateTradeData.losses}L)
                  </span>
                </div>

                {onSelectDateFilter && (
                  <button
                    onClick={() => {
                      onSelectDateFilter(selectedDateForJournal);
                      setSelectedDateForJournal(null);
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    View in Trade Log →
                  </button>
                )}
              </div>
            )}

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveJournal} className="p-6 space-y-5">
              
              {/* Section 1: Pre-Market Focus & Morning Bias */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sunrise className="w-4.5 h-4.5 text-amber-400" />
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                    🌅 Pre-Market Routine (Morning Focus & Bias)
                  </label>
                </div>
                <textarea
                  rows="3"
                  value={journalFormData.pre_market_plan}
                  onChange={(e) => setJournalFormData(prev => ({ ...prev, pre_market_plan: e.target.value }))}
                  placeholder="Morning prep: What is your market bias today? Key levels, news/events to watch, maximum trades allowed, and risk rules to follow..."
                  className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-500 font-sans leading-relaxed"
                />
              </div>

              {/* Section 2: Post-Market Review & Lessons */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sunset className="w-4.5 h-4.5 text-purple-400" />
                  <label className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono">
                    🌙 Post-Market Review (Lessons & Retrospective)
                  </label>
                </div>
                <textarea
                  rows="3"
                  value={journalFormData.post_market_review}
                  onChange={(e) => setJournalFormData(prev => ({ ...prev, post_market_review: e.target.value }))}
                  placeholder="Evening review: Did you follow your rules? What went well? Did you experience any emotional traps (FOMO, greed)? Lessons for tomorrow..."
                  className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700/80 focus:border-purple-400 focus:outline-none transition-all placeholder:text-slate-500 font-sans leading-relaxed"
                />
              </div>

              {/* Section 3: Mindset / Emotion & Execution Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* Mindset Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    Day Mindset / Psychology
                  </label>
                  <select
                    value={journalFormData.mood}
                    onChange={(e) => setJournalFormData(prev => ({ ...prev, mood: e.target.value }))}
                    className="w-full bg-[#161B27] text-xs sm:text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700/80 focus:border-cyan-400 focus:outline-none font-medium cursor-pointer"
                  >
                    {moodOptions.map(m => (
                      <option key={m.id} value={m.id} className="bg-[#10141D] text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day Rating Stars */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    Day Discipline Rating
                  </label>
                  <div className="flex items-center justify-around py-2 bg-[#161B27] px-3 rounded-xl border border-slate-700/80 h-[42px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setJournalFormData(prev => ({ ...prev, rating: star }))}
                        className="hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= journalFormData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Feedback Success notice */}
              {saveSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Daily routine journal entry saved successfully to database!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                {dailyNotesMap[selectedDateForJournal] ? (
                  <button
                    type="button"
                    onClick={handleDeleteJournal}
                    disabled={isSavingNote}
                    className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Note</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDateForJournal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingNote}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer font-mono"
                  >
                    {isSavingNote ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Journal Entry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
