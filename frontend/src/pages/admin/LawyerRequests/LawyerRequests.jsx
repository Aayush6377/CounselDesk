import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { MdVisibility } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLawyersData, updateVerificationStatus } from '../../../services/admin.service';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import RejectModal from '../../../components/RejectModal/RejectModal';
import { toast } from 'react-toastify';

const tableHeaders = ['Lawyer', 'Specialization', 'Email', 'Actions'];

const LawyerRequests = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ page: 1});
  const [pagination, setPagination] = useState({});
  const [lawyerData, setLawyerData] = useState([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [lawyerToReject, setLawyerToReject] = useState(null);

  const { data: result, isPending, isError, error } = useQuery({
    queryKey: ["LawyerData", filters.page],
    queryFn: () => getLawyersData(filters.page),
    keepPreviousData: true,
  })

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ lawyerId, status, rejectReason }) => updateVerificationStatus({ lawyerId, status, rejectReason }),
    onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["LawyerData"] });
        toast.success(res.message || "Lawyer request updated!");
        setIsRejectModalOpen(false);
        setLawyerToReject(null);
    },
    onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to update request.");
        setIsRejectModalOpen(false);
        setLawyerToReject(null);
    }
  });

  useEffect(() => {
    if (result) {
        setLawyerData(result.data);
        setPagination(result.pagination);
    }
  }, [result]);

  const handleApprove = (lawyerId) => {
      updateStatus({ lawyerId, status: 'approved' });
  };

  const handleOpenRejectModal = (lawyerId) => {
      setLawyerToReject(lawyerId);
      setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (rejectReason) => {
      if (lawyerToReject) {
          updateStatus({ lawyerId: lawyerToReject, status: 'rejected', rejectReason });
      }
  };

  const handlePageChange = (newPage) => {
      if (typeof newPage !== 'number') return; 
      setFilters(prev => ({ ...prev, page: newPage }));
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
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Lawyer Requests</h1>
                    <p className="text-gray-400 mt-2 text-lg">Review and approve new lawyer profiles.</p>
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
                          {lawyerData.length > 0 ? (
                            lawyerData.map((lawyer , index) => (
                              <tr key={index} className="border-b border-white/10 hover:bg-black/30 transition-colors">
                                  <th scope="row" className="flex items-center gap-4 px-6 py-4 font-medium text-white whitespace-nowrap">
                                      <img alt={lawyer.userId.name} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" src={lawyer.userId.profileImage} />
                                      <span className="text-[var(--accent-color)] font-bold">{lawyer.userId.name}</span>
                                  </th>
                                  <td className="px-6 py-4">{lawyer.specialization}</td>
                                  <td className="px-6 py-4">{lawyer.userId.email}</td>
                                  <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleApprove(lawyer._id)} disabled={isUpdating} className="p-2 rounded-md bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors cursor-pointer">
                                          <FaCheck className="text-base" />
                                        </button>
                                        <button onClick={() => handleOpenRejectModal(lawyer._id)} disabled={isUpdating} className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors cursor-pointer">
                                          <FaTimes className="text-base" />
                                        </button>
                                        <Link to={`/admin/lawyer/profile/${lawyer._id}`} className="p-2 rounded-md bg-black/30 text-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                            <MdVisibility className="text-base" />
                                        </Link>
                                      </div>
                                  </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                                <td colSpan={tableHeaders.length} className="text-center px-6 py-8 text-gray-400">
                                  No pending requests found.
                                </td>
                            </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Cards for Mobile */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {lawyerData.length > 0 ? (
                      lawyerData.map((lawyer, index) => (
                          <div key={index} className="bg-black/30 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                  <img src={lawyer.userId.profileImage} alt={lawyer.userId.name} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover" />
                                  <div>
                                      <div className="font-bold text-[var(--accent-color)]">{lawyer.userId.name}</div>
                                      <div className="text-xs text-gray-400">{lawyer.userId.email}</div>
                                  </div>
                              </div>
                              <div className="border-b border-white/10"></div>
                              <div className="text-sm space-y-2">
                                  <div className="flex justify-between">
                                      <span className="text-gray-400">Specialization:</span>
                                      <span className="text-white font-medium text-right">{lawyer.specialization}</span>
                                  </div>
                              </div>
                              <div className="border-b border-white/10"></div>
                              <div className="flex justify-end pt-2">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleApprove(lawyer._id)} disabled={isUpdating} className="p-2 rounded-md bg-green-600/20 text-green-400 hover:bg-green-600/40 transition-colors cursor-pointer">
                                    <FaCheck className="text-base" />
                                  </button>
                                  <button onClick={() => handleOpenRejectModal(lawyer._id)} disabled={isUpdating} className="p-2 rounded-md bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors cursor-pointer">
                                    <FaTimes className="text-base" />
                                  </button>
                                  <Link to={`/admin/lawyer/profile/${lawyer._id}`} className="p-2 rounded-md bg-black/30 text-[var(--accent-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors">
                                      <MdVisibility className="text-base" />
                                  </Link>
                                </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-400 col-span-1">
                          No pending requests found.
                      </div>
                  )}
              </div>

            {/* Pagination */}
              <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                  <p>Showing {lawyerData.length} of {pagination.totalResults} results</p>
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
        <RejectModal
            isOpen={isRejectModalOpen}
            onClose={() => setIsRejectModalOpen(false)}
            onConfirm={handleConfirmReject}
            isPending={isUpdating}
        />
    </main>
  );
};

export default LawyerRequests;