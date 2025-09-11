import React from 'react';
import { Link } from 'react-router-dom';


const termsData = [
  {
    title: '1. Acceptance of Terms',
    content: (
      <p>
        By accessing or using the CounselDesk platform and its services, you agree to be bound by these Terms of Service and our <Link to="../privacy">Privacy Policy</Link>. If you do not agree to these terms, you may not use our services. These terms apply to all users, including visitors, registered users, and lawyers.
      </p>
    )
  },
  {
    title: '2. Description of Service',
    content: (
      <>
        <p>CounselDesk provides a platform for users to get legal information from an AI-powered chatbot and to connect with registered lawyers for appointments and legal assistance. The platform is intended for informational purposes and to facilitate professional connections.</p>
        <h3>Key Features:</h3>
        <ul>
          <li><strong>AI Chatbot:</strong> Provides general information on legal topics. <strong>This is not legal advice.</strong></li>
          <li><strong>Lawyer Directory:</strong> A curated list of registered legal professionals available for consultation.</li>
          <li><strong>Appointment Scheduling:</strong> Tools to book appointments with lawyers based on their availability.</li>
        </ul>
      </>
    )
  },
  {
    title: '3. User Responsibilities',
    content: (
      <>
        <p>You are responsible for your use of the CounselDesk platform and for any content you provide, including compliance with applicable laws, rules, and regulations.</p>
        <h3>You agree not to:</h3>
        <ul>
          <li>Misuse our services by interfering with their normal operation, or attempting to access them using a method other than through the interfaces and instructions that we provide.</li>
          <li>Circumvent or attempt to circumvent any limitations that CounselDesk imposes on your account.</li>
          <li>Probe, scan, or test the vulnerability of any system or network.</li>
          <li>Use the platform for any illegal or unauthorized purpose.</li>
        </ul>
      </>
    )
  },
  {
    title: '4. No Attorney-Client Privilege',
    content: (
      <p>
        Interactions with the AI chatbot do not constitute legal advice and do not create an attorney-client relationship. An attorney-client relationship is only formed when you have formally engaged a lawyer from our directory through a separate agreement. Communications on the CounselDesk platform before this formal engagement may not be protected by attorney-client privilege.
      </p>
    )
  },
  {
    title: '5. Disclaimers and Limitation of Liability',
    content: (
      <>
        <p>CounselDesk provides its service on an "as is" and "as available" basis. We do not make any warranties, express or implied, regarding the accuracy, reliability, or completeness of the information provided by the AI chatbot or the qualifications of the lawyers listed in our directory.</p>
        <p>To the fullest extent permitted by law, CounselDesk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of our platform.</p>
      </>
    )
  },
  {
    title: '6. Intellectual Property',
    content: (
      <p>
        All content and materials available on CounselDesk, including but not limited to text, graphics, website name, code, images, and logos are the intellectual property of CounselDesk and are protected by applicable copyright and trademark law. Any inappropriate use, including but not limited to the reproduction, distribution, display or transmission of any content on this site is strictly prohibited, unless specifically authorized by CounselDesk.
      </p>
    )
  },
  {
    title: '7. Termination',
    content: (
      <p>
        We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease.
      </p>
    )
  },
  {
    title: '8. Governing Law & Contact',
    content: (
      <p>
        These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. If you have any questions about these Terms, please <Link to="../contact">contact us</Link>.
      </p>
    )
  }
];

const TermsOfService = () => {
  return (
    <main className="flex-1 bg-[var(--secondary-color)] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto bg-[#2D2D2D] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#3E3E3E] animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-400">Last updated: September 11, 2025</p>
        </div>
        
        <div className="space-y-12">
          {termsData.map(section => (
            <section key={section.title}>
              <h2 className="text-[var(--primary-color)] text-3xl font-bold mb-4 pb-2 border-b border-[#3E3E3E]">{section.title}</h2>
              <div className="prose prose-invert max-w-none text-gray-300 [&_h3]:text-[var(--accent-color)] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-[var(--primary-color)] [&_a]:no-underline [&_a:hover]:text-[var(--accent-color)] [&_a]:border-b [&_a]:border-dotted [&_a]:border-[var(--primary-color)] [&_a:hover]:border-[var(--accent-color)]">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;