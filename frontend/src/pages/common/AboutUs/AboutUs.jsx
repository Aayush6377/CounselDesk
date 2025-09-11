import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { developers } from '../../../assets/assets';

const teamData = [
   {
    name: 'Sushil Gupta',
    role: 'Backend Developer',
    bio: 'Sushil is instrumental in developing the secure and powerful server-side logic of CounselDesk. He excels in database management and API development, guaranteeing the platform\'s integrity and performance.',
    imageUrl: developers.sushil,
    social: {
      github: 'https://github.com/SGgithub001',
      linkedin: 'https://www.linkedin.com/in/sushil-gupta-157b03250',
    },
  },
  {
    name: 'Sankit Singhal',
    role: 'Backend Developer',
    bio: 'Sankit architects the robust and scalable backend systems that power CounselDesk. His focus on clean, efficient code ensures that our platform runs smoothly and reliably for all our users.',
    imageUrl: developers.sankit,
    social: {
      github: 'https://github.com/SankitSinghal',
      linkedin: 'https://www.linkedin.com/in/sankit-singhal-604275254',
    },
  },
  {
    name: 'Aayush Kukreja',
    role: 'Frontend Developer & UI Designer',
    bio: 'Aayush is the creative mind behind CounselDesk\'s user interface. He specializes in crafting intuitive, user-friendly experiences and brings the platform to life with his keen eye for design and frontend expertise.',
    imageUrl: developers.aayush, 
    social: {
      github: 'https://github.com/Aayush6377',
      linkedin: 'https://www.linkedin.com/in/aayush-kukreja-b5885324a',
    },
  },
  {
    name: 'Rahul',
    role: 'AI Research & Development',
    bio: 'Rahul leads our research and development efforts, focusing on the AI that makes CounselDesk unique. His work in legal tech research ensures our platform stays innovative and provides intelligent solutions.',
    imageUrl: developers.rahul,
    social: {
      github: 'rahul',
      linkedin: 'https://www.linkedin.com/in/rahulmandal2002',
    },
  },
];


const TeamMemberCard = ({ member }) => (
  <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--secondary-color)] p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
    <div className="flex-shrink-0 glow-effect rounded-full">
      <img 
        src={member.imageUrl} 
        alt={member.name} 
        className="w-48 h-48 object-cover rounded-full border-4 border-[var(--primary-color)]" 
      />
    </div>
    <div className="text-center md:text-left">
      <h4 className="text-2xl font-bold text-white">{member.name}</h4>
      <p className="text-[var(--primary-color)] text-lg font-medium mb-2">{member.role}</p>
      <p className="text-gray-400 mb-4 text-justify">{member.bio}</p>
      <div className="flex justify-center md:justify-start gap-4 mt-4">
        <Link to={member.social.github} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] text-3xl hover:text-[var(--primary-color)]">
          <FaGithub />
        </Link>
        <Link to={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-color)] text-3xl hover:text-[var(--primary-color)]">
          <FaLinkedin />
        </Link>
      </div>
    </div>
  </div>
);


const AboutUs = () => {
  return (
    <main className="flex-1 bg-[var(--secondary-color)]">
      <section className="py-20 px-4 sm:px-10 animate-fadeIn">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold tracking-tighter text-white mb-4">Meet the Team</h2>
          <p className="text-lg text-[var(--accent-color)] max-w-3xl mx-auto">
            We are a team of four passionate developers dedicated to making legal assistance accessible to everyone through CounselDesk. Our diverse skills and shared commitment to innovation drive us to create solutions that empower individuals and communities.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-10 bg-[#1F1E1C] animate-fadeIn">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold tracking-tighter text-white mb-12 text-center">Our Developers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamData.map(member => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;