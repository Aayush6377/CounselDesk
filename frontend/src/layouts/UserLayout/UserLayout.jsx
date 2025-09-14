import { useStore } from "../../hooks/useStore";
import Footer from "../../components/Footer/Footer";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import { ToastContainer } from "react-toastify";

const UserLayout = () => {
    const { isLoggedIn, userDetails } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/", { replace: true });
            return; 
        }
        
        switch (userDetails.role) {
            case "lawyer":
                navigate("/user-lawyer", { replace: true });
                break;
            case "admin":
                navigate("/admin", { replace: true });
                break;
            case "user":
            default:
                break;
        }

    }, [isLoggedIn, userDetails, navigate]);

    return (
        <div>
            <ScrollToTop />
            <Header />
            <ToastContainer theme="dark" autoClose={5000}/>
            <Outlet />
            <Footer />
        </div>
    );
};

export default UserLayout;