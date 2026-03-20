import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("EMPLOYEE");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await api.post("/api/auth/register", { email, password, role, username });
        alert(`Registration successful as ${role}! Please login.`);
        setIsRegister(false);
      } else {
        const res = await api.post("/api/auth/login", { email, password });

        // ✅ store token and user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userEmail", res.data.email);

        // ✅ role-based navigation
        if (res.data.role === "ADMIN" || res.data.role === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else if (res.data.role === "AGENT" || res.data.role === "ROLE_AGENT") {
          navigate("/agent/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Authentication failed!");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.95)"
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#203a43", fontWeight: "bold" }}
          >
            {isRegister ? "Create Account" : "Login"}
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "#555" }}>
            {isRegister ? "Register to get started" : "Welcome back, login to continue"}
          </Typography>

          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          {isRegister && (
            <>
              <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Select
                value={role}
                onChange={e => setRole(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="AGENT">Agent</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#203a43",
              "&:hover": { backgroundColor: "#2c5364" }
            }}
            onClick={handleSubmit}
          >
            {isRegister ? "Register" : "Login"}
          </Button>

          <Box sx={{ mt: 3 }}>
            <Button
              onClick={() => setIsRegister(!isRegister)}
              sx={{ color: "#203a43" }}
            >
              {isRegister
                ? "Already have an account? Login"
                : "New user? Register"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
