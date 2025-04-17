"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material"
import logImg from "@/assets/images/logo.png"
import { authApi } from "@/api/auth"
import { handleApiError } from "@/api"

export default function SignUp() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [success, setSuccess] = useState(false)

  // check all textfield
  const isFormComplete =
    firstName.trim() && lastName.trim() && email.trim() && password.trim() && confirmPassword.trim()

  // check password match
  const isPasswordMatch = password === confirmPassword

  // Validate form
  const validateForm = () => {
    const newErrors = {
      firstName: firstName.trim() ? "" : "First name is required",
      lastName: lastName.trim() ? "" : "Last name is required",
      email: "",
      password: "",
      confirmPassword: "",
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // register function
  const RegisterRequest = async () => {
    // Validate form first
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userData = {
        firstName,
        lastName,
        email,
        password,
      }

      const response = await authApi.register(userData)

      // Show success message
      setSuccess(true)

      // Clear form
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Registration failed:", errorDetails)
      console.error("Error response data:", error.response?.data)

      // Handle specific error cases based on status code and message
      if (errorDetails.status === 400) {
        // Check for email already registered error
        if (
          error.response?.data === "Email is already registered." ||
          errorDetails.message?.includes("already registered")
        ) {
          setError("This email is already registered. Please use a different email or try logging in.")
          // Highlight the email field with error
          setErrors({
            ...errors,
            email: "Email is already registered",
          })
        } else {
          setError(errorDetails.message || "Please check your information and try again.")
        }
      } else if (errorDetails.status === 500) {
        setError("Server error. Please try again later or contact support if the problem persists.")
      } else {
        setError(errorDetails.message || "Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        gap: { xs: 0, sm: 4, md: 12, lg: 16 },
        bgcolor: "#6145DD",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {/* left img */}
      <Box
        sx={{
          width: 300,
          height: 300,
          display: { xs: "none", sm: "block" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link to="/">
          <img
            src={logImg || "/placeholder.svg"}
            alt="Logo"
            style={{ width: "100%", height: "auto", objectFit: "contain", cursor: "pointer" }}
          />
        </Link>
      </Box>

      {/* right form */}
      <Card sx={{ width: 400, padding: 2, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          {success ? (
            // Success message
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Registration Successful!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your account has been created successfully. You will be redirected to the login page shortly.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#6145DD" }}>
                Go to Login
              </Button>
            </Box>
          ) : (
            // Registration form
            <>
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

              {/* Error message */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* textbox */}
              <TextField
                fullWidth
                label="First Name"
                variant="standard"
                sx={{ mb: 2 }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={loading}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="standard"
                sx={{ mb: 2 }}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={loading}
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="standard"
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  // Clear email error when user starts typing again
                  if (errors.email) {
                    setErrors({ ...errors, email: "" })
                  }
                }}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                required
              />

              {/* password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="standard"
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" disabled={loading}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* confirm password */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="standard"
                sx={{ mb: 3 }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword || (!isPasswordMatch && confirmPassword.length > 0)}
                helperText={
                  errors.confirmPassword ||
                  (!isPasswordMatch && confirmPassword.length > 0 ? "Passwords do not match" : "")
                }
                disabled={loading}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" disabled={loading}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* sign up btn */}
              <Button
                fullWidth
                variant="contained"
                sx={{ bgcolor: "#6145DD", color: "white", mb: 2 }}
                disabled={!isFormComplete || !isPasswordMatch || loading}
                onClick={RegisterRequest}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? "Creating Account..." : "Sign Up Now"}
              </Button>

              {/* divider */}
              <Divider>or</Divider>

              {/* link tologin page */}
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Already have an account?{" "}
                <Button
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  Log in now!!
                </Button>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
