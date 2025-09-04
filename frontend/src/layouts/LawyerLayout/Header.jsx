import Navbar from "../../components/Navbar/Navbar";

const Header = () => {

    const navItems = [
        { name: "Dashboard", path: "" },
        { name: "Chatbot", path: "chatbot" },
        { name: "Availability", path: "availability" },
        { name: "Appointments", path: "appointments" },
        { name: "Earnings", path: "earnings" },
    ];

    return (
        <div>
            <Navbar navItems={navItems}/>
        </div>
    )
}

export default Header;
