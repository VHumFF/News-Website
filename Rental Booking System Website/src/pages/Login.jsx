import React from "react";
import { Box } from "@mui/material";
import LogInPage from "@/features/auth/LogInPage";

export default function LogIn() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }} >
      <LogInPage />
    </Box>
  );
}
