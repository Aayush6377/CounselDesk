import PLAN from "../models/plan.model.js";

const plansToSeed = [
  {
    planId: 'free',
    title: 'Free',
    description: 'Basic features for getting started on the platform.',
    price: 0,
    period: 'month',
    features: [
      'Basic profile listing',
      'Limited chatbot interactions',
      'Standard visibility',
    ],
    isPopular: false,
    stripePriceId: null,
  },
  {
    planId: 'monthly',
    title: 'Monthly',
    description: 'Enhanced features and priority placement with flexible monthly billing.',
    price: 999,
    period: 'month',
    features: [
      'Enhanced profile listing',
      'Priority in search results',
      'Direct appointment booking',
      'Unlimited chatbot interactions',
    ],
    isPopular: true,
    stripePriceId: 'price_1SFFZgJDfc5c6e7Jy4mcdbby',
  },
  {
    planId: 'yearly',
    title: 'Yearly',
    description: 'Best value for maximum visibility, including a featured badge and significant savings.',
    price: 9999,
    period: 'year',
    features: [
      'All Monthly plan features',
      'Top-tier search placement',
      'Featured lawyer profile badge',
      '2 months free (vs. Monthly)',
    ],
    isPopular: false,
    stripePriceId: 'price_1SFFffJDfc5c6e7J8e3nxV2O',
  },
];

export const seedPlans = async () => {
    try {
        const planCount = await PLAN.countDocuments();

        if (planCount > 0){
            return;
        }

        await PLAN.insertMany(plansToSeed);
        console.log('Successfully seeded plans into the database!');
    } catch (error) {
        console.error(error);
    }
}