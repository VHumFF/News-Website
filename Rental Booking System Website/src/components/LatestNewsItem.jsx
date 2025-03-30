import React from "react";
import { Box, Typography } from "@mui/material";

export default function LatestNewsItem({ time, title }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption">{time}</Typography>
      <Typography variant="body2" noWrap>
        {title}
      </Typography>
    </Box>
  );
}
