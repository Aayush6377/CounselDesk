import Navbar from "../../components/Navbar/Navbar";

const Header = () => {

    const navItems = [
        { name: "Dashboard", path: "" },
        { name: "Availability", path: "availability" },
        { name: "Appointments", path: "appointments" },
        { name: "Community", path: "community" },
        { name: "Earnings", path: "earnings" },
    ];

    return (
        <div>
            <Navbar navItems={navItems}/>
        </div>
    )
}

export default Header;
