import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from'./pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeePolicies from './pages/EmployeePolicies';
import EmployeeClaims from './pages/EmployeeClaims';
import EmployeeAppointments from './pages/EmployeeAppointments';
import EmployeePayments from './pages/EmployeePayments';
import EmployeeReports from './pages/EmployeeReports';
import AgentDashboard from './pages/AgentDashboard';
import AgentAppointments from './pages/AgentAppointments';
import AgentAvailability from './pages/AgentAvailability';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPolicies from './pages/AdminPolicies';
import AdminUsers from './pages/AdminUsers';
import AdminClaims from './pages/AdminClaims';
import AdminAppointments from './pages/AdminAppointments';
import AdminAnalytics from './pages/AdminAnalytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/appointments"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/availability"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentAvailability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/policies"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>  
              <EmployeePolicies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/appointments"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/payments"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeePayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/reports"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeReports />
            </ProtectedRoute>
          }
        />
      

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/policies"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminPolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/claims"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminClaims />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />


        <Route
          path="/employee/claims"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeClaims />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
