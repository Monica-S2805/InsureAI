import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Snackbar,
  Card,
  CardContent,
  Button
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface ReportData {
  claimsProcessed: number;
  appointmentsScheduled: number;
  activePolicies: number;
  paymentsMade: number;
}



export default function EmployeeReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  // ✅ Fetch reports
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/employee/reports", {
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
        { name: "Claims", value: reportData.claimsProcessed },
        { name: "Appointments", value: reportData.appointmentsScheduled },
        { name: "Policies", value: reportData.activePolicies },
        { name: "Payments", value: reportData.paymentsMade }
      ]
    : [];

  // ✅ Export endpoints
  const reports = [
    {
      title: "My Claims Report",
      description: "Detailed claims processed by me",
      endpoint: "http://localhost:9000/api/employee/reports/claims/export",
      filename: "employee_claims.csv"
    },
    {
      title: "Appointments Report",
      description: "Scheduled appointments overview",
      endpoint: "http://localhost:9000/api/employee/reports/appointments/export",
      filename: "employee_appointments.csv"
    },
    {
      title: "Policies Report",
      description: "Active policies assigned to me",
      endpoint: "http://localhost:9000/api/employee/reports/policies/export",
      filename: "employee_policies.csv"
    },
    {
      title: "Payments Report",
      description: "Payments made by customers",
      endpoint: "http://localhost:9000/api/employee/reports/payments/export",
      filename: "employee_payments.csv"
    }
  ];

  const handleDownload = (endpoint: string, filename: string) => {
    fetch(endpoint, { headers: authHeader() })
      .then(res => {
        if (!res.ok) throw new Error("Download failed: " + res.status);
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => showMessage(err.message));
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <EmployeeSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            Analytics
          </Typography>

          {/* Summary Metrics */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", mb: 4 }}>
            {reportData ? (
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Typography sx={{ color: "white" }}>Claims Processed: {reportData.claimsProcessed}</Typography>
                <Typography sx={{ color: "white" }}>Appointments Scheduled: {reportData.appointmentsScheduled}</Typography>
                <Typography sx={{ color: "white" }}>Active Policies: {reportData.activePolicies}</Typography>
                <Typography sx={{ color: "white" }}>Payments Made: {reportData.paymentsMade}</Typography>
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
                  <Bar dataKey="value" fill="#4caf50" />
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
