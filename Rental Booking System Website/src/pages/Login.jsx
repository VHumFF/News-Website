import React from "react";
import { Container, Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginPage from "../features/auth/LoginPage";
import bgImage from "../assets/images/login-bg3.jpg";

export default function Login() {
  return (
        <Box
        sx={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
        }}
        >
      <Header />
      <Container maxWidth="xs" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoginPage />
      </Container>
      <Footer />
    </Box>
  );
}
