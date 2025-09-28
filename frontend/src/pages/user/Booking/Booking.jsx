import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { useQuery } from '@tanstack/react-query';
import { FaLock } from "react-icons/fa";
import { getLawyerTimeSlots, createCheckoutSession } from '../../../services/user.service';
import Calendar from "../../../components/Calendar/Calendar";
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import { toast } from 'react-toastify';


const Booking = () => {
  const { lawyerId } = useParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: result, isPending, isError, error } = useQuery({
      queryKey: ['lawyerTimeSlots', lawyerId],
      queryFn: () => getLawyerTimeSlots(lawyerId),
  });

  const lawyer = result?.data; 
  const allSlots = result?.slots;
  const hasBookedSlotToday = result?.hasBookedSlotToday; 

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [availableSlotsForDay, setAvailableSlotsForDay] = useState([]);

  useEffect(() => {
      if (allSlots?.length > 0 && !selectedDate) {
          const firstSlot = allSlots[0];
          setSelectedDate(moment(firstSlot.startTime).toDate());
          setSelectedTime(moment(firstSlot.startTime).tz('Asia/Kolkata').format('hh:mm A'));
      }
  }, [allSlots, selectedDate]);
    
  useEffect(() => {
    if (selectedDate && allSlots?.length > 0) {
        const slotsForSelectedDate = allSlots
            .filter(slot => moment(slot.startTime).isSame(selectedDate, 'day'))
            .map(slot => moment(slot.startTime).tz('Asia/Kolkata').format('hh:mm A'));
        
        setAvailableSlotsForDay(slotsForSelectedDate);
        setSelectedTime(null);
    } else {
        setAvailableSlotsForDay([]);
    }
  }, [selectedDate, allSlots]);

  useEffect(() => {
        if (hasBookedSlotToday) {
            toast.warn("You already have an appointment scheduled for today.", {
                toastId: "already-booked-today-warning",
                autoClose: 10000, 
            });
        }
    }, [hasBookedSlotToday]);
  
 const formatDate = (date) => {
      if (!date) return 'Not Selected';
      return moment(date).format('dddd, MMMM Do YYYY');
  };

  const handleTimeSelect = (timeString) => {
    const fullSlot = allSlots.find(slot => 
        moment(slot.startTime).tz('Asia/Kolkata').format('hh:mm A') === timeString
    );
    setSelectedSlot(fullSlot);
    setSelectedTime(timeString);
  }

  const handleConfirmAndPay = async () => {
    if (!selectedSlot || !selectedTime) {
        toast.error("Please select an available time slot.");
        return;
    }

    setIsRedirecting(true);

    try {
        const bookingDetails = {
            lawyerId: lawyerId,
            timeSlotId: selectedSlot._id
        };
        
        const response = await createCheckoutSession(bookingDetails);

        if (response.url) {
            window.location.href = response.url;
        } else {
            toast.error("Could not initiate payment session.");
            setIsRedirecting(false);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Payment initiation failed. Please try again.");
        setIsRedirecting(false);
    }
  }
  
  if (isPending) return <Loader />;
  if (isError){
    const errorCode = error.response?.data?.status || 500;
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    const errorTitle = createTitleFromStatus(errorCode);

    return (
      <Error 
        errorCode={errorCode}
        title={errorTitle}
        message={errorMessage} 
      />
    );
  }

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col items-center max-w-[1400px] flex-1 gap-8 animate-fadeIn">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-[var(--accent-color)] text-4xl font-bold">Book an Appointment</h1>
          <p className="text-gray-400 text-lg mt-2">with {lawyer.userId.name}, {lawyer.specialization}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Calendar and Time Slots Section */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8">
            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Select a Date & Time</h2>
            
            <Calendar 
                allSlots={allSlots} 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <div className="mt-6">
              <h3 className="text-gray-300 text-lg font-semibold mb-4">
                Available Slots {selectedDate ? `on ${moment(selectedDate).format('MMM DD')}` : ''}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlotsForDay?.length > 0 ? (
                  availableSlotsForDay.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(slot)}
                      className={`py-2 px-3 rounded-lg text-gray-300 transition-colors ${
                        selectedTime === slot ? 'bg-[var(--primary-color)] text-[var(--secondary-color)] font-semibold' : 'bg-black/30 hover:bg-[var(--primary-color)]/20 hover:text-[var(--accent-color)]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">{selectedDate ? 'No available slots for this date.' : 'Select a date to see available slots.'}</p>
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
                <p className="text-[var(--accent-color)] font-semibold">{lawyer.userId.name}</p>
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
                onClick={handleConfirmAndPay} 
                className="mt-2 w-full flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-14 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-lg font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect"
                disabled={!selectedDate || isRedirecting}
              >
                <span className="material-symbols-outlined"><FaLock /></span>
                <span className="truncate">
                  {isRedirecting ? 'Redirecting to Payment...' : `Confirm & Pay ₹${lawyer?.fees}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Booking;
