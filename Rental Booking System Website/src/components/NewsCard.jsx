"use client"

import { Card, Grid, CardMedia, CardContent, Typography, CardActionArea, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function NewsCard({ title, description, image, articleId, slug, publishedAt }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (articleId && slug) {
      navigate(`/news/article/${articleId}/${slug}`)
    }
  }

  return (
    <Card
      sx={{
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handleClick} disabled={!articleId || !slug}>
        <Grid container>
          {/* Image container - responsive width */}
          <Grid
            item
            xs={4}
            sm={4}
            md={4}
            sx={{
              display: "flex",
              alignItems: "stretch",
              height: { xs: "120px", sm: "150px", md: "150px" },
            }}
          >
            <CardMedia
              component="img"
              image={image || "/placeholder.svg?height=150&width=150"}
              alt={title || "News Image"}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Content container */}
          <Grid item xs={8} sm={8} md={8}>
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                p: { xs: 1.5, sm: 2 },
              }}
            >
              {/* Responsive title with ellipsis */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  lineHeight: 1.2,
                  fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {title || "News Title"}
              </Typography>

              {/* Description with ellipsis */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 2, sm: 3 },
                  WebkitBoxOrient: "vertical",
                  mb: 1,
                  flexGrow: 1,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {description || "No description available"}
              </Typography>

              {/* Date at the bottom */}
              {publishedAt && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: "auto",
                    pt: 1,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontWeight: "medium",
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    }}
                  >
                    {new Date(publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  )
}
