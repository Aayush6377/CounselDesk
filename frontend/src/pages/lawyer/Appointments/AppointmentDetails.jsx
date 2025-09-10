import React from 'react';
import { IoArrowBack } from "react-icons/io5";
import { MdCalendarToday, MdSchedule, MdCheckCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const appointmentData = {
  user: {
    name: "Jessica Williams",
    email: "jessica.williams@example.com",
    role: "Client",
    profileImage: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  appointment: {
    date: "Oct 26, 2024",
    time: "11:00 AM - 11:30 AM",
    createdAt: "2024-10-20 14:30:00 UTC"
  },
  payment: {
    fees: 150.00,
    paymentId: "pay_9s0t1u2v3w4x",
    status: "Completed" 
  }
};

const AppointmentDetails = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case "Completed":
                return (
                    <div className="flex items-center gap-2 text-green-400 text-lg font-medium mt-1">
                        <MdCheckCircle className="text-xl" />
                        <span>Completed</span>
                    </div>
                );
            default:
                return <p className="text-gray-400">{status}</p>;
        }
    };

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
                                style={{ backgroundImage: `url("${appointmentData.user.profileImage}")` }}
                            ></div>
                            <h3 className="text-[var(--accent-color)] text-2xl font-bold">{appointmentData.user.name}</h3>
                            <p className="text-gray-400 text-lg">{appointmentData.user.role}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-8">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
                            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Appointment Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-400 text-sm">User Name</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium">{appointmentData.user.name}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-400 text-sm">User Email</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium">{appointmentData.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Slot Date</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium flex items-center gap-2">
                                        <MdCalendarToday className="text-base text-[var(--primary-color)]" /> {appointmentData.appointment.date}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Slot Time</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium flex items-center gap-2">
                                        <MdSchedule className="text-base text-[var(--primary-color)]" /> {appointmentData.appointment.time}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-400 text-sm">Created At</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium">{appointmentData.appointment.createdAt}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
                            <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Payment & Status</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-400 text-sm">Fees</label>
                                    <p className="text-[var(--accent-color)] text-2xl font-bold">${appointmentData.payment.fees.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Payment ID</label>
                                    <p className="text-[var(--accent-color)] text-lg font-medium">{appointmentData.payment.paymentId}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-gray-400 text-sm">Status</label>
                                    {renderStatusBadge(appointmentData.payment.status)}
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