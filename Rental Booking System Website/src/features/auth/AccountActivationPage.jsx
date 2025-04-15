"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Card, CardContent, Typography, Button, TextField, Alert, CircularProgress, Paper } from "@mui/material"
import { CheckCircle, ErrorOutline, Email } from "@mui/icons-material"
import { authApi, handleApiError } from "@/apiRoutes"
import axios from "axios"

export default function AccountActivationPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [activationStatus, setActivationStatus] = useState("pending") // pending, success, error
  const [errorMessage, setErrorMessage] = useState("")

  // For resend activation form
  const [email, setEmail] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendStatus, setResendStatus] = useState(null) // null, success, error
  const [resendErrorMessage, setResendErrorMessage] = useState("")

  // Activate account on component mount
  useEffect(() => {
    if (!token) {
      setActivationStatus("error")
      setErrorMessage("Invalid activation link. Token is missing.")
      setLoading(false)
      return
    }

    const activateAccount = async () => {
      try {
        // Using direct axios call since the token is in the URL
        const response = await axios.post(`http://localhost:5239/api/Auth/activate-account/${token}`)

        setActivationStatus("success")
      } catch (error) {
        setActivationStatus("error")

        const errorDetails = handleApiError(error)
        console.error("Account activation failed:", errorDetails)

        // Set appropriate error message
        if (errorDetails.status === 400 && errorDetails.message?.includes("expired")) {
          setErrorMessage("Your activation link has expired. Please request a new one below.")
        } else {
          setErrorMessage(errorDetails.message || "Failed to activate your account. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    activateAccount()
  }, [token])

  // Handle resend activation email
  const handleResendActivation = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setResendStatus("error")
      setResendErrorMessage("Please enter your email address.")
      return
    }

    setResendLoading(true)
    setResendStatus(null)
    setResendErrorMessage("")

    try {
      await authApi.resendActivation(email)
      setResendStatus("success")
    } catch (error) {
      setResendStatus("error")

      const errorDetails = handleApiError(error)
      console.error("Resend activation failed:", errorDetails)

      // Set appropriate error message
      if (errorDetails.status === 404) {
        setResendErrorMessage("Email address not found. Please check your email and try again.")
      } else if (errorDetails.status === 400 && errorDetails.message?.includes("already activated")) {
        setResendErrorMessage("This account is already activated. Please login.")
      } else {
        setResendErrorMessage(errorDetails.message || "Failed to resend activation email. Please try again.")
      }
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            // Loading state
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={60} sx={{ color: "#6145DD", mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Activating Your Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we verify your account...
              </Typography>
            </Box>
          ) : activationStatus === "success" ? (
            // Success state
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Account Activated!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your account has been successfully activated. You can now log in to your account.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#6145DD" }}>
                Go to Login
              </Button>
            </Box>
          ) : (
            // Error state
            <Box>
              <Box sx={{ textAlign: "center", py: 3 }}>
                <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Activation Failed
                </Typography>
                <Typography variant="body1" color="error" sx={{ mb: 3 }}>
                  {errorMessage}
                </Typography>
              </Box>

              {/* Resend activation form */}
              <Paper sx={{ p: 3, bgcolor: "#f9f9f9", borderRadius: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resend Activation Email
                </Typography>

                {resendStatus === "success" ? (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Activation email has been sent! Please check your inbox.
                  </Alert>
                ) : resendStatus === "error" ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {resendErrorMessage}
                  </Alert>
                ) : null}

                <Box component="form" onSubmit={handleResendActivation} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={resendLoading}
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={resendLoading}
                    startIcon={resendLoading ? <CircularProgress size={20} color="inherit" /> : <Email />}
                    sx={{ bgcolor: "#6145DD" }}
                  >
                    {resendLoading ? "Sending..." : "Resend Activation Email"}
                  </Button>
                </Box>
              </Paper>

              <Box sx={{ textAlign: "center", mt: 3 }}>
                <Button onClick={() => navigate("/login")} sx={{ textTransform: "none" }}>
                  Back to Login
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
