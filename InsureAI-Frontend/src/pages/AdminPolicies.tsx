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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
  Select,
  MenuItem
} from "@mui/material";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminSidebar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Policy {
  id?: number;
  policyNumber: string;
  name: string;
  description: string;
  type: string;
  coverage: string;
  premium: string;
  duration: string;
  status: string;
  agentEmail?: string;
}

export default function AdminPolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [form, setForm] = useState<Policy>({
    policyNumber: "",
    name: "",
    description: "",
    type: "",
    coverage: "",
    premium: "",
    duration: "",
    status: "",
    agentEmail: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:9000/api/policies", {
      headers: {
        "Authorization": token?.startsWith("Bearer") ? token : `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setPolicies(data))
      .catch(err => console.error("Failed to load policies:", err));
  }, []);

  const handleOpen = (policy?: Policy) => {
    setForm(
      policy || {
        policyNumber: "",
        name: "",
        description: "",
        type: "",
        coverage: "",
        premium: "",
        duration: "",
        status: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `http://localhost:9000/api/policies/${form.id}`
      : "http://localhost:9000/api/policies";

    const token = localStorage.getItem("token");

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token?.startsWith("Bearer") ? token : `Bearer ${token}`
      },
      body: JSON.stringify(form),
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(saved => {
        if (form.id) {
          setPolicies(policies.map(p => (p.id === saved.id ? saved : p)));
        } else {
          setPolicies([...policies, saved]);
        }
        handleClose();
      })
      .catch(err => console.error("Failed to save policy:", err));
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:9000/api/policies/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": token?.startsWith("Bearer") ? token : `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setPolicies(policies.filter(p => p.id !== id));
      })
      .catch(err => console.error("Failed to delete policy:", err));
  };

  // ✅ Search + Filter logic
  const filteredPolicies = policies.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.policyNumber.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term);

    const matchesType = filterType === "All" || p.type === filterType;
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Insurance Plan Management
          </Typography>

          {/* Search + Filters + Add Policy */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search policies..."
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
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              size="small"
              sx={{ backgroundColor: "#1a1a2e", color: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="HEALTH">Health</MenuItem>
              <MenuItem value="LIFE">Life</MenuItem>
              <MenuItem value="PROPERTY">Property</MenuItem>
              <MenuItem value="LIABILITY">Liability</MenuItem>
              <MenuItem value="VEHICLE">Vehicle</MenuItem>
            </Select>
            <Select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              size="small"
              sx={{ backgroundColor: "#1a1a2e", color: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="success" onClick={() => handleOpen()}>
              Add Policy
            </Button>
          </Stack>

          {/* Table */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Agent Email</TableCell>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Description</TableCell>
                  <TableCell sx={{ color: "white" }}>Type</TableCell>
                  <TableCell sx={{ color: "white" }}>Coverage</TableCell>
                  <TableCell sx={{ color: "white" }}>Premium</TableCell>
                  <TableCell sx={{ color: "white" }}>Duration</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPolicies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ color: "white", textAlign: "center" }}>
                      No policies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPolicies.map(policy => (
                    <TableRow key={policy.id}>
                      <TableCell sx={{ color: "white" }}>{policy.policyNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.agentEmail}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.name}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.description}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.type}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.coverage}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.premium}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.duration}</TableCell>
                      <TableCell sx={{ color: "white" }}>{policy.status}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="info"
                          sx={{ mr: 1 }}
                          startIcon={<EditIcon />}
                          onClick={() => handleOpen(policy)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(policy.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>

          {/* Add/Edit Dialog */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{form.id ? "Edit Policy" : "Add New Policy"}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Policy Number"
                  value={form.policyNumber}
                  onChange={e => setForm({ ...form, policyNumber: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Agent Email"
                  value={form.agentEmail}
                  onChange={e => setForm({ ...form, agentEmail: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}    
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                />
                <TextField
                  label="Type"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Coverage"
                  value={form.coverage}
                  onChange={e => setForm({ ...form, coverage: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Premium"
                  value={form.premium}
                  onChange={e => setForm({ ...form, premium: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Duration"
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  fullWidth
                />
                <Select
                  value={form.status} 
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
