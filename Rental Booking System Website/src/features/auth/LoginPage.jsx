import React, { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
    navigate("/");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        width: "100%",
        maxWidth: 400,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff", // Ensure white form background
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Log In
        </Button>
      </form>
    </Paper>
  );
}
