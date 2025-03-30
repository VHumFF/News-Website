import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import LatestNewsItem from "./LatestNewsItem";

export default function LatestNews() {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardContent sx={{ overflowY: "auto", flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Latest
        </Typography>
        {[...Array(20)].map((_, index) => (
          <LatestNewsItem
            key={index}
            time={`${1 + index * 5}m ago`}
            title="Title: text text text text..."
          />
        ))}
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" fullWidth>
          View All News
        </Button>
      </Box>
    </Card>
  );
}
