import Navbar from "../../components/Navbar/Navbar";

const Header = () => {
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Chatbot", path: "chatbot" },
        { name: "Lawyers", path: "lawyers" },
        { name: "Community", path: "community" },
        { name: "Contact Us", path: "contact" },
    ];
    
    return (
        <div>
            <Navbar navItems={navItems}/>
        </div>
    )
}

export default Header;