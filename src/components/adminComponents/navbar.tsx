import React, { useState, useRef } from "react";
import { ChevronDown, User } from "lucide-react";
import { LuLogOut } from "react-icons/lu";

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
      icon: <LuLogOut size={24} />,
      label: "Logout",
      path: "/logout",
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  
  return (
    <>

      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg relative overflow-visible h-[80px]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 px-6 py-3 flex items-center justify-between h-full">
      
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              className="w-[70px] h-[70px] text-white drop-shadow-sm"
            />
            <h1 className="text-white text-2xl font-semibold tracking-tight drop-shadow-sm">
              Smart Library: Online Book Reservation and Monitoring System
            </h1>
          </div>

 
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-3 bg-white/15 border border-white/30 rounded-full px-4 py-2 hover:bg-white/25 transition-all duration-200 hover:scale-105"
              >
                <div className="bg-white/30 rounded-full p-1.5">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
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

      {isDropdownOpen && (
        <div
          className="fixed top-[70px] right-6 w-55 bg-white rounded-2xl shadow-2xl border border-gray-100  transform transition-all duration-200 ease-out"
          style={{
            zIndex: 60,
            position: "fixed",
          }}
        >

          <div className="py-1">
            {dropdownMenus.map((item) => (
              <button
                key={item.path}
                className="w-full flex items-center px-6 py-3 transform transistion-transform hover:scale-105 duration-300 text-left"
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
