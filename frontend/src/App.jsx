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
import Login from "./pages/landing/Login/Login";
import ForgotPassword from "./pages/landing/Login/ForgotPassword";
import Signup from "./pages/landing/Signup/Signup";

//User panel
import UserDashboard from "./pages/user/Dashboard/Dashboard";
import FindLawyers from "./pages/user/FindLawyers/FindLawyers";
import UserLawyerProfile from "./pages/user/LawyerProfile/LawyerProfile";
import Booking from "./pages/user/Booking/Booking";
import UserAppointments from "./pages/user/Appointments/Appointments";
import UserAppointmentDetails from "./pages/user/Appointments/AppointmentDetails";
import UserPaymentHistory from "./pages/user/PaymentHistory/PaymentHistory";
import UserProfile from "./pages/user/Profile/Profile";

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
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/login/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/signup",
        element: <Signup />
      }
    ]
  },
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "/user",
        element: <UserDashboard />
      },
      {
        path: "chatbot",
        element: <Chatbot />
      },
      {
        path: "find-lawyers",
        element: <FindLawyers />
      },
      {
        path: "lawyer-profile",
        element: <UserLawyerProfile />
      },
      {
        path: "book-appointment",
        element: <Booking />
      },
      {
        path: "appointments",
        element: <UserAppointments />
      },
      {
        path: "appointment-details/:appointId",
        element: <UserAppointmentDetails />
      },
      {
        path: "payment-history",
        element: <UserPaymentHistory />
      },
      {
        path: "profile",
        element: <UserProfile />
      }
    ]
  },
  {
    path: "/user-lawyer",
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
