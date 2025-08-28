import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { FaUserCog } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import logo from "logo.png";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

interface dropdownProps {
  onLogoutClick: () => void;
  onChangeState: (path: string) => void;
}

interface dropdownMenu {
  icon: JSX.Element;
  label: string;
  path: string;
}

const Navbar: React.FC<dropdownProps> = ({ onChangeState, onLogoutClick }) => {
  const dropdownMenus: dropdownMenu[] = [
    {
      icon: <FaUserCog size={24} />,
      label: "Profile",
      path: "/userProfile",
    },
    {
      icon: <LuLogOut size={24} />,
      label: "Logout",
      path: "/logout",
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("Loading...");
  const [userEmail, setUserEmail] = useState("");

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (item: dropdownMenu) => {
    setIsDropdownOpen(false); 

    if (item.path === "/logout") {
      onLogoutClick(); 
    } else {
      onChangeState(item.path); 
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || currentUser.displayName || "Unknown User");
        setUserEmail(data.email || currentUser.email || "");
      } else {
     
        setUserName(currentUser.displayName || "Unknown User");
        setUserEmail(currentUser.email || "");
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg relative overflow-visible h-[80px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 px-6 py-3 flex items-center justify-between h-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              className="w-[70px] h-[70px] text-white drop-shadow-sm"
            />
            <h1 className="text-white text-2xl font-semibold tracking-tight drop-shadow-sm">
              Smart Library: Online Book Reservation and Monitoring System
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-3 bg-white/15 border border-white/30 rounded-full px-4 py-2 hover:bg-white/25 transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white/30 rounded-full p-1.5">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-white text-sm font-medium">
                    {userName}
                  </div>
                  <div className="text-white/80 text-xs">Admin</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className="fixed top-[70px] right-6 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 transform transition-all duration-200 ease-out"
          style={{
            zIndex: 60,
            position: "fixed",
          }}
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">{userName}</div>
                <div
                  className="text-sm text-gray-600 truncate max-w-[180px]"
                  title={userEmail}
                >
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
    </>
  );
};

export default Navbar;
