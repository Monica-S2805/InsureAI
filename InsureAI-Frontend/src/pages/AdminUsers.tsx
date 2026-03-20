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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  status?: string;        // Active / Inactive
  emailVerified?: string; // Verified / Pending
  password?: string;      // masked
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:9000/api/users", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch users: " + res.status);
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id: number) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:9000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete user: " + res.status);
        setUsers(users.filter(u => u.id !== id));
      })
      .catch(err => console.error(err));
  };

  // ✅ Safe filtering logic
  const filteredUsers = users.filter(u => {
    const name = u.name ? u.name.toLowerCase() : "";
    const email = u.email ? u.email.toLowerCase() : "";
    const searchTerm = search.toLowerCase();

    return (
      (roleFilter === "All" || u.role === roleFilter) &&
      (name.includes(searchTerm) || email.includes(searchTerm))
    );
  });

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <AdminSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            User Management
          </Typography>

          {/* Search + Filter + Add User */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              size="small"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            >
              <MenuItem value="All">All Roles</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
              <MenuItem value="AGENT">Agent</MenuItem>
            </Select>
            <Box sx={{ flexGrow: 1 }} />
          
          </Stack>

          {/* Users Table */}
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email Verified</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Password</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ color: "white", textAlign: "center" }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ color: "white" }}>
                      {user.email || "No email"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>{user.role || "-"}</TableCell>
                      <TableCell sx={{ color: "white" }}>{user.status || "-"}</TableCell>
                      <TableCell sx={{ color: "white" }}>{user.emailVerified || "Pending"}</TableCell>
                      <TableCell sx={{ color: "white" }}>******</TableCell>
                      <TableCell>
                       
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(user.id)}
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
        </Box>
      </Box>
    </>
  );
}
