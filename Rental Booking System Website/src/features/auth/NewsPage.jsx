import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
} from "@mui/material";

export default function News() {
  const location = useLocation();
  const [filter, setFilter] = useState("Latest");
  const [category, setCategory] = useState("Nation");

  useEffect(() => {
    if (location.state?.filter) {
      setFilter(location.state.filter);
    }
    if (location.state?.category) {
        setCategory(location.state.category);
      }
  }, [location.state]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Box sx={{ p: 3, height: "100vh" }}>
      {/* News / Nation and Filter Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          height: "20px",
        }}
      >
        {/* News / Nation */}
        <Typography variant="h6" sx={{ color: "black" }} >
          News / {category}
        </Typography>

        {/* Filter By */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Filter by:
          </Typography>
          <Select value={filter} onChange={handleFilterChange} sx={{ height: "30px", }} >
            <MenuItem value="Latest">Latest</MenuItem>
            <MenuItem value="Trending">Trending</MenuItem>
          </Select>
          <Button variant="contained" sx={{ ml: 2 }}>
            Go
          </Button>
        </Box>
      </Box>

      {/* News List */}
      <Box sx={{ height: "calc(100vh - 180px)", overflowY: "auto", flex: "1 1 auto", padding: 2,}} >
        <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
                <Card>
                <Grid container>
                    <Grid item xs={4}>
                    <CardMedia
                        component="img"
                        height="150"
                        image="#"
                        alt="News Image"
                    />
                    </Grid>
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
      </Box>
    </Box>
  );
}
