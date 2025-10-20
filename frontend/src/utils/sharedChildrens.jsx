import Chatbot from "../pages/common/Chatbot/Chatbot";
import ContactUs from "../pages/common/ContactUs/ContactUs";
import FAQ from "../pages/common/FAQ/FAQ";
import AboutUs from "../pages/common/AboutUs/AboutUs";
import PrivacyPolicy from "../pages/common/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../pages/common/TermsOfService/TermsOfService";
import Disclaimer from "../pages/common/Disclaimer/Disclaimer";
import LegalCodeExplorer from "../pages/common/LegalCodeExplorer/LegalCodeExplorer";

const sharedChildrens = [
    {
       path: "chatbot",
       element: <Chatbot /> 
    },
    {
        path: "contact",
        element: <ContactUs />
    },
    {
        path: "faq",
        element: <FAQ />
    },
    {
        path: "privacy",
        element: <PrivacyPolicy />
    },
    {
        path: "about",
        element: <AboutUs />
    },
    {
        path: "terms",
        element: <TermsOfService />
    },
    {
        path: "disclaimer",
        element: <Disclaimer />
    },
    {
        path: "indian-legal-codes",
        element: <LegalCodeExplorer />
    }
];

export default sharedChildrens;