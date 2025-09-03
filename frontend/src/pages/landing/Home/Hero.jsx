import { Link } from "react-router-dom";
import { images } from "../../../assets/assets";
import { MdOutlineSmartToy } from "react-icons/md";
import { VscLaw } from "react-icons/vsc";
import { FaShieldAlt } from "react-icons/fa";
import { RotatingText } from "../../../components/ui/shadcn-io/rotating-text";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState } from "react";

const Hero = () => {
  const symbols = [
    {
      title: "AI-Powered Chatbot",
      description: "Our chatbot offers 24/7 instant legal guidance, answering your questions and providing preliminary advice.",
      icon: <MdOutlineSmartToy />
    },
    {
      title: "Verified Lawyer Directory",
      description: "Browse our directory of registered lawyers, verified for their expertise and experience in various legal fields.",
      icon: <VscLaw />
    },
    {
      title: "Secure & Confidential",
      description: "Your privacy is our priority. We ensure secure and confidential communication throughout your legal journey.",
      icon: <FaShieldAlt />
    }
  ];

  const rotatingPhrases = [
    'Your Legal Journey Starts Here',
    'Chat with Our AI Assistant',
    'Book a Consultation with a Lawyer',
    'Clear Answers to Complex Questions',
    'Connect with the Right Legal Expert',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    images.ladyJustice,
    images.chatbot, 
    images.lawyerMeeting,
    images.legalDocs,
    images.connection,
  ];

  return (
    <>
      <section className="bg-[var(--secondary-color)] py-20 px-4">
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 md:flex-row max-w-7xl mx-auto">
          {/* Left Side: Text Content */}
          <div className="flex flex-col gap-4 text-center md:text-left z-10 md:w-1/2">
            <h1 className="text-white text-5xl font-extrabold leading-tight tracking-[-0.033em] md:text-6xl animate-slideInUp">
              <RotatingText 
                text={rotatingPhrases}
                duration={3000}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </h1>
            <p className="text-gray-400 text-lg font-normal leading-normal max-w-2xl animate-slideInUp stagger-1">
              Get instant legal assistance from our AI chatbot and connect with experienced lawyers for personalized advice.
            </p>
            <Link
              to="/chatbot"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg z-10 mt-4 self-center md:self-start animate-slideInUp stagger-2"
            >
              <span className="truncate">Get Started</span>
            </Link>
          </div>

          {/* Right Side: Image */}
          <div className="relative md:w-1/2 flex justify-center items-center z-10 animate-scaleIn">
            <Carousel
              showArrows={false}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={3000} 
              stopOnHover={false}
              selectedItem={currentSlide}
              onChange={(index) => setCurrentSlide(index)}
              className="w-full max-w-md h-auto rounded-lg shadow-2xl"
            >
              {carouselImages.map((imageSrc, index) => (
                <div key={index}>
                  <img
                    alt={rotatingPhrases[index]}
                    className="w-full h-auto rounded-lg object-cover object-center"
                    src={imageSrc}
                  />
                  <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Why Choose LegalAssist? Section */}
      <section className="flex flex-col gap-16 px-4 py-20 @container bg-[var(--secondary-color)]">
        <div className="flex flex-col gap-4 text-center mx-auto animate-slideInUp">
          <h2 className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em] max-w-2xl">
            Why Choose CounselDesk?
          </h2>
          <p className="text-gray-400 text-lg font-normal leading-normal max-w-3xl">
            We provide a comprehensive platform for all your legal needs, from initial inquiries to professional consultations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          { symbols.map((cur,index) => (
            <div key={index} className="flex flex-col gap-4 items-center text-center p-6 rounded-lg bg-[#2D2D2D] border border-[#3E3E3E] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[var(--primary-color)] animate-slideInUp stagger-1">
              <div className="flex items-center justify-center size-12 bg-amber-900 text-[var(--accent-color)] rounded-full transition-transform duration-300 hover:rotate-12">
                <span className="material-symbols-outlined">{cur.icon}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-lg font-bold leading-tight">{cur.title}</h3>
                <p className="text-gray-400 text-sm font-normal leading-normal">{cur.description}</p>
            </div>
          </div>
          )) }
        </div>
      </section>
    </>
  );
};

export default Hero;