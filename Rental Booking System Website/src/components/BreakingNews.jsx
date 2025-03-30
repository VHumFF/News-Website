import React from "react";
import { Card, Grid, CardMedia, CardContent, Typography } from "@mui/material";

export default function BreakingNews() {
  return (
    <Card >
      <Grid container>
        <Grid item xs={4} > 
          <CardMedia
            component="img"
            height="280px"
            image="#"
            alt="Breaking News Image"
          />
        </Grid>
        <Grid item xs={8}>
          <CardContent>
            <Typography variant="h5">Breaking News: Text</Typography>
            <Typography variant="body2" color="text.secondary">
              Text text text text text text text text text text text...
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}
