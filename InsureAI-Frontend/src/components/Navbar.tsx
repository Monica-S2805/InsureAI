import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Assume these are set in localStorage after login
  const role = localStorage.getItem("role"); // e.g. "Admin", "Agent", "Employee"
  const token = localStorage.getItem("token");

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a1a2e" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          InsureAI Platform
        </Typography>

        {/* Landing page shows Login */}
        {!token && location.pathname === "/" && (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}

  
      </Toolbar>
    </AppBar>
  );
}
