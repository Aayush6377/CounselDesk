import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

const AnswerModal = ({ isOpen, onClose, question, onSubmit, isPending }) => {
    const [answerText, setAnswerText] = useState('');

    const isUpdateMode = !!question?.myAnswer;

    useEffect(() => {
        // Pre-fill with existing answer if available for "Update" mode
        if (isOpen && isUpdateMode) {
            setAnswerText(question.myAnswer.content);
        } else {
            // Reset when opening for a new question or closing
            setAnswerText('');
        }
    }, [isOpen, question, isUpdateMode]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answerText.trim().length < 50) {
            toast.error("Your answer must be at least 50 characters long.");
            return;
        }
        // onSubmit would trigger a useMutation hook in the parent component
        onSubmit({ 
            questionId: question._id, 
            answerId: question.myAnswer?._id, // Pass answerId if updating
            content: answerText 
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-[var(--secondary-color)] border border-white/10 rounded-xl p-8 max-w-3xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold">{question.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">Category: {question.category}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <IoClose size={28} />
                    </button>
                </div>
                <p className="text-gray-300 border-t border-b border-white/10 py-4 mb-6">{question.description}</p>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="answer-text">Your Answer</label>
                    <textarea
                        id="answer-text"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        rows="8"
                        placeholder="Provide your legal expertise here. Remember to include a disclaimer if necessary."
                        required
                        className="form-textarea w-full bg-black/30 border border-white/10 rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all"
                    />
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="py-3 px-8 rounded-lg bg-[var(--primary-color)] text-[var(--secondary-color)] font-bold hover:bg-[#c0a97c] transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Submitting...' : (isUpdateMode ? 'Update Answer' : 'Submit Answer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnswerModal;

