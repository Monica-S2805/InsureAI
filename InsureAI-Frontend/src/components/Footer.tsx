// src/components/Footer.tsx
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ py: 3, textAlign: 'center', background: 'linear-gradient(to right, #0f3460, #16213e)', color: 'white' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} InsureAI. All rights reserved.
      </Typography>
    </Box>
  );
}
