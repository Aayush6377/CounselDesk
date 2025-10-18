import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { FaQuestionCircle } from 'react-icons/fa';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import AnswerModal from './AnswerModal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import QuestionCard from './QuestionCard';

// Dummy Data
const dummyQuestions = [
    { _id: 'q1', title: 'Can I sue my landlord for an injury on the property?', description: "I slipped on a wet floor in the common hallway of my apartment building and broke my arm. There was no 'wet floor' sign...", category: 'Environmental Law', user: { name: 'Anonymous', profileImage: null }, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { _id: 'q2', title: 'How do I start a small business (LLC)?', description: "I'm looking to formalize my freelance graphic design work into an LLC. I'm unsure about the process of registration...", category: 'Labour Law', user: { name: 'Mark T.', profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256' }, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { _id: 'q4', title: 'What are the legal implications of breaking a lease early?', description: 'My job is relocating me to another state, and I have 6 months left on my apartment lease...', category: 'Civil Law', user: { name: 'Jane D.', profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256' }, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), myAnswer: { _id: 'ans4', content: 'You should review your lease agreement for any clauses related to early termination...' } },
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


const AnswerQuestionsPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ search: '', category: 'All Categories', sortBy: 'newest' });
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    
    // In a real app, this would come from a useQuery hook
    const questions = dummyQuestions;

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
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="flex flex-col w-full max-w-screen-xl gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Answer Questions</h1>
                        <p className="text-gray-400 text-lg">Provide your legal expertise to user-submitted questions.</p>
                    </div>
                     <Link to="/user-lawyer/community/myAnswers" className="flex items-center justify-center gap-2 w-full md:w-auto h-12 px-6 rounded-lg bg-black/30 border border-white/20 text-[var(--accent-color)] text-base font-bold hover:bg-white/10 transition-colors">
                        <FaQuestionCircle />
                        <span>My Answered Questions</span>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-auto flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input name="search" onChange={handleFilterChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 py-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] transition-all" placeholder="Search by keyword, topic..." type="text"/>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <CustomSelect name="category" value={filters.category} onChange={handleFilterChange} options={categoryOptions} />
                        <CustomSelect name="sortBy" value={filters.sortBy} onChange={handleFilterChange} options={sortOptions} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {questions.map(q => (
                        <QuestionCard 
                            key={q._id} 
                            question={q}
                            onAnswer={handleOpenModal}
                            onUpdate={handleOpenModal} // "Update" also opens the same answer modal
                            onDelete={handleOpenDeleteModal}
                        />
                    ))}
                </div>
            </div>

            <AnswerModal 
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
                question={selectedQuestion}
                // onSubmit={...} would be passed to a useMutation hook
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

export default AnswerQuestionsPage;