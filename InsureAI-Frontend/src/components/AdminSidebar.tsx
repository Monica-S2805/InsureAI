import { Box, List, ListItemText, Divider, ListItemButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Import Material-UI icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PolicyIcon from '@mui/icons-material/Assignment'; // using Assignment as "Policies"
import DescriptionIcon from '@mui/icons-material/Description'; // for Claims
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart'; // for Reports
import LogoutIcon from '@mui/icons-material/Logout';

// ✅ Import notification bell and voice assistant
import NotificationBell from "../components/NotificationBell";
import VoiceAssistantButton from "../components/VoiceAssistantButton";

export default function AdminSidebar() {
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
        p: 2
      }}
    >
      <Box>
        <ListItemText
          primary="Admin"
          sx={{ fontWeight: "bold", mb: 1, color: "white" }}
        />
        <Divider sx={{ backgroundColor: "gray", mb: 2 }} />

        <ListItemButton component={Link} to="/admin/dashboard">
          <DashboardIcon sx={{ color: "#4caf50", mr: 1 }} /> {/* Green */}
          <ListItemText primary="Dashboard" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/users">
          <PeopleIcon sx={{ color: "#2196f3", mr: 1 }} /> {/* Blue */}
          <ListItemText primary="Users" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/policies">
          <PolicyIcon sx={{ color: "#ff9800", mr: 1 }} /> {/* Orange */}
          <ListItemText primary="Policies" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/claims">
          <DescriptionIcon sx={{ color: "#f44336", mr: 1 }} /> {/* Red */}
          <ListItemText primary="Claims" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/appointments">
          <EventIcon sx={{ color: "#9c27b0", mr: 1 }} /> {/* Purple */}
          <ListItemText primary="Appointments" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/admin/analytics">
          <BarChartIcon sx={{ color: "#00bcd4", mr: 1 }} /> {/* Cyan */}
          <ListItemText primary="Analytics" sx={{ color: "white" }} />
        </ListItemButton>
      </Box>

        <Divider sx={{ backgroundColor: "gray", mt: 2, mb: 2 }} />
      {/* ✅ Voice Assistant + Logout at bottom */}
      <Box sx={{ mt: 2 }}>
        <VoiceAssistantButton role="ADMIN" />

        <Divider sx={{ backgroundColor: "gray", mt: 2, mb: 2 }} />
        <ListItemButton onClick={handleLogout}>
          <LogoutIcon sx={{ color: "#e91e63", mr: 1 }} /> {/* Pink */}
          <ListItemText primary="Logout" sx={{ color: "white" }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}
