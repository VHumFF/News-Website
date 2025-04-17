import RegisterPage from "../features/auth/RegisterPage"
import { Container, Box } from "@mui/material"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Register() {
  return (
    <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RegisterPage />
      </Container>
      <Footer />
    </Box>
  )
}
