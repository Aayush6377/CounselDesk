import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionDetails } from '../../../services/lawyer.service'; 
import { FaRegCheckCircle } from "react-icons/fa";
import moment from 'moment-timezone';
import Loader from '../../../components/Loader/Loader'; 
import Error from '../../../components/Error/Error';  

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).tz('Asia/Kolkata').format('MMMM Do, YYYY');
};

const ActiveSubscriptionView = ({ setIsModalOpen }) => {
    const { data: result, isLoading, isError, error } = useQuery({
        queryKey: ['activeSubscriptionDetails'],
        queryFn: getSubscriptionDetails,
    });

    const handleCancel = () => {
        setIsModalOpen(true);
    };

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Error title="Could Not Load Subscription" message={error.response?.data?.message || "There was an issue fetching your subscription details."} />;
    }

    const details = result?.data;

    const statusConfig = {
        active: {
            badgeClass: 'bg-[var(--primary-color)] text-[var(--secondary-color)]',
            description: 'Your subscription is active and providing you with premium benefits.',
            dateLabel: 'Renews on',
        },
        canceled: {
            badgeClass: 'bg-yellow-500/20 text-yellow-400',
            description: `Your subscription is scheduled to be cancelled. You can use premium features until ${formatDate(details.renewalDate)}.`,
            dateLabel: 'Expires on',
        }
    };
    
    const currentStatusConfig = statusConfig[details.status] || statusConfig.active;

    const formattedCost = (details.cost).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    });

    return (
        <div className="flex flex-col items-center w-full animate-fadeIn">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Your Subscription</h1>
                <p className="text-gray-400 mt-2 text-lg">Thank you for being a premium member of CounselDesk.</p>
            </div>
            <div className="mt-12 w-full max-w-4xl bg-black/20 border border-[var(--primary-color)]/50 rounded-xl p-8 glow-effect">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-3xl font-bold text-[var(--primary-color)]">{details.planTitle} Plan</h3>
                        <p className="text-gray-300 mt-2">{currentStatusConfig.description}</p>
                    </div>
                    <span className={`mt-4 md:mt-0 px-4 py-2 text-sm font-semibold capitalize rounded-full ${currentStatusConfig.badgeClass}`}>
                        {details.status}
                    </span>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xl font-semibold text-[var(--accent-color)] mb-4">Plan Details</h4>
                        <div className="space-y-3 text-gray-300">
                            <p><strong className="font-medium text-white">Cost:</strong> {formattedCost} / {details.period}</p>
                            <p><strong className="font-medium text-white">{currentStatusConfig.dateLabel}:</strong> {formatDate(details.renewalDate)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-[var(--accent-color)] mb-4">Premium Benefits</h4>
                        <ul className="space-y-3">
                            {details.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[var(--primary-color)]"><FaRegCheckCircle /></span>
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 flex flex-col md:flex-row gap-4">
                    {details.status === 'active' && (
                         <button onClick={handleCancel} className="w-full md:w-auto py-3 px-6 rounded-lg bg-red-600/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300 cursor-pointer">
                            Cancel Subscription
                        </button>
                    )}
                     {details.status === 'canceled' && (
                        <p className="text-yellow-400 text-sm">
                            Your subscription will not renew automatically. To reactivate it, please subscribe again after it has been deactivated
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
};

export default ActiveSubscriptionView;