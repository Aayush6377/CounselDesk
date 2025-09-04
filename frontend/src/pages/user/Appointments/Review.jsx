import React, { useState } from 'react';
import './ReviewComponent.css';
import { IoStar } from "react-icons/io5";

const ReviewComponent = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log({ rating, reviewText });
    alert('Thank you for your review!');
    // Reset the form
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-[var(--accent-color)] mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmitReview} className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block">Your Rating</label>
          <div className="star-rating flex flex-row-reverse justify-end items-center gap-1 text-gray-500">
            {[5, 4, 3, 2, 1].map((star) => (
              <React.Fragment key={star}>
                <input
                  className="hidden"
                  id={`star${star}`}
                  name="rating"
                  type="radio"
                  value={star}
                  checked={rating === star}
                  onChange={handleRatingChange}
                />
                <label
                  className="material-symbols-outlined text-4xl"
                  htmlFor={`star${star}`}
                  style={{ color: rating >= star ? 'var(--primary-color)' : 'inherit' }}
                >
                  <IoStar />
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400 mb-2 block" htmlFor="review-text">
            Your Review
          </label>
          <textarea
            className="py-4 px-2 form-textarea w-full resize-none rounded-lg text-[var(--accent-color)] focus:outline-0 focus:ring-2 focus:ring-[var(--primary-color)] border-none bg-black/30 placeholder:text-[#9dabb9] text-base font-normal leading-normal transition-all duration-300"
            id="review-text"
            name="review-text"
            placeholder="Share your experience with the lawyer..."
            rows="4"
            value={reviewText}
            onChange={handleReviewTextChange}
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto py-2 px-6 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-base font-bold cursor-pointer"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewComponent;