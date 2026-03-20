import { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface Notification {
  id: number;
  message: string;
  status: string;
  timestamp: string;
}

export default function NotificationBell({ role }: { role: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  const fetchNotifications = async () => {
    const res = await fetch(`http://localhost:9000/api/${role}/notifications`, {
      headers: authHeader()
    });
    const data = await res.json();
    setNotifications(data);
  };

  const fetchUnreadCount = async () => {
    const res = await fetch(`http://localhost:9000/api/${role}/notifications/count`, {
      headers: authHeader()
    });
    const data = await res.json();
    setUnreadCount(data);
  };

  const markAsRead = async (id: number) => {
    await fetch(`http://localhost:9000/api/${role}/notifications/${id}/read`, {
      method: "PUT",
      headers: authHeader()
    });
    fetchNotifications();
    fetchUnreadCount();
  };

  const deleteNotification = async (id: number) => {
    await fetch(`http://localhost:9000/api/${role}/notifications/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });
    fetchNotifications();
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { width: 300 } }}
      >
        {notifications.length > 0 ? (
          notifications.map(n => (
            <MenuItem key={n.id} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body2" sx={{ fontWeight: n.status === "UNREAD" ? "bold" : "normal" }}>
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.timestamp).toLocaleString()}
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                {n.status === "UNREAD" && (
                  <Button size="small" onClick={() => markAsRead(n.id)}>Mark as Read</Button>
                )}
                <Button size="small" color="error" onClick={() => deleteNotification(n.id)}>Delete</Button>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
