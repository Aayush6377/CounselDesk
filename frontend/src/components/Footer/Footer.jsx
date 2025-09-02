import { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { images } from "../../assets/assets";
import { FaGithub, FaLinkedin, FaFacebookF  } from "react-icons/fa";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

const footerLinks = {
  Services: [
    { name: "AI Legal Chatbot", path: "/chatbot" },
    { name: "Lawyers", path: "/lawyers" },
    { name: "Consultations", path: "/consultations" },
  ],
  "Quick Links": [
    { name: "Pricing Plans", path: "/pricing" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Disclaimer", path: "/disclaimer" },
  ],
};

const socialLinks = {
  github: "#",
  linkedin: "#",
  facebook: "#"
};

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  return (
    <footer className="bg-[var(--secondary-color)] border-t border-[#2D2D2D] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Grid for desktop, flexible for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 sm:gap-y-12 gap-x-8 sm:gap-x-12 text-center sm:text-left">
          {/* Brand & About */}
          <div className="col-span-1">
            <div className="flex justify-center sm:justify-start items-center gap-3 text-white">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-full">
                  <img
                    src={images.logo}
                    alt="CounselDesk logo"
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  CounselDesk
                </h2>
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Your trusted partner in navigating the complexities of the legal
              world. Get instant AI assistance and connect with professional
              lawyers.
            </p>

            {/* Socials */}
            <div className="flex justify-center sm:justify-start space-x-4 mt-6">
              <Link to={socialLinks.github} className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-6 h-6"/>
              </Link>
              <Link to={socialLinks.linkedin} className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-6 h-6"/>
              </Link>
              <Link to={socialLinks.facebook} className="text-gray-400 hover:text-white transition-colors">
                <FaFacebookF className="w-6 h-6"/>
              </Link>
            </div>
          </div>

          {/* Other Columns - Now with better mobile spacing */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <div key={idx} className="col-span-1 w-full">
              {/* Added a toggle button for mobile */}
              <div 
                className="flex justify-between items-center sm:block" 
                onClick={() => toggleSection(title)}
              >
                <h3 className="text-white text-base sm:text-lg font-semibold tracking-wider uppercase cursor-pointer sm:cursor-default">
                  {title}
                </h3>
                <span className="text-gray-400 text-2xl sm:hidden">
                  {openSection === title ? <CiCircleMinus /> : <CiCirclePlus />}
                </span>
              </div>
              
              {/* Conditionally render links for mobile view */}
              <ul className={`mt-4 space-y-2 sm:space-y-3 transition-max-height duration-300 ease-in-out overflow-hidden ${
                openSection === title ? 'max-h-96' : 'max-h-0 sm:max-h-full'
              }`}>
                {links.map((link, i) => (
                  <li key={i} className="text-center sm:text-left">
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-[#2D2D2D] text-center text-gray-500 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} CounselDesk. All rights reserved.</p>
          <p className="mt-2 leading-relaxed">
            Disclaimer: The information provided by our AI is for informational
            purposes only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;