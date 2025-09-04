import Footer from "../../components/Footer/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useStore } from "../../hooks/useStore";
import { useEffect } from "react";


const LandingLayout = () => {
    const { isLoggedIn, userDetails } = useStore();
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
            }
        }
    },[isLoggedIn,userDetails,navigate]);

    return (
        <>
        <Header />
        <Outlet />
        <Footer />
        </>
    )
}

export default LandingLayout;
