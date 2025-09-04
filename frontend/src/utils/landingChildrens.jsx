import sharedChildrens from "./sharedChildrens";
import Home from "../pages/landing/Home/Home";
import LawyersList from "../pages/landing/LawyersList/LawyersList";
import LawyerProfile from "../components/LawyerProfile/LawyerProfile";
import Login from "../pages/landing/Login/Login";
import ForgotPassword from "../pages/landing/Login/ForgotPassword";
import Signup from "../pages/landing/Signup/Signup";

const landingChildrens = [
    {
        path: "/",
        element: <Home />
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
    },
    ...sharedChildrens
];

export default landingChildrens;