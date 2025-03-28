import React, { useState } from "react";
import { Typography, Button, Grid, Card, CardContent, Box, CardMedia } from "@mui/material";

export default function HomePage() {
  
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Left Section */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          {/* Breaking News Section */}
          <Grid item xs={12}>
            <Card>
              <Grid container>
                {/* image here */}
                <Grid item xs={6}>
                  <CardMedia
                    component="img"
                    height="100%"
                    image="/placeholder-image.jpg"
                    alt="Breaking News Image"
                  />
                </Grid>
                {/* text here */}
                <Grid item xs={6}>
                  <CardContent>
                    <Typography variant="h5">Breaking News: Text</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Text text text text text text text text text text text
                      text text text text text text text text text text text
                      text text text text text text text text text text text.
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
                  {/* image here */}
                  <Grid item xs={4}>
                    <CardMedia
                      component="img"
                      height="100"
                      image="/placeholder-image.jpg"
                      alt="News Image"
                    />
                  </Grid>
                  {/* text here */}
                  <Grid item xs={8}>
                    <CardContent>
                      <Typography variant="h6">News Title {index + 1}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Text text text text text text text text. Text text text
                        text text text text text text text.
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
      <Grid item xs={12} md={4}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Latest
            </Typography>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="caption">{1 + index * 5}m ago</Typography>
                <Typography variant="body2" noWrap>
                  Title: text text text text text text text text text text text
                </Typography>
              </Box>
            ))}
            <Button variant="outlined" fullWidth>
              View All News
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

      {/* Profile Dialog */}
      {/* <Dialog open={openProfileDialog} onClose={handleClose} sx={{ ".MuiDialog-paper": { width: "300px" } }} >
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
      </Dialog> */}
