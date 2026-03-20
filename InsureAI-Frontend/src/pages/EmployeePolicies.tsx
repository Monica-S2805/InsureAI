import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Snackbar, CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Policy {
  id: number;
  agentEmail?: string;
  policyNumber: string;
  name: string;
  description?: string;
  type: string;
  coverage?: string;
  premium: string;
  duration: string;
  status: string;
}

export default function EmployeePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [myPolicies, setMyPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "UPI">("CARD");

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewPolicy, setViewPolicy] = useState<Policy | null>(null);

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) =>
    setSnackbar({ open: true, message: msg });

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    "Content-Type": "application/json"
  });

  const whiteTextFieldStyle = {
    input: { color: "white" },
    "& label": { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#4caf50" },
      "&:hover fieldset": { borderColor: "#4caf50" },
      "&.Mui-focused fieldset": { borderColor: "#4caf50" }
    }
  };

  // Fetch policies
  useEffect(() => {
    fetch("http://localhost:9000/api/policies", {
      headers: authHeader()
    })
      .then(res => res.json())
      .then(setPolicies)
      .finally(() => setLoading(false));
  }, []);

  // Fetch my policies
  const fetchMyPolicies = () => {
    fetch("http://localhost:9000/api/employee/my-policies", {
      headers: authHeader()
    })
      .then(res => res.json())
      .then(setMyPolicies);
  };

  useEffect(() => {
    fetchMyPolicies();
  }, []);

  // View
  const handleViewPolicy = (policy: Policy) => {
    setViewPolicy(policy);
    setViewDialogOpen(true);
  };

  // Subscribe
  const handleSubscribeClick = (policy: Policy) => {
    setSelectedPolicy(policy);
    setOpenPaymentDialog(true);
  };

  // Payment + Subscribe
  const handlePaymentSubmit = async () => {
    if (!selectedPolicy) return;

    try {
      showMessage("Processing payment...");

      const paymentRes = await fetch(
        "http://localhost:9000/api/payments",
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify({
            policyNumber: selectedPolicy.policyNumber,
            amount: Number(selectedPolicy.premium),
            method: paymentMethod,
            status: "SUCCESS"
          })
        }
      );

      if (!paymentRes.ok) throw new Error("Payment failed");

      const subRes = await fetch(
        `http://localhost:9000/api/policies/${selectedPolicy.id}/subscribe`,
        {
          method: "POST",
          headers: authHeader()
        }
      );

      if (!subRes.ok) throw new Error("Subscription failed");

      showMessage("Payment successful & Subscribed!");
      setOpenPaymentDialog(false);
      setSelectedPolicy(null);
      fetchMyPolicies();
    } catch (err: any) {
      showMessage(err.message || "Payment failed");
    }
  };

  // Unsubscribe
  const handleUnsubscribe = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/policies/${id}/unsubscribe`,
        {
          method: "POST",
          headers: authHeader()
        }
      );

      if (!res.ok) throw new Error("Unsubscribe failed");

      showMessage("Unsubscribed successfully!");
      fetchMyPolicies();
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

          {/* Available Plans */}
          <Typography variant="h4" sx={{ mb: 2 }}>
            Available Plans
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: "#1a1a2e" }}>
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    {["Plan ID", "Policy #", "Name", "Type", "Premium", "Status", "Actions"].map(h => (
                      <TableCell key={h} sx={{ color: "white" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {policies.map(p => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ color: "white" }}>{p.id}</TableCell>
                      <TableCell sx={{ color: "white" }}>{p.policyNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{p.name}</TableCell>
                      <TableCell sx={{ color: "white" }}>{p.type}</TableCell>
                      <TableCell sx={{ color: "white" }}>₹{p.premium}</TableCell>
                      <TableCell sx={{ color: "white" }}>{p.status}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1, color: "white", borderColor: "white" }}
                          onClick={() => handleViewPolicy(p)}
                        >
                          View
                        </Button>

                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleSubscribeClick(p)}
                        >
                          Subscribe
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>

          {/* My Plans */}
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            My Plans
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Plan ID", "Policy #", "Name", "Type", "Premium", "Status", "Action"].map(h => (
                    <TableCell key={h} sx={{ color: "white" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {myPolicies.map(p => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ color: "white" }}>{p.id}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.policyNumber}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.name}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.type}</TableCell>
                    <TableCell sx={{ color: "white" }}>₹{p.premium}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleUnsubscribe(p.id)}
                      >
                        Unsubscribe
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {/* Payment Dialog */}
          <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)}>
            <DialogTitle sx={{ color: "white", backgroundColor: "#252547" }}>
              Payment
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: "#1a1a2e" }}>
              <Button onClick={() => setPaymentMethod("CARD")}>Card</Button>
              <Button onClick={() => setPaymentMethod("UPI")}>UPI</Button>

              {paymentMethod === "CARD" && (
                <>
                  <TextField label="Card Number" fullWidth sx={whiteTextFieldStyle} />
                  <TextField label="Card Holder" fullWidth sx={whiteTextFieldStyle} />
                  <TextField label="Expiry" fullWidth sx={whiteTextFieldStyle} />
                  <TextField label="Amount" fullWidth sx={whiteTextFieldStyle} />
                  <TextField label="CVV" fullWidth sx={whiteTextFieldStyle} />
                </>
              )}

              {paymentMethod === "UPI" && (
                <Typography sx={{ mt: 2, color: "white" }}>
                  Scan QR using any UPI app
                </Typography>
              )}
            </DialogContent>

            <DialogActions sx={{ backgroundColor: "#1a1a2e" }}>
              <Button onClick={() => setOpenPaymentDialog(false)} sx={{ color: "white" }}>
                Cancel
              </Button>
              <Button variant="contained" color="success" onClick={handlePaymentSubmit}>
                Pay
              </Button>
            </DialogActions>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
            <DialogTitle sx={{ color: "white", backgroundColor: "#252547" }}>
              Policy Details
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: "#1a1a2e", color: "white" }}>
              {viewPolicy && (
                <>
                  <Typography><b>Plan ID:</b> {viewPolicy.id}</Typography>
                  <Typography><b>Agent Email:</b> {viewPolicy.agentEmail || "N/A"}</Typography>
                  <Typography><b>Policy Number:</b> {viewPolicy.policyNumber}</Typography>
                  <Typography><b>Name:</b> {viewPolicy.name}</Typography>
                  <Typography><b>Description:</b> {viewPolicy.description || "N/A"}</Typography>
                  <Typography><b>Type:</b> {viewPolicy.type}</Typography>
                  <Typography><b>Coverage:</b> {viewPolicy.coverage || "N/A"}</Typography>
                  <Typography><b>Premium:</b> ₹{viewPolicy.premium}</Typography>
                  <Typography><b>Duration:</b> {viewPolicy.duration}</Typography>
                  <Typography><b>Status:</b> {viewPolicy.status}</Typography>
                </>
              )}
            </DialogContent>

            <DialogActions sx={{ backgroundColor: "#1a1a2e" }}>
              <Button onClick={() => setViewDialogOpen(false)} sx={{ color: "white" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
    </>
  );
}
