import { Box } from "@mui/material"
import LogInPage from "@/features/auth/LoginPage"

export default function LogIn() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <LogInPage />
    </Box>
  )
}
