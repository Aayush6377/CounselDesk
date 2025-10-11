import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaReply, FaTrash } from 'react-icons/fa6';
import { getContactDetails, removeContactSubmission } from '../../../services/admin.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const SubmissionDetails = () => {
  const { contactId } = useParams();
  const [submissionData, setSubmissionData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: result, isPending, isError, error } = useQuery({
    queryKey: ["SubmissionDetail", contactId],
    queryFn: () => getContactDetails(contactId)
  });

  const { mutate: removeSubmission , isPending: isRemoving} = useMutation({
      mutationFn: () => removeContactSubmission(contactId),
      onSuccess: (res) => {
          toast.success(res.message || "Submission deleted successfully");
          setIsModalOpen(false);
          navigate("/admin/contact-submissions");
      },
      onError: (err) => {
          toast.error(err.response?.data?.message || "Submission deletion failed");
          setIsModalOpen(false);
      }
  });

  useEffect(() => {
    if (result) {
        setSubmissionData(result.data);
    }
  }, [result]);

  const handleConfirmDelete = () => {
      removeSubmission();
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
              <p className="text-lg text-[var(--accent-color)]">{submissionData.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <p className="text-lg text-[var(--accent-color)]">{submissionData.email}</p>
            </div>
          </div>
          {submissionData.phone && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400">Phone</label>
              <p className="text-lg text-[var(--accent-color)]">{submissionData.phone}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Message</label>
            <p className="text-base text-gray-300 leading-relaxed bg-black/30 p-4 rounded-lg border border-white/10 whitespace-pre-wrap">
              {submissionData.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-white/10">
            <Link to={`mailto:${submissionData.email}`} className="flex items-center justify-center w-full sm:w-auto gap-2 cursor-pointer rounded-md h-10 px-4 bg-[var(--primary-color)] text-[var(--secondary-color)] text-sm font-bold leading-normal hover:bg-[var(--accent-color)] transition-colors">
              <FaReply className="text-base" />
              <span className="truncate">Reply</span>
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center w-full sm:w-auto gap-2 cursor-pointer rounded-md h-10 px-4 bg-red-600/20 text-red-400 text-sm font-medium leading-normal hover:bg-red-600/40 hover:text-red-300 transition-colors border border-red-600/30">
              <FaTrash className="text-base" />
              <span className="truncate">Delete</span>
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Contact Submission"
          message="Are you sure you want to permanently delete this submission? This action cannot be undone."
          confirmText="Yes, Delete"
          isConfirming={isRemoving}
      />
    </main>
  );
};

export default SubmissionDetails;

