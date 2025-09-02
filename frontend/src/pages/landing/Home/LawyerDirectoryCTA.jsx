import { Link } from "react-router-dom";

const LawyerDirectoryCTA = () => {
  return (
    <section className="bg-[var(--secondary-color)]">
      <div className="flex flex-col justify-center items-center gap-6 px-4 py-20 text-center animate-slideInUp max-w-7xl mx-auto">
        <h2 className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em] max-w-2xl">
          Find the Right Lawyer for Your Needs
        </h2>
        <p className="text-gray-400 text-lg font-normal leading-normal max-w-3xl">
          Connect with experienced lawyers specializing in various legal areas. Schedule consultations and get personalized advice.
        </p>
        <Link
          to="/lawyers"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
        >
          <span className="truncate">Explore Lawyer Directory</span>
        </Link>
      </div>
    </section>
  );
};

export default LawyerDirectoryCTA;