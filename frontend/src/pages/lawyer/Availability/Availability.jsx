import React, { useState } from 'react';
import Switch from '../../../components/Switch/Switch';
import { FaSave } from "react-icons/fa";
import CustomSelect from '../../../components/CustomSelect/CustomSelect';

const TimeSlot = ({ time, available, booked }) => {
  if (booked) {
    return (
      <span className="py-1 px-2.5 bg-gray-700 text-gray-400 rounded-md line-through">
        {time}
      </span>
    );
  }
  if (available) {
    return (
      <span className="py-1 px-2.5 bg-green-900/50 text-green-300 rounded-md">
        {time}
      </span>
    );
  }
  return null;
};

const Availability = () => {
  const [isAvailableToday, setIsAvailableToday] = useState(true);

  const [selectedDays, setSelectedDays] = useState({
    mon: false,
    tue: true,
    wed: false,
    thu: true,
    fri: false,
    sat: false,
    sun: false,
  });

  const [schedule, setSchedule] = useState({
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
  });

  const options = [
    {label: "15 min", value: 15},
    {label: "30 min", value: 30},
    {label: "45 min", value: 45},
    {label: "1 hour", value: 60},
  ];

  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveSchedule = () => {
    console.log("Saving schedule:", { selectedDays, ...schedule });
  };

  const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const upcomingSlotsData = [
    { 
      date: "Today (Oct 24)", 
      slots: [
        { time: "09:00 AM", booked: true },
        { time: "09:30 AM", available: true },
        { time: "10:00 AM", available: true },
        { time: "10:30 AM", booked: true },
        { time: "11:00 AM", available: true },
      ] 
    },
    { date: "Tomorrow (Oct 25)" , slots: []},
    { date: "Saturday (Oct 26)" , slots: []},
    { date: "Sunday (Oct 27)"  , slots: []},
    { 
      date: "Monday (Oct 28)", 
      slots: [
        { time: "09:00 AM", available: true },
        { time: "09:30 AM", available: true },
        { time: "10:00 AM", available: true },
      ]
    },
    { 
      date: "Tuesday (Oct 29)", 
      slots: [
        { time: "09:00 AM", available: true },
        { time: "09:30 AM", booked: true },
        { time: "10:00 AM", available: true },
        { time: "10:30 AM", available: true },
        { time: "11:00 AM", available: true },
      ]
    }
  ];


  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1400px] flex-1 gap-8 animate-fadeIn">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Availability</h1>
            <p className="text-gray-400 mt-2 text-lg">Set your weekly schedule.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={isAvailableToday ? "text-gray-400" : "text-[var(--accent-color)]"}>Unavailable Today</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <Switch name="toggle" checked={isAvailableToday} onChange={() => setIsAvailableToday(!isAvailableToday)} />
            </div>
            <span className={`font-medium ${isAvailableToday ? "text-[var(--accent-color)]" : "text-gray-400"}`}>Available Today</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-6 hover:border-[var(--primary-color)]/50 transition-all duration-300">
              <h2 className="text-[var(--accent-color)] text-xl font-bold mb-4">Recurring Schedule</h2>
              <div className="mb-6">
                <label className="block text-gray-400 mb-2 text-sm font-medium">Select Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <React.Fragment key={day}>
                      <input
                        type="checkbox"
                        id={day}
                        name="day"
                        className="hidden day-checkbox"
                        checked={selectedDays[day]}
                        onChange={() => handleDayToggle(day)}
                      />
                      <label htmlFor={day} className={`bg-[var(--${selectedDays[day] ? "primary" : "secondary"}-color)] cursor-pointer text-center font-medium py-2 px-4 rounded-md border border-white/20 hover:bg-${selectedDays[day] ? "#E8D7B5" : "black"}/50 transition-colors text-[var(--accent-color)] capitalize`}>
                        {day}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    value={schedule.startTime}
                    onChange={handleScheduleChange}
                    name="startTime"
                    className="form-input w-full rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-all duration-300 h-12"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    value={schedule.endTime}
                    onChange={handleScheduleChange}
                    name="endTime"
                    className="form-input w-full rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-all duration-300 h-12"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="slotDuration">Slot Duration</label>
                  <CustomSelect options={options} value={schedule.slotDuration} onChange={handleScheduleChange} id="slotDuration" name="slotDuration"/>
                </div>
              </div>
              <button 
                onClick={handleSaveSchedule}
                className="w-full sm:w-auto flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect"
              >
                <span className="material-symbols-outlined"><FaSave /></span>
                <span className="truncate">Save Schedule</span>
              </button>
            </div>
          </div>

          {/* Upcoming Slots */}
          <div className="flex flex-col gap-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-[var(--accent-color)] text-lg font-bold mb-4">Upcoming Slots (Next 7 Days)</h3>
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                {upcomingSlotsData.map((day, index) => (
                  <div key={index} className="p-3 bg-black/30 rounded-lg">
                    <p className="font-bold text-gray-300 mb-2">{day.date}</p>
                    {day.slots.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-sm">
                        {day.slots.map((slot, slotIndex) => (
                           <TimeSlot key={slotIndex} {...slot} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No available slots
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Availability;