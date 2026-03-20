import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, CircularProgress, Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import AgentSidebar from "../components/AgentSidebar";

interface Appointment {
  id: number;
  agentEmail: string;
  employeeEmail: string;
  customerName: string;
  policyNumber: string;
  dateTime: string;
  status: string;
}

export default function AgentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "application/json"
  });

  // ✅ Fetch agent's appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:9000/api/agent/my-appointments", {
        headers: authHeader()
      });

      if (!res.ok) {
        console.error("Failed to fetch appointments:", res.status, await res.text());
        setAppointments([]);
        return;
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Delete appointment
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:9000/api/agent/appointments/${id}`, {
        method: "DELETE",
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to delete appointment: " + res.status);
      showMessage("Appointment deleted successfully!");
      fetchAppointments();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AgentSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            My Appointments
          </Typography>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>ID</TableCell>
                    <TableCell sx={{ color: "white" }}>Employee</TableCell>
                    <TableCell sx={{ color: "white" }}>Customer</TableCell>
                    <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                    <TableCell sx={{ color: "white" }}>Date/Time</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map(appt => (
                    <TableRow key={appt.id}>
                      <TableCell sx={{ color: "white" }}>{appt.id}</TableCell>
                      <TableCell sx={{ color: "white" }}>{appt.employeeEmail}</TableCell>
                      <TableCell sx={{ color: "white" }}>{appt.customerName}</TableCell>
                      <TableCell sx={{ color: "white" }}>{appt.policyNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {new Date(appt.dateTime).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{appt.status}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(appt.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ color: "white", textAlign: "center" }}>
                        No appointments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>

          {/* Snackbar for feedback */}
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
