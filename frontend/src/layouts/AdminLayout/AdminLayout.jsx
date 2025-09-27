import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const AdminLayout = () => {
    const { isLoggedIn, userDetails, appLoading } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (appLoading) {
            return;
        }

        if (!isLoggedIn) {
            navigate("/", { replace: true });
            return; 
        }
        
        switch (userDetails.role) {
            case "lawyer":
                navigate("/user-lawyer", { replace: true });
                break;
            case "user":
                navigate("/user", { replace: true });
                break;
            case "admin":
            default:
                break;
        }

    }, [isLoggedIn, userDetails, navigate, appLoading]);

    if (appLoading) {
        return (
            <div>
                <ScrollToTop />
                <Header />
                <Loader />
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <ScrollToTop />
            <Header />
           <ToastContainer theme="dark" autoClose={5000}/>
            <Outlet />
            <Footer />
        </div>
    )
}

export default AdminLayout
