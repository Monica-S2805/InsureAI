import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface AdminReportData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  totalUsers: number;
  totalClaims: number;
  approvedClaims: number;
  pendingClaims: number;
  rejectedClaims: number;
}

export default function AdminAnalytics() {
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  // ✅ Fetch admin analytics
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/admin/analytics/summary", {
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to fetch reports: " + res.status);
      const data = await res.json();
      setReportData(data);
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Chart data
  const chartData = reportData
    ? [
        { name: "Appointments", value: reportData.totalAppointments },
        { name: "Plans", value: reportData.totalPlans },
        { name: "Users", value: reportData.totalUsers },
        { name: "Claims", value: reportData.totalClaims }
      ]
    : [];

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            Admin Analytics
          </Typography>

          {/* Summary Metrics */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", mb: 4 }}>
            {reportData ? (
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Typography sx={{ color: "white" }}>Appointments: {reportData.totalAppointments}</Typography>
                <Typography sx={{ color: "white" }}>Completed: {reportData.completedAppointments}</Typography>
                <Typography sx={{ color: "white" }}>Cancelled: {reportData.cancelledAppointments}</Typography>
                <Typography sx={{ color: "white" }}>Plans: {reportData.totalPlans}</Typography>
                <Typography sx={{ color: "white" }}>Active Plans: {reportData.activePlans}</Typography>
                <Typography sx={{ color: "white" }}>Inactive Plans: {reportData.inactivePlans}</Typography>
                <Typography sx={{ color: "white" }}>Users: {reportData.totalUsers}</Typography>
                <Typography sx={{ color: "white" }}>Claims: {reportData.totalClaims}</Typography>
                <Typography sx={{ color: "white" }}>Approved Claims: {reportData.approvedClaims}</Typography>
                <Typography sx={{ color: "white" }}>Pending Claims: {reportData.pendingClaims}</Typography>
                <Typography sx={{ color: "white" }}>Rejected Claims: {reportData.rejectedClaims}</Typography>
              </Box>
            ) : (
              <Typography sx={{ color: "white" }}>No report data available</Typography>
            )}
          </Paper>

          {/* Charts */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Analytics Overview
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ color: "white", textAlign: "center" }}>
                No analytics data available
              </Typography>
            )}
          </Paper>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ open: false, message: "" })}
            message={snackbar.message}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </Box>
      </Box>
    </>
  );
}
