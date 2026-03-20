import { useState, useEffect } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import Navbar from "../components/Navbar";
import AgentSidebar from "../components/AgentSidebar";

interface Metric {
  label: string;
  value: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export default function AgentDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  // ✅ Fetch agent metrics
  const fetchMetrics = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/agent/metrics", {
        headers: authHeader()
      });

      if (!res.ok) {
        console.error("Failed to fetch metrics:", res.status, await res.text());
        setMetrics([]);
        return;
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setMetrics(data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setMetrics([]);
    }
  };

  // ✅ Fetch agent notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/agent/notifications/unread", {
        headers: authHeader()
      });
      if (!res.ok) {
        console.error("Failed to fetch notifications:", res.status);
        setNotifications([]);
        return;
      }
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchNotifications();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AgentSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            Agent Dashboard
          </Typography>

          {/* Flexbox row of cards */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {metrics.map((metric, index) => (
              <Paper
                key={index}
                sx={{
                  flex: "1 1 200px",
                  p: 3,
                  backgroundColor: "#1a1a2e",
                  textAlign: "center"
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  {metric.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
                  {metric.value}
                </Typography>
              </Paper>
            ))}
            {metrics.length === 0 && (
              <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", textAlign: "center", flex: "1 1 100%" }}>
                <Typography sx={{ color: "white" }}>
                  No metrics available
                </Typography>
              </Paper>
            )}
          </Box>

          {/* ✅ Notifications Snapshot */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
              Notifications
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#1a1a2e" }}>
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
      </Box>
    </>
  );
}
