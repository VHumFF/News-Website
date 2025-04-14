"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useMediaQuery } from "@mui/material"
// Import the categoriesApi from apiRoutes.jsx
import { categoriesApi, handleApiError } from "../apiRoutes"

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isSmallScreen = useMediaQuery("(max-width:682px)")
  const isVerySmallScreen = useMediaQuery("(max-width:520px)")

  const [categories, setCategories] = useState([])
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null)
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // fetch category from backend
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)
      setError(null)
      try {
        const response = await categoriesApi.getAll()
        setCategories(response.data || [])
      } catch (error) {
        const errorDetails = handleApiError(error)
        console.error("Failed to fetch categories:", errorDetails)
        setError("Unable to load categories. Please try again later.")
        setCategories([]) // Set to empty array instead of sample data
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // to home
  const handleNavigateHome = () => navigate("/")

  // Modified to force a full navigation
  const handleNavigateToNews = (filter, category = "") => {
    const baseUrl = "/news"
    const url = category ? `${baseUrl}/${category}/${filter.toLowerCase()}` : `${baseUrl}/${filter.toLowerCase()}`

    // Force a full navigation by adding a timestamp to force component remount
    if (location.pathname !== url) {
      navigate(url, { replace: true, state: { timestamp: Date.now() } })
    }
  }

  // category menu open & close
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget)
  const handleMenuClose = () => {
    setMenuAnchor(null)
    setCategoryMenuAnchor(null)
  }

  const handleCategoryMenuOpen = (event) => setCategoryMenuAnchor(event.currentTarget)

  // navigate to news/category/latest
  const handleCategoryClick = (category) => {
    handleNavigateToNews("latest", category.name.toLowerCase())
    handleMenuClose()
  }

  // user profile, logout
  const handleProfileClick = () => setOpenProfileDialog(true)
  const handleCloseProfileDialog = () => setOpenProfileDialog(false)
  const handleLogout = () => alert("Logout!!")

  // Close error snackbar
  const handleCloseError = () => setError(null)

  // Render category menu items
  const renderCategoryItems = () => {
    if (loading) {
      return <MenuItem disabled>Loading categories...</MenuItem>
    }

    if (categories.length === 0) {
      return <MenuItem disabled>No categories available</MenuItem>
    }

    return categories.map((category) => (
      <MenuItem key={category.categoryID} onClick={() => handleCategoryClick(category)}>
        {category.name}
      </MenuItem>
    ))
  }

  return (
    <Box>
      <AppBar position="static" color="default" sx={{ boxShadow: 0 }}>
        <Toolbar>
          {/* Menu Icon for Small Screens */}
          {isSmallScreen && (
            <>
              <IconButton color="inherit" edge="start" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleNavigateToNews("latest")}>Latest</MenuItem>
                <MenuItem onClick={handleCategoryMenuOpen}>Category</MenuItem>
                <Menu anchorEl={categoryMenuAnchor} open={Boolean(categoryMenuAnchor)} onClose={handleMenuClose}>
                  {renderCategoryItems()}
                </Menu>
              </Menu>
            </>
          )}

          {/* "The News" - navigates to home */}
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={handleNavigateHome}>
            The News
          </Typography>

          {/* Buttons for Large Screens */}
          {!isSmallScreen && (
            <>
              <Button color="inherit" onClick={() => handleNavigateToNews("latest")}>
                Latest
              </Button>
              <Button color="inherit" onClick={handleCategoryMenuOpen}>
                Category
              </Button>
              <Menu anchorEl={categoryMenuAnchor} open={Boolean(categoryMenuAnchor)} onClose={handleMenuClose}>
                {renderCategoryItems()}
              </Menu>
            </>
          )}

          {/* Search Bar and Button */}
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ mx: 1, bgcolor: "white", flexGrow: isSmallScreen ? 1 : "unset" }}
          />
          {!isVerySmallScreen && (
            <Button variant="contained" sx={{ display: "inline-block" }}>
              Search
            </Button>
          )}

          {/* User Profile Button */}
          <Button color="inherit" onClick={handleProfileClick}>
            UserName
          </Button>
        </Toolbar>

        {/* Profile Dialog */}
        <Dialog
          open={openProfileDialog}
          onClose={handleCloseProfileDialog}
          sx={{ ".MuiDialog-paper": { width: "300px" } }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>User Profile</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <strong>Username:</strong> userNme
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> user@email.com
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogout} color="primary">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
