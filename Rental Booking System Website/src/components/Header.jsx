import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="block">
      <Toolbar>
        <Typography variant="h6">Smart Property Management</Typography>
      </Toolbar>
    </AppBar>
  );
}
