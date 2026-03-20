import { Box, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";

import NotificationBell from "../components/NotificationBell";
import VoiceAssistantButton from "../components/VoiceAssistantButton";

export default function EmployeeSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#1a1a2e",
        color: "white",
        minHeight: "100vh",
        p: 2,
        
      }}
    >
      {/* Top section */}
      <Box>
        <ListItemText
          primary="Employee"
          sx={{ fontWeight: "bold", mb: 1, color: "white" }}
        />
        <Divider sx={{ backgroundColor: "#333", mb: 2 }} />

        <ListItemButton component={Link} to="/employee/dashboard">
          <DashboardIcon sx={{ mr: 2, color: "#4caf50" }} />
          <ListItemText primary="Dashboard" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/employee/policies">
          <DescriptionIcon sx={{ mr: 2, color: "#2196f3" }} />
          <ListItemText primary="Policies" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/employee/claims">
          <AssignmentIcon sx={{ mr: 2, color: "#ff9800" }} />
          <ListItemText primary="Claims" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/employee/appointments">
          <EventIcon sx={{ mr: 2, color: "#9c27b0" }} />
          <ListItemText primary="Appointments" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/employee/payments">
          <PaymentIcon sx={{ mr: 2, color: "#f44336" }} />
          <ListItemText primary="Payments" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/employee/reports">
          <BarChartIcon sx={{ mr: 2, color: "#00bcd4" }} />
          <ListItemText primary="Analytics" sx={{ color: "white" }} />
        </ListItemButton>

        <Divider sx={{ backgroundColor: "#333", mt: 2, mb: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
          <ListItemText primary="Notifications" sx={{ color: "white" }} />
          <NotificationBell role="employee" />
        </Box>
      </Box>
<Divider sx={{ backgroundColor: "#333", mt: 2, mb: 2 }} />
      {/* Bottom section pinned */}
      <Box sx={{ mt: "auto" }}>
        <VoiceAssistantButton role="EMPLOYEE" />
        <Divider sx={{ backgroundColor: "#333", mt: 2, mb: 2 }} />
        <ListItemButton onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2, color: "#e91e63" }} />
          <ListItemText primary="Logout" sx={{ color: "white" }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}
