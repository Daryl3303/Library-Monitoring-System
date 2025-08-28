import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, Menu } from "lucide-react";
import { FaUserCog } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { TiHome } from "react-icons/ti";
import logo from "../../assets/logo.png";
import { auth, db } from "../../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";

interface dropdownUserProps {
  onLogoutClick: () => void;
  onChangeState: (path: string) => void;
}

interface dropdownMenu {
  icon: JSX.Element;
  label: string;
  path: string;
}

const UserNavbar: React.FC<dropdownUserProps> = ({ onChangeState, onLogoutClick }) => {
  const dropdownMenus: dropdownMenu[] = [
    {
      icon: <TiHome size={20} />,
      label: "Home",
      path: "/",
    },
    {
      icon: <FaUserCog size={20} />,
      label: "Profile",
      path: "/userProfile",
    },
    {
      icon: <LuLogOut size={20} />,
      label: "Logout",
      path: "/logout",
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (item: dropdownMenu) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (item.path === "/logout") {
      onLogoutClick();
    } else {
      onChangeState(item.path);
    }
  };


const fetchUsers = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const querySnapshot = await getDocs(collection(db, "users"));
    const userDoc = querySnapshot.docs.find(doc => doc.id === currentUser.uid);

    if (userDoc) {
      const data = userDoc.data();
      setUserName(data.name || "");
      setUserEmail(data.email || "");
      setUserRole(data.role || "");
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);



  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg relative h-[80px] md:h-[80px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full px-4 md:px-6 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <img src={logo} className="w-[50px] h-[50px] md:w-[70px] md:h-[70px]" />
            <h1 className="hidden md:block text-white text-lg md:text-2xl font-semibold tracking-tight drop-shadow-sm">
              Smart Library: Online Book Reservation and Monitoring System
            </h1>
            <h1 className="md:hidden text-white text-lg font-semibold drop-shadow-sm">
              Smart Library
            </h1>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-3 bg-white/15 border border-white/30 rounded-full px-4 py-2 hover:bg-white/25 transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white/30 rounded-full p-1.5">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-white text-sm font-medium">{userName}</div>
                  <div className="text-white/80 text-xs">{userRole}</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/20"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-6 top-[75px] w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">{userName}</div>
                <div className="text-sm text-gray-600 truncate max-w-[180px]" title={userEmail}>
                  {userEmail}
                </div>
              </div>
            </div>
          </div>
          <div className="py-2">
            {dropdownMenus.map((item) => (
              <button
                key={item.path}
                className="w-full flex items-center px-6 py-3 hover:bg-gray-100 transition-colors duration-150 text-left"
                onClick={() => handleMenuItemClick(item)}
              >
                <div
                  className={`mr-4 ${
                    item.label === "Logout" ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {item.icon}
                </div>
                <div
                  className={`font-medium ${
                    item.label === "Logout" ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] right-0 w-60 max-w-[calc(100vw-32px)] bg-white shadow-lg rounded-b-xl z-50 max-h-[calc(100vh-60px)] overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">{userName}</div>
                <div className="text-sm text-gray-600 truncate">{userEmail}</div>
              </div>
            </div>
          </div>
          <div className="py-2">
            {dropdownMenus.map((item) => (
              <button
                key={item.path}
                className="w-full flex items-center px-6 py-3 hover:bg-gray-100 transition-colors duration-150 text-left"
                onClick={() => handleMenuItemClick(item)}
              >
                <div
                  className={`mr-4 ${
                    item.label === "Logout" ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {item.icon}
                </div>
                <div
                  className={`font-medium ${
                    item.label === "Logout" ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
