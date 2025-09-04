import Header from "./Header";
import Footer from "../../components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { useEffect } from "react";

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

    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default LawyerLayout;