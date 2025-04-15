import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
// import UserPofile from "../features/auth/UserProfile";
import HomePage from "../features/auth/HomePage";


export default function Home() {

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", boxShadow: 0  }}>
      {/* Navbar */}
      <Header />
      <HomePage />

    </Box>
  );
};

