import Header from "./Header";
import Footer from "../../components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { useEffect } from "react";
import Error from "../../components/Error/Error";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import { ToastContainer } from "react-toastify";

const LawyerLayout = () => {
    const { isLoggedIn, userDetails } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
  
        if (!isLoggedIn) {
            navigate("/", { replace: true });
            return; 
        }

        switch (userDetails.role) {
            case "user":
                navigate("/user", { replace: true });
                break;
            case "admin":
                navigate("/admin", { replace: true });
                break;
            case "lawyer":
                if (!userDetails.bioDataProvided) {
                    navigate("/user-lawyer/bio-data", { replace: true });
                }
                break;
            default:
                console.warn("Unknown user role:", userDetails.role);
                navigate("/", { replace: true });
                break;
        }

    }, [isLoggedIn, userDetails, navigate]);

    if (userDetails?.role === "lawyer" && !userDetails?.verified) {
        return <Error 
        title="Account Pending Approval" 
        message="Your account has been successfully created and is now awaiting verification by an administrator. You will be notified by email once your account is approved. Thank you for your patience." 
        errorCode={null} 
        />;
    }

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

export default LawyerLayout;