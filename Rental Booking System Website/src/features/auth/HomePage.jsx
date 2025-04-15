"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Grid,
  Box,
  useMediaQuery,
  Typography,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  Snackbar,
  Chip,
  useTheme,
  Container,
} from "@mui/material"
import { format, parseISO } from "date-fns"
import { articlesApi, handleApiError } from "@/apiRoutes"

// Breaking News component with skeleton loader - UPDATED WITH RESPONSIVE DESIGN
const BreakingNews = ({ article, loading, onClick }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  return (
    <Card
      sx={{
        cursor: article ? "pointer" : "default",
        overflow: "hidden",
        boxShadow: 3,
        borderRadius: 2,
        height: { xs: "auto", sm: 250, md: 280 },
        position: "relative",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": article
          ? {
              transform: "translateY(-4px)",
              boxShadow: 6,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Grid container sx={{ height: "100%" }} direction={isMobile ? "column" : "row"}>
        {/* Image section - full width on mobile, 40% on larger screens */}
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          sx={{
            height: isMobile ? "200px" : "100%",
            minHeight: isMobile ? "200px" : "auto",
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height="100%" width="100%" animation="wave" />
          ) : (
            <Box
              component="img"
              height="100%"
              width="100%"
              src={article?.imageURL || "/placeholder.svg?height=380&width=300"}
              alt={article?.title || "Breaking News"}
              sx={{ objectFit: "cover" }}
            />
          )}
        </Grid>

        {/* Content section */}
        <Grid item xs={12} sm={8} md={8} sx={{ height: isMobile ? "auto" : "100%" }}>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: { xs: 2, sm: 3 },
              overflow: "hidden",
            }}
          >
            {loading ? (
              <>
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={32}
                  sx={{ mb: 2, borderRadius: 1 }}
                  animation="wave"
                />
                <Skeleton variant="text" height={48} width="90%" animation="wave" />
                <Skeleton variant="text" height={48} width="70%" animation="wave" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={24} animation="wave" />
                <Skeleton variant="text" height={24} animation="wave" />
                <Skeleton variant="text" height={24} width="80%" animation="wave" />
                <Skeleton variant="text" height={24} width="60%" animation="wave" />
              </>
            ) : (
              <>
                <Chip
                  label="TRENDING NEWS"
                  color="error"
                  size="medium"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    fontSize: { xs: "0.75rem", sm: "0.85rem" },
                    height: { xs: 28, sm: 32 },
                  }}
                />
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 2, sm: 2, md: 3 },
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {article?.title || "Breaking News"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, sm: 3, md: 4 },
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.6,
                    fontSize: { xs: "0.875rem", sm: "0.875rem", md: "1rem" },
                  }}
                >
                  {article?.description !== "no Description"
                    ? article?.description
                    : "This breaking news story is developing. Click to read the latest updates and information about this important event."}
                </Typography>
                <Box sx={{ mt: "auto" }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.85rem" },
                    }}
                  >
                    {article?.publishedAt
                      ? `Published: ${format(parseISO(article.publishedAt), "MMMM d, yyyy • h:mm a")}`
                      : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "primary.main",
                      fontWeight: "medium",
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Click to read full story
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

// News Card component with skeleton loader - UPDATED WITH RESPONSIVE DESIGN
const NewsCardItem = ({ article, loading, onClick }) => {
  return (
    <Card
      sx={{
        mb: 2,
        cursor: article ? "pointer" : "default",
        height: { xs: "auto", sm: 180, md: 200 },
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": article
          ? {
              transform: "translateY(-4px)",
              boxShadow: 4,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          xs={4}
          sx={{
            height: { xs: "120px", sm: "100%", md: "100%" },
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height="100%" animation="wave" />
          ) : (
            <Box
              component="img"
              height="100%"
              width="100%"
              src={article?.imageURL || "/placeholder.svg?height=220&width=180"}
              alt={article?.title || "News Image"}
              sx={{ objectFit: "cover" }}
            />
          )}
        </Grid>
        <Grid item xs={8} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <CardContent
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              py: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2 },
              pb: "8px !important", // Override the default padding bottom
              overflow: "hidden",
            }}
          >
            {loading ? (
              <>
                <Skeleton variant="text" height={32} width="80%" animation="wave" />
                <Skeleton variant="text" height={20} animation="wave" sx={{ mt: 1 }} />
                <Skeleton variant="text" height={20} animation="wave" />
                <Skeleton variant="text" height={20} width="60%" animation="wave" />
              </>
            ) : (
              <>
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
                  {article?.title || "News Title"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 2, sm: 3 },
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.5,
                    mb: 1,
                    flexGrow: 1,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {article?.description !== "no Description"
                    ? article?.description
                    : "Click to read more about this story. This article contains the latest information about this developing story."}
                </Typography>
                {/* Date at the bottom with clear styling */}
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
                    {article?.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Date unavailable"}
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

// Latest News Item component with skeleton loader - UPDATED WITH RESPONSIVE DESIGN
const LatestNewsItem = ({ article, loading, onClick }) => {
  const formatPublishedTime = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMM d, yyyy • h:mm a")
    } catch (error) {
      return "Recently published"
    }
  }

  return (
    <Box
      sx={{
        mb: 2,
        cursor: article ? "pointer" : "default",
        p: 1,
        borderRadius: 1,
        transition: "background-color 0.2s",
        "&:hover": article
          ? {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            }
          : {},
      }}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Skeleton variant="text" height={20} width="30%" animation="wave" />
          <Skeleton variant="text" height={24} animation="wave" />
        </>
      ) : (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          >
            {article?.publishedAt ? formatPublishedTime(article.publishedAt) : "Recently"}
          </Typography>
          <Typography
            variant="body2"
            fontWeight="medium"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: { xs: "0.85rem", sm: "0.9rem" },
            }}
          >
            {article?.title || "News Title"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
            }}
          >
            {article?.description !== "no Description" ? article?.description : "Click to read more..."}
          </Typography>
        </>
      )}
    </Box>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [trendingNews, setTrendingNews] = useState([])
  const [latestNews, setLatestNews] = useState([])
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingLatest, setLoadingLatest] = useState(true)
  const [error, setError] = useState(null)

  // Fetch trending news
  useEffect(() => {
    const fetchTrendingNews = async () => {
      setLoadingTrending(true)
      try {
        const response = await articlesApi.getTrending({ params: { limit: 20 } })
        setTrendingNews(response.data || [])
      } catch (error) {
        const errorDetails = handleApiError(error)
        console.error("Failed to fetch trending news:", errorDetails)
        setError("Unable to load trending news. Please try again later.")
        setTrendingNews([])
      } finally {
        setLoadingTrending(false)
      }
    }

    fetchTrendingNews()
  }, [])

  // Fetch latest news
  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoadingLatest(true)
      try {
        const response = await articlesApi.getLatest({ params: { page: 1, pageSize: 10 } })
        setLatestNews(response.data.items || [])
      } catch (error) {
        const errorDetails = handleApiError(error)
        console.error("Failed to fetch latest news:", errorDetails)
        setError("Unable to load latest news. Please try again later.")
        setLatestNews([])
      } finally {
        setLoadingLatest(false)
      }
    }

    fetchLatestNews()
  }, [])

  // Navigate to article detail
  const handleArticleClick = (articleId, slug) => {
    if (articleId && slug) {
      navigate(`/news/article/${articleId}/${slug}`)
    }
  }

  // Navigate to all news
  const handleViewAllNews = () => {
    navigate("/news/latest")
  }

  // Close error snackbar
  const handleCloseError = () => setError(null)

  // Get breaking news (first trending article)
  const breakingNews = trendingNews.length > 0 ? trendingNews[0] : null

  // Get remaining trending news (skip the first one used for breaking news)
  const remainingTrendingNews = trendingNews.slice(1)

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ height: "100%", overflow: "auto", py: 2 }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Left Section - Trending News */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              height: { xs: "auto", md: "calc(100vh - 60px)" },
              display: "flex",
              flexDirection: "column",
              paddingBottom: "20px",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxShadow: { xs: 1, md: 2 },
                borderRadius: 2,
                overflow: "hidden", // Hide overflow at the card level
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 1.5, sm: 2, md: 3 },
                  height: "100%",
                  overflow: "hidden", // Hide overflow at the CardContent level
                  display: "flex",
                  flexDirection: "column",
                  "&:last-child": { pb: { xs: 1.5, sm: 2, md: 3 } }, // Override Material UI's default padding
                }}
              >
                <Box
                  sx={{
                    overflow: "auto",
                    flexGrow: 1,
                    pr: { xs: 1, sm: 2 }, // Add padding-right for scrollbar
                    mr: { xs: -1, sm: -2 }, // Compensate for padding with negative margin
                    // Custom scrollbar styling
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {/* Breaking News */}
                  <BreakingNews
                    article={breakingNews}
                    loading={loadingTrending}
                    onClick={() => breakingNews && handleArticleClick(breakingNews.articleID, breakingNews.slug)}
                  />

                  {/* Space between BreakingNews and NewsList */}
                  <Box sx={{ height: { xs: 16, sm: 24, md: 32 } }} />

                  {/* Trending News List */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      ml: 1,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    Trending News
                  </Typography>

                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {loadingTrending ? (
                      // Skeleton loaders for trending news
                      Array(isMobileScreen ? 4 : 6)
                        .fill(0)
                        .map((_, index) => (
                          <Grid item xs={12} md={6} key={`trending-skeleton-${index}`}>
                            <NewsCardItem loading={true} />
                          </Grid>
                        ))
                    ) : remainingTrendingNews.length > 0 ? (
                      // Actual trending news items
                      remainingTrendingNews.map((article) => (
                        <Grid item xs={12} md={6} key={article.articleID}>
                          <NewsCardItem
                            article={article}
                            loading={false}
                            onClick={() => handleArticleClick(article.articleID, article.slug)}
                          />
                        </Grid>
                      ))
                    ) : (
                      // No trending news found
                      <Grid item xs={12}>
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                          No trending news available at this time.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Section - Latest News */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              height: { xs: "auto", md: "calc(100vh - 60px)" },
              overflowY: { xs: "visible", md: "auto" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: isSmallScreen ? "90px" : "20px",
            }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxShadow: { xs: 1, md: 2 },
                borderRadius: 2,
                overflow: "hidden", // Hide overflow at the card level
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  p: { xs: 1.5, sm: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden", // Hide overflow at the CardContent level
                  "&:last-child": { pb: { xs: 1.5, sm: 2, md: 3 } }, // Override Material UI's default padding
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Latest News
                </Typography>

                <Box
                  sx={{
                    overflow: "auto",
                    flexGrow: 1,
                    pr: { xs: 1, sm: 2 }, // Add padding-right for scrollbar
                    mr: { xs: -1, sm: -2 }, // Compensate for padding with negative margin
                    // Custom scrollbar styling
                    "&::-webkit-scrollbar": {
                      width: "8px",
                      backgroundColor: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  {loadingLatest ? (
                    // Skeleton loaders for latest news
                    Array(10)
                      .fill(0)
                      .map((_, index) => <LatestNewsItem key={`latest-skeleton-${index}`} loading={true} />)
                  ) : latestNews.length > 0 ? (
                    // Actual latest news items
                    latestNews.map((article) => (
                      <LatestNewsItem
                        key={article.articleID}
                        article={article}
                        loading={false}
                        onClick={() => handleArticleClick(article.articleID, article.slug)}
                      />
                    ))
                  ) : (
                    // No latest news found
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                      No latest news available at this time.
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewAllNews}
                  sx={{
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: "0.85rem", sm: "0.875rem" },
                  }}
                >
                  View All News
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  )
}
