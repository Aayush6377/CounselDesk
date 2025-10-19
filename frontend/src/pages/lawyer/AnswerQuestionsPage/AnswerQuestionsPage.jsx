import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';
import { FaQuestionCircle } from 'react-icons/fa';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import AnswerModal from './AnswerModal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import QuestionCard from './QuestionCard';
import { deleteAnswer, getLawyerQuestionsList } from '../../../services/lawyer.service';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';

const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: "Family Law", label: "Family Law" },
    { value: "Corporate Law", label: "Corporate Law" },
    { value: "Criminal Law", label: "Criminal Law" },
    { value: "Tax Law", label: "Tax Law" },
    { value: "Cyber Law", label: "Cyber Law" },
    { value: "Real Estate Law", label: "Real Estate Law"},
    { value: "Environmental Law", label: "Environmental Law" },
    { value: "Labour Law", label: "Labour Law" },
    { value: "Civil Law", label: "Civil Law" },
    { value: "Other", label: "Other" }
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
];


const AnswerQuestionsPage = () => {
    const [filters, setFilters] = useState({ search: '', category: '', sortBy: 'newest' });
    const [liveSearchTerm, setLiveSearchTerm] = useState('');
    const queryClient = useQueryClient();
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (liveSearchTerm !== filters.search) {
                setFilters(prev => ({ ...prev, search: liveSearchTerm }));
            }
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [liveSearchTerm, filters.search]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['lawyerQuestions', filters],
        queryFn: getLawyerQuestionsList,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
    });

    const { mutate: deleteAns } = useMutation({
        mutationFn: deleteAnswer,
        onSuccess: (res) => {
            toast.success(res.message || "Your answer has been successfully deleted");
            queryClient.invalidateQueries({ queryKey: ['lawyerQuestions', filters] });
            setIsDeleteModalOpen(false);
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Unable to delete the question");
        }
    });

    useEffect(() => {
        if (!observerRef.current || isFetchingNextPage || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            }, { threshold: 1.0 }
        );
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [data, hasNextPage, fetchNextPage, isFetchingNextPage]);

    const questions = data?.pages.flatMap(page => page.data) ?? [];

    const handleOpenModal = (question) => {
        setSelectedQuestion(question);
        setIsAnswerModalOpen(true);
    };
    
    const handleOpenDeleteModal = (question) => {
        setSelectedQuestion(question);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedQuestion?.myAnswer?._id){
            deleteAns(selectedQuestion.myAnswer._id);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isError) return <Error message={error.message || "Failed to load questions."} />;

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="flex flex-col w-full max-w-screen-xl gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Answer Questions</h1>
                        <p className="text-gray-400 text-lg">Provide your legal expertise to user-submitted questions.</p>
                    </div>
                     <Link to={'/user-lawyer/community/myAnswers'} className="flex items-center justify-center gap-2 w-full md:w-auto h-12 px-6 rounded-lg bg-black/30 border border-white/20 text-[var(--accent-color)] text-base font-bold hover:bg-white/10 transition-colors">
                        <FaQuestionCircle />
                        <span>My Answered Questions</span>
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-auto flex-1">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                        <input value={liveSearchTerm} onChange={(e) => setLiveSearchTerm(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg pl-12 py-3 text-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] transition-all" placeholder="Search by keyword, topic..." type="text"/>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <CustomSelect name="category" value={filters.category} onChange={handleFilterChange} options={categoryOptions} />
                        <CustomSelect name="sortBy" value={filters.sortBy} onChange={handleFilterChange} options={sortOptions} />
                    </div>
                </div>

                {isLoading && <Loader />}
                
                {!isLoading && questions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {questions.map((q,index) => (
                            <QuestionCard 
                                key={index} 
                                question={q}
                                onAnswer={handleOpenModal}
                                onUpdate={handleOpenModal}
                                onDelete={handleOpenDeleteModal}
                            />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 bg-black/20 rounded-lg">
                        <p className="text-gray-400 text-lg">No questions found matching your criteria.</p>
                    </div>
                )}

                <div ref={observerRef} className="h-10 w-full flex justify-center items-center text-[var(--accent-color)]">
                    {isFetchingNextPage && "Loading Questions..."}
                    {!hasNextPage && questions.length > 0 && (
                        <p className="text-gray-500">You've reached the end of the list.</p>
                    )}
                </div>
            </div>

            <AnswerModal 
                isOpen={isAnswerModalOpen}
                onClose={() => setIsAnswerModalOpen(false)}
                question={selectedQuestion}
                invalidateKey={['lawyerQuestions', filters]}
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