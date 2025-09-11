import React from 'react';
import { Link } from 'react-router-dom';

const policyData = [
  {
    title: '1. Introduction',
    content: (
      <>
        <p>Welcome to CounselDesk. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please <Link to="../contact">contact us</Link>.</p>
        <p>This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of the CounselDesk platform.</p>
      </>
    )
  },
  {
    title: '2. Information We Collect',
    content: (
      <>
        <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform or otherwise contact us.</p>
        <h3>Information you provide to us:</h3>
        <ul>
          <li><strong>Account Information:</strong> When you sign up for a CounselDesk account, we require certain information such as your first name, last name, and email address.</li>
          <li><strong>Communications with CounselDesk and Lawyers:</strong> When you communicate with CounselDesk or use the platform to communicate with lawyers, we collect information about your communication and any information you choose to provide. This includes conversations with our AI chatbot.</li>
          <li><strong>Payment Information:</strong> We collect your financial information (like your credit card number and expiration date) when you choose our premium services, but we do not store it on our servers. This is handled by a secure third-party payment processor.</li>
        </ul>
        <h3>Information we automatically collect:</h3>
        <ul>
          <li><strong>Usage Information:</strong> We collect information about your interactions with the platform, such as the pages or content you view, your searches for lawyers, and other actions on the platform.</li>
          <li><strong>Log Data and Device Information:</strong> We automatically collect log data and device information when you access and use the platform, even if you have not created a CounselDesk account or logged in.</li>
        </ul>
      </>
    )
  },
    {
    title: '3. How We Use Your Information',
    content: (
      <>
        <p>We use, store, and process information, including personal information, about you to provide, understand, improve, and develop the CounselDesk platform, create and maintain a trusted and safer environment, and comply with our legal obligations.</p>
        <h3>We use your information to:</h3>
        <ul>
          <li>Enable you to access and use the CounselDesk Platform, including the AI chatbot and lawyer directory.</li>
          <li>Operate, protect, improve, and optimize the CounselDesk Platform and user experience.</li>
          <li>Provide customer service and send you service or support messages, updates, and account notifications.</li>
          <li>For payment processing purposes.</li>
          <li>To comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
      </>
    )
  },
  {
    title: '4. Sharing & Disclosure',
    content: (
        <>
            <p>We do not share your personal information with third parties except as described in this Privacy Policy.</p>
            <h3>We may disclose your information to:</h3>
            <ul>
                <li><strong>Lawyers on the Platform:</strong> When you initiate contact with a lawyer through our platform, we will share relevant information to facilitate the connection. This may include your name and the initial query you provided to the AI chatbot.</li>
                <li><strong>Service Providers:</strong> We may use third-party companies and individuals to help us provide our services, such as payment processing, data analysis, and customer support.</li>
                <li><strong>Legal Compliance:</strong> We may disclose your information if we are required to do so by law or in response to a valid request by a public authority.</li>
            </ul>
        </>
    )
  },
  {
      title: '5. Your Rights',
      content: <p>You have certain rights regarding your personal information. These include the right to access, correct, update, or request deletion of your personal information. You can do this by accessing your account settings or by contacting us directly.</p>
  },
  {
      title: '6. Data Security',
      content: <p>We are continuously implementing and updating administrative, technical, and physical security measures to help protect your information against unauthorized access, loss, destruction, or alteration. However, please note that no method of transmission over the Internet, or method of electronic storage, is 100% secure.</p>
  },
  {
      title: '7. Changes to This Privacy Policy',
      content: <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.</p>
  },
   {
    title: '8. Contact Us',
    content: (
      <>
        <p>If you have questions or comments about this policy, you may <Link to="../contact">contact us</Link> or post to:</p>
        <p className="mt-4">
          CounselDesk Inc.<br />
          Sector – 43, Delhi–Surajkund Road Faridabad<br />
          121004 Haryana<br />
          India
        </p>
      </>
    )
  }
];

const PrivacyPolicy = () => {
  return (
    <main className="flex-1 bg-[var(--secondary-color)] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto bg-[#2D2D2D] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#3E3E3E] animate-fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-400">Last updated: September 11, 2025</p>
        </div>
        
        <div className="space-y-12">
            {policyData.map(section => (
                <section key={section.title}>
                    <h2 className="text-[var(--primary-color)] text-3xl font-bold mb-4 pb-2 border-b border-[#2D2D2D]">{section.title}</h2>
                    <div className="prose prose-invert max-w-none text-gray-300 [&_h3]:text-[var(--accent-color)] [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_a]:text-[var(--primary-color)] [&_a]:underline hover:[&_a]:text-[var(--accent-color)]">
                        {section.content}
                    </div>
                </section>
            ))}
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;