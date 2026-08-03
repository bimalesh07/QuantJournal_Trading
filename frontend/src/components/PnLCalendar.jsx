import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';

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
    <div className="card-dark p-6 space-y-6">
      
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/80">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3 font-mono">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">
              Monthly PnL Grid View & Trading Activity
            </p>
          </div>
        </div>

        {/* Navigation & Summary */}
        <div className="flex items-center gap-3">
          
          <div className="bg-[#151921] px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 mr-2">Month Total:</span>
            <span className={`font-bold ${monthlyTotalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {monthlyTotalNet >= 0 ? '+' : ''}${monthlyTotalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-slate-500 ml-2">({monthlyTradeCount} trades)</span>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-[#151921] p-1 rounded-lg border border-slate-800">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-2 bg-[#151921]/60 rounded-lg">
            {d}
          </div>
        ))}
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-7 gap-2">
        {gridCells.map((cell) => {
          if (cell.isPadding) {
            return (
              <div
                key={cell.key}
                className="h-24 md:h-28 rounded-xl bg-[#0F131C]/30 border border-slate-900/50 opacity-20"
              />
            );
          }

          const hasData = !!cell.data;
          const pnl = hasData ? cell.data.net_pnl : 0;
          const isProfitable = pnl > 0;
          const isLoss = pnl < 0;

          let bgClass = 'bg-[#151921]/40 border-slate-800/60 text-slate-400 hover:border-slate-700';
          if (hasData) {
            if (isProfitable) {
              bgClass = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 hover:border-emerald-400 glow-emerald';
            } else if (isLoss) {
              bgClass = 'bg-rose-950/30 border-rose-500/40 text-rose-300 hover:border-rose-400 glow-rose';
            } else {
              bgClass = 'bg-slate-800/40 border-slate-700/60 text-slate-300';
            }
          }

          return (
            <div
              key={cell.key}
              onClick={() => hasData && onSelectDateFilter && onSelectDateFilter(cell.dateStr)}
              className={`h-24 md:h-28 p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${bgClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-300">
                  {cell.dayNumber}
                </span>
                {hasData && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/80 font-mono text-slate-400">
                    {cell.data.trades} {cell.data.trades === 1 ? 'trade' : 'trades'}
                  </span>
                )}
              </div>

              {hasData ? (
                <div className="text-right">
                  <div className={`text-xs md:text-sm font-bold font-mono ${isProfitable ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-slate-300'}`}>
                    {isProfitable ? '+' : ''}${pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5 font-mono">
                    <span className="text-emerald-400">{cell.data.wins}W</span>
                    <span>/</span>
                    <span className="text-rose-400">{cell.data.losses}L</span>
                  </div>
                </div>
              ) : (
                <div className="text-right opacity-30 text-[10px] font-mono text-slate-500">
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
