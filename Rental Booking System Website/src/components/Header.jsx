import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, IconButton, Menu, MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

export default function Header() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:682px)");
  const isVerySmallScreen = useMediaQuery("(max-width:520px)");

  const [categories, setCategories] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // fetch category from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories"); // replace with the api
        const data = await response.json();
        setCategories(data || []); 
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(["Nation", "World", "Education", "Music", "Sport"]); // testing only
      }
    }

    fetchCategories();
  }, []);

  // to home
  const handleNavigateHome = () => navigate("/");

  const handleNavigateToNews = (filter, category = "") => {
    const baseUrl = "/news";
    const url = category
      ? `${baseUrl}/${category}/${filter.toLowerCase()}`
      : `${baseUrl}/${filter.toLowerCase()}`;
    navigate(url);
  };

  // category menu open & close
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCategoryMenuAnchor(null);
  };

  const handleCategoryMenuOpen = (event) => setCategoryMenuAnchor(event.currentTarget);
  
  // navigate to news/category/latest
  const handleCategoryClick = (category) => {
    handleNavigateToNews("latest", category.toLowerCase());
    handleMenuClose();
  };

  // user profile, logout
  const handleProfileClick = () => setOpenProfileDialog(true);
  const handleCloseProfileDialog = () => setOpenProfileDialog(false);
  const handleLogout = () => alert("Logout!!");

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
              <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} >
                <MenuItem onClick={() => handleNavigateToNews("trending")}>
                  Trending
                </MenuItem>
                <MenuItem onClick={() => handleNavigateToNews("latest")}>
                  Latest
                </MenuItem>
                <MenuItem onClick={handleCategoryMenuOpen}>
                  Category
                </MenuItem>
                <Menu anchorEl={categoryMenuAnchor} open={Boolean(categoryMenuAnchor)} onClose={handleMenuClose} >
                  {categories.map((category, index) => (
                    <MenuItem key={index} onClick={() => handleCategoryClick(category)} >
                      {category}
                    </MenuItem>
                  ))}
                </Menu>
              </Menu>
            </>
          )}

          {/* "The News" - navigates to home */}
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={handleNavigateHome} >
            The News
          </Typography>

          {/* Buttons for Large Screens */}
          {!isSmallScreen && (
            <>
              <Button
                color="inherit"
                onClick={() => handleNavigateToNews("Trending")}
              >
                Trending
              </Button>
              <Button
                color="inherit"
                onClick={() => handleNavigateToNews("Latest")}
              >
                Latest
              </Button>
              <Button color="inherit" onClick={handleCategoryMenuOpen}>
                Category
              </Button>
              <Menu
                anchorEl={categoryMenuAnchor}
                open={Boolean(categoryMenuAnchor)}
                onClose={handleMenuClose}
              >
                {categories.map((category, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          {/* Search Bar and Button */}
          <TextField variant="outlined" placeholder="Search" size="small" sx={{ mx: 1, bgcolor: "white", flexGrow: isSmallScreen ? 1 : "unset", }} />
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
        <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog} sx={{ ".MuiDialog-paper": { width: "300px" } }} >
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
    </Box>
  );
}
