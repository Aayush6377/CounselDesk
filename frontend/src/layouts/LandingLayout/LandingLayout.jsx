import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./landing.css";

const LandingLayout = () => {
    return (
        <>
        <Header />
        <Outlet />
        <Footer />
        </>
    )
}

export default LandingLayout;
