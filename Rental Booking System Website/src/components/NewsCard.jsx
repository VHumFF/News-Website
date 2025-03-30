import React from "react";
import { Card, Grid, CardMedia, CardContent, Typography } from "@mui/material";

export default function NewsCard({ title, description, image }) {
  return (
    <Card>
      <Grid container>
        <Grid item xs={4}>
          <CardMedia component="img" height="150" image={image} alt="News Image" />
        </Grid>
        <Grid item xs={8}>
          <CardContent>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
