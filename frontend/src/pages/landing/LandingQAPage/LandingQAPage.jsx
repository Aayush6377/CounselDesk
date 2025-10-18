import React from 'react';
import { Link } from 'react-router-dom';
import { MdEditNote, MdGavel, MdNotificationsActive, MdHelpOutline, MdLockPerson } from 'react-icons/md';

const exampleQuestions = [
    {
        id: 1,
        question: 'What are the first steps to take after a minor car accident?',
        askedBy: 'a user',
        date: '2 days ago',
        answer: {
            text: "First, ensure everyone is safe and call for medical help if needed. Exchange insurance and contact information with the other driver. It's crucial to take photos of the damage and the scene. Avoid admitting fault. Report the accident to your insurance company promptly. Consulting with a personal injury lawyer can also be beneficial to understand your rights and options.",
            lawyer: {
                name: 'John Doe, Esq.',
                specialization: 'Verified Personal Injury Lawyer',
                avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=256'
            }
        }
    },
    {
        id: 2,
        question: 'Can my landlord increase my rent without notice?',
        askedBy: 'a user',
        date: '5 days ago',
        answer: {
            text: "Generally, landlords are required to provide written notice before increasing rent. The notice period varies by state and the terms of your lease agreement. For a month-to-month lease, it's typically 30 days. For a fixed-term lease, the rent usually cannot be increased until the lease expires. Review your lease and local landlord-tenant laws for specific requirements.",
            lawyer: {
                name: 'Jane Smith, Esq.',
                specialization: 'Verified Real Estate Lawyer',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256'
            }
        }
    }
];

const LandingQAPage = () => {
    return (
        <main className="flex-1">
            <section className="py-20 px-4 text-center bg-[var(--secondary-color)] pt-15">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-white tracking-[-0.033em] leading-tight animate-slideInUp">Legal Q&A Community</h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto animate-slideInUp">
                        Have a legal question? Get it answered by our community of verified lawyers. Clear, concise, and trustworthy answers to help you navigate your legal issues.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4 bg-[#212121]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-slideInUp stagger-1">
                        <h2 className="text-4xl font-extrabold text-white tracking-[-0.033em]">How It Works</h2>
                        <p className="mt-3 text-lg text-gray-400">A simple process to get your legal questions answered.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10">
                        <HowItWorksCard icon={<MdEditNote size={32} />} title="1. Ask Your Question" text="Simply type out your legal query. Be as detailed as possible to get the most accurate answer." delay="stagger-2" />
                        <HowItWorksCard icon={<MdGavel size={32} />} title="2. Lawyers Respond" text="Verified lawyers review your question and provide clear, insightful answers based on their expertise." delay="stagger-3" />
                        <HowItWorksCard icon={<MdNotificationsActive size={32} />} title="3. Get Notified" text="You'll be notified as soon as your question is answered. Review and get the clarity you need." delay="stagger-4" />
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-[var(--secondary-color)]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16 animate-slideInUp">
                        <h2 className="text-4xl font-extrabold text-white tracking-[-0.033em]">Example Questions & Answers</h2>
                        <p className="mt-3 text-lg text-gray-400">See how our community helps users like you.</p>
                    </div>
                    <div className="space-y-8">
                        {exampleQuestions.map((item, index) => (
                            <ExampleQACard key={item.id} item={item} delay={`stagger-${index + 1}`} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#212121] py-20 px-4">
                <div className="max-w-4xl mx-auto text-center animate-scaleIn">
                    <div className="flex justify-center items-center mb-6">
                        <MdLockPerson className="text-6xl text-[var(--primary-color)]" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-[-0.033em]">Ready to Get Your Questions Answered?</h2>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Join our community to ask your own legal questions and get personalized insights from experienced lawyers. It's free to sign up!</p>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-amber-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg">
                            <span className="truncate">Ask a Question</span>
                        </Link>
                        <Link to="/signup" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-transparent border-2 border-[var(--primary-color)] text-[var(--primary-color)] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300 transform hover:scale-110">
                            <span className="truncate">Sign Up Now</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

const HowItWorksCard = ({ icon, title, text, delay }) => (
    <div className={`flex flex-col items-center text-center p-8 bg-[#2D2D2D] rounded-xl border border-transparent hover:border-[var(--primary-color)] transition-all duration-300 transform hover:-translate-y-2 animate-slideInUp ${delay}`}>
        <div className="flex items-center justify-center size-16 bg-amber-900/50 text-[var(--accent-color)] rounded-full mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{text}</p>
    </div>
);

const ExampleQACard = ({ item, delay }) => (
    <div className={`bg-[#2D2D2D] p-8 rounded-lg shadow-lg animate-slideInUp ${delay}`}>
        <div className="mb-4">
            <h3 className="text-xl font-bold text-[var(--accent-color)] flex items-center gap-3">
                <MdHelpOutline />
                <span>{item.question}</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">Asked by {item.askedBy} {item.date}</p>
        </div>
        <div className="border-l-4 border-[var(--primary-color)] pl-6 mt-6">
            <p className="text-gray-300 mb-4">"{item.answer.text}"</p>
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${item.answer.lawyer.avatar}')` }}></div>
                <div>
                    <p className="font-bold text-white">{item.answer.lawyer.name}</p>
                    <p className="text-sm text-[var(--primary-color)]">{item.answer.lawyer.specialization}</p>
                </div>
            </div>
        </div>
    </div>
);


export default LandingQAPage;
