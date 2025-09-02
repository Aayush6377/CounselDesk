import { NavLink} from "react-router-dom";
import { lawyers } from "../../../assets/assets"; 
import renderRating from "../../../utils/renderRating";

const LawyersList = () => {
  const isLoggedIn = false; 

  return (
    <main className="flex-1 bg-[var(--secondary-color)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slideInUp">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-[-0.033em]">Our Lawyer Directory</h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Find experienced and verified lawyers specialized in various fields. Create an account to view full profiles and book appointments.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lawyers.map((lawyer, index) => {
            const isLocked = lawyer.subscriptionPlan !== "free" && !isLoggedIn;

            return (
              <div
                key={lawyer._id}
                className={`bg-[#2D2D2D] rounded-lg shadow-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--primary-color)] border border-transparent animate-slideInUp stagger-${index + 1}`}
              >
                <img
                  alt={`${lawyer.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[var(--primary-color)]"
                  src={lawyer.profileImage}
                />
                <h3 className="text-xl font-bold text-white">{lawyer.name}</h3>
                <p className="text-[var(--accent-color)] font-medium">{lawyer.specialization}</p>
                <div className="relative w-full">
                  <div className={`flex items-center justify-center gap-1 mt-2 text-yellow-400 ${isLocked ? 'blur-sm select-none' : ''}`}>
                    {renderRating(lawyer.rating)}
                    <span className="text-gray-400 text-sm ml-1">({lawyer.rating})</span>
                  </div>
                </div>
                
                <div className="relative w-full mt-4 flex-grow">
                  <div className={`${isLocked ? 'blur-sm select-none' : ''}`}>
                    <p className="text-gray-400 mt-4 text-sm flex-grow">{lawyer.bio}</p>
                  </div>
                </div>
                
                <NavLink
                  to={isLocked ? "/login" : `/lawyer/${lawyer._id}`}
                  className="mt-6 w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 bg-[var(--primary-color)] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-colors"
                >
                  {isLocked ? "Log in to view details" : "View Profile"}
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default LawyersList;
