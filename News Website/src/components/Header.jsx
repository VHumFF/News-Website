"use client"

import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material"
import { Menu as MenuIcon, Person, Logout, AdminPanelSettings, Article } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import { useMediaQuery } from "@mui/material"
import { categoriesApi } from "@/api/categories"
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

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isSmallScreen = useMediaQuery("(max-width:682px)")
  const isVerySmallScreen = useMediaQuery("(max-width:520px)")

  const [categories, setCategories] = useState([])
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // User state
  const [user, setUser] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  // Get user info from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = decodeToken(token)
      if (decodedToken) {
        setUser({
          username: decodedToken.username || "User",
          role: Number.parseInt(decodedToken.role || "0", 10),
          id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        })
      }
    }
  }, [])

  // Extract search query from URL if on search page
  useEffect(() => {
    if (location.pathname === "/news/search") {
      const params = new URLSearchParams(location.search)
      const query = params.get("query") || ""
      setSearchQuery(query)
    }
  }, [location])

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

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/news/search?query=${encodeURIComponent(searchQuery.trim())}`)
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

  // User menu handlers
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget)
  const handleUserMenuClose = () => setUserMenuAnchor(null)

  // Handle profile click
  const handleProfileClick = () => {
    handleUserMenuClose()
    navigate("/profile")
  }

  // Handle journalist dashboard click
  const handleJournalistDashboardClick = () => {
    handleUserMenuClose()
    navigate("/journalist-dashboard")
  }

  // Handle admin dashboard click
  const handleAdminDashboardClick = () => {
    handleUserMenuClose()
    navigate("/admin-dashboard")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    handleUserMenuClose()
    navigate("/login")
  }

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

  // Get first letter of username for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U"
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
          <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", flexGrow: isSmallScreen ? 1 : "unset" }}>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              placeholder="Search"
              size="small"
              sx={{ bgcolor: "white", flexGrow: 1 }}
            />
            {!isVerySmallScreen && (
              <Button variant="contained" type="submit" sx={{ ml: 1 }}>
                Search
              </Button>
            )}
          </Box>

          {/* User Menu Button */}
          {user ? (
            <>
              <Button
                color="inherit"
                onClick={handleUserMenuOpen}
                startIcon={
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "#6145DD",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    {getInitial(user.username)}
                  </Avatar>
                }
                sx={{ ml: 1 }}
              >
                {user.username}
              </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 200,
                    mt: 1,
                    "& .MuiMenuItem-root": {
                      py: 1,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>

                {/* Journalist Dashboard - only for role 1 */}
                {user.role === 1 && (
                  <MenuItem onClick={handleJournalistDashboardClick}>
                    <ListItemIcon>
                      <Article fontSize="small" />
                    </ListItemIcon>
                    Journalist Dashboard
                  </MenuItem>
                )}

                {/* Admin Dashboard - only for role 2 */}
                {user.role === 2 && (
                  <MenuItem onClick={handleAdminDashboardClick}>
                    <ListItemIcon>
                      <AdminPanelSettings fontSize="small" />
                    </ListItemIcon>
                    Admin Dashboard
                  </MenuItem>
                )}

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </Toolbar>
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
