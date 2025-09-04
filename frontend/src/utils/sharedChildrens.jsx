import Chatbot from "../pages/common/Chatbot/Chatbot";
import ContactUs from "../pages/common/ContactUs/ContactUs";

const sharedChildrens = [
    {
       path: "chatbot",
       element: <Chatbot /> 
    },
    {
        path: "contact",
        element: <ContactUs />
    }
];

export default sharedChildrens;