import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import NewsPage from "../features/auth/NewsPage";


export default function News() {

  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Header />
      
      <NewsPage />

    </Box>
  );
};