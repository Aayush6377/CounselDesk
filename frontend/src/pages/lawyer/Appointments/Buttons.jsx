import { Link } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import { FaHourglassStart, FaInfoCircle } from "react-icons/fa"
import { MdFreeCancellation } from "react-icons/md";

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    scheduled: { text: 'Scheduled', color: 'text-green-400', icon: <FaHourglassStart /> },
    completed: { text: 'Completed', color: 'text-blue-400', icon: <MdHistory /> },
    cancelled: { text: 'Canceled', color: 'text-red-400', icon: <MdFreeCancellation /> }
  };
  
  const currentStatus = statusStyles[status] || {};

  return (
    <div className={`flex items-center gap-2 ${currentStatus.color} text-sm font-medium`}>
      <span className="material-symbols-outlined text-base">{currentStatus.icon}</span>
      <span>{currentStatus.text}</span>
    </div>
  );
};

export const ActionButtons = ( {appointmentId} ) => {
    return (
      <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-white/20 text-white/70 text-sm font-bold leading-normal tracking-wide hover:bg-white/10 hover:text-white transition-all duration-300">
        <span className="material-symbols-outlined text-base"><FaInfoCircle /></span>
        <Link to={`/user-lawyer/appointment-details/${appointmentId}`} className="truncate">View Details</Link>
      </button>
    );
};