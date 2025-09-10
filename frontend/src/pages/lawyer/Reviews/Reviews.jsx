import React, { useState, useEffect, useMemo } from 'react';
import renderRating from '../../../utils/renderRating';
import CustomSelect from '../../../components/CustomSelect/CustomSelect';

const reviewSummary = {
  averageRating: 4.9,
  totalReviews: 67,
  ratingDistribution: [
    { stars: 5, count: 60 },
    { stars: 4, count: 5 },
    { stars: 3, count: 2 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

const initialReviews = [
  {
    id: 1,
    clientName: 'Alex Thompson',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256',
    date: '2025-09-08',
    rating: 5,
    comment: 'Attorney Chen was incredibly helpful and professional. He explained everything clearly and made a stressful situation much more manageable. Highly recommended!',
  },
  {
    id: 2,
    clientName: 'Jessica Tan',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256',
    date: '2025-09-05',
    rating: 5,
    comment: 'Excellent service. Robert was very thorough in reviewing my business contract and provided valuable insights. The whole process was seamless.',
  },
  {
    id: 3,
    clientName: 'Michael Wong',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256',
    date: '2025-09-02',
    rating: 4,
    comment: 'Good experience overall. A bit of a delay in getting the final documents, but the quality of work was high.',
  },
];

const ReviewStats = ({ summary }) => (
  <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex flex-col items-center">
        <p className="text-[var(--accent-color)] text-6xl font-bold">{summary.averageRating.toFixed(1)}</p>
        <div className="mt-2 flex flex-row">
          {renderRating(summary.averageRating)}
        </div>
        <p className="text-gray-400 mt-2 text-sm">Based on {summary.totalReviews} reviews</p>
      </div>
      <div className="flex-1 w-full">
        {summary.ratingDistribution.map((item) => {
            const percentage = summary.totalReviews > 0 ? (item.count / summary.totalReviews) * 100 : 0;
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
);

const ReviewCard = ({ review }) => {
    const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    return (
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-black/20 border border-white/10 rounded-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
        <img alt={review.clientName} className="flex-shrink-0 w-16 h-16 rounded-full object-cover" src={review.avatarUrl} />
        <div className="flex flex-col gap-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[var(--accent-color)] text-lg font-bold leading-tight">{review.clientName}</p>
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
    const [reviews, setReviews] = useState(initialReviews);

    const options = [
        {label: "Newest First", value: "newest"},
        {label: "Oldest First", value: "oldest"},
        {label: "Highest Rating", value: "highest"},
        {label: "Lowest Rating", value: "lowest"}
    ];

    const sortedReviews = useMemo(() => {
        const sorted = [...initialReviews];
        switch (sortBy) {
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'highest':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'newest':
            default:
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }, [sortBy]);

    useEffect(() => {
        setReviews(sortedReviews);
    }, [sortedReviews]);

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
            <div className="relative">
              <CustomSelect options={options} value={sortBy} onChange={(e) => setSortBy(e.target.value)}/>
            </div>
          </div>
        </div>
        
        <ReviewStats summary={reviewSummary} />

        <div className="flex flex-col gap-6">
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default Reviews;