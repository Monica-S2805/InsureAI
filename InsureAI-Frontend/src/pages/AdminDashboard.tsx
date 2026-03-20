import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Stack, Table,
  TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemText
} from "@mui/material";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

// ✅ Import Material-UI icons
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CancelIcon from "@mui/icons-material/Cancel";

interface Metric {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface Plan {
  id: number;
  policyNumber: string;
  name: string;
  type: string;
  premium: string;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [recentPlans, setRecentPlans] = useState<Plan[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9000/api/admin/metrics", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const enriched = data.map((m: Metric) => {
          switch (m.label) {
            case "Total Users":
              return { ...m, icon: <PeopleIcon sx={{ fontSize: 40, color: "#4caf50" }} /> };
            case "Total Appointments":
              return { ...m, icon: <EventIcon sx={{ fontSize: 40, color: "#2196f3" }} /> };
            case "Active Plans":
              return { ...m, icon: <AssignmentIcon sx={{ fontSize: 40, color: "#ff9800" }} /> };
            case "Inactive Plans":
              return { ...m, icon: <CancelIcon sx={{ fontSize: 40, color: "#f44336" }} /> };
            case "Total Plans":
              return { ...m, icon: <AssignmentIcon sx={{ fontSize: 40, color: "#9c27b0" }} /> };
            default:
              return m;
          }
        });
        setMetrics(enriched);
      })
      .catch(() => setMetrics([]));

    fetch("http://localhost:9000/api/policies", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setRecentPlans(data))
      .catch(() => setRecentPlans([]));

    // ✅ Fetch notifications
    fetch("http://localhost:9000/api/admin/notifications/unread", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setNotifications(data))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            Dashboard Overview
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white" }}>
            System statistics and key metrics at a glance
          </Typography>

          {/* Metrics Section */}
          <Stack direction="column" spacing={3} sx={{ mb: 4 }}>
            {/* First row */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {metrics.slice(0, 3).map((metric, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 3,
                    backgroundColor: "#1a1a2e",
                    textAlign: "center",
                    flex: "1 1 200px",
                    minWidth: "200px",
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.5)"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    {metric.icon && (
                      <Box
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "50%",
                          p: 1.5,
                          display: "inline-flex"
                        }}
                      >
                        {metric.icon}
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                    {metric.value}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            {/* Second row */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {metrics.slice(3).map((metric, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 3,
                    backgroundColor: "#1a1a2e",
                    textAlign: "center",
                    flex: "1 1 200px",
                    minWidth: "200px",
                    borderRadius: 2,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.5)"
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    {metric.icon && (
                      <Box
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          borderRadius: "50%",
                          p: 1.5,
                          display: "inline-flex"
                        }}
                      >
                        {metric.icon}
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                    {metric.value}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Stack>

          {/* Recent Plans Section */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Recent Plans
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Type</TableCell>
                  <TableCell sx={{ color: "white" }}>Premium</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPlans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell sx={{ color: "white" }}>{plan.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{plan.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{plan.type}</TableCell>
                    <TableCell sx={{ color: "white" }}>{plan.premium}</TableCell>
                    <TableCell sx={{ color: "white" }}>{plan.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* ✅ Notifications Section */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Notifications
            </Typography>
            {notifications.length > 0 ? (
              <List>
                {notifications.slice(0, 5).map((n) => (
                  <ListItem key={n.id}>
                    <ListItemText
                      primary={<Typography sx={{ color: "white" }}>{n.message}</Typography>}
                      secondary={<Typography sx={{ color: "white" }}>{new Date(n.timestamp).toLocaleString()}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: "white" }}>
                No new notifications
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </>
  );
}
