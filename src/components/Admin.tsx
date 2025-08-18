import React, { useState } from "react";
import Sidebar from "./adminComponents/sidebar";
import Navbar from "./adminComponents/navbar";
import Dashboard from "./adminComponents/dashboard";
import Reservation from "./adminComponents/reservation";
import BookStatus from "./adminComponents/bookStatus";
import ReservationReport from "./adminComponents/reservationReport";
import BookReport from "./adminComponents/bookReport";
import ManageReservation from "./adminComponents/manageBook";
import ManageUser from "./adminComponents/manageUser";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
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
            Are you sure you want to logout? Any unsaved changes may be lost.
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
const Admin: React.FC = () => {
  const [pageState, setPageState] = useState<string>("/dashboard");
  const [logoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

    const { setUserId } = useAuth();

    const handleLogoutClick = (): void => {
    setLogoutModalOpen(true);
  };

  
    const handleLogoutConfirm = (): void => {
    setUserId(null);
    setLogoutModalOpen(false);
  };

    
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow" style={{ zIndex: 60 }}>
        <Navbar 
        onChangeState={(path) => {
            if (path === "/logout") {
              setLogoutModalOpen(true);
            } else {
              setPageState(path);
            }
          }}
          onLogoutClick={handleLogoutClick}/>
      </div>
      <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-white shadow transition-all duration-300" style={{ zIndex: 50 }}>
        <Sidebar
        />
      </div>

      <main className="flex-1 transition-all duration-300" >
        {pageState === "/dashboard" && <Dashboard />}
        {pageState === "/resevation" && <Reservation />}
        {pageState === "/bookStatus" && <BookStatus />}
        {pageState === "/reservationReport" && <ReservationReport />}
        {pageState === "/bookReport" && <BookReport />}
        {pageState === "/manageReservation" && <ManageReservation />}
        {pageState === "/manageUser" && <ManageUser />}
      </main>

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Admin;
