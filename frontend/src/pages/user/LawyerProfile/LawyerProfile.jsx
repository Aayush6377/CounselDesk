import React from 'react';
import { lawyerProfile } from "../../../assets/assets";
import renderRating from '../../../utils/renderRating';
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationOn, MdEventAvailable } from "react-icons/md";
import { Link } from 'react-router-dom';

const LawyerProfile = () => {

  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-16 xl:px-24 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1400px] flex-1 gap-8 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Section */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-8 flex flex-col items-center text-center">
              <div 
                className="w-40 h-40 bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-[var(--primary-color)] glow-effect" 
                style={{ backgroundImage: `url("${lawyerProfile.profileImage}")` }}>
              </div>
              <h1 className="text-[var(--accent-color)] text-3xl font-bold mt-6">{lawyerProfile.name}</h1>
              <p className="text-[var(--primary-color)] text-lg font-medium">{lawyerProfile.specialization}</p>
              <div className="flex items-center mt-2">
                {renderRating(lawyerProfile.rating)}
                <span className="text-gray-400 text-base ml-2">{lawyerProfile.rating} ({lawyerProfile.reviewsCount} reviews)</span>
              </div>
              <div className="mt-6 w-full space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-2 text-[var(--primary-color)]"><IoMail /></span>
                  <span className="text-gray-300">{lawyerProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2 text-[var(--primary-color)]"><FaPhoneAlt /></span>
                  <span className="text-gray-300">{lawyerProfile.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2 text-[var(--primary-color)] mt-1"><MdLocationOn /></span>
                  <span className="text-gray-300">{lawyerProfile.address.city}, {lawyerProfile.address.state}, {lawyerProfile.address.pincode}</span>
                </div>
              </div>
              <Link to="/user/book-appointment" className="mt-8 w-full flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-12 px-6 bg-[var(--primary-color)] text-[var(--secondary-color)] text-lg font-bold leading-normal tracking-wide hover:bg-[#c0a97c] transition-all duration-300 transform hover:scale-105 glow-effect">
                <span className="truncate">Book Appointment</span>
              </Link>
            </div>

            {/* Details Card */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-6">
              <h2 className="text-[var(--accent-color)] text-xl font-bold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[var(--primary-color)] text-sm font-semibold">Qualifications</p>
                  <p className="text-gray-300">{lawyerProfile.qualification}</p>
                </div>
                <div>
                  <p className="text-[var(--primary-color)] text-sm font-semibold">Consultation Fee</p>
                  <p className="text-gray-300">₹{lawyerProfile.fees} / hour</p>
                </div>
                <div>
                  <p className="text-[var(--primary-color)] text-sm font-semibold">Subscription Plan</p>
                  <p className="text-gray-300">{lawyerProfile.subscriptionPlan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* About Me Section */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-4">About Me</h2>
              <p className="text-gray-300 leading-relaxed">{lawyerProfile.bio}</p>
            </div>

            {/* Availability Section */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Availability</h2>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h3 className="text-gray-300 text-lg font-semibold">Available Dates & Times:</h3>
              </div>
              <div className="space-y-4">
                {lawyerProfile.availability.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-lg p-4">
                    <span className="material-symbols-outlined text-[var(--primary-color)]"><MdEventAvailable /></span>
                    <span className="text-gray-300">{slot.date}</span>
                    <span className="text-gray-400">at</span>
                    <span className="text-[var(--accent-color)] font-semibold">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <h2 className="text-[var(--accent-color)] text-2xl font-bold mb-6">Client Reviews</h2>
              <div className="space-y-6">
                {lawyerProfile.reviews.slice(0,3).map((review, index) => (
                  <React.Fragment key={index}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full flex-shrink-0" style={{ backgroundImage: `url("${review.profileImage}")` }}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[var(--accent-color)] font-semibold">{review.userName}</h4>
                          <span className="text-gray-500 text-sm">{review.date}</span>
                        </div>
                        <div className="flex items-center my-1">
                          {renderRating(review.rating)}
                        </div>
                        <p className="text-gray-400 text-sm">{review.comment}</p>
                      </div>
                    </div>
                    {index < lawyerProfile.reviews.length - 1 && <div className="border-t border-white/10"></div>}
                  </React.Fragment>
                ))}
              </div>
              <button className="mt-6 text-sm text-[var(--primary-color)] hover:text-[var(--accent-color)] transition-colors font-semibold">Show all reviews</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LawyerProfile;
