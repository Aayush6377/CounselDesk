import React from 'react';
import { Link } from 'react-router-dom';

const disclaimerData = [
  {
    title: '1. No Legal Advice',
    content: (
      <>
        <p>The information provided by the CounselDesk AI chatbot and through our website content is for informational purposes only. It is not intended to be, and should not be construed as, legal advice on any subject matter. The information provided is general in nature and may not apply to your specific circumstances.</p>
        <p>You should not act or refrain from acting on the basis of any information provided by CounselDesk without seeking appropriate legal or other professional advice on the particular facts and circumstances at issue from a licensed attorney in your jurisdiction.</p>
      </>
    )
  },
  {
    title: '2. No Attorney-Client Relationship',
    content: (
      <>
        <p>Your use of the CounselDesk platform, including interacting with the AI chatbot or browsing the lawyer directory, does not create an attorney-client relationship between you and CounselDesk, or between you and any lawyer affiliated with our platform.</p>
        <p>An attorney-client relationship is only formed when you have signed a formal engagement agreement with a lawyer you connect with through our service. Any information you provide to the platform prior to such an engagement may not be protected by attorney-client privilege.</p>
      </>
    )
  },
  {
    title: '3. Lawyer Directory and Vetting',
    content: (
      <>
        <p>CounselDesk provides a directory of lawyers for your convenience. While we strive to include qualified professionals, we do not endorse, guarantee, or warrant the services of any lawyer listed on our platform.</p>
        <h3>We are not responsible for:</h3>
        <ul>
          <li>The quality, accuracy, or legality of the legal services provided by any lawyer.</li>
          <li>The professional qualifications or licensure of any lawyer listed.</li>
          <li>Any disputes that may arise between you and a lawyer you connect with through CounselDesk.</li>
        </ul>
        <p>It is your sole responsibility to conduct your own due diligence and to choose a lawyer that is right for your needs.</p>
      </>
    )
  },
  {
    title: '4. Limitation of Liability',
    content: (
      <p>
        CounselDesk, its owners, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the platform or any information provided therein. This includes, but is not limited to, reliance on information from the AI chatbot, issues arising from appointments made through the platform, or any other interaction with the services provided.
      </p>
    )
  },
  {
    title: '5. Acknowledge and Agreement',
    content: (
      <p>
        By using CounselDesk, you acknowledge that you have read this disclaimer, understand it, and agree to be bound by its terms. You understand that legal matters are serious and that you should consult with a qualified attorney for advice regarding your individual situation. For more detailed information, please review our <Link to="../terms">Terms of Service</Link>.
      </p>
    )
  }
];

const Disclaimer = () => {
  return (
    <main className="flex-1 bg-[var(--secondary-color)] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto bg-[#2D2D2D] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#3E3E3E] animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Disclaimer</h1>
          <p className="mt-4 text-lg text-gray-400">Last updated: September 11, 2025</p>
        </div>
        
        <div className="space-y-12">
          {disclaimerData.map(section => (
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

export default Disclaimer;