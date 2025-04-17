import { Box } from "@mui/material"
import Header from "../components/Header"
import JournalistDashboardPage from "../features/journalist/JournalistDashboardPage"

export default function JournalistDashboard() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <JournalistDashboardPage />
      </Box>
    </Box>
  )
}
