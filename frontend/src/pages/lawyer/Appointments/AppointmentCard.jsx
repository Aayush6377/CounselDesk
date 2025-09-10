import { StatusBadge, ActionButtons } from "./Buttons";
import { FaRegCalendar } from "react-icons/fa";

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
  return (
    <div className="flex flex-col bg-black/20 border border-white/10 rounded-xl p-6 hover:border-[var(--primary-color)]/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[var(--primary-color)]" 
            style={{ backgroundImage: `url("${appointment.avatarUrl}")` }}
          ></div>
          <div>
            <h3 className="text-[var(--accent-color)] text-lg font-bold">{appointment.clientName}</h3>
            <p className="text-gray-400 text-sm">{appointment.service}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base"><FaRegCalendar /></span>
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <StatusBadge status={appointment.status} />
        <ActionButtons
          status={appointment.status}
          onComplete={() => onUpdateStatus(appointment.id, 'completed')}
        />
      </div>
    </div>
  );
};

export default AppointmentCard;