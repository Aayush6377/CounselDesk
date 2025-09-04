import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../../hooks/useStore';
import { FaRobot, FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoCalendar } from "react-icons/io5";
import { MdGavel } from "react-icons/md";

const Dashboard = () => {
    const { userDetails, lawyerList } = useStore();

    const cartItem = [
        {icon: <MdGavel />, title: "Recent Consultations", description: "Review your past discussions with legal experts.", button: "View History", link: "payment-history"},
        {icon: <FaSearch />, title: "Find a Lawyer", description: "Search our network of verified legal professionals.", button: "Start Search", link: "lawyers"},
        {icon: <IoCalendar />, title: "Appointments", description: "Manage your upcoming meetings and schedules.", button: "Manage Appointments", link: "appointments"}
    ];

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-12 animate-fadeIn">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">User Dashboard</h1>
            <p className="text-gray-400 mt-2 text-lg">Welcome back, {userDetails.name || "User"}! Let's get you the legal help you need.</p>
          </div>
          <div className="flex items-center gap-4">
            <NavLink to="chatbot" className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
              <span className="material-symbols-outlined"><FaRobot className='w-4 text-lg'/></span>
              <span className="truncate">Chat with CouncilDesk AI</span>
            </NavLink>
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cartItem.map((item,index) => (
            <div key={index} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col gap-4 hover:border-[var(--primary-color)]/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="bg-black/30 p-3 rounded-lg"><span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">{item.icon}</span></div>
              <h3 className="text-[var(--accent-color)] text-xl font-bold">{item.title}</h3>
            </div>
            <p className="text-gray-400 text-sm">{item.description}</p>
            <Link to={item.link} className="mt-auto text-[var(--primary-color)] hover:text-[var(--accent-color)] font-semibold text-sm flex items-center gap-2 group">{item.button} <IoIosArrowForward className='mt-[5px]'/></Link>
          </div>
          ))}
        </div>

        {/* Upcoming and Recommended Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Upcoming Appointments</h2>
            <div className="flex flex-col gap-6">
              {/* Appointment Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
                <div className="flex-shrink-0 w-full sm:w-48 h-32 bg-center bg-no-repeat bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjp-HfRlBvgqPtt01d0WxGyvNNWcmdqaV06Pgt9HvpRf6a7O-q7kgINluPJOkD8qHa4uRzObkVgHst7XAY9U-lP77L9a_PULxxCpprV0MuV2HPptMiV1G16xSQLCntaD43vq2h8fxuY_UpjN1AqKvl3W8WjDA0Z2-9MhRxyjG-ii9AcKnO93XZHsdnlo_RljCDz-50oajLGm8vmYFo2_Wu7GCeBNfkBZsBiFlmv3giRu4cKRR80nYnQ6hVguVuL4RoMA51hjL1yL2t")' }}></div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">Family Law Consultation</p>
                  <p className="text-[#9dabb9] text-base font-normal leading-normal">with Attorney Sarah Chen</p>
                  <p className="text-gray-400 text-sm font-normal leading-normal line-clamp-2">Discussing child custody arrangements and visitation schedules.</p>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-2"><span className="material-symbols-outlined text-base">event</span> <span>Tomorrow, 10:00 AM</span></div>
                  <button className="flex items-center gap-2 mt-4 w-fit cursor-pointer rounded-md h-9 px-3 bg-black/30 text-[var(--accent-color)] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                    <Link to="/user/appointment-details/apt_003" className="truncate">View Details</Link>
                    <span className="material-symbols-outlined text-base"><IoIosArrowForward className='mt-[5px]'/></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Section */}
          <div className="flex flex-col">
            <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Recommended For You</h2>
            <div className="flex flex-col gap-2 bg-black/20 border border-white/10 rounded-xl p-4">
              {lawyerList.slice(0,3).map((lawyer,index) => (
                <Link to={`lawyer-profile`} key={index} className="group flex items-center gap-4 rounded-lg p-3 hover:bg-black/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url("${lawyer.profileImage}")` }}></div>
                    <div>
                    <p className="text-[var(--accent-color)] text-base font-bold leading-normal">{lawyer.name}</p>
                    <p className="text-gray-400 text-sm font-normal leading-normal">{lawyer.specialization}</p>
                    </div>
                    <span className="material-symbols-outlined text-white ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><IoIosArrowForward className='mt-[5px]'/></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;