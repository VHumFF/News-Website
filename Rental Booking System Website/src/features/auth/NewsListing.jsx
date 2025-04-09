import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Typography, Select, MenuItem, Box } from "@mui/material";
import NewsCard from "@/components/NewsCard";

export default function NewsListing() {
  const { category: urlCategory, filter: urlFilter } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("latest");
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (urlFilter) {
      setFilter(urlFilter.toLowerCase());
    }
    setCategory(urlCategory || null);
  }, [urlFilter, urlCategory]);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value.toLowerCase();
    setFilter(selectedFilter);
    if (urlCategory) {
      navigate(`/news/${urlCategory}/${selectedFilter}`);
    } else {
      navigate(`/news/${selectedFilter}`);
    }
  };

  return (
    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexShrink: 0, }} >
        <Typography variant="h6" sx={{ color: "black" }}>
          <Box component="span" sx={{ color: "blue", fontWeight: "bold" }}>
            News{category ? " /" : ""}
          </Box>
          {category && (
            <Box component="span" sx={{ color: "black" }}>
              {` ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            </Box>
          )}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Filter by:
          </Typography>
          <Select value={filter} onChange={handleFilterChange} sx={{ height: "30px" }}>
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* News List */}
      <Box sx={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }} >
        <Grid container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <NewsCard
                title={`News Title ${index + 1}`}
                description="Text text text text text text text text. Text text text text text text text text text text."
                image="#"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
