import React from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CardMedia,
  useMediaQuery,
} from "@mui/material";

export default function HomePage() {
  // Use media query to detect screen width
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{ height: "100vh", overflow: "auto", p: 2, }} >
      <Grid container spacing={2}>
        {/* Left Section */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            height: { xs: "auto", md: "calc(100vh - 60px)" },
            overflow: { xs: "visible", md: "auto" },
            paddingBottom: "20px",
          }}
        >
          <Grid container spacing={2}>
            {/* Breaking News Section */}
            <Grid item xs={12}>
              <Card>
                <Grid container>
                  {/* Image */}
                  <Grid item xs={4}>
                    <CardMedia
                      component="img"
                      height="290px"
                      image="#"
                      alt="Breaking News Image"
                    />
                  </Grid>
                  {/* Text */}
                  <Grid item xs={8}>
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
            {[...Array(10)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <Grid container>
                    {/* Image */}
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        height="150"
                        image="#"
                        alt="News Image"
                      />
                    </Grid>
                    {/* Text */}
                    <Grid item xs={8}>
                      <CardContent>
                        <Typography variant="h6">
                          News Title {index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Text text text text text text text text. Text text
                          text text text text text text text text.
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
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: { xs: "auto", md: "calc(100vh - 60px)" },
            overflowY: { xs: "visible", md: "auto" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingBottom: isSmallScreen ? "90px" : "20px", // Dynamic padding
          }}
        >
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardContent sx={{ overflowY: "auto", flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Latest
              </Typography>
              {[...Array(20)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="caption">{1 + index * 5}m ago</Typography>
                  <Typography variant="body2" noWrap>
                    Title: text text text text text text text text text text text
                  </Typography>
                </Box>
              ))}
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="outlined" fullWidth>
                View All News
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
