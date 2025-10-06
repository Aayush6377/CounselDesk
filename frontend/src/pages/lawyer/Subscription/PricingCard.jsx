import { FaRegCheckCircle } from "react-icons/fa";

const PricingCard = ({ plan, onUpgrade, isRedirecting }) => (
  <div className={`relative flex flex-col bg-black/20 border rounded-xl p-8 transition-transform duration-300 ${
      plan.isPopular 
        ? 'border-[var(--primary-color)]/50 glow-effect' 
        : 'border-white/10 transform hover:scale-105'
  }`}>
    {plan.isPopular && (
      <span className="absolute top-0 right-4 -mt-3 bg-[var(--primary-color)] text-[var(--secondary-color)] px-3 py-1 text-sm font-bold rounded-full">
        Most Popular
      </span>
    )}
    <h3 className={`text-2xl font-bold ${plan.isPopular ? 'text-[var(--primary-color)]' : 'text-[var(--accent-color)]'}`}>
      {plan.title}
    </h3>
    <p className="text-gray-400 mt-2 text-sm">{plan.description}</p>
    <p className="text-4xl font-bold text-white mt-6">
      {plan.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
      <span className="text-lg font-normal text-gray-400"> / {plan.period}</span>
    </p>
    <ul className="space-y-4 mt-8 flex-grow">
      {plan.features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[var(--primary-color)]"><FaRegCheckCircle /></span>
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    {plan.planId === 'free' ? (
      <button disabled className="w-full mt-8 py-3 px-6 rounded-lg bg-gray-700 text-white font-semibold cursor-not-allowed opacity-50">
        Current Plan
      </button>
    ) : (
      <button 
        onClick={() => onUpgrade(plan.planId)}
        className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer duration-300 ${
          plan.isPopular 
            ? 'bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--accent-color)]'
            : 'bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)]'
        }`}
      >
        {isRedirecting ? `Redirecting to Payment...` : `Upgrade to ${plan.title}`}
      </button>
    )}
  </div>
);

export default PricingCard;