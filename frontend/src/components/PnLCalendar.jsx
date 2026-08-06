import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export default function PnLCalendar({ analytics, onSelectDateFilter }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
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
    gridCells.push({
      isPadding: false,
      dateStr: formattedDate,
      dayNumber: day,
      data: dayData,
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

  return (
    <div className="bg-[#121622]/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 space-y-6 shadow-2xl">
      
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800/80">
        
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-mono tracking-wide text-white">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {monthNames[month]}
              </span>{' '}
              <span className="text-slate-300">{year}</span>
            </h2>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              Monthly PnL Grid View & Activity Heatmap
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
            className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-all cursor-pointer shadow-sm"
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

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-extrabold text-slate-200 uppercase tracking-widest font-mono">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-2.5 bg-[#181E2C] rounded-xl border border-slate-800 shadow-md text-emerald-400/90 font-bold">
            {d}
          </div>
        ))}
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {gridCells.map((cell) => {
          if (cell.isPadding) {
            return (
              <div
                key={cell.key}
                className="h-28 sm:h-32 rounded-2xl bg-[#121622]/40 border border-slate-800/30 opacity-20"
              />
            );
          }

          const hasData = !!cell.data;
          const pnl = hasData ? cell.data.net_pnl : 0;
          const isProfitable = pnl > 0;
          const isLoss = pnl < 0;

          let cardStyle = 'bg-[#141924] border border-slate-800/90 hover:border-slate-700 hover:bg-[#1A2130] text-slate-300';
          if (hasData) {
            if (isProfitable) {
              cardStyle = 'bg-gradient-to-br from-[#062c21] via-[#0d3d2e] to-[#0a261c] border-2 border-emerald-500/70 text-emerald-300 shadow-lg shadow-emerald-500/20 hover:border-emerald-400 hover:scale-[1.02]';
            } else if (isLoss) {
              cardStyle = 'bg-gradient-to-br from-[#3b0a12] via-[#4d0f19] to-[#2e070e] border-2 border-rose-500/70 text-rose-300 shadow-lg shadow-rose-500/20 hover:border-rose-400 hover:scale-[1.02]';
            } else {
              cardStyle = 'bg-[#181E2C] border-2 border-slate-700 text-slate-200 hover:border-slate-500';
            }
          }

          return (
            <div
              key={cell.key}
              onClick={() => hasData && onSelectDateFilter && onSelectDateFilter(cell.dateStr)}
              className={`h-28 sm:h-32 p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer shadow-md ${cardStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-extrabold font-mono px-2 py-0.5 rounded-lg ${
                  hasData 
                    ? isProfitable ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-sm' : isLoss ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-sm' : 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                }`}>
                  {cell.dayNumber}
                </span>
                {hasData && (
                  <span className={`text-xs px-2 py-0.5 rounded-lg font-mono font-extrabold border shadow-sm ${
                    isProfitable ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40' : isLoss ? 'bg-rose-400/20 text-rose-300 border-rose-400/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {cell.data.trades} {cell.data.trades === 1 ? 'trade' : 'trades'}
                  </span>
                )}
              </div>

              {hasData ? (
                <div className="text-right space-y-0.5">
                  <div className={`text-sm sm:text-base font-extrabold font-mono ${
                    isProfitable ? 'text-emerald-400 drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]' : isLoss ? 'text-rose-400 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]' : 'text-slate-200'
                  }`}>
                    {isProfitable ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs font-mono font-bold flex items-center justify-end gap-1.5">
                    <span className="text-emerald-400">{cell.data.wins}W</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-rose-400">{cell.data.losses}L</span>
                  </div>
                </div>
              ) : (
                <div className="text-right text-xs font-mono text-slate-500 font-semibold opacity-70">
                  No trades
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
