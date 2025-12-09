import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle,
  Book,
  UserCheck,
  Wrench,
  DoorOpen 
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

type Section = "reports" | "maintenance";

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<Section, boolean>
  >({
    reports: false,
    maintenance: false,
  });

  const toggleSection = (section: Section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleItemClick = (path: string) => {
    onPageChange(path);
  };

  const isActive = (path: string) => currentPage === path;

  return (
    <div className="w-72 h-full bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col">
      <div className="h-[20px] border-b border-blue-500/30"></div>

      <div className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
              isActive("/") ? "bg-white/20" : "hover:bg-white/10"
            }`}
            onClick={() => handleItemClick("/")}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium text-lg">Dashboard</span>
          </div>

          <div className="ml-8 mt-2 space-y-1">
            <div
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                isActive("/reservations") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={() => handleItemClick("/reservations")}
            >
              <Calendar className="w-5 h-5" />
              <span>Reservations</span>
            </div>
            <div
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                isActive("/bookStatus") ? "bg-white/20" : "hover:bg-white/10"
              }`}
              onClick={() => handleItemClick("/bookStatus")}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Book Status</span>
            </div>
          </div>
        </div>

        {/* Reports */}
        <div className="mb-4">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
              isActive("/reservationReport") || isActive("/bookReport")
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
            onClick={() => toggleSection("reports")}
          >
            <FileText className="w-6 h-6" />
            <span className="font-medium flex-1 text-lg">Reports</span>
            {expandedSections.reports ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>

          {expandedSections.reports && (
            <div className="ml-8 mt-2 space-y-1">
              <div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive("/entryRecords") ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => handleItemClick("/entryRecords")}
              >
                <DoorOpen  className="w-5 h-5" />
                <span>Entry Records</span>
              </div>

              <div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive("/reservationReport")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
                onClick={() => handleItemClick("/reservationReport")}
              >
                <Calendar className="w-5 h-5" />
                <span>Reservation Reports</span>
              </div>

              <div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive("/bookReport") ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => handleItemClick("/bookReport")}
              >
                <Book className="w-5 h-5" />
                <span>Book Reports</span>
              </div>

              
            </div>
          )}
        </div>

        {/* Maintenance */}
        <div className="mb-4">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
              isActive("/reservationManagement") || isActive("/manageUser")
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
            onClick={() => toggleSection("maintenance")}
          >
            <Wrench className="w-6 h-6" />
            <span className="font-medium flex-1 text-lg">Maintenance</span>
            {expandedSections.maintenance ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>

          {/* Maintenance Sub-items */}
          {expandedSections.maintenance && (
            <div className="ml-8 mt-2 space-y-1">
              <div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive("/reservationManagement")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
                onClick={() => handleItemClick("/reservationManagement")}
              >
                <Calendar className="w-5 h-5" />
                <span>Manage Reservations</span>
              </div>
              <div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive("/manageUser") ? "bg-white/20" : "hover:bg-white/10"
                }`}
                onClick={() => handleItemClick("/manageUser")}
              >
                <UserCheck className="w-5 h-5" />
                <span>Manage Library Users</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
