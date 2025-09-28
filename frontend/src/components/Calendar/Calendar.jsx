import moment from 'moment-timezone';
import React, { useMemo, useState } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const Calendar = ({ allSlots, selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const availableDates = useMemo(() => {
        return new Set(
            allSlots.map(slot => moment(slot.startTime).tz('Asia/Kolkata').format('YYYY-MM-DD'))
        );
    }, [allSlots]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = moment(date).format('YYYY-MM-DD');

      const isAvailable = availableDates.has(dateString);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`py-2 rounded-lg text-center cursor-pointer transition-colors ${
            isAvailable
              ? isSelected
                ? 'bg-[var(--primary-color)]/20 border border-[var(--primary-color)]/50 text-[var(--accent-color)]'
                : 'text-gray-300 hover:bg-[var(--primary-color)]/20'
              : 'text-gray-600 cursor-not-allowed opacity-50'
          }`}
          onClick={() => isAvailable && setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newDate;
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          onClick={() => changeMonth(-1)}
        >
          <span className="material-symbols-outlined text-gray-300"><FaChevronCircleLeft /></span>
        </button>
        <h3 className="text-gray-300 text-lg font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
          onClick={() => changeMonth(1)}
        >
          <span className="material-symbols-outlined text-gray-300"><FaChevronCircleRight /></span>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center gap-2 text-sm">
        <div className="text-gray-400 font-bold">S</div>
        <div className="text-gray-400 font-bold">M</div>
        <div className="text-gray-400 font-bold">T</div>
        <div className="text-gray-400 font-bold">W</div>
        <div className="text-gray-400 font-bold">T</div>
        <div className="text-gray-400 font-bold">F</div>
        <div className="text-gray-400 font-bold">S</div>
        {generateCalendarDays()}
      </div>
    </>
  );
};

export default Calendar;
