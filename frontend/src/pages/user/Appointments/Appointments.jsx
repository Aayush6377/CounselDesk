import Pagination from '../../../components/Pagination/Pagination';
import Loader from '../../../components/Loader/Loader';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { cancelAppointment, getUserAppointments } from '../../../services/user.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
    return moment(dateString).tz('Asia/Kolkata').format('dddd, MMMM Do YYYY');
};

const formatTime = (dateString) => {
    return moment(dateString).tz('Asia/Kolkata').format('hh:mm A');
};

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

const Appointments = () => {
    const queryClient = useQueryClient();
    const [curPage, setCurPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const { data: result, isLoading, isError, error } = useQuery({
        queryKey: ["userAppointments", curPage],
        queryFn: () => getUserAppointments(curPage),
    });

    useEffect(() => {
        if (result) {
            setAppointments(result.data);
            setPagination(result.pagination);
        }
    }, [result]);

     const handlePageChange = (newPage) => {
        if (typeof newPage !== 'number') return; 

        if (newPage > 0 && newPage <= pagination.totalPages) {
            setCurPage(newPage);
        }
    };

    //cancel api call
    const { mutate: cancel , isPending: isCancelling} = useMutation({
        mutationFn: (appointmentId) => cancelAppointment(appointmentId),
        onSuccess: () => {
            toast.success("Appointment successfully cancelled");
            queryClient.invalidateQueries({ queryKey: ["userAppointments", curPage] });
            setIsModalOpen(false);
            setAppointmentToCancel(null);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Appointment cancellation failed");
            setIsModalOpen(false);
            setAppointmentToCancel(null);
        }
    });

    //Modal handlers
     const handleOpenCancelModal = (appointmentId) => {
        setAppointmentToCancel(appointmentId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (appointmentToCancel) {
            cancel(appointmentToCancel);
        }
    };

    if (isLoading){
        return <Loader />;
    }

    if (isError){
        const errorCode = error.response?.data?.status || 500;
        const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
        const errorTitle = createTitleFromStatus(errorCode);

        return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col items-center max-w-[1400px] flex-1 gap-10 animate-fadeIn">
                <div className="w-full text-center">
                    <h1 className="text-[var(--accent-color)] text-4xl font-bold">My Appointments</h1>
                    <p className="text-gray-400 text-lg mt-2">Manage your upcoming and past consultations.</p>
                </div>

                <div className="w-full max-w-6xl mt-8">
                    {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((apt, index) => (
                                <div key={index} className={`bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 ${apt.status === 'cancelled' ? 'opacity-70' : ''}`}>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-[var(--accent-color)] text-xl font-semibold">Consultation with {apt.lawyerName}</h3>
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${getStatusClasses(apt.status)}`}>{apt.status}</span>
                                        </div>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Date:</span> {formatDate(apt.date)}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Time:</span> {formatTime(apt.date)}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Type:</span> {apt.specialization}</p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                                        <p className={`text-lg font-semibold text-[var(--accent-color)] mb-2 md:mb-0 ${apt.status === 'cancelled' ? 'line-through text-gray-500' : ''}`}>₹{apt.fees}</p>
                                        <div className="flex items-center gap-3">
                                            {apt.status === 'completed' && (
                                                <Link to={`/user/appointment-details/${apt._id}`} className="py-2 px-4 rounded-lg bg-[var(--primary-color)]/20 text-[var(--accent-color)] hover:bg-[var(--primary-color)]/30 transition-colors text-sm font-medium">View Details</Link>
                                            )}
                                            {apt.status === 'cancelled' && (
                                                <Link to={`/user/book-appointment/${apt.lawyerId}`} className="py-2 px-4 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-sm font-medium">Book Again</Link>
                                            )}
                                            {apt.status === 'scheduled' && (
                                                <button onClick={() => handleOpenCancelModal(apt._id)} className="py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium cursor-pointer">
                                                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">You have no appointments.</p>
                    )}
                </div>

                <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Appointment Cancellation"
                message="Are you sure you want to cancel this appointment? This action cannot be undone."
                confirmText="Yes, Cancel"
                isConfirming={isCancelling}
            />
        </main>
    );
};

export default Appointments;
