import { Box } from "@mui/material"
import AccountActivationPage from "../features/auth/AccountActivationPage"

export default function AccountActivation() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AccountActivationPage />
    </Box>
  )
}
