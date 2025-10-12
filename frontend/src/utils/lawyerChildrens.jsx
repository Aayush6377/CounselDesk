import sharedChildrens from "./sharedChildrens";
import Dashboard from "../pages/lawyer/Dashboard/Dashboard";
import Availability from "../pages/lawyer/Availability/Availability";
import Appointments from "../pages/lawyer/Appointments/Appointments";
import Earnings from "../pages/lawyer/Earning/Earning";
import Reviews from "../pages/lawyer/Reviews/Reviews";
import Subscription from "../pages/lawyer/Subscription/Subscription";
import Profile from "../pages/lawyer/Profile/Profile";
import AppointmentDetails from "../pages/lawyer/Appointments/AppointmentDetails";
import SubscriptionSuccess from "../pages/lawyer/Subscription/SubscriptionSuccess";
import MeetingPage from "../components/MeetingPage/MeetingPage";

const lawyerChildrens = [
    {
        path: "/user-lawyer",
        element: <Dashboard />
    },
    {
        path: "availability",
        element: <Availability />
    },
    {
        path: "appointments",
        element: <Appointments />
    },
    {
        path: "earnings",
        element: <Earnings />

    },
    {
        path: "reviews",
        element: <Reviews />
    },
    {
        path: "subscription",
        element: <Subscription />

    },
    {
        path: "subscription/success",
        element: <SubscriptionSuccess />
    },
    {
        path: "profile",
        element: <Profile />
    },
    {
        path: "appointment-details/:appointmentId",
        element: <AppointmentDetails />
    },
    {
        path: "meeting/:appointmentId",
        element: <MeetingPage />
    },
    ...sharedChildrens
];

export default lawyerChildrens;