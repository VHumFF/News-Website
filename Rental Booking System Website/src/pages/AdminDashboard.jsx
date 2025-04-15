import { Box } from "@mui/material"
import Header from "../components/Header"
import AdminDashboardPage from "../features/admin/AdminDashboardPage"

export default function AdminDashboard() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <AdminDashboardPage />
      </Box>
    </Box>
  )
}
