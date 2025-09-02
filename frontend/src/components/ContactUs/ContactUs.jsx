import { useState } from 'react';
import { BiLogoGmail } from "react-icons/bi";
import { IoCall } from "react-icons/io5";
import { IoLocation } from "react-icons/io5";

const contactInfo = [
  {
    icon: <BiLogoGmail />,
    title: 'Email Us',
    description: 'Our team is here to help.',
    link: {
      href: 'mailto:counseldesk_contact@gmail.com',
      text: 'counseldesk_contact@gmail.com'
    }
  },
  {
    icon: <IoCall />,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 5pm.',
    link: {
      href: 'tel:+1234567890',
      text: '+1 (234) 567-890'
    }
  },
  {
    icon: <IoLocation />,
    title: 'Main Office',
    description: 'Sector – 43, Delhi–Surajkund Road Faridabad – 121004 Haryana, India',
    link: {
        href: "",
        text: ""
    }
  }
];

const ContactUs = () => {
    const [formData,setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[var(--secondary-color)] group/design-root overflow-x-hidden font-['Manrope',_'Noto_Sans',_sans-serif]">

      <main className="flex-1 bg-[var(--secondary-color)] py-20 px-4 sm:px-6 lg:px-8 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-slideInUp">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Contact Us</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
              We're here to help. Reach out to us with any questions or inquiries.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="animate-slideInUp stagger-1">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="sr-only" htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="4"
                    className="block w-full bg-[#2D2D2D] border border-[#3E3E3E] rounded-md py-3 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition-colors"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[var(--primary-color)] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--primary-color)] transition-all duration-300 transform hover:scale-105"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            <div className="space-y-12 animate-slideInUp stagger-2">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info,index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                        <span className="material-symbols-outlined text-[var(--primary-color)] text-2xl">{info.icon}</span>
                        </div>
                        <div>
                        <h3 className="text-lg font-semibold text-white">{info.title}</h3>
                        <p className="text-gray-400">{info.description}<br /> <a className="text-[var(--accent-color)] hover:underline" href={info.link.href}>{info.link.text}</a></p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Our Location</h2>
                <div className="rounded-lg overflow-hidden border-2 border-[#3E3E3E] shadow-lg">
                  <iframe 
                    width="100%" 
                    height="200" 
                    frameborder="0" 
                    scrolling="no" 
                    marginheight="0" 
                    marginwidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=77.3195%2C28.4552%2C77.3295%2C28.4652&amp;marker=28.4602%2C77.3245"
                    style={{border: "1px solid black"}}>
                    </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;