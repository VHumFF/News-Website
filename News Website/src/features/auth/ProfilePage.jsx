"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Person, Lock, Check } from "@mui/icons-material"
import { authApi } from "@/api/auth"
import { handleApiError } from "@/api"

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    // Split the token and get the payload part
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    // Parse the JSON
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("account")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Password change form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Get user info from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      // Redirect to login if no token
      navigate("/login")
      return
    }

    const decodedToken = decodeToken(token)
    if (decodedToken) {
      setUser({
        username: decodedToken.username || "User",
        email: decodedToken.email || "No email available",
        role: Number.parseInt(decodedToken.role || "0", 10),
        id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      })
    } else {
      // Redirect to login if token is invalid
      navigate("/login")
    }
  }, [navigate])

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Reset form states when changing tabs
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setSuccess(false)
    setError(null)
  }

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)
    setPasswordError("")

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      })

      // Clear form and show success message
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSuccess(true)
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to change password:", errorDetails)
      setError(errorDetails.message || "Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Check if password form is valid
  const isPasswordFormValid = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword

  return (
    <Box sx={{ display: "flex", width: "100%", maxWidth: 1200, mx: "auto" }}>
      {/* Left sidebar with tabs */}
      <Paper sx={{ width: 240, flexShrink: 0, mr: 3, borderRadius: 2 }}>
        <List component="nav" aria-label="profile navigation">
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === "account"}
              onClick={() => handleTabChange("account")}
              sx={{ py: 2 }}
            >
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Account Info" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === "password"}
              onClick={() => handleTabChange("password")}
              sx={{ py: 2 }}
            >
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Right content area */}
      <Card sx={{ flexGrow: 1, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Account Info Tab */}
          {activeTab === "account" && (
            <Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Account Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {user ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      {user.username}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      {user.email}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary">
                      Account Type
                    </Typography>
                    <Typography variant="h6">
                      {user.role === 0
                        ? "User"
                        : user.role === 1
                          ? "Journalist"
                          : user.role === 2
                            ? "Administrator"
                            : "Unknown"}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <CircularProgress />
              )}
            </Box>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <Box component="form" onSubmit={handleChangePassword}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {success && (
                <Alert icon={<Check fontSize="inherit" />} severity="success" sx={{ mb: 3 }}>
                  Password changed successfully!
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    error={!!passwordError}
                    helperText={passwordError}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                    required
                    disabled={loading}
                    error={newPassword !== confirmPassword && confirmPassword !== ""}
                    helperText={
                      newPassword !== confirmPassword && confirmPassword !== "" ? "Passwords do not match" : ""
                    }
                  />

                  <Box sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!isPasswordFormValid || loading}
                      startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
