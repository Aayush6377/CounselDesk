import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'General',
    items: [
      {
        id: 'g1',
        question: 'What is CounselDesk?',
        answer: 'CounselDesk is a platform designed to make legal assistance more accessible. We offer an AI-powered chatbot for instant legal information and a directory to connect you with experienced lawyers for personalized advice.',
      },
      {
        id: 'g2',
        question: 'Who can use CounselDesk?',
        answer: 'CounselDesk is for everyone. Whether you\'re an individual with a legal question, a business seeking guidance, or a lawyer looking to expand your reach, our platform has tools and resources for you.',
      },
    ],
  },
  {
    category: 'For Users',
    items: [
      {
        id: 'u1',
        question: "Is the AI chatbot's advice legally binding?",
        answer: "No. The information provided by our AI chatbot is for informational purposes only and does not constitute legal advice. It's a great starting point, but for specific legal issues, we strongly recommend consulting with a qualified lawyer from our directory.",
      },
      {
        id: 'u2',
        question: 'How do I connect with a lawyer?',
        answer: 'You can browse our Lawyer Directory, filter by specialization and location, view profiles, and book appointments directly through the platform. You need to sign up for a premium plan to access the full directory and scheduling features.',
      },
      {
        id: 'u3',
        question: 'Is my information secure and confidential?',
        answer: 'Absolutely. We prioritize your privacy and use end-to-end encryption for all communications. Your conversations with the chatbot and registered lawyers are secure and confidential.',
      },
    ],
  },
  {
    category: 'For Lawyers',
    items: [
      {
        id: 'l1',
        question: 'How can I register as a lawyer on CounselDesk?',
        answer: "Lawyers interested in joining our platform can apply through our 'For Lawyers' page. You will need to provide your credentials and go through a verification process to ensure the quality and integrity of our directory.",
      },
      {
        id: 'l2',
        question: 'What are the benefits of joining CounselDesk?',
        answer: 'By joining CounselDesk, you gain access to a broad client base, a secure platform for consultations, and tools to manage your appointments and client communications efficiently. It\'s a modern way to grow your practice.',
      },
    ],
  },
];

const AccordionItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="group bg-[#2D2D2D] rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#3E3E3E]">
      <div className="flex items-center justify-between p-6" onClick={onClick}>
        <h3 className="text-lg font-medium text-white">{item.question}</h3>
        <FaPlus className={`text-gray-400 group-hover:text-[var(--primary-color)] transition-transform duration-300 ${isOpen ? 'transform rotate-45' : ''}`} />
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-6 pb-6 text-gray-400">{item.answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId(openId === id ? null : id);
    };

  return (
    <main className="flex-1 bg-[var(--secondary-color)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl tracking-[-0.033em]">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-400">Find answers to common questions about CounselDesk.</p>
        </div>

        <div className="mt-12 space-y-10">
          {faqData.map((section, sectionIndex) => (
            <div key={section.category}>
              <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-6" style={{ animationDelay: `${0.2 + sectionIndex * 0.3}s` }}>
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                    <AccordionItem 
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onClick={() => handleToggle(item.id)}
                    />
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-16" style={{ animationDelay: '1.1s' }}>
            <h3 className="text-xl font-semibold text-white">Still have questions?</h3>
            <p className="text-gray-400 mt-2">If you can't find the answer you're looking for, feel free to reach out to our support team.</p>
            <Link to="../contact" className="mt-6 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg mx-auto">
              <span className="truncate">Contact Support</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQ;