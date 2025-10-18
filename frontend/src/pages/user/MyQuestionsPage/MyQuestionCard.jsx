import React, { useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaChevronDown, FaChevronUp, FaGavel, FaThumbsUp } from 'react-icons/fa';
import moment from 'moment';
import { images } from '../../../assets/assets';
import { toggleVote } from '../../../services/user.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AnswerCard = ({ answer, onMarkAsBest, invalidateKey }) => {
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
                <Link to={`/user/lawyer-profile/${answer.lawyerId}`}><img alt={answer.lawyername} className="w-12 h-12 rounded-full object-cover" src={answer.lawyerProfile || images.defaultProfile} /></Link>
                <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                            <Link to={`/user/lawyer-profile/${answer.lawyerId}`} className="font-bold text-white hover:text-[var(--accent-color)] transition-colors">{answer.lawyername} <span className="text-xs font-normal text-[var(--primary-color)] ml-1">(Verified Lawyer)</span></Link>
                            <p className="text-xs text-gray-400">Answered {moment(answer.createdAt).fromNow()}</p>
                        </div>
                        <button
                            onClick={() => toggle(answer._id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
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
            <div className="flex items-center justify-end border-t border-white/10 pt-3">
                {answer.isBestAnswer ? (
                    <div className="bg-[var(--primary-color)] text-[var(--secondary-color)] text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                        <FaGavel className="text-base" />
                        <span>BEST ANSWER</span>
                    </div>
                ) : (
                    <button
                        onClick={() => onMarkAsBest(answer._id)}
                        className="flex items-center gap-2 text-sm text-[var(--primary-color)] hover:text-[var(--accent-color)] font-semibold bg-black/30 hover:bg-[var(--primary-color)]/20 px-4 py-2 rounded-md transition-colors cursor-pointer"
                    >
                        <FaGavel />
                        <span>Mark as Best Answer</span>
                    </button>
                )}
            </div>
        </div>
    );
};


const MyQuestionCard = ({ question, onUpdate, onDelete, onMarkBest, invalidateKey }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-black/20 border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h2 onClick={() => setIsOpen(!isOpen)} className="text-lg sm:text-xl font-bold text-[var(--accent-color)] hover:text-[var(--primary-color)] cursor-pointer">{question.title}</h2>
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => onUpdate(question)} className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-[var(--accent-color)] bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
                                <MdEdit />
                                <span>Update</span>
                            </button>
                            <button onClick={() => onDelete(question)} className="flex items-center gap-1.5 text-sm text-red-400 bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
                                <MdDelete />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-2">
                        <span>Category: {question.category}</span>
                        <span>•</span>
                        <span>{moment(question.createdAt).fromNow()}</span>
                    </div>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 p-2">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            <div className="flex sm:hidden items-center gap-2 border-t border-white/10 pt-4">
                <button onClick={() => onUpdate(question)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-gray-300 ...">
                    <MdEdit />
                    <span>Update</span>
                </button>
                <button onClick={() => onDelete(question)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-400 ...">
                    <MdDelete />
                    <span>Delete</span>
                </button>
            </div>

            {isOpen && (
                <div className="pt-4 border-t border-white/10 animate-fadeIn">
                    <p className="text-gray-300 mb-6">{question.description}</p>
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--accent-color)] mb-4">Answers ({question.answers.length})</h3>
                        {question.answers.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {question.answers.map(answer => (
                                    <AnswerCard 
                                        key={answer._id} 
                                        answer={answer}
                                        onMarkAsBest={(answerId) => onMarkBest(question._id, answerId)}
                                        invalidateKey = {invalidateKey}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">No answers yet. Check back later.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyQuestionCard;