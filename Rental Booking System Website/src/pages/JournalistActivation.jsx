import { Box } from "@mui/material"
import JournalistActivationPage from "../features/auth/JournalistActivationPage"

export default function JournalistActivation() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <JournalistActivationPage />
    </Box>
  )
}
