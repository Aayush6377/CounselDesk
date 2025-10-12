import React, { useEffect, useState } from 'react';
import './ReviewComponent.css';
import { IoStar } from "react-icons/io5";
import { addReview, getReviewDetails, updateReview } from '../../../services/user.service';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const ReviewComponent = () => {
  const { appointmentId } = useParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const queryClient = useQueryClient();

  const { data: review } = useQuery({
    queryKey: ["ReviewDetails", appointmentId],
    queryFn: () => getReviewDetails(appointmentId),
  });

  useEffect(() => {
    if (review){
      setRating(review.data.rating);
      setReviewText(review.data.comment);
    }
  }, [review]);

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const { mutate: add, isPending: isAdding  } = useMutation({
    mutationFn: () => addReview(rating, reviewText, appointmentId),
    onSuccess: () => {
      toast.success("Review added successfully");
      queryClient.invalidateQueries({ queryKey: ["ReviewDetails", appointmentId] });
    },
    onError: (err) => { 
      if (err.response?.data?.errors) {
          toast.error(err.response.data.errors.rating || err.response.data.errors.comment || "Failed to add a review");
      } else {
          toast.error(err?.response?.data?.message || err.message || "Failed to add a review");
      }
    }
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
      mutationFn: (reviewId) => updateReview(rating, reviewText, reviewId),
      onSuccess: () => {
        toast.success("Review updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["ReviewDetails", appointmentId] });
      },
      onError: (err) => { 
        if (err.response?.data?.errors) {
            toast.error(err.response.data.errors.rating || err.response.data.errors.comment || "Failed to add a review");
        } else {
            toast.error(err?.response?.data?.message || err.message || "Failed to update the review");
        }
      }
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (review) {
        update(review.data._id);
    } else {
        add();
    }
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
            disabled={isAdding || isUpdating}
            className="w-full sm:w-auto py-2 px-6 rounded-lg bg-[var(--primary-color)]/80 text-[var(--secondary-color)] hover:bg-[var(--primary-color)] transition-colors text-base font-bold cursor-pointer"
          >
            {(isAdding || isUpdating) ? "Submitting..." : (review ? "Update Review" : "Submit Review")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewComponent;