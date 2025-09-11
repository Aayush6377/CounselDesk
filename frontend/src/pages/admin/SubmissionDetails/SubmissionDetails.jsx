import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaReply, FaTrash } from 'react-icons/fa6';


const submissionData = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Inquiry about service',
  message: `Hello, I am writing to inquire about the specific legal services you offer regarding intellectual property. I couldn't find detailed information on your website and would appreciate it if you could provide more details on this. I am particularly interested in copyright and trademark registration. Thank you for your time and assistance.`,
  date: '2023-10-27',
};

const SubmissionDetails = () => {
  const { name, email, subject, message } = submissionData;
  const navigate = useNavigate();

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors w-fit cursor-pointer">
            <IoIosArrowBack />
            <span>Back</span>
          </button>
          <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Submission Details</h1>
        </div>

        {/* Details Card */}
        <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Name</label>
              <p className="text-lg text-[var(--accent-color)]">{name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <p className="text-lg text-[var(--accent-color)]">{email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Subject</label>
            <p className="text-lg text-[var(--accent-color)]">{subject}</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Message</label>
            <p className="text-base text-gray-300 leading-relaxed bg-black/30 p-4 rounded-lg border border-white/10 whitespace-pre-wrap">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-white/10">
            <Link to={`mailto:${email}`} className="flex items-center justify-center w-full sm:w-auto gap-2 cursor-pointer rounded-md h-10 px-4 bg-[var(--primary-color)] text-[var(--secondary-color)] text-sm font-bold leading-normal hover:bg-[var(--accent-color)] transition-colors">
              <FaReply className="text-base" />
              <span className="truncate">Reply</span>
            </Link>
            <button className="flex items-center justify-center w-full sm:w-auto gap-2 cursor-pointer rounded-md h-10 px-4 bg-red-600/20 text-red-400 text-sm font-medium leading-normal hover:bg-red-600/40 hover:text-red-300 transition-colors border border-red-600/30">
              <FaTrash className="text-base" />
              <span className="truncate">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubmissionDetails;

