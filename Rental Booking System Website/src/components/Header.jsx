import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function Header() {

  // for user profile
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const handleProfileClick = () => {
    setOpenProfileDialog(true);
  };
  
  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  // logout function
  const handleLogout = () => {
    alert("Logout!!");
  };

  // navigate to the page
  const handleTrending = () => {
    alert("Trending page!!");
  };

  const handleLatest = () => {
    alert("Latest page!!");
  };

  const handleCategory = () => {
    alert("Category page!!");
  };

  
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          The News
        </Typography>
        <Button color="inherit" onClick={handleTrending} >Trending</Button>
        <Button color="inherit" onClick={handleLatest} >Latest</Button>
        <Button color="inherit " onClick={handleCategory} >Category</Button>
        <TextField
          variant="outlined"
          placeholder="Search"
          size="small"
          sx={{ mx: 2, bgcolor: "white" }}
        />
        <Button variant="contained">Search</Button>
        <Button color="inherit" onClick={handleProfileClick} >
          UserName
        </Button>
      </Toolbar>

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} onClose={handleClose} sx={{ ".MuiDialog-paper": { width: "300px" } }} >
        <DialogTitle sx={{ textAlign: "center" }} >User Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Username:</strong> userNme
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> user@email.com
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">Logout</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
    
  );
}
