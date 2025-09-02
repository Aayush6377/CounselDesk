import Hero from "./Hero";
import LawyerDirectoryCTA from "./LawyerDirectoryCTA";
import HowItWorks from "./HowItWorks";
import PricingPlans from "./PricingPlans";

const Home = () => {
    return (
        <main className="w-full">
            <Hero />
            <LawyerDirectoryCTA />
            <HowItWorks />
            <PricingPlans />
        </main>
    )
}

export default Home;
