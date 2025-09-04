import React from 'react';
import { useStore } from '../../../hooks/useStore';
import { Link } from 'react-router-dom';

const Appointments = () => {
   
    const  { appointments } = useStore();

    const getUpcomingAppointments = () => {
        const today = new Date();
        return appointments.filter(apt => new Date(apt.slot.date) >= today && (apt.status === 'confirmed' || apt.status === 'pending'));
    };

    const getPastAppointments = () => {
        const today = new Date();
        return appointments.filter(apt => new Date(apt.slot.date) < today || apt.status === 'completed' || apt.status === 'cancelled');
    };

    const upcomingAppointments = getUpcomingAppointments();
    const pastAppointments = getPastAppointments();

    const getStatusClasses = (status) => {
        switch (status) {
            case 'confirmed':
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
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col items-center max-w-[1400px] flex-1 gap-10 animate-fadeIn">
                <div className="w-full text-center">
                    <h1 className="text-[var(--accent-color)] text-4xl font-bold">My Appointments</h1>
                    <p className="text-gray-400 text-lg mt-2">Manage your upcoming and past consultations.</p>
                </div>

                {/* Upcoming Appointments Section */}
                <div className="w-full max-w-6xl">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Upcoming Appointments</h2>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.map((apt,index) => (
                                <div key={index} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-[var(--accent-color)] text-xl font-semibold">Consultation with {apt.lawyerId.name}</h3>
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${getStatusClasses(apt.status)}`}>{apt.status}</span>
                                        </div>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Date:</span> {formatDate(apt.slot.date)}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Time:</span> {apt.slot.time}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Type:</span> {apt.lawyerId.specialization}</p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                                        <p className="text-lg font-semibold text-[var(--accent-color)] mb-2 md:mb-0">₹{apt.fees}</p>
                                        <div className="flex items-center gap-3">
                                            <Link className="py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium">Cancel</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">You have no upcoming appointments.</p>
                    )}
                </div>

                {/* Past Appointments Section */}
                <div className="w-full max-w-6xl mt-8">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Past Appointments</h2>
                    {pastAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {pastAppointments.map((apt) => (
                                <div key={apt._id} className={`bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 ${apt.status === 'cancelled' ? 'opacity-70' : ''}`}>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-[var(--accent-color)] text-xl font-semibold">Consultation with {apt.lawyerId.name}</h3>
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${getStatusClasses(apt.status)}`}>{apt.status}</span>
                                        </div>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Date:</span> {formatDate(apt.slot.date)}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Time:</span> {apt.slot.time}</p>
                                        <p className="text-gray-400"><span className="font-medium text-gray-300">Type:</span> {apt.lawyerId.specialization}</p>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                                        <p className={`text-lg font-semibold text-[var(--accent-color)] mb-2 md:mb-0 ${apt.status === 'cancelled' ? 'line-through text-gray-500' : ''}`}>₹{apt.fees}</p>
                                        <div className="flex items-center gap-3">
                                            {apt.status === 'completed' && (
                                                <Link to={`/user/appointment-details/${apt._id}`} className="py-2 px-4 rounded-lg bg-[var(--primary-color)]/20 text-[var(--accent-color)] hover:bg-[var(--primary-color)]/30 transition-colors text-sm font-medium">View Details</Link>
                                            )}
                                            {apt.status === 'cancelled' && (
                                                <Link to="/user/book-appointment" className="py-2 px-4 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-sm font-medium">Book Again</Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">You have no past appointments.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Appointments;
