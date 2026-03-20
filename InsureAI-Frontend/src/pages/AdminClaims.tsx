import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack
} from "@mui/material";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";

interface Claim {
  id: number;
  policyNumber: string;
  claimNumber: string;
  claimAmount: string;
  status: string; // Pending / Approved / Rejected
}

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchClaims = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9000/api/admin/claims", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch claims: " + res.status);
        return res.json();
      })
      .then(data => setClaims(data))
      .catch(err => alert(err.message));
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = (id: number, newStatus: string) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:9000/api/admin/claims/${id}/status`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update claim: " + res.status);
        return res.json();
      })
      .then(() => {
        alert(`Claim ${id} marked as ${newStatus}`);
        fetchClaims();
      })
      .catch(err => alert(err.message));
  };

  // ✅ Search + Filter logic
  const filteredClaims = claims.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.policyNumber.toLowerCase().includes(term) ||
      c.claimNumber.toLowerCase().includes(term) ||
      c.status.toLowerCase().includes(term);

    const matchesStatus = filterStatus === "All" || c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Manage Claims
          </Typography>

          {/* Search + Filter */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search claims..."
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
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              size="small"
              sx={{ backgroundColor: "#1a1a2e", color: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </Stack>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Claim ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Claim #</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ color: "white", textAlign: "center" }}>
                      No claims found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map(claim => (
                    <TableRow key={claim.id}>
                      <TableCell sx={{ color: "white" }}>{claim.id}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.policyNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.claimNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.claimAmount}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            claim.status === "Approved"
                              ? "#4caf50"
                              : claim.status === "Rejected"
                              ? "#f44336"
                              : "#ff9800"
                        }}
                      >
                        {claim.status}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() => handleUpdateStatus(claim.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleUpdateStatus(claim.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
