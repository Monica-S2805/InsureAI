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
  DialogActions,
  TextField,
  Snackbar
} from "@mui/material";
import Navbar from "../components/Navbar";
import EmployeeSidebar from "../components/EmployeeSidebar";

interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  type: string;
  claimAmount: number;
  status: string;        // PENDING / APPROVED / REJECTED / WITHDRAWN
  description?: string;
}

export default function EmployeeClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [openClaimDialog, setOpenClaimDialog] = useState(false);
  const [openNewClaimDialog, setOpenNewClaimDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [newClaim, setNewClaim] = useState({
    policyNumber: "",
    type: "",
    claimAmount: 0,
    description: ""
  });

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const fetchClaims = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:9000/api/employee/my-claims", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to fetch claims: " + res.status);
      const data = await res.json();
      setClaims(data);
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setOpenClaimDialog(true);
  };

  const handleRequestUpdate = async (claimId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:9000/api/claims/${claimId}/request-update`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to request update: " + res.status);
      showMessage("Update request sent to admin/agent!");
      fetchClaims();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  const handleWithdraw = async (claimId: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:9000/api/claims/${claimId}/withdraw`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to withdraw claim: " + res.status);
      showMessage("Claim withdrawn successfully!");
      fetchClaims();
    } catch (err: any) {
      showMessage(err.message);
    }
  };

  const handleFileClaim = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:9000/api/employee/claims", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newClaim)
      });
      if (!res.ok) throw new Error("Failed to file claim: " + res.status);
      showMessage("Claim filed successfully!");
      setOpenNewClaimDialog(false);
      setNewClaim({ policyNumber: "", type: "", claimAmount: 0, description: "" });
      fetchClaims();
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
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
            My Claims
          </Typography>

          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setOpenNewClaimDialog(true)}
          >
            File New Claim
          </Button>

          <Paper sx={{ p: 3, backgroundColor: "#1a1a2e" }}>
            {claims.length === 0 ? (
              <Typography sx={{ color: "white", textAlign: "center" }}>
                You have not filed any claims yet
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Claim #</TableCell>
                    <TableCell sx={{ color: "white" }}>Policy #</TableCell>
                    <TableCell sx={{ color: "white" }}>Type</TableCell>
                    <TableCell sx={{ color: "white" }}>Amount</TableCell>
                    <TableCell sx={{ color: "white" }}>Status</TableCell>
                    <TableCell sx={{ color: "white" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claims.map(claim => (
                    <TableRow key={claim.id}>
                      <TableCell sx={{ color: "white" }}>{claim.claimNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.policyNumber}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.type}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.claimAmount}</TableCell>
                      <TableCell sx={{ color: "white" }}>{claim.status}</TableCell>
                      <TableCell>
                        <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => handleViewClaim(claim)}>View</Button>
                        {claim.status === "PENDING" && (
                          <>
                            <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleRequestUpdate(claim.id)}>Request Update</Button>
                            <Button size="small" color="error" variant="contained" onClick={() => handleWithdraw(claim.id)}>Withdraw</Button>
                          </>
                        )}
                        {claim.status !== "PENDING" && (
                          <Typography variant="caption" sx={{ color: "white" }}>
                            No actions available
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>

          {/* Claim Details Dialog */}
          <Dialog open={openClaimDialog} onClose={() => setOpenClaimDialog(false)}>
            <DialogTitle sx={{ backgroundColor: "#252547", color: "white" }}>Claim Details</DialogTitle>
            <DialogContent sx={{ backgroundColor: "#1a1a2e", color: "white" }}>
              <Typography sx={{ color: "white" }}>Claim #: {selectedClaim?.claimNumber}</Typography>
              <Typography sx={{ color: "white" }}>Policy #: {selectedClaim?.policyNumber}</Typography>
              <Typography sx={{ color: "white" }}>Type: {selectedClaim?.type}</Typography>
              <Typography sx={{ color: "white" }}>Amount: {selectedClaim?.claimAmount}</Typography>
              <Typography sx={{ color: "white" }}>Status: {selectedClaim?.status}</Typography>
              {selectedClaim?.description && (
                <Typography sx={{ color: "white" }}>Description: {selectedClaim.description}</Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#252547" }}>
              <Button onClick={() => setOpenClaimDialog(false)} sx={{ color: "white" }}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* File New Claim Dialog */}
          <Dialog open={openNewClaimDialog} onClose={() => setOpenNewClaimDialog(false)}>
            <DialogTitle sx={{ backgroundColor: "#252547", color: "white" }}>File New Claim</DialogTitle>
            <DialogContent sx={{ backgroundColor: "#1a1a2e" }}>
              <TextField
                fullWidth
                margin="dense"
                label="Policy Number"
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={newClaim.policyNumber}
                onChange={(e) => setNewClaim({ ...newClaim, policyNumber: e.target.value })}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Type"
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={newClaim.type}
                onChange={(e) => setNewClaim({ ...newClaim, type: e.target.value })}
              />
              <TextField  
                fullWidth
                margin="dense"
                label="Claim Amount"
                type="number"
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={newClaim.claimAmount}
                onChange={(e) => setNewClaim({ ...newClaim, claimAmount: parseFloat(e.target.value) })}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Description (optional)"  
                multiline
                rows={4}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                value={newClaim.description}
                onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
              />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#252547" }}>
              <Button onClick={() => setOpenNewClaimDialog(false)} sx={{ color: "white" }}>Cancel</Button>
              <Button onClick={handleFileClaim} variant="contained" sx={{ color: "white" }}>Submit Claim</Button>
            </DialogActions>
          </Dialog>

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