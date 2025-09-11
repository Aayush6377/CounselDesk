import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaFilePdf } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const lawyerProfileData = {
  general: {
    name: 'Harvey Specter',
    specialization: 'Corporate Law',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    bio: 'A seasoned corporate lawyer with over 15 years of experience in mergers and acquisitions, corporate governance, and securities law. Known for a strategic approach and an impeccable track record of closing complex deals.',
  },
  personalInfo: {
    fullName: 'Harvey Reginald Specter',
    phone: '+1 234 567 8900',
    address: 'Pearson Hardman, 601 Lexington Avenue, New York, NY, 10022',
  },
  professionalDetails: {
    qualifications: 'Juris Doctor (J.D.), Harvard Law School',
    fees: '$500 / hour',
  },
  documents: [
    { id: 1, name: 'Bar Council Certificate.pdf', url: '#' },
    { id: 2, name: 'Practice Certificate.pdf', url: '#' },
    { id: 3, name: 'Government ID.pdf', url: '#' },
    { id: 4, name: 'Law Degree.pdf', url: '#' },
  ],
};

const LawyerProfileReview = () => {
  const { general, personalInfo, professionalDetails, documents } = lawyerProfileData;
  const navigate = useNavigate();

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col w-full max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors w-fit cursor-pointer">
            <IoIosArrowBack />
            <span>Back</span>
          </button>
          <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Lawyer Profile Review</h1>
          <p className="text-gray-400 mt-2 text-lg">Review and approve lawyer's profile details.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Left Column: Profile Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* General Info Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img className="w-28 h-28 rounded-full border-4 border-[var(--primary-color)] object-cover" src={general.avatar} alt={general.name} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--accent-color)]">{general.name}</h2>
                  <p className="text-lg font-medium text-[var(--primary-color)]">{general.specialization}</p>
                  <p className="text-gray-400 mt-2 text-sm">{general.bio}</p>
                </div>
              </div>
            </div>

            {/* Personal & Contact Info Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Personal & Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="text-gray-300">{personalInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="text-gray-300">{personalInfo.phone}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="text-gray-300">{personalInfo.address}</p>
                </div>
              </div>
            </div>
            
            {/* Professional Details Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Qualifications</p>
                  <p className="text-gray-300">{professionalDetails.qualifications}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fees</p>
                  <p className="text-gray-300">{professionalDetails.fees}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Documents */}
          <div className="flex flex-col gap-8">
            {/* Action Center Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Action Center</h3>
              <div className="flex flex-col gap-3">
                <button className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-md h-12 px-4 bg-green-600/80 text-white text-base font-bold leading-normal hover:bg-green-600 transition-colors">
                  <FaCheckCircle />
                  <span>Approve Profile</span>
                </button>
                <button className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-md h-12 px-4 bg-red-600/80 text-white text-base font-bold leading-normal hover:bg-red-600 transition-colors">
                  <FaTimesCircle />
                  <span>Reject Profile</span>
                </button>
              </div>
            </div>
            
            {/* Uploaded Documents Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {documents.map(doc => (
                  <a 
                    href={doc.url} 
                    key={doc.id} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <FaFilePdf className="text-[var(--primary-color)] text-lg" />
                    <span className="text-gray-300 text-sm">{doc.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LawyerProfileReview;