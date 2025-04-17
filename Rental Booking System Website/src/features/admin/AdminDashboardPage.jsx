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
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Snackbar,
} from "@mui/material"
import { PersonAdd } from "@mui/icons-material"
import { adminApi } from "@/api/admin"
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

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")

  // Form validation errors
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

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
      const role = Number.parseInt(decodedToken.role || "0", 10)
      if (role !== 2) {
        // Redirect if not an admin (role 2)
        navigate("/home")
        return
      }

      setUser({
        username: decodedToken.username || "User",
        role: role,
        id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      })
    } else {
      // Redirect to login if token is invalid
      navigate("/login")
    }
  }, [navigate])

  // Validate form
  const validateForm = () => {
    const newErrors = {
      firstName: firstName.trim() ? "" : "First name is required",
      lastName: lastName.trim() ? "" : "Last name is required",
      email: "",
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const journalistData = {
        firstName,
        lastName,
        email,
      }

      await adminApi.registerJournalist(journalistData)

      // Clear form and show success message
      setFirstName("")
      setLastName("")
      setEmail("")
      setSuccess("Journalist account created successfully! An email has been sent with login instructions.")
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to create journalist account:", errorDetails)

      // Handle specific error cases
      if (errorDetails.status === 409) {
        setError("Email is already registered.")
      } else {
        setError(errorDetails.message || "Failed to create journalist account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSuccess(null)
    setError(null)
  }

  return (
    <Box sx={{ display: "flex", width: "100%", maxWidth: 1200, mx: "auto" }}>
      {/* Left sidebar with tabs */}
      <Paper sx={{ width: 240, flexShrink: 0, mr: 3, borderRadius: 2 }}>
        <List component="nav" aria-label="dashboard navigation">
          <ListItem disablePadding>
            <ListItemButton selected={true} sx={{ py: 2 }}>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Create Journalist" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Right content area */}
      <Card sx={{ flexGrow: 1, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold">
            Create Journalist Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new journalist account. The journalist will receive an email with instructions to set up their
            password.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  margin="normal"
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                  required
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  margin="normal"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  required
                />

                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{ bgcolor: "#6145DD" }}
                  >
                    {loading ? "Creating Account..." : "Create Journalist Account"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Success/Error Snackbar */}
      <Snackbar open={!!success || !!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
