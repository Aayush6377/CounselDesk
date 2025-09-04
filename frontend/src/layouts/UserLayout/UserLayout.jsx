import { useStore } from "../../hooks/useStore";
import Footer from "../../components/Footer/Footer";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserLayout = () => {
    const { isLoggedIn, userDetails } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            switch (userDetails.role) {
                case "lawyer":
                    navigate("/user-lawyer", { replace: true });
                    break;
                case "admin":
                    navigate("/admin", { replace: true });
                    break;
            }
        }
        else{
            navigate("/"),{ replace: true };
        }
    },[isLoggedIn,userDetails,navigate]);


    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default UserLayout;
