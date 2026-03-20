import { Box, Typography, Button, Paper } from "@mui/material";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 5
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            maxWidth: 700,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.9)",
            color: "#203a43"
          }}
        >
          <Typography variant="h3" gutterBottom fontWeight="bold">
            InsureAI Platform
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            A modern insurance management system for administrators, agents, and employees.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Manage insurance plans, streamline appointments, and provide smarter support — all in one unified platform.
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#203a43", px: 4, py: 1.5 }}
            onClick={() => (window.location.href = "/login")}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
