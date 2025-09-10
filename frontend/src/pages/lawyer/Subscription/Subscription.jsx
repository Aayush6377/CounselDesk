import ActiveSubscriptionView from './ActiveSubscriptionView';
import PricingCard from './PricingCard';
import { useStore } from '../../../hooks/useStore';

const pricingPlans = [
  {
    id: 'free',
    title: 'Free',
    description: 'Your current plan',
    price: 0,
    period: 'month',
    features: [
      'Basic profile listing',
      'Limited chatbot interactions',
      'Standard visibility',
    ],
    isCurrent: true,
  },
  {
    id: 'monthly',
    title: 'Monthly',
    description: 'Enhanced features, flexible billing',
    price: 999,
    period: 'month',
    features: [
      'Enhanced profile listing',
      'Priority in search results',
      'Direct appointment booking',
      'Unlimited chatbot interactions',
    ],
    isPopular: true,
  },
  {
    id: 'yearly',
    title: 'Yearly',
    description: 'Best value, maximum visibility',
    price: 9999,
    period: 'year',
    features: [
      'All Monthly plan features',
      'Top-tier search placement',
      'Featured lawyer profile badge',
      '2 months free (vs. Monthly)',
    ],
  },
];

const Subscription = () => {
  const { userDetails, setUserDetails } = useStore();

  const handleUpgrade = (planId) => {
    const plan = pricingPlans.find((plan) => plan.id === planId);
    setUserDetails((prev) => ({...prev, subscription: {...prev.subscription, plan: plan.title, status: "active"}}));
  };

  const handleCancel = () => {
    setUserDetails((prev) => ({...prev, subscription: {...prev.subscription, plan: "Free", status: "expire"}}));
  };
  
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {userDetails.subscription.status === "active" ? (
            <ActiveSubscriptionView onCancel={handleCancel} pricingPlans={pricingPlans}/>
        ) : (
            <>
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Subscription Management</h1>
                    <p className="text-gray-400 mt-2 text-lg">Upgrade your plan for enhanced visibility and more client connections.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                    {pricingPlans.map((plan) => (
                        <PricingCard key={plan.id} plan={plan} onUpgrade={handleUpgrade} />
                    ))}
                </div>
            </>
        )}
      </div>
    </main>
  );
};

export default Subscription;