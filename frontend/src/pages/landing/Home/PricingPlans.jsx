import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getPlansData } from "../../../services/landing.service";
import Loader from "../../../components/Loader/Loader"
import Error from "../../../components/Error/Error";

const formatPrice = (price, period) => {
    if (price === 0) return "Free";
    const amount = (price).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    });
    return `${amount} / ${period}`;
};


const PricingPlans = () => {
    const { data: result, isLoading, isError } = useQuery({
        queryKey: ['landingPlansData'],
        queryFn: getPlansData,
    });

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <Error title="Could Not Load Plans" message="There was an issue fetching the pricing plans. Please try again later." />;
    }
    
    const pricingData = result?.data;

    return (
        <section className="bg-[var(--secondary-color)] py-20 px-4">
            <div className="max-w-7xl mx-auto flex flex-col gap-16">
                <div className="flex flex-col gap-4 text-center mx-auto animate-slideInUp">
                    <h2 className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em] max-w-2xl">
                        Choose Your Plan
                    </h2>
                    <p className="text-gray-400 text-lg font-normal leading-normal max-w-3xl">
                        Find the perfect plan that fits your legal needs, whether you're a single user or a business.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingData.map((plan, index) => {
                        const isFree = plan.planId === 'free';
                        const buttonText = isFree ? "Get Started" : "Upgrade";
                        const buttonClasses = plan.isPopular 
                            ? "bg-[var(--primary-color)] text-white hover:bg-amber-600 transition-colors"
                            : "bg-gray-700 text-white hover:bg-gray-600 transition-colors";

                        return (
                            <div
                                key={plan.planId}
                                className={`flex flex-1 flex-col gap-6 rounded-lg p-6 shadow-lg animate-slideInUp stagger-${index + 1} transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${
                                    plan.isPopular ? "border-2 border-solid border-[var(--primary-color)] bg-[#2D2D2D] relative" : "border border-solid border-[#3E3E3E] bg-[#2D2D2D]"
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-6 -mt-3">
                                        <p className="text-white text-xs font-semibold leading-normal tracking-wide rounded-full bg-[var(--primary-color)] px-3 py-1 text-center">Popular</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <h3 className={`text-xl font-bold leading-tight ${plan.isPopular ? "text-[var(--primary-color)]" : "text-white"}`}>
                                        {plan.title}
                                    </h3>
                                    <p className="flex items-baseline gap-1 text-white">
                                        <span className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em]">
                                            {formatPrice(plan.price, plan.period)}
                                        </span>
                                    </p>
                                    <p className="text-gray-400 text-sm">{plan.description}</p>
                                </div>
                                <Link 
                                    to="/signup"
                                    className={`flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${buttonClasses}`}
                                >
                                    <span className="truncate">{buttonText}</span>
                                </Link>
                                <div className="flex flex-col gap-3">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm items-center text-gray-300">
                                            <FaCheckCircle className="text-[var(--accent-color)]" /> {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;
