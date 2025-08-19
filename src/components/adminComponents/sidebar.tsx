import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText,  
  ChevronDown, 
  ChevronRight,
  Calendar,
  CheckCircle,
  Users,
  Book,
  UserCheck,
  Wrench
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (path: string) => void;
}

type Section = 'reports' | 'maintenance';

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  
  const [expandedSections, setExpandedSections] = useState<Record<Section, boolean>>({
    reports: false,
    maintenance: false
  });

  const toggleSection = (section: Section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleItemClick = (path: string) => {
    onPageChange(path);
  };

  // Helper function to check if current item is active
  const isActive = (path: string) => currentPage === path;

  return (
    <div className="w-64 h-screen overflow-y-auto bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col">
      {/* Navbar Space */}
      <div className="h-[20px] border-b border-blue-500/30">
        {/* Space reserved for navbar */}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <div className="mb-4">
          <div 
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
              isActive('/dashboard') ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => handleItemClick('/dashboard')}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium text-lg">Dashboard</span>
          </div>
          
          {/* Dashboard Sub-items */}
          <div className="ml-8 mt-2 space-y-1">
            <div 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                isActive('/resevation') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => handleItemClick('/resevation')}
            >
              <Calendar className="w-5 h-5" />
              <span>Reservations</span>
            </div>
            <div 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                isActive('/bookStatus') ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => handleItemClick('/bookStatus')}
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
              (isActive('/reservationReport') || isActive('/bookReport')) ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => toggleSection('reports')}
          >
            <FileText className="w-6 h-6" />
            <span className="font-medium flex-1 text-lg">Reports</span>
            {expandedSections.reports ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </div>
          
          {/* Reports Sub-items */}
          {expandedSections.reports && (
            <div className="ml-8 mt-2 space-y-1">
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive('/reservationReport') ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('/reservationReport')}
              >
                <Calendar className="w-5 h-5" />
                <span>Reservation Reports</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive('/libraryUsersReport') ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('/libraryUsersReport')}
              >
                <Users className="w-5 h-5" />
                <span>Library Users Reports</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive('/bookReport') ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('/bookReport')}
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
              (isActive('/manageReservation') || isActive('/manageUser')) ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => toggleSection('maintenance')}
          >
            <Wrench className="w-6 h-6" />
            <span className="font-medium flex-1 text-lg">Maintenance</span>
            {expandedSections.maintenance ? 
              <ChevronDown className="w-5 h-5" /> : 
              <ChevronRight className="w-5 h-5" />
            }
          </div>
          
          {/* Maintenance Sub-items */}
          {expandedSections.maintenance && (
            <div className="ml-8 mt-2 space-y-1">
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive('/manageReservation') ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('/manageReservation')}
              >
                <Calendar className="w-5 h-5" />
                <span>Manage Reservations</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  isActive('/manageUser') ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('/manageUser')}
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