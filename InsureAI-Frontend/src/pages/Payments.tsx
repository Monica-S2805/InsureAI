import { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Payment {
  id: number;
  policyNumber: string;
  amount: number;
  method: string;
  status: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:9000/api/payments/employee", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setPayments);
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "white" }}>
        <EmployeeSidebar />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">Payments</Typography>
          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount</TableCell>
                  <TableCell sx={{ color: "white" }}>Method</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ color: "white" }}>{p.policyNumber}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.amount}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.method}</TableCell>
                    <TableCell sx={{ color: "white" }}>{p.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
