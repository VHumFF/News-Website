import { Box } from "@mui/material"
import ResetPasswordPage from "../features/auth/ResetPasswordPage"

export default function ResetPassword() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ResetPasswordPage />
    </Box>
  )
}
