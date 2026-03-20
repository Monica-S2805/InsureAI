import { Box, List, ListItemButton, ListItemText, Divider, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LogoutIcon from "@mui/icons-material/Logout";

import VoiceAssistantButton from "../components/VoiceAssistantButton";

export default function AgentSidebar() {
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
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Agent
      </Typography>
      <Divider sx={{ borderColor: "gray", mb: 2 }} />

      <List>
        <ListItemButton component={Link} to="/agent/dashboard">
          <DashboardIcon sx={{ mr: 2, color: "#4caf50" }} />
          <ListItemText primary="Dashboard" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/agent/appointments">
          <EventIcon sx={{ mr: 2, color: "#2196f3" }} />
          <ListItemText primary="My Appointments" sx={{ color: "white" }} />
        </ListItemButton>

        <ListItemButton component={Link} to="/agent/availability">
          <AccessTimeIcon sx={{ mr: 2, color: "#ff9800" }} />
          <ListItemText primary="Manage Availability" sx={{ color: "white" }} />
        </ListItemButton>
      </List>

      <Divider sx={{ backgroundColor: "gray", mt: 2, mb: 2 }} />
 {/* Voice Assistant below Logout */}
      <VoiceAssistantButton role="AGENT" />

      {/* ✅ Place Logout immediately after navigation */}
      <ListItemButton onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 2, color: "#f44336" }} />
        <ListItemText primary="Logout" sx={{ color: "white" }} />
      </ListItemButton>

     
    </Box>
  );
}
