import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Typography, Select, MenuItem, Button, Card, CardContent, CardMedia, Box, } from "@mui/material";

export default function News() {
  const { category: urlCategory, filter: urlFilter } = useParams(); // get cate from url
  const navigate = useNavigate();
  const [filter, setFilter] = useState("latest");
  const [category, setCategory] = useState(null); // default as null

  useEffect(() => {
    // based on url change the category
    if (urlFilter) {
      setFilter(urlFilter.toLowerCase());
    }
    setCategory(urlCategory || null); // if no category, null
  }, [urlFilter, urlCategory]);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value.toLowerCase();
    setFilter(selectedFilter);
    // refresh URL
    if (urlCategory) {
      navigate(`/news/${urlCategory}/${selectedFilter}`);
    } else {
      navigate(`/news/${selectedFilter}`);
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* News / Nation and Filter Row */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, height: "20px", }} >
        {/* News / Category */}
        <Typography variant="h6" sx={{ color: "black" }}>
          News{category ? ` / ${category.charAt(0).toUpperCase() + category.slice(1)}` : ""}
        </Typography>

        {/* Filter By */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Filter by:
          </Typography>
          <Select value={filter} onChange={handleFilterChange} sx={{ height: "30px" }} >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* News List */}
      <Box
        sx={{
          height: "calc(100vh - 180px)",
          overflowY: "auto",
          flex: "1 1 auto",
          padding: 2,
        }}
      >
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
                      <Typography variant="h6">
                        News Title {index + 1}
                      </Typography>
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
