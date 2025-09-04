import Navbar from "../../components/Navbar/Navbar";

const Header = () => {

    const navItems = [
        { name: "Dashboard", path: "" },
        { name: "Chatbot", path: "chatbot" },
        { name: "Find Lawyers", path: "lawyers" },
        { name: "Appointments", path: "appointments" },
    ];

    return (
        <div>
            <Navbar navItems={navItems}/>
        </div>
    )
}

export default Header;