import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Book,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

interface DashboardProps {
  stats?: {
    totalUsers: number;
    totalBooks: number;
    pendingReservations: number;
    overdueBooks: number;
    todayReservations: number;
    availableBooks: number
  };
}

const Dashboard: React.FC<DashboardProps> = ( {}) => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    pendingReservations: 0,
    overdueBooks: 0,
    todayReservations: 0,
    availableBooks: 0
  });


  const cardRoutes = {
    users: '/admin/manage-user',
    books: '/admin/book-status',
    pendingReservations: '/admin/reservations',
    availableBooks: '/admin/book-status',
    todayReservations: '/admin/reservation-management',
    overdueBooks:'/admin/reservation-management'
  };

  const handleCardClick = (route: string) => {
    navigate(route);
  };

 const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setStats((prev) => ({
        ...prev,
        totalUsers: querySnapshot.docs.length,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

   const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));

      const availableBooks = querySnapshot.docs.reduce((acc, docSnap) => {
        const data = docSnap.data();
        const quantity = data.quantity || 0;
        const numericId = Number(docSnap.id);

        if (!isNaN(numericId)) {
          return acc + numericId * quantity;
        } else {
          return acc + quantity;
        }
      }, 0);

      setStats((prev) => ({
        ...prev,
        availableBooks, 
      }));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchReservationStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservationStatus"));
      
      let borrowedQuantity = 0;
      let overdueCount = 0;
      let todayCount = 0;
      let pendingCount = 0;
      
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0]; 

      querySnapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const status = data.status;
        const borrowQuantity = data.borrowQuantity || 0;
        const createdAt = data.createdAt;

        if (status === "Overdue" || status === "Confirmed" || status === "In Use") {
          borrowedQuantity += borrowQuantity;
        }

        if (status === "Overdue") {
          overdueCount += 1;
        }


        if (status === "Pending") {
          pendingCount += 1;
        }

        if (createdAt) {
          const reservationDate = new Date(createdAt).toISOString().split('T')[0];
          if (reservationDate === todayDateString) {
            todayCount += 1;
          }
        }
      });

      setStats((prev) => ({
        ...prev,
        overdueBooks: overdueCount,
        todayReservations: todayCount,
        pendingReservations: pendingCount,
      }));

      setStats((prev) => ({
        ...prev,
        totalBooks: prev.availableBooks + borrowedQuantity,
      }));

    } catch (error) {
      console.error("Error fetching reservation stats:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchUsers();
      await fetchBooks();
      await fetchReservationStats();
    };
    
    fetchAllData();
  }, []);
 
  return (
    <div className="w-full h-full bg-gray-50 p-5">
      <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
   
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Dashboard
              </h1>
              <p className="mt-2 text-gray-600">Welcome to LCC-Isabela Library Management System</p>
            </div>
          </div>
        </div>
        


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
     
          <div 
            onClick={() => handleCardClick(cardRoutes.users)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500 group-hover:bg-blue-600 transition-colors duration-200">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-200">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
            </div>
          </div>


          <div 
            onClick={() => handleCardClick(cardRoutes.books)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-green-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500 group-hover:bg-green-600 transition-colors duration-200">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors duration-200">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
            </div>
          </div>


          <div 
            onClick={() => handleCardClick(cardRoutes.pendingReservations)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-purple-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500 group-hover:bg-purple-600 transition-colors duration-200">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-200">Pending Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations.toLocaleString()}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
            </div>
          </div>

          <div 
            onClick={() => handleCardClick(cardRoutes.availableBooks)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-emerald-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-emerald-500 group-hover:bg-emerald-600 transition-colors duration-200">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors duration-200">Available Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableBooks.toLocaleString()}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
            </div>
          </div>

          <div 
            onClick={() => handleCardClick(cardRoutes.todayReservations)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-orange-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-500 group-hover:bg-orange-600 transition-colors duration-200">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600 transition-colors duration-200">Today's Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayReservations.toLocaleString()}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
            </div>
          </div>

          {/* Overdue Books */}
          <div 
            onClick={() => handleCardClick(cardRoutes.overdueBooks)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-red-300 hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-500 group-hover:bg-red-600 transition-colors duration-200">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors duration-200">Overdue Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks.toLocaleString()}</p>
                </div>
              </div>          
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;