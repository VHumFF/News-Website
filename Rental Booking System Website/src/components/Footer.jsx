import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "black", position: "block"}}>
      <Typography variant="body2">&copy; 2025 Smart Property Management</Typography>
    </Box>
  );
}
  