import SignUpPage from "@/features/auth/SignUpPage"
import { Box } from "@mui/material"

export default function Register() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SignUpPage />
    </Box>
  )
}
