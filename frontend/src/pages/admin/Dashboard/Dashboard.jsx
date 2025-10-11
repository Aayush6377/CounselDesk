import React from 'react';
import { getDashboardData } from '../../../services/admin.service';
import { FaUsers, FaGavel, FaUserPlus, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import moment from 'moment-timezone';
import { images } from '../../../assets/assets';

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

  const stats = result?.stats;
  const lawyers = result?.lawyers || [];
  const submissions = result?.submissions || [];

  const statsCards = [
    { icon: FaUsers, label: 'Total Users', value: stats?.totalUsers ?? 0, change: `+${stats?.usersThisWeek ?? 0} this week` },
    { icon: FaGavel, label: 'Total Lawyers', value: stats?.totalLawyers ?? 0, change: `+${stats?.lawyersThisMonth ?? 0} this month` },
    { icon: FaUserPlus, label: 'Total Lawyer Requests',  value: stats?.totalLawyerRequest ?? 0, change: `+${stats?.requestsThisWeek ?? 0} this week` },
    { icon: FaEnvelope, label: 'Total Contact Us Submissions', value: stats?.totalContactSubmissions ?? 0, change: `+${stats?.submissionsThisMonth ?? 0} this month` }
  ];
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
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
                    {lawyers.length > 0 ? ( 
                      lawyers.map((lawyer, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
                              <img src={lawyer.userId.profileImage || images.defaultProfile} alt={lawyer.userId.name} className="flex-shrink-0 w-20 h-20 object-cover rounded-full border-2 border-white/10" />
                              <div className="flex flex-col gap-1 flex-1">
                                  <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">{lawyer.userId.name}</p>
                                  <p className="text-[#9dabb9] text-base font-normal leading-normal">{lawyer.specialization}</p>
                                  <p className="text-gray-400 text-sm mt-1">{lawyer.userId.email}</p>
                              </div>
                              <Link to={`/admin/lawyer/profile/${lawyer._id}`} className="flex items-center gap-2 mt-4 sm:mt-0 w-fit cursor-pointer rounded-md h-9 px-3 bg-black/30 text-[var(--accent-color)] text-sm font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                  <span className="truncate">View Request</span>
                              </Link>
                          </div>
                      ))) : (
                          <p className="text-gray-500 text-center p-8">No pending lawyer requests found.</p>
                    )}
                </div>
            </div>

            {/* Contact Us Submissions */}
            <div className="flex flex-col">
              <h2 className="text-[var(--accent-color)] text-2xl font-bold leading-tight tracking-tight mb-4">Contact Us Submissions</h2>
              <div className="flex flex-col gap-2 bg-black/20 border border-white/10 rounded-xl p-2">
                  {submissions.length > 0 ? (
                      submissions.map((submission) => (
                          <Link
                              to={`/admin/contact-submission-details/${submission._id}`}
                              key={submission._id}
                              className="group flex items-center gap-4 rounded-lg p-3 hover:bg-black/50 transition-colors cursor-pointer"
                          >
                              <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-full bg-blue-500/10 text-blue-400">
                                  <FaCommentDots size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                  <p className="text-[var(--accent-color)] text-sm font-bold leading-normal truncate">{submission.name}</p>
                                  <p className="text-gray-400 text-xs font-normal leading-normal truncate">{submission.email}</p>
                              </div>
                              <span className="text-gray-500 text-xs ml-auto whitespace-nowrap pl-4">
                                  {formatDate(submission.createdAt)}
                              </span>
                          </Link>
                      ))
                  ) : (
                      <p className="text-gray-500 text-center p-8">No contact submissions found.</p>
                  )}
              </div>
        </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
