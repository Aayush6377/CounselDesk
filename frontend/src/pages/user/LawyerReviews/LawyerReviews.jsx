import React from 'react';
import { dummyReview } from '../../../assets/assets';
import renderRating from '../../../utils/renderRating';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const LawyerReviews = () => {
    const navigate = useNavigate();
    const lawyer = dummyReview[0].lawyerId;

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-2 cursor-pointer">
                            <span className="material-symbols-outlined"><IoIosArrowRoundBack /></span>
                            <span>Back to Profile</span>
                        </button>
                        <h1 className="text-3xl font-bold text-[var(--accent-color)]">Reviews for {lawyer.name}</h1>
                        <p className="text-lg text-[var(--primary-color)]">{lawyer.specialization}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex material-symbols-outlined text-yellow-400 text-2xl">{renderRating(lawyer.rating)}</span>
                        <span className="text-xl font-bold text-white">{lawyer.rating}</span>
                        <span className="text-gray-400">(based on {lawyer.reviewsCount} reviews)</span>
                    </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-8">
                    <div className="space-y-8">
                        {dummyReview.map((review, index) => (
                            <React.Fragment key={review._id}>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex items-center gap-4 w-full sm:w-48 flex-shrink-0">
                                        <div
                                            className="w-14 h-14 bg-center bg-no-repeat aspect-square bg-cover rounded-full"
                                            style={{ backgroundImage: `url("${review.userId.profileImage}")` }}
                                        ></div>
                                        <div>
                                            <h4 className="text-[var(--accent-color)] font-semibold">{review.userId.name}</h4>
                                            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            {renderRating(review.rating)}
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                                {index < dummyReview.length - 1 && <div className="border-t border-white/10"></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    
                </div>
            </div>
        </main>
    );
};

export default LawyerReviews;