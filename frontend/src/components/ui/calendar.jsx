import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export function Calendar({ selectedDate, onSelect, className }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onDateClick = (day) => {
    // Prevent past dates
    if (isBefore(day, startOfDay(new Date()))) return;
    onSelect(day);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Determine header
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-1">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full border border-border/50 hover:bg-muted">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-[15px] tracking-wide">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full border border-border/50 hover:bg-muted">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Determine Days of week row
  const renderDays = () => {
    const days = [];
    const dateFormat = 'E'; // Mon, Tue, etc
    let startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider h-8 flex items-center justify-center" key={i}>
          {format(addDays(startDate, i), dateFormat).slice(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2 gap-1">{days}</div>;
  };

  // Determine cells
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = startOfDay(new Date());

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const disabled = isBefore(day, today);
        const selected = selectedDate && isSameDay(day, selectedDate);
        const notCurrentMonth = !isSameMonth(day, monthStart);

        days.push(
          <div className="relative p-0.5 h-10 sm:h-12 w-full flex items-center justify-center" key={day.toString()}>
            <Button
              variant={selected ? "default" : "ghost"}
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-full text-sm transition-all flex items-center justify-center relative",
                disabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : "hover:bg-primary/10 hover:text-foreground font-medium",
                selected ? "bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary hover:opacity-90" : "text-foreground",
                notCurrentMonth && !selected && !disabled && "text-muted-foreground opacity-50",
                !disabled && !selected && isSameDay(day, today) && "text-primary font-bold after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full"
              )}
              onClick={() => !disabled && onDateClick(cloneDay)}
              disabled={disabled}
            >
              {formattedDate}
            </Button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className={cn("p-2 w-full", className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
