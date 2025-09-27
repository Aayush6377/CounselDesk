import Footer from "../../components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useStore } from "../../hooks/useStore";
import { useEffect } from "react";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const LandingLayout = () => {
    const { isLoggedIn, userDetails, appLoading } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            switch (userDetails.role) {
                case "user":
                    navigate("/user", { replace: true });
                    break;
                case "lawyer":
                    navigate("/user-lawyer", { replace: true });
                    break;
                case "admin":
                    navigate("/admin", { replace: true });
                    break;
                default:
                    console.warn("Unknown user role:", userDetails.role);
                    navigate("/", { replace: true });
                    break;
            }
        }
    },[isLoggedIn,userDetails,navigate]);

     if (appLoading){
        return (
            <>
            <Header />
            <Loader />
            <Footer />
            </>
        );
    }

    return (
        <>
        <ScrollToTop />
        <Header />
        <ToastContainer theme="dark" autoClose={5000}/>
        <Outlet />
        <Footer />
        </>
    )
}

export default LandingLayout;