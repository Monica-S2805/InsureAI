import { useState, useEffect } from "react";

export interface Notification {
  id: number;
  message: string;
  status: string;   // UNREAD or READ
  type?: string;    // INFO, SUCCESS, WARNING
  timestamp: string;
}

export function useNotifications(role: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:9000/api/${role}/notifications`, {
        headers: authHeader()
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`http://localhost:9000/api/${role}/notifications/count`, {
        headers: authHeader()
      });
      const data = await res.json();
      setUnreadCount(data);
    } catch (err) {
      console.error("Error fetching unread count", err);
    }
  };

  const markAsRead = async (id: number) => {
    await fetch(`http://localhost:9000/api/${role}/notifications/${id}/read`, {
      method: "PUT",
      headers: authHeader()
    });
    await fetchNotifications();
    await fetchUnreadCount();
  };

  const deleteNotification = async (id: number) => {
    await fetch(`http://localhost:9000/api/${role}/notifications/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });
    await fetchNotifications();
    await fetchUnreadCount();
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [role]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification
  };
}
