import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import { addQuestion, updateQuestion } from '../../../services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const categoryOptions = [
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law"},
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" },
    { value: 'Other', label: 'Other' },
];

const AskQuestionModal = ({ isOpen, onClose, invalidateKey, initialData = null }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ title: '', description: '', category: 'Family Law', isAnonymous: false });
    const [errors, setErrors] = useState({});

    const isUpdateMode = !!initialData;

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                category: initialData.category || 'Family Law',
                isAnonymous: initialData.isAnonymous || false
            });
        } else {
            setFormData({ title: '', description: '', category: 'Family Law', isAnonymous: false });
            setErrors({});
        }
    }, [isOpen, initialData]);

    const { mutate: add, isPending: isAdding } = useMutation({
        mutationFn: addQuestion,
        onSuccess: (res) => {
            setFormData({ title: '', description: '', category: 'Family Law', isAnonymous: false });
            setErrors({});
            toast.success(res.message || "Your question has been successfully submitted");
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
        mutationFn: updateQuestion,
        onSuccess: (res) => {
            setErrors({});
            toast.success(res.message || "Your question has been successfully updated");
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUpdateMode) {
            update({ questionId: initialData._id, ...formData });
        } else {
            add(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4" onClick={onClose}>
            <div className="bg-[var(--secondary-color)] border border-white/10 rounded-xl p-8 max-w-2xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[var(--accent-color)] text-2xl font-bold">{isUpdateMode ? 'Update Your Question' : 'Ask a New Question'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <IoClose size={28} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="title">Question Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Can I sue my landlord for an injury on the property?"
                            required
                            className={`form-input w-full bg-black/30 border rounded-lg h-12 px-4 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all ${errors.title ? 'border-red-500' : 'border-white/10'}`}
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="category">Legal Category</label>
                        <CustomSelect
                            name="category"
                            options={categoryOptions}
                            value={formData.category}
                            onChange={handleChange}
                            className="relative w-full"
                        />
                        {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="description">Detailed Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            placeholder="Provide as much detail as possible to get the best answers..."
                            required
                            className={`form-textarea w-full bg-black/30 border rounded-lg p-4 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] outline-none transition-all ${errors.description ? 'border-red-500' : 'border-white/10'}`}
                        />
                         {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            id="isAnonymous"
                            name="isAnonymous"
                            type="checkbox"
                            checked={formData.isAnonymous}
                            onChange={handleChange}
                            className="h-5 w-5 rounded bg-black/30 border-white/20 text-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]"
                        />
                        <label htmlFor="isAnonymous" className="text-gray-300">Post Anonymously</label>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={ isAdding || isUpdating }
                            className="py-3 px-8 rounded-lg bg-[var(--primary-color)] text-[var(--secondary-color)] font-bold hover:bg-[#c0a97c] transition-colors cursor-pointer"
                        >
                            {isUpdateMode ? isUpdating ? 'Updating...' : 'Update Question' : isAdding ? 'Submitting...' : 'Submit Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AskQuestionModal;