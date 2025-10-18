import React, { useState } from 'react';
import moment from 'moment';
import { FaChevronDown, FaChevronUp, FaGavel, FaThumbsUp } from 'react-icons/fa';
import { images } from '../../../assets/assets';
import { Link } from 'react-router-dom';
import { toggleVote } from '../../../services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const AnswerCard = ({ answer, invalidateKey }) => {
    const queryClient = useQueryClient();
    const [hasLiked, setHasLiked] = useState(answer.isVoted);
    const [likeCount, setLikeCount] = useState(answer.upvotes);

    const { mutate: toggle } = useMutation({
        mutationFn: toggleVote,
        onSuccess: () => {
            setHasLiked(prev => !prev);
            setLikeCount(prev => hasLiked ? prev - 1 : prev + 1 );
            queryClient.invalidateQueries({ queryKey: invalidateKey });
        }, 
        onError: (err) => {
            toast.error(err.response.data.message || "Unable to toggle upvote button");
        }
    });

    return (
        <div className={`bg-black/20 border rounded-xl p-4 flex flex-col gap-4 ${answer.isBestAnswer ? 'border-[var(--primary-color)]/60' : 'border-white/10'}`}>
            <div className="flex gap-4">
                <Link to={`/user/lawyer-profile/${answer.lawyerId}`}><img alt={answer.lawyername} className="w-12 h-12 rounded-full object-cover flex-shrink-0" src={answer.lawyerProfile || images.defaultProfile} /></Link>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <Link to={`/user/lawyer-profile/${answer.lawyerId}`} className="font-bold text-white truncate hover:text-[var(--accent-color)] transition-colors">{answer.lawyername}
                                <span className="text-xs font-normal text-[var(--primary-color)] ml-2">(Verified Lawyer)</span>
                            </Link>
                            <p className="text-xs text-gray-400">Answered {moment(answer.createdAt).fromNow()}</p>
                        </div>
                        <button
                            onClick={() => toggle(answer._id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                                hasLiked
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/70 hover:text-white'
                            }`}
                        >
                            <FaThumbsUp />
                            <span>{likeCount}</span>
                        </button>
                    </div>
                    <p className="text-gray-300 mt-2">{answer.content}</p>
                </div>
            </div>
            {answer.isBestAnswer && (
                <div className="flex items-center justify-end border-t border-white/10 pt-3">
                    <div className="bg-[var(--primary-color)] text-[var(--secondary-color)] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <FaGavel className="text-base" />
                        <span>BEST ANSWER</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuestionAccordion = ({ question , invalidateKey }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-black/20 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <img alt="User Avatar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" src={question.userProfile || images.defaultProfile} />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-[var(--accent-color)] hover:text-[var(--primary-color)] transition-colors">{question.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400 mt-2">
                        <span>Asked by {question.isAnonymous ? 'Anonymous' : question.username}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{question.category}</span>
                    </div>
                </div>
                <button className="text-gray-400 p-2">
                    {isOpen ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>
            </div>
            
            {isOpen && (
                <div className="pt-4 sm:pl-16 animate-fadeIn">
                    <p className="text-gray-300 mb-6">{question.description}</p>
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-4">Answers ({question.answers.length})</h3>
                        {question.answers.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                { question.answers.map(answer => <AnswerCard key={answer._id} answer={answer} invalidateKey={invalidateKey} />) }
                            </div>
                        ) : (
                            <p className="text-gray-500">No answers have been submitted for this question yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionAccordion;

