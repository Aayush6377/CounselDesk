import sharedChildrens from "./sharedChildrens";
import UserDashboard from "../pages/user/Dashboard/Dashboard";
import FindLawyers from "../pages/user/FindLawyers/FindLawyers";
import UserLawyerProfile from "../pages/user/LawyerProfile/LawyerProfile";
import Booking from "../pages/user/Booking/Booking";
import UserAppointments from "../pages/user/Appointments/Appointments";
import UserAppointmentDetails from "../pages/user/Appointments/AppointmentDetails";
import UserPaymentHistory from "../pages/user/PaymentHistory/PaymentHistory";
import UserProfile from "../pages/user/Profile/Profile";
import LawyerReviews from "../pages/user/LawyerReviews/LawyerReviews";

const userChildrens = [
      { 
        path: "/user",
        element: <UserDashboard />
      },
      {
        path: "lawyers",
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
      },
      {
        path: "lawyer-reviews",
        element: <LawyerReviews />
      },
      ...sharedChildrens
];

export default userChildrens;