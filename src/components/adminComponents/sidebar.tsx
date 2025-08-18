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

const Sidebar = () => {
  
  const [expandedSections, setExpandedSections] = useState<Record<Section, boolean>>({
    reports: false,
    maintenance: false
  });
  
  const [activeItem, setActiveItem] = useState('dashboard');
  type Section = 'reports' | 'maintenance';


  

  const toggleSection = (section: Section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);  
  };



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
              activeItem === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() =>  handleItemClick('dashboard')}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-medium text-lg">Dashboard</span>
          </div>
          
          {/* Dashboard Sub-items */}
          <div className="ml-8 mt-2 space-y-1">
            <div 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                activeItem === 'reservations' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => handleItemClick('reservations')}
            >
              <Calendar className="w-5 h-5" />
              <span>Reservations</span>
            </div>
            <div 
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                activeItem === 'book-status' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => handleItemClick('book-status')}
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
              activeItem === 'reports' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => {
              toggleSection('reports');
              handleItemClick('reports');
            }}
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
                  activeItem === 'reservation-reports' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('reservation-reports')}
              >
                <Calendar className="w-5 h-5" />
                <span>Reservation Reports</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  activeItem === 'library-users-reports' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('library-users-reports')}
              >
                <Users className="w-5 h-5" />
                <span>Library Users Reports</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  activeItem === 'book-reports' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('book-reports')}
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
              activeItem === 'maintenance' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
            onClick={() => {
              toggleSection('maintenance');
              handleItemClick('maintenance');
            }}
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
                  activeItem === 'manage-reservations' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('manage-reservations')}
              >
                <Calendar className="w-5 h-5" />
                <span>Manage Reservations</span>
              </div>
              <div 
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors cursor-pointer text-base ${
                  activeItem === 'manage-library-users' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
                onClick={() => handleItemClick('manage-library-users')}
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