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
  Snackbar,
  CircularProgress
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Payment {
  id: number;
  policyNumber: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
}

export default function EmployeePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showMessage = (msg: string) =>
    setSnackbar({ open: true, message: msg });

  // ✅ Fetch payments (UPDATED API)
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showMessage("Please login again");
        return;
      }

      const res = await fetch(
        "http://localhost:9000/api/payments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("Failed to fetch payments");

      const data = await res.json();
      setPayments(data);
    } catch (err: any) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#121212",
          color: "white"
        }}
      >
        <EmployeeSidebar />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ color: "white" }}
          >
            Payments & Billing
          </Typography>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            {loading ? (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                    <TableCell sx={{ color: "white" }}>Amount</TableCell>
                    <TableCell sx={{ color: "white" }}>Method</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white" }}>Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ color: "white" }}>
                        {p.policyNumber}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        ₹{p.amount}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {p.method}
                      </TableCell>

                      <TableCell
                        sx={{
                          color:
                            p.status === "SUCCESS"
                              ? "#4caf50"
                              : p.status === "FAILED"
                              ? "#f44336"
                              : "#ff9800",
                          fontWeight: "bold"
                        }}
                      >
                        {p.status}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {p.paidAt
                          ? new Date(p.paidAt).toLocaleString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}

                  {payments.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        sx={{ color: "white", textAlign: "center" }}
                      >
                        No payment records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            message={snackbar.message}
            onClose={() =>
              setSnackbar({ open: false, message: "" })
            }
          />
        </Box>
      </Box>
    </>
  );
}