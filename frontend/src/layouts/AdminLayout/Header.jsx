import Navbar from "../../components/Navbar/Navbar";

const Header = () => {

    const navItems = [
        { name: "Dashboard", path: "" },
        { name: "User Management", path: "user-management" },
        { name: "Lawyer requests", path: "lawyers" },
        { name: "Contact Submissions", path: "contact-submissions" },
        { name: "Admins", path: "create-admin" },
    ];

    return (
        <div>
            <Navbar navItems={navItems}/>
        </div>
    )
}

export default Header;