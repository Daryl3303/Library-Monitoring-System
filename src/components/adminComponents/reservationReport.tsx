import { useState, useEffect } from "react";
import { BarChart3, Filter, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';

import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface ReservationData {
  id?: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" ;
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
  "Bachelor in Elementary Education",
  "Bachelor in Secondary Education",
];

const ReservationReport = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [reservationCounts, setReservationCounts] = useState<ReservationCount[]>([]);
  
  const getCurrentMonthDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };
  
  const defaultDates = getCurrentMonthDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);

  const isDateInRange = (dateString: string): boolean => {
    const date = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    return date >= start && date <= end;
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
      
      return isDateInRange(dateString);
    });

    filteredReservations.forEach((reservation) => {
      const dept = reservation.department;
      
      if (!counts[dept]) {
        return;
      }

      const role = reservation.role?.toString().trim();
      
      if (role === "Student") {
        const year = reservation.year?.toString().trim();
        switch (year) {
          case "1st Year":
            counts[dept].studentYear1++;
            break;
          case "2nd Year":
            counts[dept].studentYear2++;
            break;
          case "3rd Year":
            counts[dept].studentYear3++;
            break;
          case "4th Year":
            counts[dept].studentYear4++;
            break;
        }
      } else if (role === "Teacher") {
        counts[dept].teacher++;
      }
      
      counts[dept].total++;
    });

    setReservationCounts(Object.values(counts));
  };

  const handleExportToExcel = () => {
    // Prepare header data
    const headerData = [
      ['Reservation Status Report'],
      [`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`],
      selectedDepartment !== "All Departments" ? [`Department: ${selectedDepartment}`] : [],
      [], // Empty row for spacing
    ];

    // Prepare table headers
    const tableHeaders = [
      'Department',
      '1st Year',
      '2nd Year',
      '3rd Year',
      '4th Year',
      'Teachers',
      'Total'
    ];

    // Prepare table data
    const tableData = reservationCounts
      .sort((a, b) => a.department.localeCompare(b.department))
      .map(count => [
        count.department,
        count.studentYear1,
        count.studentYear2,
        count.studentYear3,
        count.studentYear4,
        count.teacher,
        count.total
      ]);

    // Add summary row
    const totalStudents = reservationCounts.reduce((sum, count) => 
      sum + count.studentYear1 + count.studentYear2 + count.studentYear3 + count.studentYear4, 0
    );
    const totalTeachers = reservationCounts.reduce((sum, count) => sum + count.teacher, 0);
    const overallTotal = reservationCounts.reduce((sum, count) => sum + count.total, 0);

    const summaryData = [
      [], // Empty row
      ['Summary'],
      ['Total Students', totalStudents],
      ['Total Teachers', totalTeachers],
      ['Total Reservations', overallTotal]
    ];

    // Combine all data
    const worksheetData = [
      ...headerData,
      tableHeaders,
      ...tableData,
      ...summaryData
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    ws['!cols'] = [
      { wch: 50 }, // Department
      { wch: 10 }, // 1st Year
      { wch: 10 }, // 2nd Year
      { wch: 10 }, // 3rd Year
      { wch: 10 }, // 4th Year
      { wch: 10 }, // Teachers
      { wch: 10 }  // Total
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reservation Report');

    // Generate filename with date
    const filename = `Reservation_Report_${startDate}_to_${endDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

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
  }, [reservations, selectedDepartment, startDate, endDate]); 

  return (
    <div>
      <div className="w-full h-full bg-gray-50 p-5">
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
            <div className="flex flex-col gap-4">
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
                  <label className="text-sm font-medium text-gray-700">Date Range:</label>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">From:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">To:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleExportToExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors sm:ml-auto"
                >
                  <FileDown className="w-4 h-4" />
                  Export to Excel
                </button>
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
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    1st Year
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    2nd Year
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    3rd Year
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    4th Year
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Teachers
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {reservationCounts
                  .sort((a, b) => a.department.localeCompare(b.department))
                  .map((count) => (
                    <tr key={count.department} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 text-gray-900 text-left text-xs sm:text-sm">
                        {count.department}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                          {count.studentYear1}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {count.studentYear2}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          {count.studentYear3}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full font-medium">
                          {count.studentYear4}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                          {count.teacher}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold">
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