// Fixed Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User, BookOpen } from "lucide-react";
import { FaUserCog } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";

interface dropdownProps {
  onLogoutClick: () => void;
  onChangeState: (path: string) => void;
}

interface dropdownMenu{
  icon: JSX.Element;
  label: string;
  path: string;
}

const Navbar: React.FC<dropdownProps> = ({ onChangeState, onLogoutClick }) => {
  const dropdownMenus: dropdownMenu[] = [
    {
      icon: <FaUserCog size={24} />,
      label: "User Profile",
      path: "/userProfile",
    },
    {
      icon: <LuLogOut size={24} />,
      label: "Logout",
      path: "/logout",
    }
  ]
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (item: dropdownMenu) => {
    setIsDropdownOpen(false); // Close dropdown first
    
    if (item.path === "/logout") {
      onLogoutClick(); // Call the logout handler
    } else {
      onChangeState(item.path); // Navigate to other pages
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg relative overflow-visible h-[70px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 px-6 py-3 flex items-center justify-between h-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-2 hover:bg-white/25 transition-all duration-300 hover:scale-105">
              <BookOpen className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <h1 className="text-white text-lg font-semibold tracking-tight drop-shadow-sm">
              Smart Library System
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
                  <div className="text-white text-sm font-medium">John Doe</div>
                  <div className="text-white/80 text-xs">Librarian</div>
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
          className="fixed top-[65px] right-6 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 transform transition-all duration-200 ease-out"
          style={{
            zIndex: 9999,
            position: "fixed",
          }}
        >
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">John Doe</div>
                <div className="text-sm text-gray-600">
                  john.doe@library.com
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
                <div className="mr-4 text-gray-600">{item.icon}</div>
                <div className="text-gray-700 font-medium">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;