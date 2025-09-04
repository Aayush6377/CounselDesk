import React from 'react';
import { Link } from 'react-router-dom';
import { appointment } from '../../../assets/assets';
import renderRating from '../../../utils/renderRating';
import { FaArrowLeft } from "react-icons/fa";
import Review from './Review';

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

const AppointmentDetails = () => {
  const { lawyerId, slot, fees, status, paymentId, createdAt } = appointment;

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col items-center max-w-5xl flex-1 gap-10 animate-fadeIn">
        <div className="w-full flex items-center gap-4">
          <Link to="/user/appointments" className="flex items-center justify-center h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-gray-300 transition-colors">
            <span className="material-symbols-outlined"><FaArrowLeft /></span>
          </Link>
          <h1 className="text-[var(--accent-color)] text-3xl sm:text-4xl font-bold">Appointment Details</h1>
        </div>

        <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <img alt="Lawyer Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-[var(--primary-color)]/50 glow-effect mb-4" src={lawyerId.profileImage} />
              <h2 className="text-2xl font-bold text-[var(--accent-color)]">{lawyerId.name}</h2>
              <p className="text-base text-gray-400">{lawyerId.specialization}</p>
              <div className="flex items-center gap-1 mt-2 text-[var(--primary-color)]">
                {renderRating(lawyerId.rating)}
                <span className="text-sm text-gray-300 ml-1">({lawyerId.rating})</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[var(--primary-color)]/20 text-[var(--accent-color)]">{lawyerId.subscriptionPlan} Plan</span>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="text-sm font-medium text-gray-400">Appointment Date</p>
                <p className="text-lg font-semibold text-[var(--accent-color)]">{formatDate(slot.date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Time Slot</p>
                <p className="text-lg font-semibold text-[var(--accent-color)]">{slot.time}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Status</p>
                <span className={`text-lg font-semibold px-2 py-1 rounded-full ${getStatusClasses(status)}`}>{status}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Appointment Fees</p>
                <p className="text-lg font-semibold text-[var(--accent-color)]">₹{fees}.00</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-400">Payment ID</p>
                <p className="text-lg font-semibold text-[var(--accent-color)] font-mono">{paymentId}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-400">Booked On</p>
                <p className="text-lg font-semibold text-[var(--accent-color)]">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link className="w-full sm:w-auto py-2 px-6 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60 transition-colors text-base font-medium">Download Invoice</Link>
            <Link to="/user/book-appointment" className="w-full sm:w-auto py-2 px-6 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-base font-bold">Reschedule</Link>
          </div>
        </div>
        <Review />
      </div>
    </main>
  );
};

export default AppointmentDetails;
