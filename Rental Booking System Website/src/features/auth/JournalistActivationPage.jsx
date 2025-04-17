"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { CheckCircle, ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material"
import { handleApiError } from "@/api"
// Import the journalistApi
import { journalistApi } from "@/api/journalist"

export default function JournalistActivationPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const countdownRef = useRef(null)

  // Token validation states
  const [loading, setLoading] = useState(true)
  const [tokenStatus, setTokenStatus] = useState("pending") // pending, valid, invalid
  const [errorMessage, setErrorMessage] = useState("")
  const [countdown, setCountdown] = useState(10)

  // Form states
  const [temporaryPassword, setTemporaryPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)

  // Password validation
  const [passwordErrors, setPasswordErrors] = useState({
    temporaryPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid")
      setErrorMessage("Invalid activation link. Token is missing.")
      setLoading(false)
      return
    }

    // Replace the validateToken function with journalistApi
    const validateToken = async () => {
      try {
        await journalistApi.validateActivation(token)
        setTokenStatus("valid")
      } catch (error) {
        setTokenStatus("invalid")
        const errorDetails = handleApiError(error)
        setErrorMessage(errorDetails.message || "Invalid or expired activation token.")
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  // Start countdown if token is invalid
  useEffect(() => {
    if (tokenStatus === "invalid" && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(countdownRef.current)
    } else if (countdown === 0) {
      clearInterval(countdownRef.current)
      navigate("/home")
    }
  }, [tokenStatus, countdown, navigate])

  // Validate form
  const validateForm = () => {
    const errors = {
      temporaryPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    let isValid = true

    if (!temporaryPassword.trim()) {
      errors.temporaryPassword = "Temporary password is required"
      isValid = false
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required"
      isValid = false
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters"
      isValid = false
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  // Handle form submission
  // Replace the handleSubmit function with journalistApi
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setFormLoading(true)
    setFormError("")

    try {
      await journalistApi.activate({
        token,
        temporaryPassword,
        newPassword,
      })

      setFormSuccess(true)

      // Clear form
      setTemporaryPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      const errorDetails = handleApiError(error)
      if (error.response && error.response.status === 401) {
        setFormError("Incorrect temporary password. Please check the password provided in your email.")
      } else {
        setFormError(errorDetails.message || "Failed to activate account. Please try again.")
      }
    } finally {
      setFormLoading(false)
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
                Validating Your Activation Link
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we verify your activation link...
              </Typography>
            </Box>
          ) : tokenStatus === "invalid" ? (
            // Invalid token state
            <Box sx={{ textAlign: "center", py: 4 }}>
              <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Invalid Activation Link
              </Typography>
              <Typography variant="body1" color="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Redirecting to homepage in {countdown} seconds...
              </Typography>
              <Button variant="contained" onClick={() => navigate("/home")} sx={{ bgcolor: "#6145DD" }}>
                Go to Homepage
              </Button>
            </Box>
          ) : formSuccess ? (
            // Success state
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Account Activated!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your journalist account has been successfully activated. You can now log in to your account.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#6145DD" }}>
                Go to Login
              </Button>
            </Box>
          ) : (
            // Activation form
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ textAlign: "center" }}>
                Activate Your Journalist Account
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                Please enter your temporary password and create a new password to activate your account.
              </Typography>

              {formError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Temporary Password"
                  type={showTempPassword ? "text" : "password"}
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                  margin="normal"
                  error={!!passwordErrors.temporaryPassword}
                  helperText={passwordErrors.temporaryPassword}
                  disabled={formLoading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowTempPassword(!showTempPassword)}
                          edge="end"
                          disabled={formLoading}
                        >
                          {showTempPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                  disabled={formLoading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          disabled={formLoading}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                  disabled={formLoading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={formLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#6145DD", py: 1.5 }}
                  disabled={formLoading}
                  startIcon={formLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {formLoading ? "Activating Account..." : "Activate Account"}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
