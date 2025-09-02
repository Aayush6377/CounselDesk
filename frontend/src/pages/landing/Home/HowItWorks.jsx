import { images } from "../../../assets/assets";

const HowItWorks = () => {
  const data = [
    {
      step: "Chat with Our AI Assistant",
      description: "Start by chatting with our AI assistant to get instant answers to your legal questions and understand your options.",
      image: images.howItWorks1
    },
    {
      step: "Connect with a Lawyer",
      description: "Browse our lawyer directory, filter by specialization, and connect with a lawyer who matches your needs.",
      image: images.howItWorks2
    },
    {
      step: "Get Expert Advice",
      description: "Schedule a consultation and receive expert advice tailored to your specific legal situation.",
      image: images.howItWorks3
    }
  ];

  return (
    <section className="bg-[var(--secondary-color)] py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-16"> 
        <div className="flex flex-col gap-4 text-center mx-auto animate-slideInUp">
          <h2 className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em] max-w-2xl">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg font-normal leading-normal max-w-3xl">
            Our platform simplifies the process of getting legal help, making it accessible and efficient.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          { data.map((cur,index) => (
            <div key={index} className="flex flex-col gap-4 bg-[#2D2D2D] p-6 rounded-lg shadow-lg animate-slideInUp stagger-1 transform transition-transform duration-300 hover:scale-105">
              <div 
                className="w-full aspect-video bg-cover bg-center bg-no-repeat rounded-lg shadow-md" 
                style={{ backgroundImage: `url(${cur.image})` }} 
              ></div>
              <div>
                <h3 className="text-white text-lg font-bold leading-normal">{`${index+1} ${cur.step}`}</h3>
                <p className="text-gray-400 text-sm font-normal leading-normal">{cur.description}</p>
              </div>
            </div>
          )) }
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;