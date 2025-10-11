import RejectModal from '../../../components/RejectModal/RejectModal';
import Error from '../../../components/Error/Error';
import Loader from '../../../components/Loader/Loader';
import { getLawyerProfile, updateVerificationStatus } from '../../../services/admin.service';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaFilePdf } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const LawyerProfileReview = () => {
  const navigate = useNavigate();
  const { lawyerId } = useParams();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  
  const { data: result, isPending, isError, error } = useQuery({
    queryKey: ["LawyerProfile", lawyerId],
    queryFn: () => getLawyerProfile(lawyerId)
  });

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ status, rejectReason }) => updateVerificationStatus({ lawyerId: lawyerId, status, rejectReason }),
    onSuccess: (res) => {
        toast.success(res.message || "Lawyer request updated!");
        setIsRejectModalOpen(false);
    },
    onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to update request.");
        setIsRejectModalOpen(false);
    }
  });

  const lawyerProfile = result?.data;

  const handleApprove = () => {
      updateStatus({ status: 'approved' });
  };

  const handleOpenRejectModal = () => {
      setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (rejectReason) => {
      updateStatus({ status: 'rejected', rejectReason });
  };

  if (isPending){
    return <Loader />;
  }

  if (isError){
    const errorCode = error.response?.data?.status || 500;
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    const errorTitle = createTitleFromStatus(errorCode);

    return (
      <Error 
        errorCode={errorCode}
        title={errorTitle}
        message={errorMessage} 
      />
    );
  }

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
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <img className="w-28 h-28 rounded-full border-4 border-[var(--primary-color)] object-cover" src={lawyerProfile.userId.profileImage} alt={lawyerProfile.userId.name} />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--accent-color)]">{lawyerProfile.userId.name}</h2>
                  <p className="text-lg font-medium text-[var(--primary-color)]">{lawyerProfile.specialization}</p>
                  <p className="text-gray-400 mt-2 text-sm">{lawyerProfile.bio}</p>
                </div>
              </div>
            </div>

            {/* Personal & Contact Info Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Personal & Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-300">{lawyerProfile.userId.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="text-gray-300">{lawyerProfile.phone}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="text-gray-300">{lawyerProfile.address.city}, {lawyerProfile.address.state}, {lawyerProfile.address.pincode}</p>
                </div>
              </div>
            </div>
            
            {/* Professional Details Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Qualifications</p>
                  <p className="text-gray-300">{lawyerProfile.qualifications}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fees</p>
                  <p className="text-gray-300">{lawyerProfile.fees.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Documents */}
          <div className="flex flex-col gap-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Action Center</h3>
              <div className="flex flex-col gap-3">
                <button onClick={handleApprove} disabled={isUpdating} className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-md h-12 px-4 bg-green-600/80 text-white text-base font-bold leading-normal hover:bg-green-600 transition-colors">
                  <FaCheckCircle />
                  <span>Approve Profile</span>
                </button>
                <button onClick={handleOpenRejectModal} disabled={isUpdating} className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-md h-12 px-4 bg-red-600/80 text-white text-base font-bold leading-normal hover:bg-red-600 transition-colors">
                  <FaTimesCircle />
                  <span>Reject Profile</span>
                </button>
              </div>
            </div>
            
            {/* Uploaded Documents Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[var(--accent-color)] mb-4">Uploaded Documents</h3>
              <div className="space-y-3">
                {Object.entries(lawyerProfile.documents).map(([name, url], index) => (
                  <a
                    href={url}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <FaFilePdf className="text-[var(--primary-color)] text-lg" />
                    <span className="text-gray-300 text-sm capitalize">
                      {name.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </a>
                ))}
              </div>
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

export default LawyerProfileReview;