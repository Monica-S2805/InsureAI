import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Appointment {
  id: number;
  agentEmail: string;
  employeeEmail: string;
  customerName: string;
  policyNumber: string;
  dateTime: string; // ISO string from backend
  status: string;
}

interface Availability {
  id: number;
  agentEmail: string;
  date: string;       // ISO date
  startTime: string;  // ISO time
  endTime: string;    // ISO time
  status: string;
}

export default function EmployeeAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  // Helper to build Authorization header
  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  // ✅ Fetch employee's appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/employee/my-appointments", {
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to fetch appointments: " + res.status);
      const data = await res.json();
      setAppointments(data);
    } catch (err: any) {
      showMessage(err.message);
      setAppointments([]);
    }
  };

  // ✅ Fetch open availability slots
  const fetchAvailability = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/employee/availability", {
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to fetch availability: " + res.status);
      const data = await res.json();
      setAvailability(data);
    } catch (err: any) {
      showMessage(err.message);
      setAvailability([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchAvailability();
  }, []);

  // ✅ Request appointment from slot
  const handleRequest = async (slot: Availability) => {
    if (!customerName || !policyNumber) {
      showMessage("Please enter Customer Name and Policy Number before requesting.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:9000/api/availability/book/${slot.id}`, {
        method: "PUT",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ customerName, policyNumber })
      });
      if (!res.ok) throw new Error("Failed to request appointment: " + res.status);
      showMessage("Appointment requested successfully!");
      setCustomerName("");
      setPolicyNumber("");
      fetchAppointments();
      fetchAvailability();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  // ✅ Cancel appointment
  const handleCancel = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:9000/api/employee/appointments/${id}/cancel`, {
        method: "POST",
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to cancel appointment: " + res.status);
      showMessage("Appointment cancelled successfully!");
      fetchAppointments();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <EmployeeSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Appointments
          </Typography>

          {/* Employee's Appointments */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e", mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Agent</TableCell>
                  <TableCell sx={{ color: "white" }}>Customer</TableCell>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Date & Time</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell sx={{ color: "white" }}>{appt.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.agentEmail}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.customerName}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.policyNumber}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {new Date(appt.dateTime).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.status}</TableCell>
                    <TableCell>
                      {appt.status !== "CANCELLED" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleCancel(appt.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Available Slots */}
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Available Slots
          </Typography>

          {/* Input fields for customer details */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Customer Name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              sx={{ flex: 1, input: { color: "white" }, label: { color: "white" } }}
            />
            <TextField
              label="Policy Number"
              value={policyNumber}
              onChange={e => setPolicyNumber(e.target.value)}
              sx={{ flex: 1, input: { color: "white" }, label: { color: "white" } }}
            />
          </Box>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Agent</TableCell>
                  <TableCell sx={{ color: "white" }}>Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Time</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availability.filter(slot => slot.status === "OPEN").map(slot => (
                  <TableRow key={slot.id}>
                    <TableCell sx={{ color: "white" }}>{slot.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{slot.agentEmail}</TableCell>
                    <TableCell sx={{ color: "white" }}>{slot.date}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {slot.startTime} - {slot.endTime}
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>{slot.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleRequest(slot)}
                      >
                        Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {availability.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ color: "white", textAlign: "center" }}>
                      No available slots
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
