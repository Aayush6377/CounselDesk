import React, { useState, useEffect, useRef } from 'react';
import renderRating from '../../../utils/renderRating';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getReviewStats, getLawyerReviewsList } from '../../../services/lawyer.service';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import { images } from '../../../assets/assets';

const ReviewStats = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ReviewStats"],
    queryFn: getReviewStats
  });

  const stats = data?.data;

  if (isLoading){
      return <Loader />;
  }

  if (isError) {
      const errorCode = error?.response?.data?.status || 500;
      const errorMessage = error?.response?.data?.message || "Appointment not found or an error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);
      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />;
  }
  
  return (
  <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex flex-col items-center">
        <p className="text-[var(--accent-color)] text-6xl font-bold">{stats?.rating}</p>
        <div className="mt-2 flex flex-row">
          {renderRating(stats.rating)}
        </div>
        <p className="text-gray-400 mt-2 text-sm">Based on {stats?.reviewsCount} reviews</p>
      </div>
      <div className="flex-1 w-full">
        {stats.reviews.map((item) => {
            const percentage = stats.reviewsCount > 0 ? (item.count / stats.reviewsCount) * 100 : 0;
            return (
                <div key={item.stars} className="flex items-center gap-4 mb-2">
                    <span className="text-gray-400 text-sm">{item.stars} star</span>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-[var(--primary-color)] h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="text-[var(--accent-color)] w-10 text-right text-sm">{item.count}</span>
                </div>
            )
        })}
      </div>
    </div>
  </div>
)};

const ReviewCard = ({ review }) => {
    const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    return (
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
            <img alt={review.userId.name} className="flex-shrink-0 w-16 h-16 rounded-full object-cover" src={review.userId.profileImage || images.defaultProfile} />
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">{review.userId.name}</p>
                    <span className="text-gray-500 text-sm">{formattedDate}</span>
                </div>
                <p className='flex flex-row'>{renderRating(review.rating)}</p>
                <p className="text-gray-300 text-base font-normal leading-relaxed mt-2">{review.comment}</p>
            </div>
        </div>
    );
};


const Reviews = () => {
    const [sortBy, setSortBy] = useState('newest');
    const observerRef = useRef();

    const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
        queryKey: ['lawyerReviewsList', sortBy],
        queryFn: ({ pageParam = 1 }) => getLawyerReviewsList(pageParam, sortBy),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.pagination.hasNextPage ? lastPage.pagination.nextPage : undefined;
        }
    });

    useEffect(() => {
        if (isFetchingNextPage || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            }, { threshold: 1.0 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const options = [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Highest Rating", value: "highest" },
        { label: "Lowest Rating", value: "lowest" }
    ];

    const reviews = data?.pages.flatMap(page => page.reviews) ?? [];

    return (
        <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
                <div className="flex flex-wrap justify-between items-center gap-6">
                    <div>
                        <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Reviews & Ratings</h1>
                        <p className="text-gray-400 mt-2 text-lg">Feedback from your clients.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">Sort by:</span>
                        <CustomSelect options={options} value={sortBy} onChange={(e) => setSortBy(e.target.value)} />
                    </div>
                </div>
                
                <ReviewStats />

                {isLoading ? (
                    <Loader />
                ) : isError ? (
                    <Error message={error.message || "Could not load reviews."} />
                ) : (
                    <div className="flex flex-col gap-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard key={review._id} review={review} />
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">No reviews found.</p>
                        )}
                        
                        <div ref={observerRef} className="h-10 mt-4 flex justify-center items-center">
                            {isFetchingNextPage && <p className="text-center text-gray-400 py-8">Loading...</p>}
                            {!hasNextPage && reviews.length > 0 && (
                                <p className="text-gray-500">You've reached the end of the list.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Reviews;