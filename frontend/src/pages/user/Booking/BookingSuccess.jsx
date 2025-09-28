import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { confirmBooking } from "../../../services/user.service"; 
import Error from '../../../components/Error/Error';
import Loader from '../../../components/Loader/Loader';
import { FaCheckCircle } from "react-icons/fa";

const BookingSuccess = () => {
    const location = useLocation();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verifyBooking = async () => {
            const sessionId = new URLSearchParams(location.search).get('session_id');

            if (sessionId) {
                try {
                    await confirmBooking(sessionId);
                    setStatus('success');
                } catch (error) {
                    setStatus('error');
                    console.error("Booking confirmation failed:", error);
                }
            } else {
                setStatus('error');
            }
        };

        verifyBooking();
    }, [location.search]);

    if (status === 'verifying') {
        return <Loader />;
    }
    
    if (status === 'error') {
        return <Error title='Payment Failed or Canceled' message="There was an issue confirming your booking. Please contact support."/>;
    }

    return (
       <main className="bg-[var(--secondary-color)] flex flex-1 justify-center items-center px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
            <div className="w-full max-w-lg text-center animate-fadeIn">
                <div className="bg-black/20 border border-white/10 rounded-xl p-8 sm:p-12 shadow-2xl shadow-black/20">
                    <div className="flex justify-center items-center mx-auto bg-[var(--primary-color)]/10 rounded-full h-16 w-16 mb-6">
                        <span className="material-symbols-outlined text-4xl text-[var(--primary-color)]">
                            <FaCheckCircle />
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--accent-color)] mb-4">
                        Booking Successful!
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 mb-8">
                        Your appointment has been confirmed. You will receive an email shortly.
                    </p>
                    <Link 
                        to="/user/appointments" 
                        className="inline-block rounded-lg bg-[var(--primary-color)] px-8 py-3 text-base font-semibold text-[var(--secondary-color)] transition-transform duration-300 hover:scale-105 hover:bg-[#c0a97c]"
                    >
                        View My Appointments
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default BookingSuccess;