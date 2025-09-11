import { useState, useEffect } from "react";
import { BarChart3, Filter } from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface ReservationData {
  id?: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
  reservationDate?: any;
  createdAt?: any; 
}

interface ReservationCount {
  department: string;
  studentYear1: number;
  studentYear2: number;
  studentYear3: number;
  studentYear4: number;
  teacher: number;
  total: number;
}

const departments = [
  "All Departments",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education",
  "Bachelor of Science in Secondary Education",
];

const dateFilters = [
  "All Time",
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
] as const;

type DateFilter =
  | "All Time"
  | "Today"
  | "Last 7 Days"
  | "Last 30 Days"
  | "This Month"
  | "Last Month";

const ReservationReport = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>("All Time");
  const [reservationCounts, setReservationCounts] = useState<ReservationCount[]>([]);

  
  const isDateInRange = (dateString: string, filter: DateFilter): boolean => {
    if (filter === "All Time") return true;

    const date = new Date(dateString);
    const now = new Date();

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysDiff =
      (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24);

    switch (filter) {
      case "Today":
        return daysDiff === 0;
      case "Last 7 Days":
        return daysDiff >= 0 && daysDiff <= 7;
      case "Last 30 Days":
        return daysDiff >= 0 && daysDiff <= 30;
      case "This Month":
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      case "Last Month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );
      default:
        return true;
    }
  };

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservationStatus"));
      const reservationsData: ReservationData[] = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as ReservationData),
      }));
      
      setReservations(reservationsData); 
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const calculateReservationCounts = () => {
    const counts: { [key: string]: ReservationCount } = {};
    
    const depsToProcess = selectedDepartment === "All Departments" 
      ? departments.slice(1) 
      : [selectedDepartment];
    
    console.log("Departments to process:", depsToProcess);
    console.log("Total reservations to process:", reservations.length);
    
    depsToProcess.forEach(dept => {
      counts[dept] = {
        department: dept,
        studentYear1: 0,
        studentYear2: 0,
        studentYear3: 0,
        studentYear4: 0,
        teacher: 0,
        total: 0,
      };
    });

    const filteredReservations = reservations.filter((reservation) => {
      let dateString = reservation.createdAt;
      if (reservation.createdAt && typeof reservation.createdAt.toDate === 'function') {
        dateString = reservation.createdAt.toDate().toISOString();
      } else if (reservation.createdAt && reservation.createdAt.seconds) {
        dateString = new Date(reservation.createdAt.seconds * 1000).toISOString();
      }
      
      return isDateInRange(dateString, selectedDateFilter);
    });

    console.log(`Filtered reservations for ${selectedDateFilter}:`, filteredReservations.length);

    filteredReservations.forEach((reservation, index) => {
      const dept = reservation.department;
      
      console.log(`Processing reservation ${index + 1}:`, {
        id: reservation.id,
        department: dept,
        role: reservation.role,
        year: reservation.year,
        createdAt: reservation.createdAt,
        availableDepts: Object.keys(counts)
      });
      
      if (!counts[dept]) {
        console.log(`Department '${dept}' not found in counts object`);
        return;
      }

      const role = reservation.role?.toString().trim();
      
      if (role === "Student") {
        const year = reservation.year?.toString().trim();
        console.log(`Processing student with year: '${year}'`);
        switch (year) {
          case "1st Year":
            counts[dept].studentYear1++;
            console.log(`1st Year incremented for ${dept}:`, counts[dept].studentYear1);
            break;
          case "2nd Year":
            counts[dept].studentYear2++;
            console.log(`2nd Year incremented for ${dept}:`, counts[dept].studentYear2);
            break;
          case "3rd Year":
            counts[dept].studentYear3++;
            console.log(`3rd Year incremented for ${dept}:`, counts[dept].studentYear3);
            break;
          case "4th Year":
            counts[dept].studentYear4++;
            console.log(`4th Year incremented for ${dept}:`, counts[dept].studentYear4);
            break;
          default:
            console.log(`Unknown year: '${year}'`);
        }
      } else if (role === "Teacher") {
        counts[dept].teacher++;
        console.log(`Teacher count incremented for ${dept}:`, counts[dept].teacher);
      } else {
        console.log(`Unknown role: '${role}'`);
      }
      
      counts[dept].total++;
    });

    console.log("Final counts:", counts);
    setReservationCounts(Object.values(counts));
  };

  // Calculate summary statistics
  const totalStudents = reservationCounts.reduce((sum, count) => 
    sum + count.studentYear1 + count.studentYear2 + count.studentYear3 + count.studentYear4, 0
  );
  const totalTeachers = reservationCounts.reduce((sum, count) => sum + count.teacher, 0);
  const overallTotal = reservationCounts.reduce((sum, count) => sum + count.total, 0);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    calculateReservationCounts();
  }, [reservations, selectedDepartment, selectedDateFilter]); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Reservation Status Report
              </h1>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">Time Period:</label>
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value as DateFilter)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateFilters.map((filter) => (
                    <option key={filter} value={filter}>
                      {filter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

     
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalTeachers}</div>
                <div className="text-sm text-gray-500">Total Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overallTotal}</div>
                <div className="text-sm text-gray-500">Total Reservations</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Department
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    1st Year Students
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    2nd Year Students
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    3rd Year Students
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    4th Year Students
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Teachers
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {reservationCounts
                  .sort((a, b) => a.department.localeCompare(b.department))
                  .map((count) => (
                    <tr key={count.department} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 text-gray-900 text-center text-xs sm:text-sm">
                        {count.department}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          {count.studentYear1}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {count.studentYear2}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {count.studentYear3}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {count.studentYear4}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {count.teacher}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                          {count.total}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {reservationCounts.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No reservation data found for the selected criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationReport;