import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { IoArrowBack } from "react-icons/io5";
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import AnswerModal from '../AnswerQuestionsPage/AnswerModal'; 
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import QuestionCard from '../AnswerQuestionsPage/QuestionCard'; 

// Dummy Data for demonstration
const dummyMyAnswers = [
    {
        _id: 'q4',
        title: 'What are the legal implications of breaking a lease early?',
        description: 'My job is relocating me to another state, and I have 6 months left on my apartment lease. What are the potential financial and legal consequences?',
        category: 'Property Law',
        user: { name: 'Jane D.', profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256' },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        myAnswer: { 
            _id: 'ans4', 
            content: 'You should review your lease agreement for any clauses related to early termination. Most leases have a penalty, but some states have laws that limit what a landlord can charge if you have a valid reason like a job relocation. It\'s best to communicate with your landlord in writing as soon as possible.',
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) // 20 hours ago
        }
    },
    {
        _id: 'q3',
        title: 'Child custody arrangements after separation',
        description: 'My partner and I are separating, and we have a 5-year-old child. We are not married. What are the typical custody arrangements?',
        category: 'Family Law',
        user: { name: 'Sarah P.', profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256' },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        myAnswer: {
            _id: 'ans3',
            content: 'In situations where parents are not married, custody is determined based on the best interests of the child. Courts typically favor joint legal custody, where both parents make major decisions. Physical custody can be sole or joint. You should try to create a parenting plan together. If you cannot agree, you will need to file a petition with the court.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        }
    },
];

const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law"},
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" },
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
];

const MyAnswersPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ search: '', category: 'All Categories', sortBy: 'newest' });
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    
    // In a real app, this would come from a useQuery hook
    const answeredQuestions = dummyMyAnswers;

    const handleOpenModal = (question) => {
        setSelectedQuestion(question);
        setIsAnswerModalOpen(true);
    };
    
    const handleOpenDeleteModal = (question) => {
        setSelectedQuestion(question);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        // Here you would call a useMutation to delete the answer
        console.log("Deleting answer for question:", selectedQuestion._id);
        toast.success("Answer deleted successfully.");
        setIsDeleteModalOpen(false);
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main className="bg-[var(--secondary-color)]  px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="flex flex-col w-full max-w-screen-xl gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-2 cursor-pointer">
                            <IoArrowBack size={24} />
                            <span>Back</span>
                        </button>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">My Answered Questions</h1>
                        <p className="text-gray-400 text-lg">Manage, update, or delete your answers to user questions.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-auto flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input name="search" onChange={handleFilterChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 py-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] transition-all" placeholder="Search by keyword..." type="text"/>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <CustomSelect name="category" value={filters.category} onChange={handleFilterChange} options={categoryOptions} />
                        <CustomSelect name="sortBy" value={filters.sortBy} onChange={handleFilterChange} options={sortOptions} />
                    </div>
                </div>
                {answeredQuestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 2. Use the imported QuestionCard component */}
                        {answeredQuestions.map(q => (
                            <QuestionCard 
                                key={q._id} 
                                question={q}
                                onUpdate={handleOpenModal}
                                onDelete={handleOpenDeleteModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-black/20 border border-white/10 rounded-xl p-8 text-center text-gray-400">
                        <p>You have not answered any questions yet.</p>
                    </div>
                )}
            </div>

            <AnswerModal 
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
                question={selectedQuestion}
            />
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Answer"
                message="Are you sure you want to permanently delete your answer? This action cannot be undone."
                confirmText="Yes, Delete"
            />
        </main>
    );
};

export default MyAnswersPage;
