import React from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isConfirming = false
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
            <div className="bg-[var(--secondary-color)] border border-white/10 rounded-xl p-8 max-w-md w-full mx-4">
                <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-300 mb-8">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        disabled={isConfirming}
                        className="py-2 px-6 rounded-lg bg-gray-700/50 text-white hover:bg-gray-600/70 transition-colors font-semibold disabled:opacity-50 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className="py-2 px-6 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors font-bold disabled:bg-red-500/40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isConfirming ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;