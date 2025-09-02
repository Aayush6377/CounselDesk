import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const pricingData = [
  {
    plan: "Basic",
    price: "Free",
    period: "",
    description: "For individuals with basic legal questions.",
    buttonText: "Get Started",
    buttonLink: "/signup",
    isPopular: false,
    features: [
      "Access to AI Chatbot",
      "Limited Lawyer Directory Access",
    ],
    buttonClasses: "bg-gray-700 text-white hover:bg-gray-600 transition-colors",
  },
  {
    plan: "Premium",
    price: "₹500",
    period: "/month",
    description: "For those needing direct access to lawyers.",
    buttonText: "Upgrade",
    buttonLink: "/signup",
    isPopular: true,
    features: [
      "All features from Basic",
      "Full Lawyer Directory Access",
      "Priority Support",
    ],
    buttonClasses: "bg-[var(--primary-color)] text-white hover:bg-amber-600 transition-colors",
  },
  {
    plan: "Enterprise",
    price: "₹1200",
    period: "/month",
    description: "For firms and organizations.",
    buttonText: "Upgrade",
    buttonLink: "/signup",
    isPopular: false,
    features: [
      "All features from Premium",
      "24/7 Dedicated Support",
      "Customized Solutions",
    ],
    buttonClasses: "bg-gray-700 text-white hover:bg-gray-600 transition-colors",
  },
];

const PricingPlans = () => {
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
          {pricingData.map((plan, index) => (
            <div
              key={plan.plan}
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
                  {plan.plan}
                </h3>
                <p className="flex items-baseline gap-1 text-white">
                  <span className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em]">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 text-base font-medium leading-tight">{plan.period}</span>}
                </p>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>
              <Link 
                to={plan.buttonLink}
                className={`flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] ${plan.buttonClasses}`}
              >
                <span className="truncate">{plan.buttonText}</span>
              </Link>
              <div className="flex flex-col gap-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3 text-sm items-center text-gray-300">
                    <FaCheckCircle className="text-[var(--accent-color)]" /> {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
