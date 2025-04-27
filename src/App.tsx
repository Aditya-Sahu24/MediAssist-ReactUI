import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Reports from "./pages/Reports";
import Prescriptions from "./pages/Prescriptions";
import MedicalRecords from "./pages/MedicalRecords";
import Billing from "./pages/Billing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ReactNode } from "react";

const Layout = ({
  children,
  isLoggedIn,
}: {
  children: ReactNode;
  isLoggedIn: boolean;
}) => {
  const location = useLocation();
  const authRoutes = ["/login", "/signup", "/"];

  const showSidebar = !authRoutes.includes(location.pathname) && isLoggedIn;
  const mainContentMarginTop = showSidebar ? "mt-28" : "";

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <div
          className={`flex-1 bg-gray-100 overflow-auto ${mainContentMarginTop}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem("token");
  });

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Protected Routes */}
          {isLoggedIn && (
            <>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
            </>
          )}

          {/* Fallback */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
