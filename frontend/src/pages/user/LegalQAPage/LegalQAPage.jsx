import React, { useEffect, useRef, useState } from 'react';
import AskQuestionModal from './AskQuestionModal';
import QuestionAccordion from './QuestionAccordion';
import { IoAdd } from 'react-icons/io5';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import { FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getQuestionsList } from '../../../services/user.service';
import { MdSearch } from 'react-icons/md';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';

const specializationOptions = [
    { value: "", label: "All Specializations" },
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

const LegalQAPage = () => {
    const [filters, setFilters] = useState({ search: "", category: "" });
    const [liveSearchTerm, setLiveSearchTerm] = useState("");
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
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
        queryKey: ['publicQuestions', filters],
        queryFn: ({ pageParam = 1 }) => getQuestionsList(pageParam, filters.category, filters.search),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
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
    
    const questions = data?.pages?.flatMap(page => page?.data) ?? [];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Legal Q&A</h1>
                        <p className="text-gray-400 mt-2 text-lg">Browse legal questions or ask your own.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link to="/user/community/myQuestions"
                            className="flex items-center gap-2 flex-1 md:flex-initial justify-center rounded-lg h-12 px-6 bg-black/30 border border-white/20 text-[var(--accent-color)] text-base font-bold hover:bg-white/10 transition-colors"
                        >
                            <FaQuestionCircle />
                            <span className="truncate">My Questions</span>
                        </Link>
                        <button 
                            onClick={() => setIsAskModalOpen(true)}
                            className="flex items-center gap-2 flex-1 md:flex-initial justify-center rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect cursor-pointer"
                        >
                            <IoAdd size={24} />
                            <span className="truncate">Ask a Question</span>
                        </button>
                    </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:flex-1">
                        <input 
                            value={liveSearchTerm}
                            onChange={(e) => setLiveSearchTerm(e.target.value)}
                            className="form-input w-full h-12 bg-black/30 border-none rounded-lg text-[var(--accent-color)] pl-12 pr-4 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--primary-color)]" 
                            placeholder="Search questions by keyword..." 
                            type="text"
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <CustomSelect 
                            name="category" 
                            options={specializationOptions} 
                            value={filters.category} 
                            onChange={handleFilterChange} 
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {isLoading && <Loader />}
                    {isError && <Error message={error.message || "Could not load questions."} />}
                    
                    {!isLoading && questions.length > 0 && (
                        questions.map((question) => (
                            <QuestionAccordion key={question._id} question={question} invalidateKey = {['publicQuestions', filters]}/>
                        ))
                    )}

                    {!isLoading && !isError && questions.length === 0 && (
                         <div className="text-center py-16 bg-black/20 rounded-lg">
                            <p className="text-gray-400 text-lg">No questions found matching your criteria.</p>
                        </div>
                    )}
                </div>
                
                <div ref={observerRef} className="h-10 w-full flex justify-center items-center text-[var(--accent-color)]">
                    {isFetchingNextPage && "Loading Questions..."}
                    {!hasNextPage && questions.length > 0 && <p className="text-gray-500">You've reached the end of the list.</p>}
                </div>
            </div>
            <AskQuestionModal 
                isOpen={isAskModalOpen}
                onClose={() => setIsAskModalOpen(false)}
                invalidateKey = {['publicQuestions', filters]}
            />
        </main>
    );
};

export default LegalQAPage;
