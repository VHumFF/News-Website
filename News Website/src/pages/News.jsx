import { Box } from "@mui/material"
import Header from "@/components/Header"
import NewsListing from "@/features/news/NewsListing"

export default function News() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "auto", // Allow content to be scrollable
      }}
    >
      {/* Navbar */}
      <Header />

      <Box sx={{ flex: 1, overflow: "auto" }}>
        <NewsListing />
      </Box>
    </Box>
  )
}
