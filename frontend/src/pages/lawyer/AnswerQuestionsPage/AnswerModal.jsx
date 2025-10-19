import { addAnswer, updateAnswer } from '../../../services/lawyer.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

const AnswerModal = ({ isOpen, onClose, question, invalidateKey }) => {
    const [formData, setFormData] = useState({ content: '' });
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();
    const isUpdateMode = !!question?.myAnswer;

    const { mutate: add, isPending: isAdding } = useMutation({
        mutationFn: addAnswer,
        onSuccess: (res) => {
            setErrors({});
            toast.success(res.message || "Your answer has been successfully added");
            queryClient.invalidateQueries({ queryKey: invalidateKey });
            onClose();
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
            }
        }
    });

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: updateAnswer,
        onSuccess: (res) => {
            setErrors({});
            toast.success(res.message || "Your answer has been successfully updated");
            queryClient.invalidateQueries({ queryKey: invalidateKey });
            onClose();
        },
        onError: (err) => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                toast.error(err.response.data.message);
            } else {
                toast.error(err?.response?.data?.message || err.message || "Something went wrong. Please try again.");
            }
        }
    });

    useEffect(() => {
        if (isOpen && isUpdateMode) {
            setFormData({content: question.myAnswer.content});
        } else {
            setFormData({ content: "" });
            setErrors({});
        }
    }, [isOpen, question, isUpdateMode]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
        setErrors(prev => ({...prev, [e.target.name]: ""}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUpdateMode){
            update({ content: formData.content, answerId: question.myAnswer._id });
        }
        else{
            add({ content: formData.content, questionId: question._id });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-[var(--secondary-color)] border border-white/10 rounded-xl p-8 max-w-3xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-[var(--accent-color)] text-2xl font-bold">{question.title}</h2>
                        <p className="text-gray-400 text-sm mt-1">Category: {question.category}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <IoClose size={28} />
                    </button>
                </div>
                <p className="text-gray-300 border-t border-b border-white/10 py-4 mb-6">{question.description}</p>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="answer-text">Your Answer</label>
                    <textarea
                        id="answer-text"
                        value={formData.content}
                        onChange={handleChange}
                        name='content'
                        rows="8"
                        placeholder="Provide your legal expertise here. Remember to include a disclaimer if necessary."
                        required
                        className={`form-textarea w-full bg-black/30 border ${errors.content ? 'border-red-500' : 'border-white/10'} rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all`}
                    />
                    {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={isAdding || isUpdating}
                            className="py-3 px-8 rounded-lg bg-[var(--primary-color)] text-[var(--secondary-color)] font-bold hover:bg-[#c0a97c] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {isUpdateMode ? isUpdating ? 'Updating...' : 'Update Answer' : isAdding ? 'Submitting...' : 'Submit Answer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnswerModal;

