import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAdd, IoArrowBack } from 'react-icons/io5';
import AskQuestionModal from '../LegalQAPage/AskQuestionModal';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import MyQuestionCard from './MyQuestionCard';
import { toast } from 'react-toastify';
import { deleteQuestion, getQuestionsList, markAsBestAnswer } from '../../../services/user.service';
import Loader from '../../../components/Loader/Loader';
import Error from '../../../components/Error/Error';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const MyQuestionsPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [questionToAction, setQuestionToAction] = useState(null);
    const observerRef = useRef(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
        queryKey: ['personalQuestions'],
        queryFn: ({ pageParam = 1 }) => getQuestionsList(pageParam, "", "", true),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        },
    });

    //Mark as best answer
    const { mutate: markAsBest } = useMutation({
        mutationFn: markAsBestAnswer,
        onSuccess: (res) => {
            toast.success(res.message || "Best answer marked successfully!!");
            queryClient.invalidateQueries({ queryKey: ["personalQuestions"] });
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Unable to toggle upvote button");
        }
    });

    //Delete the question
    const { mutate: mutateDelQuestion } = useMutation({
        mutationFn: deleteQuestion,
        onSuccess: (res) => {
            toast.success(res.message || "Your question has been successfully deleted");
            queryClient.invalidateQueries({ queryKey: ["personalQuestions"] });
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

    const handleOpenUpdateModal = (question) => {
        setQuestionToAction(question);
        setIsAskModalOpen(true);
    };

    const handleOpenDeleteModal = (question) => {
        setQuestionToAction(question);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        mutateDelQuestion(questionToAction._id);
        setIsDeleteModalOpen(false);
        setQuestionToAction(null);
    };

    const handleMarkAsBest = (questionId, answerId) => {
        markAsBest({ questionId, answerId });
    };

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-6">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-2 cursor-pointer">
                            <IoArrowBack />
                            <span>Back to Q&A</span>
                        </button>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">My Questions</h1>
                        <p className="text-gray-400 mt-2 text-lg">Manage and review the questions you have asked.</p>
                    </div>
                    <button 
                        onClick={() => { setQuestionToAction(null); setIsAskModalOpen(true); }}
                        className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-base font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect w-full md:w-auto">
                        <IoAdd size={24} />
                        <span className="truncate">Ask a New Question</span>
                    </button>
                </div>
                
                <div className="flex flex-col gap-6">
                    {isLoading && <Loader />}
                    {isError && <Error message={error.message || "Could not load questions."} />}
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <MyQuestionCard 
                                key={question._id} 
                                question={question}
                                onUpdate={handleOpenUpdateModal}
                                onDelete={handleOpenDeleteModal}
                                onMarkBest={handleMarkAsBest}
                                invalidateKey={['personalQuestions']}
                            />
                        ))
                    ) : (
                        <div className="bg-black/20 border border-white/10 rounded-xl p-8 text-center">
                            <p className="text-gray-400">You haven't asked any questions yet.</p>
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
                initialData={questionToAction}
            />
            
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete this question?`}
                confirmText="Yes, Delete"
            />
        </main>
    );
};

export default MyQuestionsPage;
