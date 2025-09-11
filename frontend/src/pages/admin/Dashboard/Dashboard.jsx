import React from 'react';
import { FaUsers, FaGavel, FaUserPlus, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const statsCards = [
  {
    icon: FaUsers,
    label: 'Total Users',
    value: '1,428',
    change: '+25 this week',
  },
  {
    icon: FaGavel,
    label: 'Total Lawyers',
    value: '78',
    change: '+2 this month',
  },
  {
    icon: FaUserPlus,
    label: 'Total Lawyer Requests',
    value: '512',
    change: '+42 this week',
  },
  {
    icon: FaEnvelope,
    label: 'Total Contact Us Submissions',
    value: '1,234',
    change: '+150 this month',
  },
];

const recentRequests = [
  {
    id: 1,
    name: 'Jessica Miller',
    specialization: 'Corporate Law',
    email: 'jessica.miller@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/40.jpg',
  },
  {
    id: 2,
    name: 'Michael Brown',
    specialization: 'Criminal Defense',
    email: 'michael.brown@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
];

const contactSubmissions = [
    { id: 1, title: 'New Message', from: 'John Doe', time: '10m ago' },
    { id: 2, title: 'Inquiry Received', from: 'Jane Smith', time: '45m ago' },
    { id: 3, title: 'Support Question', from: 'Alex Johnson', time: '2h ago' },
    { id: 4, title: 'Partnership Proposal', from: 'Emily White', time: '1d ago' },
];


const Dashboard = () => {
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2 text-lg">Platform overview and statistics.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col gap-2 hover:border-[var(--primary-color)]/50 hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <p className="text-sm">{card.label}</p>
                <card.icon className="text-xl" />
              </div>
              <p className="text-[var(--accent-color)] text-3xl font-bold">{card.value}</p>
              <p className="text-gray-500 text-sm">{card.change}</p>
            </div>
          ))}
        </div>
        
        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Lawyer Requests */}
            <div className="lg:col-span-2">
                <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Recent Lawyer Requests</h2>
                <div className="flex flex-col gap-6">
                    {recentRequests.map(request => (
                        <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
                            <img src={request.avatar} alt={request.name} className="flex-shrink-0 w-20 h-20 object-cover rounded-full border-2 border-white/10" />
                            <div className="flex flex-col gap-1 flex-1">
                                <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">{request.name}</p>
                                <p className="text-[#9dabb9] text-base font-normal leading-normal">{request.specialization}</p>
                                <p className="text-gray-400 text-sm mt-1">{request.email}</p>
                            </div>
                            <Link to="/admin/lawyer-review" className="flex items-center gap-2 mt-4 sm:mt-0 w-fit cursor-pointer rounded-md h-9 px-3 bg-black/30 text-[var(--accent-color)] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                <span className="truncate">View Request</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Us Submissions */}
            <div className="flex flex-col">
                <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Contact Us Submissions</h2>
                <div className="flex flex-col gap-2 bg-black/20 border border-white/10 rounded-xl p-4">
                    {contactSubmissions.map(submission => (
                        <Link to="/admin/contact-submission-details" key={submission.id} className="group flex items-center gap-4 rounded-lg p-3 hover:bg-black/50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-center size-10 rounded-full bg-blue-500/10 text-blue-400">
                               <FaCommentDots />
                            </div>
                            <div>
                                <p className="text-[var(--accent-color)] text-sm font-bold leading-normal">{submission.title}</p>
                                <p className="text-gray-400 text-xs font-normal leading-normal">From: {submission.from}</p>
                            </div>
                            <span className="text-gray-500 text-xs ml-auto whitespace-nowrap">{submission.time}</span>
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
