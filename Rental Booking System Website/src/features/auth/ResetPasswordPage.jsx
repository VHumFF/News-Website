"use client"

import { useState, useEffect } from "react"
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
import { CheckCircle, Visibility, VisibilityOff } from "@mui/icons-material"
import { authApi } from "@/api/auth"
import { handleApiError } from "@/api"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  // Form states
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Password validation
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Token is missing.")
    }
  }, [token])

  // Start countdown after successful password reset
  useEffect(() => {
    let timer
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (success && countdown === 0) {
      navigate("/login")
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [success, countdown, navigate])

  // Validate form
  const validateForm = () => {
    const errors = {
      newPassword: "",
      confirmPassword: "",
    }

    let isValid = true

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
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      await authApi.resetPassword(token, newPassword)
      setSuccess(true)

      // Clear form
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Password reset failed:", errorDetails)

      if (errorDetails.status === 401) {
        setError("Invalid or expired reset token. Please request a new password reset link.")
      } else {
        setError(errorDetails.message || "Failed to reset password. Please try again.")
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
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 2, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {success ? (
            // Success state
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Password Reset Successful!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now log in with your new password.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Redirecting to login page in {countdown} seconds...
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#6145DD" }}>
                Go to Login
              </Button>
            </Box>
          ) : (
            // Reset password form
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ textAlign: "center" }}>
                Reset Your Password
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
                Please enter and confirm your new password.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                  disabled={loading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" disabled={loading}>
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
                  disabled={loading}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={loading}
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
                  disabled={loading || !token}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
