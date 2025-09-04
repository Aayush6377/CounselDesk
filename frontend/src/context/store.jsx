import { createContext, useState } from 'react';
import { lawyers, dummyAppointments } from "../assets/assets";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm your Legal AI Assistant. How can I help you today? Please remember, I am an AI and my advice does not constitute a legal opinion.",
    },
  ]);

  const [isLoggedIn, setLogedin] = useState(true);
  const [userDetails, setUserDetails] = useState({
    role: "user",
    name: "Aayush Kukreja",
    email: "aayush@gmail.com",
    profileImage: "https://randomuser.me/api/portraits/men/42.jpg",
  });

  const [lawyerList, setLawyerList] = useState(lawyers);
  const [appointments, setAppointments] = useState(dummyAppointments);

  const store = {
    messages,
    setMessages,
    isLoggedIn,
    setLogedin,
    userDetails,
    setUserDetails,
    lawyerList,
    setLawyerList,
    appointments,
    setAppointments
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
