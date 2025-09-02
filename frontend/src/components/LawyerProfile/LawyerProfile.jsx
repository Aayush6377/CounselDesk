import { Link } from "react-router-dom";
import { lawyerProfile } from "../../assets/assets";
import renderRating from "../../utils/renderRating";

const LawyerProfile = () => {
    return (
        <div className="relative flex size-full min-h-screen flex-col bg-[var(--secondary-color)] group/design-root overflow-x-hidden font-['Manrope',_'Noto_Sans',_sans-serif]">
            <main className="flex-1 bg-[var(--secondary-color)] py-16 px-4 sm:px-6 lg:px-8 text-gray-300">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-slideInUp">
                        {/* Profile Section */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-6 text-center animate-fadeIn stagger-1">
                                <img
                                    alt="Lawyer Portrait"
                                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-[var(--primary-color)]"
                                    src={lawyerProfile.profileImage}
                                />
                                <h2 className="text-3xl font-bold text-white">{lawyerProfile.name}</h2>
                                <p className="text-[var(--accent-color)] font-medium text-lg mt-1">{lawyerProfile.specialization}</p>
                                <div className="flex items-center justify-center gap-1 mt-3 text-yellow-400">
                                    {renderRating(lawyerProfile.rating)}
                                </div>
                                <div className="mt-6 text-left space-y-3 text-gray-300">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[var(--primary-color)]">Email</span>
                                        <span>{lawyerProfile.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[var(--primary-color)]">Phone</span>
                                        <span>{lawyerProfile.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[var(--primary-color)] mt-1">Location</span>
                                        <span>
                                            {lawyerProfile.address.city}, {lawyerProfile.address.state}, {lawyerProfile.address.pincode}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Fees & Subscription Section */}
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-6 animate-fadeIn stagger-2">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Fees & Subscription</h3>
                                <div className="space-y-3 text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Consultation Fee:</span>
                                        <span className="font-semibold text-white">₹{lawyerProfile.fees} / hour</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Subscription:</span>
                                        <span className="bg-[var(--primary-color)] text-white text-xs font-bold px-2 py-1 rounded-full">{lawyerProfile.subscriptionPlan.toUpperCase()}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 pt-2">
                                        {lawyerProfile.subscriptionPlan} plan members get priority booking and a 15% discount on all services.
                                    </p>
                                </div>
                            </div>
                            {/* Availability Section */}
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-6 animate-fadeIn stagger-3">
                                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Availability</h3>
                                <div className="space-y-3">
                                    {lawyerProfile.availability.map((slot, index) => (
                                        <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                                            <p className="font-semibold text-white">{new Date(slot.date).toDateString()}</p>
                                            <p className="text-sm text-gray-400">{slot.time}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-6 w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-all duration-300 transform hover:scale-105">
                                    <Link to="/login" className="truncate">Book an Appointment</Link>
                                </button>
                            </div>
                        </div>
                        {/* Details Section */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Me */}
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-8 animate-fadeIn stagger-3">
                                <h3 className="text-2xl font-bold text-white mb-4">About Me</h3>
                                <p className="text-gray-300 leading-relaxed">{lawyerProfile.bio}</p>
                            </div>
                            {/* Qualifications */}
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-8 animate-fadeIn stagger-4">
                                <h3 className="text-2xl font-bold text-white mb-6">Qualifications</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[var(--primary-color)] mt-1">School</span>
                                        <div>
                                            <h4 className="font-semibold text-white">Degrees</h4>
                                            <p className="text-gray-400">{lawyerProfile.qualification}</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[var(--primary-color)] mt-1">Gavel</span>
                                        <div>
                                            <h4 className="font-semibold text-white">Specialization</h4>
                                            <p className="text-gray-400">{lawyerProfile.specialization}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            {/* Client Reviews */}
                            <div className="bg-[#2D2D2D] rounded-lg shadow-lg p-8 animate-fadeIn stagger-5">
                                <h3 className="text-2xl font-bold text-white mb-6">Client Reviews</h3>
                                <div className="space-y-6">
                                    {lawyerProfile.reviews.map((review, index) => (
                                        <div key={index} className="border-b border-gray-700 pb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-semibold text-white">{review.userName}</h4>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    {renderRating(review.rating)}
                                                </div>
                                            </div>
                                            <p className="text-gray-300">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LawyerProfile;