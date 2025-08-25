import { useState, useEffect} from 'react';
import {
  Users,
  Book,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

interface DashboardProps {
  stats?: {
    totalUsers: number;
    totalBooks: number;
    activeReservations: number;
    overdueBooks: number;
    todayReservations: number;
    availableBooks: number
  };
}

const Dashboard: React.FC<DashboardProps> = ( {}) => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeReservations: 0,
    overdueBooks: 0,
    todayReservations: 0,
    availableBooks: 0
  });

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

  const totalBooks = querySnapshot.docs.reduce((acc, docSnap) => {
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
    totalBooks, 
  }));
} catch (error) {
  console.error("Error fetching books:", error);
}
};


  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);
 
  return (
    <div className="bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to LCC-Isabela Library Management System</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Reservations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeReservations.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-emerald-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableBooks.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reservations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-orange-500">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayReservations.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Books */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-500">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks.toLocaleString()}</p>
                </div>
              </div>          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;