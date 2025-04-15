"use client"

import { Card, Grid, CardMedia, CardContent, Typography, CardActionArea } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function NewsCard({ title, description, image, articleId, slug, publishedAt }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (articleId && slug) {
      navigate(`/news/article/${articleId}/${slug}`)
    }
  }

  return (
    <Card>
      <CardActionArea onClick={handleClick} disabled={!articleId || !slug}>
        <Grid container>
          <Grid item xs={4}>
            <CardMedia component="img" height="150" image={image || "#"} alt={title || "News Image"} />
          </Grid>
          <Grid item xs={8}>
            <CardContent>
              <Typography variant="h6">{title || "News Title"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {description || "No description available"}
              </Typography>
              {publishedAt && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  {new Date(publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  )
}
