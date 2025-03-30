import React from "react";
import { Grid, Box, useMediaQuery } from "@mui/material";
import BreakingNews from "@/components/BreakingNews";
import NewsList from "@/components/NewsList";
import LatestNews from "@/components/LatestNews";

export default function HomePage() {
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  return (
    <Box sx={{ height: "100vh", overflow: "auto", p: 2 }}>
      <Grid container spacing={2}>
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: { xs: "auto", md: "calc(100vh - 60px)" },
            overflow: { xs: "visible", md: "auto" },
            paddingBottom: "20px",
          }}
        >
          {/* Breaking News */}
          <BreakingNews />

          {/* Space between BreakingNews and NewsList */}
          <Box sx={{ height: 24 }} />

          {/* News List */}
          <NewsList />
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: { xs: "auto", md: "calc(100vh - 60px)" },
            overflowY: { xs: "visible", md: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: isSmallScreen ? "90px" : "20px",
          }}
        >
          <LatestNews />
        </Grid>
      </Grid>
    </Box>
  );
}
