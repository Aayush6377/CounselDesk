import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { getContactSubmissionList } from '../../../services/admin.service';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import moment from 'moment-timezone';

const tableHeaders = ['Name', 'Email', 'Phone', 'Date Submitted', 'Details'];

const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Kolkata").format('MMM Do, YYYY');
}

const ContactSubmissions = () => {
  const [pagination, setPagination] = useState({});
  const [curPage, setCurPage] = useState(1);
  const [submissionsData, setSubmissionData] = useState([]);

  const { data: result,  isPending, isError, error} = useQuery({
      queryKey: ["SubmissionsData", curPage],
      queryFn: () => getContactSubmissionList(curPage),
      keepPreviousData: true,
  });

  useEffect(() => {
    if (result) {
        setSubmissionData(result.data);
        setPagination(result.pagination);
    }
  }, [result]);

  const handlePageChange = (newPage) => {
      if (typeof newPage !== 'number') return; 
      setCurPage(newPage);
  };

  if (isPending){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);
      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
  }

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
                {submissionsData.length > 0 ?  (
                  submissionsData.map((submission) => (
                      <tr key={submission._id} className="hover:bg-black/30 transition-colors">
                        <td className="p-4 text-sm text-gray-300">{submission.name}</td>
                        <td className="p-4 text-sm text-gray-300">{submission.email}</td>
                        <td className="p-4 text-sm text-gray-300">{submission.phone || "Not Provided"}</td>
                        <td className="p-4 text-sm text-gray-400">{formatDate(submission.createdAt)}</td>
                        <td className="p-4">
                          <Link to={`/admin/contact-submission-details/${submission._id}`} className="flex items-center gap-2 w-fit cursor-pointer rounded-md h-8 px-3 bg-black/30 text-[var(--accent-color)] text-xs font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                            <span className="truncate">View Details</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                    ) : ( 
                  <tr>
                      <td colSpan={tableHeaders.length} className="text-center px-6 py-8 text-gray-400">
                        No new submissions found.
                      </td>
                  </tr>)
                }
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 md:hidden">
            {submissionsData.length > 0 ?  ( 
              submissionsData.map(submission => (
                <div key={submission.id} className="bg-black/30 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-sm text-[var(--accent-color)]">{submission.name}</div>
                    <div className="text-xs text-gray-400">{submission.email}</div>
                    <div className="text-xs text-gray-400">{submission.phone}</div>
                  </div>
                  <div className="border-b border-white/10"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{formatDate(submission.createdAt)}</span>
                      <Link to={`/admin/contact-submission-details/${submission._id}`} className="flex items-center gap-2 w-fit cursor-pointer rounded-md h-8 px-3 bg-black/30 text-[var(--accent-color)] text-xs font-medium leading-normal hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                        <span className="truncate">View Details</span>
                      </Link>
                  </div>
                </div>
              )) 
            ) : (
              <div className="text-center py-8 text-gray-400 col-span-1">
                 No new submissions found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                <p>Showing {submissionsData.length} of {pagination.totalResults} results</p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handlePageChange(pagination.prevPage)}
                        disabled={!pagination.hasPrevPage}
                        className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FaChevronCircleLeft className="text-lg" />
                    </button>
                    
                    <span className="text-white">Page {pagination.currentPage} of {pagination.totalPages || 1}</span>
  
                    <button
                        onClick={() => handlePageChange(pagination.nextPage)}
                        disabled={!pagination.hasNextPage}
                        className="p-2 hover:text-white transition-colors disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
                    >
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

