import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Stack, Select, MenuItem
} from "@mui/material";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

interface Appointment {
  id: number;
  agentEmail: string;
  employeeEmail: string;
  customerName: string;
  policyNumber: string;
  dateTime: string; // ISO string from backend
  status: string;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
  });

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/admin/appointments", {
        headers: authHeader()
      });
      if (!res.ok) {
        console.error("Failed to fetch appointments:", res.status, await res.text());
        setAppointments([]);
        return;
      }
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApprove = async (id: number) => {
    await fetch(`http://localhost:9000/api/admin/appointments/${id}/approve`, {
      method: "POST",
      headers: authHeader()
    });
    fetchAppointments();
  };

  const handleCancel = async (id: number) => {
    await fetch(`http://localhost:9000/api/admin/appointments/${id}/cancel`, {
      method: "POST",
      headers: authHeader()
    });
    fetchAppointments();
  };

  // ✅ Filter logic
  const filteredAppointments = appointments.filter(appt => {
    const term = search.toLowerCase();
    const matchesSearch =
      appt.customerName.toLowerCase().includes(term) ||
      appt.agentEmail.toLowerCase().includes(term) ||
      appt.policyNumber.toLowerCase().includes(term);

    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;

    const apptDate = new Date(appt.dateTime);
    const matchesStart = !startDate || apptDate >= new Date(startDate);
    const matchesEnd = !endDate || apptDate <= new Date(endDate);

    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Appointment Management
          </Typography>

          {/* Search + Filters */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search appointments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{
                backgroundColor: "#1a1a2e",
                input: { color: "white" },
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4caf50" }
              }}
            />
           
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              size="small"
              sx={{ backgroundColor: "#1a1a2e", color: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="REQUESTED">Requested</MenuItem>
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </Stack>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Agent</TableCell>
                  <TableCell sx={{ color: "white" }}>Employee</TableCell>
                  <TableCell sx={{ color: "white" }}>Customer</TableCell>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Date & Time</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell sx={{ color: "white" }}>{appt.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.agentEmail}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.employeeEmail}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.customerName}</TableCell>
                    <TableCell sx={{ color: "white" }}>{appt.policyNumber}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {new Date(appt.dateTime).toLocaleString()}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          appt.status === "APPROVED"
                            ? "#4caf50"
                            : appt.status === "CANCELLED"
                            ? "#f44336"
                            : "#ff9800"
                      }}
                    >
                      {appt.status}
                    </TableCell>
                    <TableCell>
                      {appt.status === "REQUESTED" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleApprove(appt.id)}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                      )}
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
                {filteredAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ color: "white", textAlign: "center" }}>
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
