import { FaRegCheckCircle } from "react-icons/fa";

const ActiveSubscriptionView = ({ onCancel, pricingPlans }) => {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    const formattedRenewalDate = renewalDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    
    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Your Subscription</h1>
                <p className="text-gray-400 mt-2 text-lg">Thank you for being a premium member of CounselDesk.</p>
            </div>
            <div className="mt-12 w-full max-w-4xl bg-black/20 border border-[var(--primary-color)]/50 rounded-xl p-8 glow-effect">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h3 className="text-3xl font-bold text-[var(--primary-color)]">Monthly Plan</h3>
                        <p className="text-gray-300 mt-2">Your subscription is active and providing you with premium benefits.</p>
                    </div>
                    <span className="mt-4 md:mt-0 px-4 py-2 text-sm font-semibold rounded-full bg-[var(--primary-color)] text-[var(--secondary-color)]">Active</span>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xl font-semibold text-[var(--accent-color)] mb-4">Plan Details</h4>
                        <div className="space-y-3 text-gray-300">
                            <p><strong className="font-medium text-white">Cost:</strong> ₹999 / month</p>
                            <p><strong className="font-medium text-white">Renewal Date:</strong> {formattedRenewalDate}</p>
                            <p><strong className="font-medium text-white">Payment Method:</strong> Visa **** 1234</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-[var(--accent-color)] mb-4">Premium Benefits</h4>
                        <ul className="space-y-3">
                            {pricingPlans.find(p => p.id === 'monthly').features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[var(--primary-color)]"><FaRegCheckCircle  /></span>
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8 flex flex-col md:flex-row gap-4">
                    <button onClick={onCancel} className="w-full md:w-auto py-3 px-6 rounded-lg bg-red-600/20 border-2 border-red-500 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300">Cancel Subscription</button>
                </div>
            </div>
        </div>
    )
};

export default ActiveSubscriptionView;