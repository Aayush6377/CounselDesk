import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Error from '../../../components/Error/Error';
import Loader from '../../../components/Loader/Loader';
import { FaCheckCircle } from "react-icons/fa";
import { confirmSubscriptionPurchase } from '../../../services/lawyer.service';
import { useStore } from '../../../hooks/useStore';

const SubscriptionSuccess = () => {
    const location = useLocation();
    const { setUserDetails } = useStore();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verifyBooking = async () => {
            const sessionId = new URLSearchParams(location.search).get('session_id');

            if (sessionId) {
                try {
                    await confirmSubscriptionPurchase(sessionId);
                    setStatus('success');
                    setUserDetails((prev) => ({...prev, subscription: {...prev.subscription, status: "active"}}));
                } catch (error) {
                    setStatus('error');
                    console.error("Subscription Payment failed:", error);
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
                        Subscription Activated!
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 mb-8">
                        Your plan has been successfully upgraded. You now have access to all premium features.
                    </p>
                    <Link 
                        to="/user-lawyer" 
                        className="inline-block rounded-lg bg-[var(--primary-color)] px-8 py-3 text-base font-semibold text-[var(--secondary-color)] transition-transform duration-300 hover:scale-105 hover:bg-[#c0a97c]"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default SubscriptionSuccess;