import ActiveSubscriptionView from './ActiveSubscriptionView';
import PricingCard from './PricingCard';
import { useStore } from '../../../hooks/useStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlansData, createSubscriptionCheckoutSession, cancelSubscription } from '../../../services/lawyer.service';
import Loader from '../../../components/Loader/Loader';
import createTitleFromStatus from '../../../utils/createTitleFromStatus';
import Error from '../../../components/Error/Error';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const Subscription = () => {
  const { userDetails, setUserDetails } = useStore();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: plansData, isLoading, isError, error } = useQuery({
    queryKey: ["SubscriptionPlansData"],
    queryFn: getPlansData
  });

  const pricingPlans = plansData?.data;

  const { mutate: upgrade } = useMutation({
    mutationFn: (planId) => {
      setIsRedirecting(true);
      return createSubscriptionCheckoutSession(planId);
    },
    onSuccess: (res) => {
        if (res.url) {
            window.location.href = res.url;
        } else {
            toast.error("Could not initiate payment session.");
            setIsRedirecting(false);
        }
    },
    onError: (err) => {
        toast.error(err.response?.data?.message || "Payment initiation failed. Please try again.");
        setIsRedirecting(false);
    }
  });

  const handleUpgrade = (planId) => {
    upgrade(planId);
  };

  //cancel subscription
  const { mutate: cancel, isPending: isCancelling } = useMutation({
      mutationFn: cancelSubscription,
      onSuccess: () => {
          toast.success("Subscription successfully cancelled");
          queryClient.invalidateQueries({ queryKey: ["activeSubscriptionDetails"] });
          setIsModalOpen(false);
          setUserDetails((prev) => ({...prev, subscription: {...prev.subscription, plan: "Free", status: "canceled"}}));
      },
      onError: (err) => {
          toast.error(err.response?.data?.message || "Appointment cancellation failed");
          setIsModalOpen(false);
      }
  });

  const handleConfirmCancel = () => {
      cancel();
  };

  if (isLoading){
      return <Loader />;
  }

  if (isError){
      const errorCode = error.response?.data?.status || 500;
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      const errorTitle = createTitleFromStatus(errorCode);

      return <Error errorCode={errorCode} title={errorTitle} message={errorMessage} />
  }
  
  return (
    <main className="bg-[var(--secondary-color)] px-4 sm:px-10 lg:px-24 xl:px-40 flex flex-1 justify-center py-8 pt-15">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8 animate-fadeIn">
        {userDetails?.subscription?.status === "active" || userDetails?.subscription?.status === "canceled" ? (
            <ActiveSubscriptionView setIsModalOpen={setIsModalOpen}/>
        ) : (
            <>
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-[var(--accent-color)] tracking-tight text-4xl md:text-5xl font-bold leading-tight">Subscription Management</h1>
                    <p className="text-gray-400 mt-2 text-lg">Upgrade your plan for enhanced visibility and more client connections.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                    {pricingPlans.map((plan, index) => (
                        <PricingCard key={index} plan={plan} onUpgrade={handleUpgrade} isRedirecting={isRedirecting}/>
                    ))}
                </div>
            </>
        )}
      </div>
        <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmCancel}
            title="Cancel Subscription"
            message="Are you sure you want to cancel your subscription? Your premium benefits will remain active until the end of your current billing period."
            confirmText="Yes, Cancel Subscription"
            isConfirming={isCancelling}
        />
    </main>
  );
};

export default Subscription;