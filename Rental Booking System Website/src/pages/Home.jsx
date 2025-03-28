import React, { useState } from "react";
import { AppBar, Toolbar, Typography, TextField, Button, Grid, Card, CardContent, CardMedia, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const Home = () => {
  
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  
  const handleProfileClick = () => {
    setOpenProfileDialog(true);
  };
  
  const handleClose = () => {
    setOpenProfileDialog(false);
  };

  const handleLogout = () => {
    alert("Logout!!");
  };

  const handleTrending = () => {
    alert("Trending page!!");
  };

  const handleLatest = () => {
    alert("Latest page!!");
  };

  const handleCatogery = () => {
    alert("Catogery page!!");
  };



  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            The News
          </Typography>
          <Button color="inherit" onClick={handleTrending}>Trending</Button>
          <Button color="inherit" onClick={handleLatest}>Latest</Button>
          <Button color="inherit" onClick={handleCatogery}>Category</Button>
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ mx: 2, bgcolor: "white" }}
          />
          <Button variant="contained">Search</Button>
          <Button color="inherit" onClick={handleProfileClick}>Admin</Button>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Left Section */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {/* Breaking News Section */}
            <Grid item xs={12}>
              <Card sx={{height: "250px"}}>
                <Grid container>
                  {/* trending image here */}
                  <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "250px" }}>
                    <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center" }}>
                    <img src="#" />
                    </Typography>
                  </Grid>
                  {/* trending title, text... */}
                  <Grid item xs={6} sx={{height: "250px"}}>
                    <CardContent>
                      <Typography variant="h5">Breaking News: Text</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Text text text text text text text text text text text text text text text text text text text
                        text text text text text text text text text text text text text.
                      </Typography>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* News Cards Section */}
            {[...Array(5)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <Grid container>
                    {/* news image here */}
                    <Grid item xs={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center" }}>
                        <img src="#" />
                      </Typography>
                    </Grid>
                    {/* news title, text... */}
                    <Grid item xs={8}>
                      <CardContent>
                        <Typography variant="h6">News Title, text</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Text text text text text text text text. Text text text text text text text text text text.
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4} sx={{border:"none"}}>
          {/* , minHeight: "100vh" */}
          <Card sx={{ height: "100%" }}> 
            <CardContent>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Latest
              </Typography>
              {/* adjust when done setup */}
              {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="caption">{1 + index * 5}m ago</Typography>
                  <Typography variant="body2" noWrap>
                    Title: text text text text text text text text text text text
                  </Typography>
                </Box>
              ))}

              {/* view all news btn */}
              <Button variant="outlined" fullWidth>
                View All News
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

    </Box>
  );
};

export default Home;
