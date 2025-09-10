import { Link } from "react-router-dom";
import { MdHistory } from "react-icons/md";
import { FaHourglassStart, FaInfoCircle } from "react-icons/fa"
import { IoMdDoneAll } from "react-icons/io";

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: { text: 'Pending', color: 'text-yellow-400', icon: <FaHourglassStart /> },
    completed: { text: 'Completed', color: 'text-blue-400', icon: <MdHistory /> },
  };
  
  const currentStatus = statusStyles[status] || {};

  return (
    <div className={`flex items-center gap-2 ${currentStatus.color} text-sm font-medium`}>
      <span className="material-symbols-outlined text-base">{currentStatus.icon}</span>
      <span>{currentStatus.text}</span>
    </div>
  );
};

export const ActionButtons = ({ status, onComplete }) => {
  switch (status) {
    case 'pending':
      return (
        <button onClick={onComplete} className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-[var(--primary-color)] text-[var(--secondary-color)] text-sm font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
          <span className="material-symbols-outlined text-base"><IoMdDoneAll /></span>
          <Link className="truncate">Mark as Completed</Link>
        </button>
      );
    case 'completed':
      return (
        <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-white/20 text-white/70 text-sm font-bold leading-normal tracking-wide hover:bg-white/10 hover:text-white transition-all duration-300">
          <span className="material-symbols-outlined text-base"><FaInfoCircle /></span>
          <Link to="/user-lawyer/appointment-details" className="truncate">View Details</Link>
        </button>
      );
    default:
      return null;
  }
};