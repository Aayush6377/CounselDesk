import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "./context/store";

//Layouts
import LandingLayout from "./layouts/LandingLayout/LandingLayout";
import UserLayout from "./layouts/UserLayout/UserLayout";
import LawyerLayout from "./layouts/LawyerLayout/LawyerLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

//Landing panel
import Home from "./pages/landing/Home/Home";
import Chatbot from "./components/Chatbot/Chatbot";
import LawyersList from "./pages/landing/LawyersList/LawyersList";
import LawyerProfile from "./components/LawyerProfile/LawyerProfile";
import ContactUs from "./components/Contactus/Contactus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/chatbot",
        element: <Chatbot />
      },
      {
        path: "/lawyers",
        element: <LawyersList />
      },
      {
        path: "/lawyer/:id",
        element: <LawyerProfile />
      },
      {
        path: "/contact",
        element: <ContactUs />
      }
    ]
  },
  {
    path: "/user",
    element: <UserLayout />,
  },
  {
    path: "/lawyer",
    element: <LawyerLayout />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
  }
]);

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <RouterProvider router={router}/>
      </StoreProvider>
    </ QueryClientProvider>
  )
}

export default App;
