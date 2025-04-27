import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiFileText,
  FiClipboard,
  FiCreditCard,
} from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { motion } from "framer-motion";
import { HiMenuAlt3 } from "react-icons/hi";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Logo from "../assets/images/logo.png";

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ username: parsedUser.username, email: parsedUser.email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      {/* 🌟 Topbar */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-2 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <img src={Logo} alt="MediAssist Logo" className="w-12 h-12" />
          <h1 className="text-xl font-bold text-gray-700">MediAssist</h1>
        </div>

        {/* Desktop Profile Dropdown */}
        {user && (
          <div className="hidden md:block relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-700 flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 transition duration-200 focus:outline-none"
            >
              <FaUserCircle size={26} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-md z-50 overflow-hidden">
                <div className="p-4 border-b">
                  <p className="text-sm font-medium text-gray-800">👤 {user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-blue-600 focus:outline-none"
        >
          <HiMenuAlt3 size={28} />
        </button>
      </motion.div>

      {/* 📌 Sidebar Navigation */}
      <motion.nav className="hidden md:flex fixed top-16 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white shadow-md z-40 p-2">
        <div className="flex justify-between w-full overflow-x-auto">
          <NavItem to="/" icon={<FiHome />} title="Dashboard" />
          <NavItem to="/patients" icon={<FiUser />} title="Patients" />
          <NavItem to="/appointments" icon={<FiCalendar />} title="Appointments" />
          <NavItem to="/doctors" icon={<FaUserDoctor />} title="Doctors" />
          <NavItem to="/prescriptions" icon={<FiFileText />} title="Prescription" />
          <NavItem to="/medical-records" icon={<FiClipboard />} title="Medical Records" />
          <NavItem to="/billing" icon={<FiCreditCard />} title="Billing" />
        </div>
      </motion.nav>

      {/* 📱 Mobile Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 z-50 md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex flex-col space-y-2">
            <NavItem to="/" icon={<FiHome />} title="Dashboard" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/patients" icon={<FiUser />} title="Patients" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/appointments" icon={<FiCalendar />} title="Appointments" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/doctors" icon={<FaUserDoctor />} title="Doctors" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/prescriptions" icon={<FiFileText />} title="Prescription" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/medical-records" icon={<FiClipboard />} title="Medical Records" mobile onClick={() => setMobileMenuOpen(false)} />
            <NavItem to="/billing" icon={<FiCreditCard />} title="Billing" mobile onClick={() => setMobileMenuOpen(false)} />

            {user && (
              <>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-800 font-medium">👤 {user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-md text-sm mt-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

// 📌 Navigation Item
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  mobile?: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, title, mobile = false, onClick }: NavItemProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm md:text-base whitespace-nowrap transition-all
      ${mobile
        ? "text-white bg-blue-700 hover:bg-blue-800"
        : "text-white hover:bg-blue-800"
      }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{title}</span>
  </Link>
);

export default Sidebar;
