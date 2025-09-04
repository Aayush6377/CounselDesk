import React, { useState, useEffect } from 'react';
import { lawyerProfile } from "../../../assets/assets";
import { FaChevronCircleLeft, FaChevronCircleRight, FaLock } from "react-icons/fa";


const Booking = () => {
  // const { lawyerId } = useParams();
  // const lawyer = fetchLawyerData(lawyerId);
  const lawyer = lawyerProfile;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Filter available slots based on the selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      const slots = lawyer.availability.filter(slot => slot.date === formattedDate);
      setAvailableSlots(slots.map(slot => slot.time));
      setSelectedTime(null);
    }
  }, [selectedDate, lawyer.availability]);

  // Calendar logic to generate the days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Add empty divs for preceding days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isAvailable = lawyer.availability.some(slot => {
        const slotDate = new Date(slot.date);
        return slotDate.getDate() === day && slotDate.getMonth() === month && slotDate.getFullYear() === year;
      });
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
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col items-center max-w-[1400px] flex-1 gap-8 animate-fadeIn">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-[var(--accent-color)] text-4xl font-bold">Book an Appointment</h1>
          <p className="text-gray-400 text-lg mt-2">with {lawyer.name}, {lawyer.specialization}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Calendar and Time Slots Section */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8">
            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Select a Date & Time</h2>
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
            <div className="mt-6">
              <h3 className="text-gray-300 text-lg font-semibold mb-4">
                Available Slots {selectedDate ? `on ${formatDate(selectedDate)}` : ''}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, index) => (
                    <button 
                      key={index}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg text-gray-300 transition-colors ${
                        selectedTime === slot ? 'bg-[var(--primary-color)] text-[var(--secondary-color)] font-semibold' : 'bg-black/30 hover:bg-[var(--primary-color)]/20 hover:text-[var(--accent-color)]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No available slots for this date.</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary and Payment Section */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8 flex flex-col">
            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Booking Summary</h2>
            <div className="space-y-4 flex-grow">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Lawyer:</p>
                <p className="text-[var(--accent-color)] font-semibold">{lawyer.name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Date:</p>
                <p className="text-[var(--accent-color)] font-semibold">
                  {selectedDate ? formatDate(selectedDate) : 'Not Selected'}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Time:</p>
                <p className="text-[var(--accent-color)] font-semibold">
                  {selectedTime || 'Not Selected'}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Duration:</p>
                <p className="text-[var(--accent-color)] font-semibold">1 Hour</p>
              </div>
              <div className="border-t border-white/10 my-4"></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300 text-lg">Consultation Fee:</p>
                <p className="text-[var(--primary-color)] text-2xl font-bold">₹{lawyer.fees}</p>
              </div>
            </div>
            <div className="mt-8">
              <button 
                className="mt-2 w-full flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-14 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-lg font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect"
                disabled={!selectedDate || !selectedTime}
              >
                <span className="material-symbols-outlined"><FaLock /></span>
                <span className="truncate">Confirm & Pay ${lawyer.fees}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Booking;
