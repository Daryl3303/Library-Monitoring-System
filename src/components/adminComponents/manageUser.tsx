// LibraryUserTable.tsx
import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, User } from "lucide-react";
import UserFormModal from "../modals/AddUser";
import DeleteConfirmationModal from "../modals/DeleteUser";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  deleteUser, 
} from "firebase/auth";
import { db } from "../../firebase/firebase";

interface User {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  number: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
}

interface FormData {
  name: string;
  email: string;
  password: string;
  number: string;
  department: string;
  year: string;
  role: "Student" | "Teacher" | "Admin";
}

const departments = [
  "All Departments",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Business Administration ",
  "Bachelor of Science in Hospital Management",
  "Bachelor of Science in Elementary Education ",
  "Bachelor of Science in Secondary Education",
];

export default function LibraryUserTable() {
  const auth = getAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    number: "",
    department: "",
    year: "",
    role: "Student",
  });

  // Filter users based on search and department
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData: User[] = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as User),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      // 1️⃣ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2️⃣ Update display name
      if (formData.name) {
        await updateProfile(user, { displayName: formData.name });
      }

      // 3️⃣ Add user record to Firestore
      const docRef = await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        number: formData.number || "",
        department: formData.department || "",
        year: formData.role === "Student" ? formData.year : "",
        role: formData.role,
        createdAt: new Date(),
      });

      // 4️⃣ Update local state - FIXED VERSION
      const newUser: User = {
        id: docRef.id,
        uid: user.uid,
        name: formData.name, 
        email: formData.email, 
        number: formData.number,
        department: formData.department,
        year: formData.year,
        role: formData.role,
      };

      setUsers([...users, newUser]);

      // 5️⃣ Close modal + reset form
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      console.error("Error adding user:", error.message);
    }
  };

  const handleEditUser = async () => {
     if (selectedUser) {
    try {
      const currentAuthUser = auth.currentUser;
      

      if (currentAuthUser && currentAuthUser.uid === selectedUser.uid) {
        if (formData.name !== selectedUser.name) {
          await updateProfile(currentAuthUser, { 
            displayName: formData.name 
          });
        }

        if (formData.password && formData.password.trim() !== "") {
          await updatePassword(currentAuthUser, formData.password);
        }
      }
      const userRef = doc(db, "users", selectedUser.id as string);
      const updateData = {
        name: formData.name,
        number: formData.number,
        department: formData.department,
        year: formData.year,
        role: formData.role,
        updatedAt: new Date(),
      };
      
      await updateDoc(userRef, updateData);

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id 
            ? { 
                ...user, 
                name: formData.name,
                number: formData.number,
                department: formData.department,
                year: formData.year,
                role: formData.role,
              }
            : user
        )
      );

      setShowEditModal(false);
      resetForm();
      
      console.log("User updated successfully");
      
    } catch (error: any) {
      console.error("Error updating user:", error);
    }
  }
};

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteDoc(doc(db, "users", selectedUser.id as string));

        setUsers(users.filter((user) => user.id !== selectedUser.id));

        setShowDeleteModal(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      number: "",
      department: "",
      year: "",
      role: "Student",
    });
    setSelectedUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      number: user.number,
      department: user.department,
      year: user.year,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                User Management
              </h1>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-[20px] border border-blue-800 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-blue-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              {/* Left side - Search + Department Filter */}
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
              </div>

              {/* Right side - Add User Button */}
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md flex items-center justify-center hover:scale-105 duration-300 gap-2 transition-colors w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm sm:text-base">Add User</span>
              </button>
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
                    "Number",
                    "Department",
                    "Year",
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-900 text-center">
                      {user.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {user.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-500 text-center">
                      {user.number}
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
                      <div className="flex gap-2 justify-start sm:justify-center">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors hover:scale-110 duration-200"
                        >
                          <Edit2 className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-800 transition-colors hover:scale-110 duration-200"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No users found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals remain unchanged */}
      <UserFormModal
        isOpen={showAddModal}
        isEdit={false}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddUser}
        onClose={closeModals}
      />

      <UserFormModal
        isOpen={showEditModal}
        isEdit={true}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditUser}
        onClose={closeModals}
      />

      {selectedUser && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          user={selectedUser}
          onConfirm={handleDeleteUser}
          onCancel={closeModals}
        />
      )}
    </div>
  );
}
