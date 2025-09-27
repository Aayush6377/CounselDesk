import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FaSave } from "react-icons/fa";
import { scheduleUpdate, scheduleDetails, scheduleAvailableToday } from '../../../services/lawyer.service';
import Switch from '../../../components/Switch/Switch';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import Loader from '../../../components/Loader/Loader';

const TimeSlot = ({ time, available, booked, cancelled }) => {
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
  if (cancelled) {
    return (
      <span className="py-1 px-2.5 bg-red-900/50 text-red-300 rounded-md line-through">
        {time}
      </span>
    )
  }
  return null;
};

const options = [
  {label: "15 min", value: 15},
  {label: "30 min", value: 30},
  {label: "45 min", value: 45},
  {label: "1 hour", value: 60},
];

const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const Availability = () => {
    const queryClient = useQueryClient();
    const [isAvailableToday, setIsAvailableToday] = useState(true);
    const [selectedDays, setSelectedDays] = useState({
      mon: false, tue: false, wed: false, thu: false, fri: false, sat: false ,sun: false
    });
    const [schedule, setSchedule] = useState({
        startTime: '', endTime: '', breakStartTime: '', breakEndTime: '', slotDuration: 30,
    });
    const [upcomingSlots, setUpcomingSlots] = useState([]);
    const [errors, setErrors] = useState({});

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['lawyerSchedule'],
        queryFn: scheduleDetails,
        retry: false,
    });

    useEffect(() => {
        if (data?.schedule) {
            const { recurringDays, availableToday, ...restOfSchedule } = data.schedule;
            setSelectedDays(recurringDays);
            setIsAvailableToday(availableToday);
            setSchedule(prev => ({ ...prev, ...restOfSchedule }));
        }

        if (data?.slots) {
            const groupedSlots = data.slots.reduce((acc, slot) => {
                const date = moment(slot.startTime).tz('Asia/Kolkata').format('YYYY-MM-DD');
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(slot);
                return acc;
            }, {});

            const formattedSlots = Object.keys(groupedSlots).map(dateStr => {
                const dateMoment = moment(dateStr);
                const today = moment().tz('Asia/Kolkata');
                let displayDate = dateMoment.format('dddd (MMM DD)');
                if (dateMoment.isSame(today, 'day')) {
                    displayDate = `Today (${dateMoment.format('MMM DD')})`;
                } else if (dateMoment.isSame(today.clone().add(1, 'day'), 'day')) {
                    displayDate = `Tomorrow (${dateMoment.format('MMM DD')})`;
                }

                return {
                    date: displayDate,
                    slots: groupedSlots[dateStr].map(s => ({
                        time: moment(s.startTime).tz('Asia/Kolkata').format('hh:mm A'),
                        available: s.status === 'available',
                        booked: s.status === 'booked', 
                        cancelled: s.status === 'cancelled'
                    }))
                };
            });
            setUpcomingSlots(formattedSlots);
        }

    }, [data]);

    useEffect(() => {
        if (isError) {
            if (error.response?.status === 404) {
                toast.warn("Schedule is not set, please set the schedule", {
                    toastId: "schedule-not-set-error"
                });
            } else {
                toast.error(error.response?.data?.message || "Failed to load schedule data.", {
                    toastId: "schedule-load-error"
                });
            }
        }
    }, [isError, error]);

    const { mutate, isPending } = useMutation({
        mutationFn: scheduleUpdate,
        onSuccess: () => {
            toast.success("Schedule saved successfully!");
            setErrors({});
            queryClient.invalidateQueries(['lawyerSchedule']);
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
            }
        }
    });

    const { mutate: updateAvailableToday } = useMutation({
      mutationFn: scheduleAvailableToday,
      onSuccess: () => {
        queryClient.invalidateQueries(["lawyerSchedule"]);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
      }
    });

    const handleDayToggle = (day) => {
        setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const handleScheduleChange = (e) => {
        const { name, value } = e.target;
        setSchedule(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };
    
    const handleSaveSchedule = () => {
        mutate({ selectedDays, ...schedule });
    };

    const handleToggle = () => {
      setIsAvailableToday(!isAvailableToday);
      updateAvailableToday(!isAvailableToday);
    }

    if (isLoading) {
        return <Loader />;
    }

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
              <Switch name="toggle" checked={isAvailableToday} onChange={handleToggle} />
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
                  {errors["startTime"] && <p className="text-red-500 text-sm mt-1">{errors["startTime"]}</p>}
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
                  {errors["endTime"] && <p className="text-red-500 text-sm mt-1">{errors["endTime"]}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="breakStartTime">Break Start Time</label>
                  <input
                    type="time"
                    id="breakStartTime"
                    value={schedule.breakStartTime}
                    onChange={handleScheduleChange}
                    name="breakStartTime"
                    className="form-input w-full rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-all duration-300 h-12"
                  />
                  {errors["breakStartTime"] && <p className="text-red-500 text-sm mt-1">{errors["breakStartTime"]}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="breakEndTime">Break End Time</label>
                  <input
                    type="time"
                    id="breakEndTime"
                    value={schedule.breakEndTime}
                    onChange={handleScheduleChange}
                    name="breakEndTime"
                    className="form-input w-full rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-all duration-300 h-12"
                  />
                  {errors["breakEndTime"] && <p className="text-red-500 text-sm mt-1">{errors["breakEndTime"]}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-medium" htmlFor="slotDuration">Slot Duration</label>
                  <CustomSelect options={options} value={schedule.slotDuration} onChange={handleScheduleChange} id="slotDuration" name="slotDuration"/>
                  {errors["slotDuration"] && <p className="text-red-500 text-sm mt-1">{errors["slotDuration"]}</p>}
                </div>
              </div>
              <button 
                onClick={handleSaveSchedule}
                className="w-full sm:w-auto flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect"
              >
                <span className="material-symbols-outlined"><FaSave /></span>
                <span className="truncate">{isPending ? "Saving..." : "Save Schedule"}</span>
              </button>
            </div>
          </div>

          {/* Upcoming Slots */}
          <div className="flex flex-col gap-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-[var(--accent-color)] text-lg font-bold mb-4">Upcoming Slots (Next 3 Days)</h3>
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                {upcomingSlots.length > 0 ? (
                      upcomingSlots.map((day, index) => (
                          <div key={index} className="p-3 bg-black/30 rounded-lg">
                              <p className="font-bold text-gray-300 mb-2">{day.date}</p>
                              <div className="flex flex-wrap gap-2 text-sm">
                                  {day.slots.map((slot, slotIndex) => (
                                      <TimeSlot key={slotIndex} {...slot} />
                                  ))}
                              </div>
                          </div>
                      ))
                  ) : (
                      <p className="text-sm text-gray-500">No upcoming slots available.</p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Availability;