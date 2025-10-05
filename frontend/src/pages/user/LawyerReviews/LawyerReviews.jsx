import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import renderRating from '../../../utils/renderRating';
import { getLawyerReviews } from '../../../services/user.service'; 
import Loader from '../../../components/Loader/Loader'; 
import Error from '../../../components/Error/Error';  

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const LawyerReviews = () => {
    const navigate = useNavigate();
    const { lawyerId } = useParams();
    const observerRef = useRef();

    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ['lawyerReviews', lawyerId],
        queryFn: ({ pageParam = 1 }) => getLawyerReviews(lawyerId, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.pagination.hasNextPage) {
                return lastPage.pagination.nextPage;
            }
            return undefined; 
        },
    });

    useEffect(() => {
        if (isFetchingNextPage || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const reviews = data?.pages.flatMap(page => page.reviews) ?? [];
    const lawyer = data?.pages[0]?.lawyer;

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Error message={error.message || "Failed to load reviews."} />;
    }

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-[var(--accent-color)] transition-colors mb-2 cursor-pointer">
                            <IoIosArrowRoundBack className="text-2xl" />
                            <span>Back to Profile</span>
                        </button>
                        <h1 className="text-3xl font-bold text-[var(--accent-color)]">Reviews for {lawyer?.userId.name}</h1>
                        <p className="text-lg text-[var(--primary-color)]">{lawyer?.specialization}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex material-symbols-outlined text-yellow-400 text-2xl">{renderRating(lawyer?.rating)}</span>
                        <span className="text-xl font-bold text-white">{lawyer?.rating.toFixed(1)}</span>
                        <span className="text-gray-400">(based on {lawyer?.reviewsCount} reviews)</span>
                    </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-xl p-8">
                    <div className="space-y-8">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
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
                                    {index < reviews.length - 1 && <div className="border-t border-white/10"></div>}
                                </React.Fragment>
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No reviews found for this lawyer.</p>
                        )}
                    </div>
                    
                    <div ref={observerRef} className="h-10 mt-8 flex justify-center items-center">
                        {isFetchingNextPage && <p className="text-gray-500">Loading....</p>}
                        {!hasNextPage && reviews.length > 0 && (
                            <p className="text-gray-500">You've reached the end of the list.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LawyerReviews;