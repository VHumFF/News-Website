import { Box } from "@mui/material"
import Header from "../components/Header"
import ProfilePage from "../features/auth/ProfilePage"

export default function Profile() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ flexGrow: 1, display: "flex", p: 3 }}>
        <ProfilePage />
      </Box>
    </Box>
  )
}
