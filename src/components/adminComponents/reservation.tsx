
import { useState } from 'react';
import { Search, BookOpenCheck, X, Check } from 'lucide-react';

const Reservation = () => {
  // Sample data for pending user registrations
  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      department: "Computer Science",
      year: "2nd Year",
      address: "123 Main St, Cebu City",
      phone: "+63 912 345 6789",
      bookTitle: "Introduction to Algorithms",
      createdAt: "2025-08-1",
      role: "Student",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      department: "Information Technology",
      year: "3rd Year",
      address: "456 Oak Ave, Mandaue City",
      phone: "+63 923 456 7890",
      bookTitle: "Database Management Systems",
      createdAt: "2025-7-20",
      role: "Student",
    },
    {
      id: 3,
      name: "Robert Chen",
      email: "robert.chen@email.com",
      department: "Computer Science",
      year: "",
      address: "789 Pine St, Lapu-Lapu City",
      phone: "+63 934 567 8901",
      bookTitle: "Advanced Data Structures",
      createdAt: "2024-02-05",
      role: "Teacher",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      department: "Information Technology",
      year: "1st Year",
      address: "321 Elm St, Talisay City",
      phone: "+63 945 678 9012",
      bookTitle: "Web Development Fundamentals",
      createdAt: "2024-02-10",
      role: "Student",
    },
    {
      id: 5,
      name: "Michael Torres",
      email: "michael.torres@email.com",
      department: "Computer Engineering",
      year: "4th Year",
      address: "654 Maple Dr, Consolacion",
      phone: "+63 956 789 0123",
      bookTitle: "Digital Signal Processing",
      createdAt: "2025-08-22",
      role: "Student",
    },
    {
      id: 6,
      name: "Dr. Lisa Rodriguez",
      email: "lisa.rodriguez@email.com",
      department: "Computer Engineering",
      year: "",
      address: "987 Cedar Ln, Cebu City",
      phone: "+63 967 890 1234",
      bookTitle: "Machine Learning Concepts",
      createdAt: "2024-02-15",
      role: "Teacher",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Time");

  // Extract unique departments for filter dropdown
  const departments = [
    "All Departments",
    ...new Set(users.map((user) => user.department)),
  ];

  // Date filter options
  const dateFilters = [
    "All Time",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
  ] as const;

  // Helper function to check if date matches filter
  type DateFilter =
    | "All Time"
    | "Last 7 Days"
    | "Last 30 Days"
    | "This Month"
    | "Last Month";

  const isDateInRange = (dateString: string, filter: DateFilter): boolean => {
    if (filter === "All Time") return true;

    const date = new Date(dateString);
    const now = new Date();

    // Reset time to start of day for accurate comparison
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysDiff =
      (nowOnly.getTime() - dateOnly.getTime()) / (1000 * 60 * 60 * 24);

    switch (filter) {
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

  // ✅ Handle confirm
  const handleConfirm = (userId: number) => {
    console.log(`✅ Confirmed user with ID: ${userId}`);
    // Here you can update state or call backend API
  };

  // ✅ Handle decline
  const handleDecline = (userId: number) => {
    console.log(`❌ Declined user with ID: ${userId}`);
    // Here you can update state or call backend API
  };

  // ✅ Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      user.department === selectedDepartment;
    const matchesDate = isDateInRange(
      user.createdAt,
      selectedDateFilter as DateFilter
    );

    return matchesSearch && matchesDepartment && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <BookOpenCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Book Reservations
              </h1>
            </div>
          </div>
        </div>


        {/* User Management Section */}
        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Left side - Search + Filters */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>

                {/* Department Filter */}
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

                {/* Date Filter */}
                <select
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-blue-700">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Department",
                    "Year",
                    "Address",
                    "Phone#",
                    "Book Title",
                    "Created At",
                    "Role",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-200">
                {filteredUsers
                .slice()
                .sort((a,b) => a.name.localeCompare(b.name))
                .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 text-center">
                      {user.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {user.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {user.department}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.year === "1st Year"
                            ? "bg-red-300 text-red-900"
                            : user.year === "2nd Year"
                            ? "bg-blue-300 text-blue-900"
                            : user.year === "3rd Year"
                            ? "bg-green-300 text-green-900"
                            : user.year === "4th Year"
                            ? "bg-gray-300 text-gray-900"
                            : "bg-yellow-300 text-yellow-900"
                        }`}
                      >
                        {user.year === "" ? "N/A" : user.year}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate" title={user.address}>
                        {user.address}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {user.phone}
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 text-center max-w-xs">
                      <div className="truncate" title={user.bookTitle}>
                        {user.bookTitle}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "Admin"
                            ? "bg-red-100 text-red-800"
                            : user.role === "Teacher"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleConfirm(user.id)}
                          className="bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800 p-2 rounded-lg transition-colors hover:scale-110 duration-200"
                          title="Confirm"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDecline(user.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors hover:scale-110 duration-200"
                          title="Decline"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No pending registrations found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;