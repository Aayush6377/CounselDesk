import { createContext, useState } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm your Legal AI Assistant. How can I help you today? Please remember, I am an AI and my advice does not constitute a legal opinion.",
    },
  ]);

  const store = {
    messages,
    setMessages,
  };

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
