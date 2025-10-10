import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../../hooks/useStore';
import { FaRobot, FaSearch } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoCalendar } from "react-icons/io5";
import { MdGavel, MdEventAvailable } from "react-icons/md";
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import moment from 'moment-timezone';
import { getDashboardData } from '../../../services/user.service';

const cartItem = [
    {icon: <MdGavel />, title: "Recent Consultations", description: "Review your past discussions with legal experts.", button: "View History", link: "payment-history"},
    {icon: <FaSearch />, title: "Find a Lawyer", description: "Search our network of verified legal professionals.", button: "Start Search", link: "lawyers"},
    {icon: <IoCalendar />, title: "Appointments", description: "Manage your upcoming meetings and schedules.", button: "Manage Appointments", link: "appointments"}
];

const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const appointmentTime = moment(dateString).tz('Asia/Kolkata');
    return appointmentTime.calendar(null, {
      sameDay: '[Today,] h:mm A',
      nextDay: '[Tomorrow,] h:mm A',
      nextWeek: 'dddd, h:mm A',
      sameElse: 'MMM Do, YYYY, h:mm A'
    });
};

const Dashboard = () => {
  const { userDetails } = useStore();

  const { data: result, isLoading, isError, error } = useQuery({
    queryKey: ["DashboardData"],
    queryFn: getDashboardData
  });

  if (isLoading){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);

      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
  }

  const nextAppointment = result?.data?.nextAppointment;
  const lawyerList = result?.data?.recommendedLawyers;
  
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
                  {nextAppointment ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
                          <div className="flex-shrink-0 w-full sm:w-48 h-32 bg-center bg-no-repeat bg-cover rounded-lg" style={{ backgroundImage: `url("${nextAppointment.lawyerProfileImage}")` }}></div>
                          <div className="flex flex-col gap-2 flex-1">
                              <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">{nextAppointment.specialization} Consultation</p>
                              <p className="text-[#9dabb9] text-base font-normal leading-normal">with {nextAppointment.lawyerName}</p>
                              <p className="text-gray-400 text-sm font-normal leading-normal line-clamp-2">{nextAppointment.description}</p>
                              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2"><span className="material-symbols-outlined text-base"><MdEventAvailable /></span> <span>{formatDate(nextAppointment.startTime)}</span></div>
                              <Link to={`/user/appointment-details/${nextAppointment.id}`} className="flex items-center gap-2 mt-4 w-fit cursor-pointer rounded-md h-9 px-3 bg-black/30 text-[var(--accent-color)] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                  <span className="truncate">View Details</span>
                                  <span className="material-symbols-outlined text-base"><IoIosArrowForward className='mt-[5px]'/></span>
                              </Link>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-black/20 border border-white/10 rounded-xl text-center">
                          <p className="text-gray-400">You have no upcoming appointments scheduled.</p>
                          <Link to="lawyers" className="py-2 px-4 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-sm font-medium">
                              Book a Consultation
                          </Link>
                      </div>
                  )}
              </div>
          </div>

          {/* Recommended Section */}
          <div className="flex flex-col">
                <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Recommended For You</h2>
                <div className="flex flex-col gap-2 bg-black/20 border border-white/10 rounded-xl p-4">
                    {(lawyerList && lawyerList.length > 0) ? (
                        lawyerList.map((lawyer) => (
                            <Link to={`/user/lawyer-profile/${lawyer.id}`} key={lawyer.id} className="group flex items-center gap-4 rounded-lg p-3 hover:bg-black/50 transition-colors cursor-pointer">
                                <div className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url("${lawyer.profileImage}")` }}></div>
                                <div>
                                    <p className="text-[var(--accent-color)] text-base font-bold leading-normal">{lawyer.name}</p>
                                    <p className="text-gray-400 text-sm font-normal leading-normal">{lawyer.specialization}</p>
                                </div>
                                <span className="material-symbols-outlined text-white ml-auto opacity-0 group-hover:opacity-100 transition-opacity"><IoIosArrowForward className='mt-[5px]'/></span>
                            </Link>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No recommendations available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;