import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { images } from "../../assets/assets";
import { useStore } from "../../hooks/useStore";

const Navbar = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userDetails } = useStore();

  const authRoutes = {
    login: "/login",
    signup: "/signup",
    profile: "profile",
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#2D2D2D] px-6 md:px-10 py-4 shadow-lg sticky top-0 bg-[var(--secondary-color)] z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 text-white rounded-full transition-transform duration-300">
            <img 
              src={images.logo} 
              alt="CounselDesk logo" 
              className="h-full w-full object-contain rounded-full" 
            />
          </div>
          <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
            CounselDesk
          </h2>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex flex-1 justify-center gap-8">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === ""} 
            className={({ isActive }) =>
              `nav-item text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--primary-color)]"
                  : "text-gray-400 hover:text-[var(--primary-color)]"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Conditional Rendering for Auth Buttons or Profile Pic */}
      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <Link to={authRoutes.profile}>
            <img
              src={userDetails.profileImage || images.defaultProfile}
              alt="Profile"
              className="size-10 rounded-full object-cover"
            />
          </Link>
        ) : (
          <>
            <Link
              to={authRoutes.login}
              className="text-sm font-medium text-gray-400 hover:text-[var(--primary-color)] transition-colors"
            >
              Login
            </Link>
            <Link
              to={authRoutes.signup}
              className="flex min-w-[84px] items-center justify-center rounded-md h-10 px-5 bg-[var(--primary-color)] text-white text-sm font-bold hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`block h-0.5 w-6 bg-white rounded-sm transition-transform duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white rounded-sm my-1 transition-opacity duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white rounded-sm transition-transform duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-[var(--secondary-color)] border-t border-[#2D2D2D] flex flex-col items-center gap-6 py-8 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === ""}
              className={({ isActive }) =>
                `nav-item text-base font-medium ${
                  isActive
                    ? "text-[var(--primary-color)]"
                    : "text-gray-300 hover:text-[var(--primary-color)]"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {/* Conditional Rendering for Auth Buttons or Profile Pic (Mobile) */}
          <div className="flex flex-col gap-3 w-full px-6 mt-6">
            {isLoggedIn ? (
              <Link
                to={authRoutes.profile}
                className="w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={userDetails.profileImage|| images.defaultProfile}
                  alt="Profile"
                  className="mx-auto size-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <>
                <Link
                  to={authRoutes.login}
                  className="w-full text-center text-sm font-medium text-gray-300 hover:text-[var(--primary-color)] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to={authRoutes.signup}
                  className="w-full flex items-center justify-center rounded-md h-10 px-5 bg-[var(--primary-color)] text-white text-sm font-bold hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;