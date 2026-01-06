import SignIn from "./components/SignIn.tsx";
import AdminSignIn from "./components/adminSignIn.tsx";
import Admin from "./components/Admin.tsx";
import UserMain from "./components/UserMain.tsx";
import ScannerLogger from "./components/Scan.tsx";
import ProtectedRoute from "./context/protectedRoute.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/scan" element={<ScannerLogger />} />
        <Route path="/admin/signIn" element={<AdminSignIn />} />

   
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

  
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserMain />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/signIn" replace />} />
        <Route path="*" element={<Navigate to="/signIn" replace />} />
      </Routes>
    </Router>
  );
};

export default App;