import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Card, CardContent, Divider, List, ListItem, ListItemText 
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";
import NotificationBell from "../components/NotificationBell"; // ✅ reuse bell component

// ✅ Icons aligned with AdminDashboard style
import AssignmentIcon from "@mui/icons-material/Assignment";   // Claims
import PendingActionsIcon from "@mui/icons-material/PendingActions"; // Pending
import EventIcon from "@mui/icons-material/Event";             // Appointments
import DescriptionIcon from "@mui/icons-material/Description"; // Plans
import PaymentIcon from "@mui/icons-material/Payment";         // Payments

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState<any>({});
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9000/api/employee/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data: " + res.status);
        return res.json();
      })
      .then(data => setEmployeeData(data))
      .catch(err => console.error(err));

    // ✅ Fetch notifications for dashboard snapshot
    fetch("http://localhost:9000/api/employee/notifications/unread", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  const renderCard = (label: string, value: any, icon: React.ReactNode) => (
    <Card
      sx={{
        flex: 1,
        minWidth: "220px",
        height: "160px",
        backgroundColor: "#1a1a2e",
        color: "white",
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6">{label}</Typography>
          <Typography variant="h4" fontWeight="bold">{value ?? 0}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <EmployeeSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Dashboard
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Quick snapshot of your activity
          </Typography>

          {/* Metrics Section */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            {/* First row: 3 cards */}
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              {renderCard("My Claims", employeeData.myClaims, <AssignmentIcon sx={{ fontSize: 40, color: "#4caf50" }} />)}
              {renderCard("Pending Claims", employeeData.pendingClaims, <PendingActionsIcon sx={{ fontSize: 40, color: "#ff9800" }} />)}
              {renderCard("Upcoming Appointments", employeeData.upcomingAppointments, <EventIcon sx={{ fontSize: 40, color: "#2196f3" }} />)}
            </Box>

            {/* Second row: 2 cards */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {renderCard("Active Plans", employeeData.activePolicies, <DescriptionIcon sx={{ fontSize: 40, color: "#9c27b0" }} />)}
              {renderCard("Payments Made", employeeData.paymentsMade, <PaymentIcon sx={{ fontSize: 40, color: "#f44336" }} />)}
            </Box>
          </Paper>

          {/* ✅ Notifications Snapshot */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Notifications
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#1a1a2e" }}>
              {notifications.length > 0 ? (
                <List>
                  {notifications.slice(0, 5).map((n) => (
                    <ListItem key={n.id} sx={{ color: "white" }}>
                      <ListItemText
                        primary={n.message}
                        secondary={new Date(n.timestamp).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="gray">
                  No new notifications
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: "center", color: "gray" }}>
            <Typography variant="body2">
              Welcome back! Here’s a quick snapshot of your activity.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
