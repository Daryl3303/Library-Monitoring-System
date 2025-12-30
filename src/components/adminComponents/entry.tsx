import { useState, useEffect, useRef } from "react";
import { Search, Users } from "lucide-react";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

interface Visitor {
  id?: string;
  Name: string;
  Department: string;
  Year: string;
  timestamp: string;
  uid?: string;
}

export default function EntryLog() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  const [departments, setDepartments] = useState<string[]>(["All Departments"]);
  const [scannerInput, setScannerInput] = useState("");
  const [lastScannedTime, setLastScannedTime] = useState(0);
  const scannerRef = useRef<HTMLInputElement>(null);

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = visitor.Name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      visitor.Department?.toLowerCase() === selectedDepartment.toLowerCase();
    return matchesSearch && matchesDepartment;
  });

  // Real-time listener with snapshot
  useEffect(() => {
    const q = query(collection(db, "logs"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
    }, (error) => {
      console.error("Error fetching visitors:", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Keep scanner input focused
  useEffect(() => {
    const focusScanner = () => {
      if (scannerRef.current && document.activeElement !== scannerRef.current) {
        scannerRef.current.focus();
      }
    };

    focusScanner();
    const focusInterval = setInterval(focusScanner, 1000);

    return () => clearInterval(focusInterval);
  }, []);

  const handleScannerInput = async (userId: string) => {
    if (!userId.trim()) return;

    // Prevent duplicate scans within 2 seconds
    const now = Date.now();
    if (now - lastScannedTime < 2000) {
      setScannerInput("");
      return;
    }

    setLastScannedTime(now);

    try {
      // Fetch user data from users collection using the scanned userId
      const userRef = doc(db, "users", userId.trim());
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        showNotification("✗ User not found in database", "error");
        setScannerInput("");
        return;
      }

      const userData = userSnap.data();
      
      // Add entry to Firebase logs collection
      const entryData = {
        Name: userData.Name || userData.name,
        Department: userData.Department || userData.department,
        Year: userData.Year || userData.year,
        timestamp: new Date().toISOString(),
        uid: userId.trim(),
      };

      await addDoc(collection(db, "logs"), entryData);
      
      // Show success notification
      showNotification(`✓ Entry logged: ${userData.Name || userData.name}`, "success");
      
      // No need to manually refresh - snapshot will update automatically
      
    } catch (error) {
      console.error("Error processing QR code:", error);
      showNotification("✗ Error logging entry", "error");
    } finally {
      setScannerInput("");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const formatTime = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div>
      {/* Hidden scanner input - Hardware scanner will type here */}
      <input
        ref={scannerRef}
        type="text"
        value={scannerInput}
        onChange={(e) => setScannerInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleScannerInput(scannerInput);
          }
        }}
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      <div className="w-full h-full bg-gray-50 p-5">
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
                  Real-time updates • {visitors.length} entries
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-green-800">
          <div className="p-4 sm:p-6 border-b border-green-700">
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
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 border-b border-green-700">
                <tr>
                  {["Name", "Department", "Year", "Time"].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-200">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 font-semibold text-center">
                      {visitor.Name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {visitor.Department}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {visitor.Year}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {formatTime(visitor.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVisitors.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No entry records found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}