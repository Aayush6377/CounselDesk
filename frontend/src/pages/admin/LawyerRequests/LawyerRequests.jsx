import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaFilter, FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";

const lawyerRequestsData = [
  {
    id: 1,
    name: 'David Miller',
    avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
    specialization: 'Corporate Law',
    email: 'david.miller@example.com',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Jessica Pearson',
    avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
    specialization: 'Criminal Law',
    email: 'jessica.p@example.com',
    status: 'pending',
  },
  {
    id: 3,
    name: 'Michael Ross',
    avatar: 'https://randomuser.me/api/portraits/men/53.jpg',
    specialization: 'Intellectual Property',
    email: 'michael.ross@example.com',
    status: 'pending',
  },
   {
    id: 4,
    name: 'Rachel Zane',
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    specialization: 'Family Law',
    email: 'rachel.zane@example.com',
    status: 'rejected',
  },
];

const tableHeaders = ['Lawyer', 'Specialization', 'Email', 'Actions'];

const ActionButtons = () => (
    <>
    <button className="p-2 rounded-md bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors cursor-pointer">
      <FaCheck className="text-base" />
    </button>
    <button className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors cursor-pointer">
      <FaTimes className="text-base" />
    </button>
    </>
);


const LawyerRequests = () => {
  const [activeFilter, setActiveFilter] = useState('pending');

  const filteredRequests = lawyerRequestsData.filter(
    (lawyer) => lawyer.status === activeFilter
  );

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Lawyer Requests</h1>
                    <p className="text-gray-400 mt-2 text-lg">Review and approve new lawyer profiles.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setActiveFilter('pending')}
                      className={`flex items-center gap-2 cursor-pointer rounded-md h-10 px-4 text-sm font-medium transition-colors ${activeFilter === 'pending' ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}>
                        <FaFilter className="text-base" />
                        <span className="truncate">Pending</span>
                    </button>
                    <button 
                      onClick={() => setActiveFilter('rejected')}
                      className={`flex items-center gap-2 cursor-pointer rounded-md h-10 px-4 text-sm font-medium transition-colors ${activeFilter === 'rejected' ? 'bg-[var(--primary-color)] text-[var(--secondary-color)]' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}>
                        <FaTimes className="text-base" />
                        <span className="truncate">Rejected</span>
                    </button>
                </div>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
              {/* Table for Desktop */}
              <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-left text-sm text-gray-300">
                      <thead className="bg-black/30 text-xs uppercase text-[var(--accent-color)]">
                          <tr>
                              {tableHeaders.map(header => (
                                <th key={header} scope="col" className={`p-4 text-sm font-semibold text-[var(--accent-color)] ${header === 'Actions' ? 'text-center' : ''}`}>{header}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody>
                          {filteredRequests.length > 0 ? (
                            filteredRequests.map(req => (
                              <tr key={req.id} className="border-b border-white/10 hover:bg-black/30 transition-colors">
                                  <th scope="row" className="flex items-center gap-4 px-6 py-4 font-medium text-white whitespace-nowrap">
                                      <img alt={req.name} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" src={req.avatar} />
                                      <span className="text-[var(--accent-color)] font-bold">{req.name}</span>
                                  </th>
                                  <td className="px-6 py-4">{req.specialization}</td>
                                  <td className="px-6 py-4">{req.email}</td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        {activeFilter === 'pending' && <ActionButtons />}
                                        <Link to="/admin/lawyer-review" className="p-2 rounded-md bg-black/30 text-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                            <MdVisibility className="text-base" />
                                        </Link>
                                      </div>
                                  </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                                <td colSpan={tableHeaders.length} className="text-center px-6 py-8 text-gray-400">
                                  No {activeFilter.toLowerCase()} requests found.
                                </td>
                            </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Cards for Mobile */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {filteredRequests.length > 0 ? (
                      filteredRequests.map(req => (
                          <div key={req.id} className="bg-black/30 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                  <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" />
                                  <div>
                                      <div className="font-bold text-[var(--accent-color)]">{req.name}</div>
                                      <div className="text-xs text-gray-400">{req.email}</div>
                                  </div>
                              </div>
                              <div className="border-b border-white/10"></div>
                              <div className="text-sm space-y-2">
                                  <div className="flex justify-between">
                                      <span className="text-gray-400">Specialization:</span>
                                      <span className="text-white font-medium text-right">{req.specialization}</span>
                                  </div>
                              </div>
                              <div className="border-b border-white/10"></div>
                              <div className="flex justify-end pt-2">
                                <div className="flex items-center justify-center gap-2">
                                  {activeFilter === 'pending' && (<ActionButtons />)}
                                  <Link to="/admin/lawyer-review" className="p-2 rounded-md bg-black/30 text-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                      <MdVisibility className="text-base" />
                                  </Link>
                                </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-400 col-span-1">
                          No {activeFilter.toLowerCase()} requests found.
                      </div>
                  )}
              </div>

              {/* Pagination */}
            <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <p>Showing {filteredRequests.length} of {lawyerRequestsData.length} results</p>
                <div className="flex items-center gap-4">
                <button className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer" disabled>
                    <FaChevronCircleLeft className="text-lg" />
                </button>
                <button className="h-8 w-8 rounded-md bg-[var(--primary-color)] text-[var(--secondary-color)] cursor-pointer">1</button>
                <button className="p-2 hover:text-white transition-colors cursor-pointer">
                    <FaChevronCircleRight className="text-lg" />
                </button>
                </div>
            </div>
            </div>
        </div>
    </main>
  );
};

export default LawyerRequests;