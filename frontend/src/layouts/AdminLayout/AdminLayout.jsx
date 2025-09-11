import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Header from "./Header";
import { useEffect } from "react";
import { useStore } from "../../hooks/useStore";

const AdminLayout = () => {
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
            case "user":
                navigate("/user", { replace: true });
                break;
            case "admin":
            default:
                break;
        }

    }, [isLoggedIn, userDetails, navigate]);
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default AdminLayout
