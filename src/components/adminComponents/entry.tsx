import { useState, useEffect } from "react";
import { Search, Users, Filter, FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface Visitor {
  id?: string;
  Name: string;
  Department: string;
  Year: string;
  timestamp: Timestamp;
  uid?: string;
}

export default function EntryLog() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [departments, setDepartments] = useState<string[]>(["All Departments"]);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());

  const isDateInRange = (timestamp: Timestamp | any): boolean => {
    if (!timestamp) return false;

    try {
      let date: Date;
      
      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        return false;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      date.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return date >= start && date <= end;
    } catch (error) {
      console.error("Error checking date range:", error);
      return false;
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = visitor.Name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      visitor.Department?.toLowerCase() === selectedDepartment.toLowerCase();
    const matchesDateRange = isDateInRange(visitor.timestamp);
    
    return matchesSearch && matchesDepartment && matchesDateRange;
  });

  // Real-time listener with snapshot
  useEffect(() => {
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const visitorsData: Visitor[] = querySnapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Visitor),
        }));
        setVisitors(visitorsData);

        // Update departments list
        const uniqueDepartments = Array.from(
          new Set(
            visitorsData
              .map((visitor) => visitor.Department?.trim())
              .filter(Boolean)
          )
        ).sort();

        setDepartments(["All Departments", ...uniqueDepartments]);
      },
      (error) => {
        console.error("Error fetching visitors:", error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const formatTime = (timestamp: Timestamp | any): string => {
    if (!timestamp) return "N/A";

    try {
      // Handle Firestore Timestamp object
      if (timestamp?.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
      
      // Handle ISO string
      if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      }
      
      return "Invalid Date";
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Date";
    }
  };

  const handleExportToExcel = () => {
    // Prepare header data
    const headerData = [
      ['Library Entry Log Report'],
      [`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`],
      selectedDepartment !== "All Departments" ? [`Department: ${selectedDepartment}`] : [],
      [`Total Entries: ${filteredVisitors.length}`],
      [], // Empty row for spacing
    ];

    // Prepare table headers
    const tableHeaders = [
      'Name',
      'Department',
      'Year',
      'Time'
    ];

    // Prepare table data
    const tableData = filteredVisitors.map(visitor => [
      visitor.Name,
      visitor.Department,
      visitor.Year || "Teacher",
      formatTime(visitor.timestamp)
    ]);

    // Combine all data
    const worksheetData = [
      ...headerData,
      tableHeaders,
      ...tableData
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Name
      { wch: 50 }, // Department
      { wch: 15 }, // Year
      { wch: 25 }  // Time
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Entry Log');

    // Generate filename with date
    const filename = `Entry_Log_${startDate}_to_${endDate}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-5">
      {/* Header */}
      <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Library Entry Log
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time updates • {filteredVisitors.length} entries
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-green-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-green-700">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
                />
              </div>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-50 border-b border-green-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 font-semibold text-center">
                    {visitor.Name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-500 text-center">
                    {visitor.Department}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                    {visitor.Year || "Teacher"}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                    {formatTime(visitor.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredVisitors.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-sm sm:text-base">
              No entry records found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}