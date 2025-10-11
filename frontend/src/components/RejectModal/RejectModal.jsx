import React, { useState } from 'react';
import { toast } from 'react-toastify';

const RejectModal = ({
    isOpen,
    onClose,
    onConfirm,
    isPending
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (!reason.trim()) {
            toast.error("A reason for rejection is required.");
            return;
        }
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--secondary-color)] border border-white/10 rounded-xl p-8 max-w-md w-full mx-4">
                <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-4">Reject Lawyer Application</h2>
                <p className="text-gray-300 mb-6">Please provide a reason for rejecting this application. The lawyer will be notified via email.</p>
                
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Document is not clear, information mismatch..."
                    className="w-full min-h-[120px] bg-black/30 border border-white/10 rounded-lg p-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all"
                    required
                />

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="py-2 px-6 rounded-lg bg-gray-700/50 text-white hover:bg-gray-600/70 transition-colors font-semibold disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending || !reason.trim()}
                        className="py-2 px-6 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors font-bold disabled:bg-red-500/40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isPending ? 'Submitting...' : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;