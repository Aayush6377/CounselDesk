import sharedChildrens from "./sharedChildrens";
import Home from "../pages/landing/Home/Home";
import LawyersList from "../pages/landing/LawyersList/LawyersList";
import LawyerProfile from "../components/LawyerProfile/LawyerProfile";
import Login from "../pages/landing/Login/Login";
import ForgotPassword from "../pages/landing/Login/ForgotPassword";
import Signup from "../pages/landing/Signup/Signup";
import LandingQAPage from "../pages/landing/LandingQAPage/LandingQAPage";
import DemoLogin from "../pages/landing/DemoLogin/DemoLogin";

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
        path: "/lawyer/:lawyerId",
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
    {
        path: "/community",
        element: <LandingQAPage />
    },
    {
        path: "/demo/user",
        element: <DemoLogin role="user"/>
    },
    {
        path: "/demo/lawyer",
        element: <DemoLogin role="lawyer"/>
    },
    ...sharedChildrens
];

export default landingChildrens;