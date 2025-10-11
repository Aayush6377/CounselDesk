import { useEffect, useState } from 'react';
import StoreContext from './store-context';
import { logoutUser, refreshAccessToken } from '../services/auth.service';
import { useMutation } from '@tanstack/react-query';
import fetchUserLocation from '../services/fetchUserLocation';

export const StoreProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm your Legal AI Assistant. How can I help you today? Please remember, I am an AI and my advice does not constitute a legal opinion.",
    },
  ]);

  const checkLogin = async () => {
    try {
      const res = await refreshAccessToken();
      if (res.success){
        setUserDetails(res.user);

        if (res.user.role === "user"){
          const address = await fetchUserLocation();
          setUserDetails(prev => ({...prev, address}));
        }
        setLogedin(true);
      }
      else{
        setLogedin(false);
        setUserDetails({});
      }
    } catch (error) {
      console.error(error);
      setLogedin(false);
      setUserDetails({});
    } finally {
      setAppLoading(false);
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
    subscription: {},
    address: {
      state: "",
      city: ""
    }
  });

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  },[]);

  const store = {
    appLoading,
    messages,
    setMessages,
    isLoggedIn,
    setLogedin,
    userDetails,
    setUserDetails,
    logout,
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};