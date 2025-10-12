import React from 'react';
import { IoArrowBack } from "react-icons/io5";
import { MdCalendarToday, MdSchedule, MdCheckCircle, MdHourglassEmpty, MdCancel, MdVideocam } from "react-icons/md";
import { RiRefundFill } from "react-icons/ri";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAppointmentDetails } from '../../../services/lawyer.service';
import { useQuery } from '@tanstack/react-query';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import moment from 'moment-timezone';
import { images } from '../../../assets/assets';

const renderStatusBadge = (status) => {
    switch (status) {
        case "consultancy":
            return (
                <div className="flex items-center gap-2 text-green-400 text-lg font-medium mt-1">
                    <MdCheckCircle className="text-xl" />
                    <span>Paid</span>
                </div>
            );
        case "refund":
            return (
                <div className="flex items-center gap-2 text-red-400 text-lg font-medium mt-1">
                    <RiRefundFill className="text-xl" />
                    <span>Refund</span>
                </div>
            );
        case "completed":
            return (
                <div className="flex items-center gap-2 text-blue-400 text-lg font-medium">
                    <MdCheckCircle className="text-xl" />
                    <span>Completed</span>
                </div>
            );
        case "scheduled":
            return (
                <div className="flex items-center gap-2 text-green-400 text-lg font-medium">
                    <MdHourglassEmpty className="text-xl" />
                    <span>Scheduled</span>
                </div>
            );
        case "cancelled":
            return (
                <div className="flex items-center gap-2 text-red-400 text-lg font-medium">
                    <MdCancel className="text-xl" />
                    <span>Cancelled</span>
                </div>
            );
        default:
            return <p className="text-gray-400">{status}</p>;
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

    const {data: result, isLoading, isError, error} = useQuery({
        queryKey: ["appointmentData", appointmentId],
        queryFn: () => getAppointmentDetails(appointmentId),
    });

    const appointmentData = result?.data;

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading){
        return <Loader />;
    }

    if (isError || !appointmentData) {
        const errorCode = error?.response?.data?.status || 500;
        const errorMessage = error?.response?.data?.message || "Appointment not found or an error occurred.";
        const errorTitle = createTitleFromStatus(errorCode);
        return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />;
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-wrap justify-between items-center gap-6">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Appointment Details</h1>
                        <p className="text-gray-400 mt-2 text-lg">Key information for the scheduled appointment.</p>
                    </div>
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent border border-[var(--primary-color)] text-[var(--primary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[var(--primary-color)]/10 transition-all duration-300 transform hover:scale-105"
                    >
                        <IoArrowBack />
                        <span className="truncate">Back to List</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-8">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center h-full justify-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-[var(--primary-color)] mb-4"
                                style={{ backgroundImage: `url("${appointmentData?.userId?.profileImage || images.defaultProfile}")` }}
                            ></div>
                            <h3 className="text-[var(--accent-color)] text-2xl font-bold">{appointmentData?.userId?.name}</h3>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
                            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Appointment Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-400 text-sm">User Name</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium">{appointmentData?.userId?.name}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-400 text-sm">User Email</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium break-all">{appointmentData?.userId?.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Slot Date</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium flex items-center gap-2">
                                        <MdCalendarToday className="text-base text-[var(--primary-color)]" /> {formatDate(appointmentData?.timeSlotId?.startTime)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Slot Time</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium flex items-center gap-2">
                                        <MdSchedule className="text-base text-[var(--primary-color)]" /> {formatTime(appointmentData?.timeSlotId?.startTime)} - {formatTime(appointmentData?.timeSlotId?.endTime)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Booked On</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium flex items-center gap-2">{formatDate(appointmentData?.updatedAt)} {formatTime(appointmentData?.updatedAt)}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Appointment status</label>
                                    {renderStatusBadge(appointmentData.status)}
                                </div>
                                {['scheduled', 'completed'].includes(appointmentData.status) && (
                                    <div className="sm:col-span-2">
                                        <label className="text-gray-400 text-sm">Meeting Link</label>
                                        <p className="text-blue-400 text-lg font-medium break-all cursor-pointer hover:underline">
                                            <Link to={`/user-lawyer/meeting/${appointmentData._id}`} target="_blank" rel="noopener noreferrer">{appointmentData.meetingLink}</Link>
                                        </p>
                                    </div>
                                )}

                                {appointmentData.status === 'scheduled' && (
                                    <div className="sm:col-span-2">
                                        <Link 
                                            to={`/user-lawyer/meeting/${appointmentData._id}`} target="_blank"
                                            className="inline-flex items-center gap-2 mt-4 rounded-lg bg-[var(--primary-color)] px-6 py-3 text-base font-semibold text-[var(--secondary-color)] transition-transform duration-300 hover:scale-105 hover:bg-[#c0a97c]"
                                        >
                                            <MdVideocam className="text-xl" />
                                            Join Meeting
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
                            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Payment & Status</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-400 text-sm">Amount</label>
                                    <p className="text-[var(--accent-color)] text-2xl font-bold">
                                        ₹{Math.abs(appointmentData?.paymentId?.amount)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Payment ID</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium break-all">
                                        {appointmentData?.paymentId?.transactionId}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-400 text-sm">Payment status</label>
                                    {renderStatusBadge(appointmentData?.paymentId?.type)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppointmentDetails;