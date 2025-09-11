import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const submissionsData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Inquiry about service',
    date: '2023-10-27',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    subject: 'Partnership Proposal',
    date: '2023-10-26',
  },
  {
    id: 3,
    name: 'Samuel Green',
    email: 'sam.green@example.com',
    subject: 'Feedback',
    date: '2023-10-25',
  },
  {
    id: 4,
    name: 'Emily White',
    email: 'emily.w@example.com',
    subject: 'Technical Issue Report',
    date: '2023-10-24',
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    subject: 'Question about pricing',
    date: '2023-10-23',
  },
];

const tableHeaders = ['Name', 'Email', 'Subject', 'Date Submitted', 'Details'];

const ContactSubmissions = () => {
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div>
            <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">
              Contact Us Submissions
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Review and manage user inquiries.</p>
          </div>
        </div>

        {/* Submissions Table/Card Container */}
        <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
          {/* Table for Desktop */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-black/30 text-xs uppercase text-[var(--accent-color)]">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} className="p-4 text-sm font-semibold text-[var(--accent-color)]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {submissionsData.map((submission) => (
                  <tr key={submission.id} className="hover:bg-black/30 transition-colors">
                    <td className="p-4 text-sm text-gray-300">{submission.name}</td>
                    <td className="p-4 text-sm text-gray-300">{submission.email}</td>
                    <td className="p-4 text-sm text-gray-300">{submission.subject}</td>
                    <td className="p-4 text-sm text-gray-400">{submission.date}</td>
                    <td className="p-4">
                      <Link to="/admin/contact-submission-details" className="flex items-center gap-2 w-fit cursor-pointer rounded-md h-8 px-3 bg-black/30 text-[var(--accent-color)] text-xs font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                        <span className="truncate">View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            {submissionsData.map(submission => (
              <div key={submission.id} className="bg-black/30 rounded-lg p-4 space-y-3">
                <div>
                  <div className="font-semibold text-gray-300">{submission.subject}</div>
                  <div className="text-sm text-[var(--accent-color)]">{submission.name}</div>
                   <div className="text-xs text-gray-400">{submission.email}</div>
                </div>
                <div className="border-b border-white/10"></div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-gray-400">{submission.date}</span>
                    <Link to="/admin/contact-submission-details" className="flex items-center gap-2 w-fit cursor-pointer rounded-md h-8 px-3 bg-black/30 text-[var(--accent-color)] text-xs font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                      <span className="truncate">View Details</span>
                    </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <p>Showing 5 of 5 results</p>
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

export default ContactSubmissions;

