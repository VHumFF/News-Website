import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, TextField, Typography, Button, Link, Divider, InputAdornment, IconButton, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logImg from "@/assets/images/logo.png";


export default function SignUp() {
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // check all textfield
  const isFormComplete =
    firstName.trim() && lastName.trim() && email.trim() && password.trim() && confirmPassword.trim();
  
  // check password match
  const isPasswordMatch = password === confirmPassword;
  
  // register function
  const RegisterRequest = () => {
    alert("Registering...");
  };
  
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: { xs: 0, sm: 4, md: 12, lg: 16 }, bgcolor: "#6145DD", flexDirection: { xs: "column", sm: "row" },
    }} >
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
            Sign up for{" "}
            <Typography component="span" sx={{ fontStyle: "italic", color: "purple" }}>
              Newser
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter your credentials in the fields below to register an account
          </Typography>

          {/* textbox */}
          <TextField fullWidth label="First Name" variant="standard" sx={{ mb: 2 }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <TextField fullWidth label="Last Name" variant="standard" sx={{ mb: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <TextField fullWidth label="Email" type="email" variant="standard" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* password */}
          <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} variant="standard" sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} 
            InputProps={{ 
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
          }} />
          {/* confirm password */}
          <TextField fullWidth label="Confirm Password" type={showConfirmPassword ? "text" : "password"} variant="standard" sx={{ mb: 3 }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={!isPasswordMatch && confirmPassword.length > 0} helperText={!isPasswordMatch && confirmPassword.length > 0 ? "Password not match" : ""}  
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
          }} />

          {/* sign up btn */}
          <Button fullWidth variant="contained" sx={{ bgcolor: "#6145DD", color: "white", mb: 2 }} disabled={!isFormComplete || !isPasswordMatch} onClick={RegisterRequest} >
            Sign Up Now
          </Button>

          {/* divider */}
          <Divider>or</Divider>

          {/* link tologin page */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Button sx={{ fontWeight: "bold", textTransform: "none" }} onClick={() => navigate("/login")} >
              Log in now!!
            </Button>  
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}