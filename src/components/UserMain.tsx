import React, { useState, useRef, useEffect } from "react";
import UserNavbar from "./userComponents/userNavbar";
import WelcomePage from "./userComponents/welcomePage" 
import UserProfile from "./userComponents/UserProfile";
import ViewBooks from "./userComponents/viewBooks";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{ zIndex: 70 }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-center text-gray-600">
            Are you sure you want to logout?
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-center space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
const UserMain: React.FC = () => {
  const [pageState, setPageState] = useState<string>("/");
   const location = useLocation();
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    const { logout } = useAuth();  
  const navigate = useNavigate();

   useEffect(() => {
    const currentPath = location.pathname;
    
    
    const pathMapping: { [key: string]: string } = {
      '/user': '/',
      '/user/welcome': '/',
      '/user/user-profile': '/userProfile',
      '/user/view-books': '/viewBooks',
    };

    const mappedPath = pathMapping[currentPath] || '/';
    setPageState(mappedPath);
  }, [location.pathname]);


  const handleLogoutClick = (): void => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async (): Promise<void> => {
    await logout();               
    setLogoutModalOpen(false);
    navigate("/signIn");         
  };

  const handlePageChange = (path: string): void => {
    if (path === "/logout") {
      setLogoutModalOpen(true);
    } else {
      setIsTransitioning(true);

      const urlMapping: { [key: string]: string } = {
        '/': '/user/welcome',
        '/userProfile': '/user/user-profile',
        '/viewBooks': '/user/view-books',
      };

      const urlPath = urlMapping[path] || '/admin/dashboard';

      setTimeout(() => {
        setPageState(path);
        navigate(urlPath, { replace: true });
        setIsTransitioning(false);
      }, 200);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow"
        style={{ zIndex: 60 }}  
      >
        <UserNavbar
          onChangeState={(path) => {
            if (path === "/logout") {
              setLogoutModalOpen(true);
            } else {
              handlePageChange(path);
            }
          }}
          onLogoutClick={handleLogoutClick}
        />
      </div>
  
       
      <main
        className="transition-all duration-300 pt-[60px] min-h-screen bg-gray-50"
        style={{ zIndex: 40 }}
      >
        <div
          className={` transition-all duration-300 ease-in-out transform ${
            isTransitioning
              ? "opacity-0 translate-y-2 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          {pageState === "/" && (
            <div className="animate-fade-in">
              <WelcomePage onViewBooks={() => handlePageChange("/viewBooks")}/>
            </div>
          )}

          {pageState === "/userProfile" && (
            <div className="animate-fade-in">
              <UserProfile />
            </div>
          )}

          {pageState === "/viewBooks" && (
            <div className="animate-fade-in">
              <ViewBooks />
            </div>
          )}
        </div>
      </main>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default UserMain;
