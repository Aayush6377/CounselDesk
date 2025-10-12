import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import renderRating from '../../../utils/renderRating';
import { FaArrowLeft, FaVideo } from "react-icons/fa";
import Review from './Review';
import { downloadInvoice, getAppointmentDetails, cancelAppointment } from '../../../services/user.service';
import moment from 'moment-timezone';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { images } from '../../../assets/assets';

const getStatusClasses = (status) => {
    switch (status) {
        case 'scheduled':
            return 'bg-green-500/20 text-green-400';
        case 'pending':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'completed':
            return 'bg-gray-500/20 text-gray-400';
        case 'cancelled':
            return 'bg-red-500/20 text-red-400';
        default:
            return '';
    }
};

const formatDate = (dateString) => {
    return moment(dateString).tz('Asia/Kolkata').format('D MMMM YYYY');
};

const formatTime = (dateString) => {
    return moment(dateString).tz('Asia/Kolkata').format('hh:mm A');
};

const AppointmentDetails = () => {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const queryClient = useQueryClient();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: result, isLoading, isError, error } = useQuery({
        queryKey: ["appointmentData", appointmentId],
        queryFn: () => getAppointmentDetails(appointmentId),
    });

    const appointmentData = result?.data;

    const { mutate: cancel, isPending: isCancelling } = useMutation({
        mutationFn: (id) => cancelAppointment(id),
        onSuccess: () => {
            toast.success("Appointment successfully cancelled");
            queryClient.invalidateQueries({ queryKey: ["appointmentData", appointmentId] });
            setIsModalOpen(false);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Appointment cancellation failed");
            setIsModalOpen(false);
        }
    });

    const handleDownloadInvoice = async () => {
        setIsDownloading(true);
        try {
            await downloadInvoice(appointmentId);
        } catch (error) {
            console.error(error);
            toast.error("Failed to download invoice. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleConfirmCancel = () => {
        cancel(appointmentId);
    };

    if (isLoading) {
        return <Loader />;
    }

    if (isError || !appointmentData) {
        const errorCode = error?.response?.data?.status || 500;
        const errorMessage = error?.response?.data?.message || "Appointment not found or an error occurred.";
        const errorTitle = createTitleFromStatus(errorCode);
        return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />;
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col items-center max-w-5xl flex-1 gap-10 animate-fadeIn">
                <div className="w-full flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="flex cursor-pointer items-center justify-center h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 transition-colors">
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-[var(--accent-color)] text-3xl sm:text-4xl font-bold">Appointment Details</h1>
                </div>

                <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 flex flex-col items-center text-center">
                            <img alt="Lawyer Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary-color)]/50 glow-effect mb-4" src={appointmentData.lawyerId.userId.profileImage || images.defaultProfile} />
                            <h2 className="text-2xl font-bold text-[var(--accent-color)]">{appointmentData?.lawyerId?.userId?.name}</h2>
                            <p className="text-base text-gray-400">{appointmentData.lawyerId.specialization}</p>
                            <div className="flex items-center gap-1 mt-2 text-[var(--primary-color)]">
                                {renderRating(appointmentData?.lawyerId?.rating)}
                                <span className="text-sm text-gray-300 ml-1">({appointmentData?.lawyerId?.reviewsCount})</span>
                            </div>
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Appointment Date</p>
                                <p className="text-lg font-semibold text-[var(--accent-color)]">{formatDate(appointmentData?.timeSlotId?.startTime)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">Time Slot</p>
                                <p className="text-lg font-semibold text-[var(--accent-color)]">{formatTime(appointmentData?.timeSlotId?.startTime)} - {formatTime(appointmentData?.timeSlotId?.endTime)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">Status</p>
                                <span className={`text-base font-semibold capitalize px-2 py-1 rounded-full ${getStatusClasses(appointmentData?.status)}`}>{appointmentData?.status}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-400">Appointment Fees</p>
                                <p className="text-lg font-semibold text-[var(--accent-color)]">{Math.abs(appointmentData?.paymentId?.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-gray-400">Payment ID</p>
                                <p className="text-base font-semibold text-[var(--accent-color)] font-mono">{appointmentData?.paymentId?.transactionId}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm font-medium text-gray-400">Booked On</p>
                                <p className="text-lg font-semibold text-[var(--accent-color)]">{formatDate(appointmentData?.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                        {appointmentData.status === 'scheduled' && (
                            <>
                                <Link to={`/user/meeting/${appointmentData._id}`} target="_blank" className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-6 rounded-lg bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[#c0a97c] transition-colors text-base font-bold">
                                    <FaVideo />
                                    <span>Join Meeting</span>
                                </Link>
                                <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto py-2 px-6 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-base font-medium cursor-pointer">
                                    Cancel Appointment
                                </button>
                            </>
                        )}
                        {(appointmentData.status === 'completed') && (
                             <button onClick={handleDownloadInvoice} disabled={isDownloading} className="w-full sm:w-auto py-2 px-6 rounded-lg bg-black/40 text-gray-300 cursor-pointer hover:bg-black/60 transition-colors text-base font-medium disabled:opacity-50">
                                {isDownloading ? 'Downloading...' : 'Download Invoice'}
                            </button>
                        )}
                    </div>
                </div>
                {appointmentData.status === 'completed' && <Review />}
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Confirm Cancellation"
                message="Are you sure you want to cancel this appointment?"
                confirmText="Yes, Cancel"
                isConfirming={isCancelling}
            />
        </main>
    );
};

export default AppointmentDetails;
