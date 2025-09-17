import { useEffect, useState } from 'react';
import { lawyers, dummyAppointments } from "../assets/assets";
import StoreContext from './store-context';
import { logoutUser, refreshAccessToken } from '../services/auth.service';
import { useMutation } from '@tanstack/react-query';

export const StoreProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm your Legal AI Assistant. How can I help you today? Please remember, I am an AI and my advice does not constitute a legal opinion.",
    },
  ]);

  const checkLogin = async () => {
    const res = await refreshAccessToken();
    if (res.success){
      setUserDetails(res.user);
      setLogedin(true);
    }
    else{
      setLogedin(false);
      setUserDetails({});
    }
  }

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      setLogedin(false);
      setUserDetails({});
    },
    onError: (error) => {
      console.error("Server logout failed:", error);
      setLogedin(false);
      setUserDetails({});
    }
  });

  const [isLoggedIn, setLogedin] = useState(false);
  const [userDetails, setUserDetails] = useState({
    role: "",
    name: "",
    email: "",
    profileImage: "",
    bioDataProvided:false,
    verified: false,
    subscription: {}
  });

  const [lawyerList, setLawyerList] = useState(lawyers);
  const [appointments, setAppointments] = useState(dummyAppointments);

  useEffect(() => {
    checkLogin();
  },[]);

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
    setAppointments,
    logout,
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};