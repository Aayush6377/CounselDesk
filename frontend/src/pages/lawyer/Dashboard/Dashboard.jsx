import { FaCalendarAlt, FaRegAddressBook } from "react-icons/fa";
import { MdOutlinePayment, MdOutlineWorkspacePremium, MdOutlineEventNote } from "react-icons/md";
import { IoStar } from "react-icons/io5";
import { useStore } from "../../../hooks/useStore";
import { Link, NavLink } from "react-router-dom";


const upcomingAppointments = [
  {
    _id: "app_1",
    name: 'Alex Thompson',
    date: 'Tomorrow, 10:00 AM',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    _id: "app_2",
    name: 'Jessica Tan',
    date: 'Oct 28, 2:30 PM',
    image: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
];


const recentMessages = [
  { name: 'Alex Thompson', message: 'That sounds good, thank you for...', time: '1h ago', image: "https://randomuser.me/api/portraits/men/13.jpg"},
  { name: 'Michael Wong', message: 'Just sent over the documents for...', time: '3h ago', image: "https://randomuser.me/api/portraits/men/14.jpg" },
  { name: 'Jessica Tan', message: "Perfect, I'll review it and get back...", time: 'Yesterday', image: "https://randomuser.me/api/portraits/men/2.jpg"},
];

const Dashboard = () => {
    const { userDetails } = useStore();

    const statCards = [
    { title: 'Total Bookings', value: '128', subtext: '+5 this month', link: "appointments", icon: <FaCalendarAlt />},
    { title: 'Total Earnings', value: '₹25,600', subtext: '+ $1,200 this month', link: "earnings", icon: <MdOutlinePayment /> },
    { title: 'Reviews', value: '4.9', subtext: 'from 67 reviews', icon: <IoStar />, link: "reviews", valueSuffix: ' / 5.0' },
    { title: 'Subscription', value: userDetails?.subscription?.plan || "Free", subtext: 'Manage Plan', link: "subscription", icon: <MdOutlineWorkspacePremium />, valueColor: '#A89166' },
    ];

  return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-12 animate-fadeIn">
            <div className="flex flex-wrap justify-between items-center gap-6">
              <div>
                <h1 className="text-[#E8D7B5] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Lawyer Dashboard</h1>
                <p className="text-gray-400 mt-2 text-lg">Welcome back, {userDetails.name}</p>
              </div>
              <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                <span className="material-symbols-outlined"><FaRegAddressBook /></span>
                <NavLink to="appointments" className="truncate">View Appointments</NavLink>
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statCards.map((card, index) => (
                <Link to={card.link} key={index} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col gap-2 hover:border-[var(--primary-color)]/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between text-gray-400">
                    <p className="text-sm">{card.title}</p>
                    <span className="material-symbols-outlined">{card.icon}</span>
                  </div>
                  <p className="text-[#E8D7B5] text-3xl font-bold">
                    <span style={{ color: card.valueColor }}>{card.value}</span>
                    {card.valueSuffix && <span className="text-base text-gray-400">{card.valueSuffix}</span>}
                  </p>
                  <p className="text-gray-500 text-sm">{card.subtext}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Appointments */}
              <div className="lg:col-span-2">
                <h2 className="text-[#E8D7B5] text-2xl font-bold leading-tight tracking-tight mb-4">Upcoming Appointments</h2>
                <div className="flex flex-col gap-6">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
                      <div className="flex-shrink-0 w-20 h-20 bg-center bg-no-repeat bg-cover rounded-full" style={{ backgroundImage: `url("${appointment.image}")` }}></div>
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[#E8D7B5] text-lg font-bold leading-tight">{appointment.name}</p>
                        <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
                          <div className="flex items-center gap-2"><MdOutlineEventNote /> <span>{appointment.date}</span></div>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 mt-4 sm:mt-0 w-fit cursor-pointer rounded-md h-9 px-3 bg-black/30 text-[#E8D7B5] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                        <Link to="/user-lawyer/appointment-details" className="truncate">View Details</Link>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="flex flex-col">
                <h2 className="text-[#E8D7B5] text-2xl font-bold leading-tight tracking-tight mb-4">Recent Reviews</h2>
                <div className="flex flex-col gap-2 bg-black/20 border border-white/10 rounded-xl p-4">
                  {recentMessages.map((message, index) => (
                    <Link to="/user-lawyer/reviews" key={index} className="group flex items-center gap-4 rounded-lg p-3 hover:bg-black/50 transition-colors cursor-pointer">
                      <div className="relative">
                        <div className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full" style={{ backgroundImage: `url("${message.image}")` }}></div>
                      </div>
                      <div>
                        <p className="text-[#E8D7B5] text-base font-bold leading-normal">{message.name}</p>
                        <p className="text-gray-400 text-sm font-normal leading-normal line-clamp-1">{message.message}</p>
                      </div>
                      <span className="text-gray-500 text-xs ml-auto">{message.time}</span>
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
