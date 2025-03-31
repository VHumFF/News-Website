import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, TextField, Typography, Button, Divider, InputAdornment, IconButton,Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logImg from "@/assets/images/logo.png";

export default function LogIn() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // check textfield
  const isFormComplete = email.trim() && password.trim();

  // login function
  const LoginRequest = () => {
    alert("Logging in...");
  };

  // forgot password
  const handleForgotPassword = () => {
    alert(`Reset password sent to ${resetEmail}`);
    setOpenForgotPassword(false);
  };


  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: { xs: 0, sm: 4, md: 12, lg: 16 }, bgcolor: "#6145DD", flexDirection: { xs: "column", sm: "row" }, }} >
      {/* left img */}
      <Box sx={{ width: 300, height: 300, display: { xs: "none", sm: "block" }, alignItems: "center", justifyContent: "center", }} >
        <img src={logImg} alt="Logo" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
      </Box>

      {/* right form */}
      <Card sx={{ width: 400, padding: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            The News
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome back, {" "}
            <Typography component="span" sx={{ fontStyle: "italic", color: "purple" }}>
              Newser
            </Typography>
          </Typography>

          {/* textbox */}
          <TextField fullWidth label="Email" type="email" variant="standard" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} variant="standard" sx={{ mb: 3 }} value={password} onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* forgot password & login btn */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Button sx={{ textTransform: "none", color: "#6145DD" }} onClick={() => setOpenForgotPassword(true)} >
              Forgot Password?
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#6145DD", color: "white" }} disabled={!isFormComplete} onClick={LoginRequest} >
              Log In Now
            </Button>
          </Box>

          {/* divider */}
          <Divider>or</Divider>

          {/* navigate to sign up page */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account yet?{" "}
            <Button sx={{ fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/signup")} >
              Sign up now!!
            </Button>        
          </Typography>
        </CardContent>
      </Card>

      {/* forgot password dialog */}
      <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your email to receive a password reset link.
          </Typography>
          <TextField fullWidth label="Email" type="email" variant="outlined" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgotPassword(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: "#6145DD", color: "white" }} disabled={!resetEmail.trim()} onClick={handleForgotPassword} >
            Send
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}