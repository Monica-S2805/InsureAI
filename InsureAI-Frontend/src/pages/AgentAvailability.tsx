import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, CircularProgress, Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import AgentSidebar from "../components/AgentSidebar";

interface Availability {
  id: number;
  agentEmail: string;
  date: string;       // ISO date
  startTime: string;  // ISO time
  endTime: string;    // ISO time
  status: string;
}

export default function AgentAvailability() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const authHeader = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "application/json"
  });

  // ✅ Fetch agent's availability slots
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:9000/api/agent/availability", {
        headers: authHeader()
      });

      if (!res.ok) {
        console.error("Failed to fetch availability:", res.status, await res.text());
        setAvailability([]);
        return;
      }

      const data = await res.json();
      setAvailability(data);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  // ✅ Publish new slot
  const handlePublish = async () => {
    if (!date || !startTime || !endTime) {
      showMessage("Please enter Date, Start Time, and End Time before publishing.");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/api/agent/availability", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({ date, startTime, endTime })
      });
      if (!res.ok) throw new Error("Failed to publish slot: " + res.status);
      showMessage("Slot published successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchAvailability();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  // ✅ Delete slot
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:9000/api/agent/availability/${id}`, {
        method: "DELETE",
        headers: authHeader()
      });
      if (!res.ok) throw new Error("Failed to delete slot: " + res.status);
      showMessage("Slot deleted successfully!");
      fetchAvailability();
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
            Agent Availability
          </Typography>

          {/* Input fields for new slot */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}> 
            <TextField
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              sx={{ flex: "1 1 200px", input: { color: "white" }, label: { color: "white" } }}
            />
            <TextField
              label="Start Time"
              type="time" 
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              sx={{ flex: "1 1 200px", input: { color: "white" }, label: { color: "white" } }}
            />
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              sx={{ flex: "1 1 200px", input: { color: "white" }, label: { color: "white" } }}
            />
            <Button variant="contained" color="primary" onClick={handlePublish}>
              Publish Slot
            </Button>
          </Box>

          {/* Slots Table */}
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
                    <TableCell sx={{ color: "white" }}>Date</TableCell>
                    <TableCell sx={{ color: "white" }}>Time</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availability.map(slot => (
                    <TableRow key={slot.id}>
                      <TableCell sx={{ color: "white" }}>{slot.id}</TableCell>
                      <TableCell sx={{ color: "white" }}>{new Date(slot.date).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {slot.startTime} - {slot.endTime}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{slot.status}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(slot.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {availability.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ color: "white", textAlign: "center" }}>
                        No slots published
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
