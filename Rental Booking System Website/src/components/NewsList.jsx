import React from "react";
import { Grid } from "@mui/material";
import NewsCard from "./NewsCard";

export default function NewsList() {
  return (
    <Grid container spacing={2}>
      {[...Array(10)].map((_, index) => (
        <Grid item xs={12} md={6} key={index}>
          <NewsCard
            title={`News Title ${index + 1}`}
            description="Text text text text text text..."
            image="#"
          />
        </Grid>
      ))}
    </Grid>
  );
}
