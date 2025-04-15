"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  Box,
  Pagination,
  Alert,
  Snackbar,
  Container,
  Paper,
  Button,
  Skeleton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { SearchOff, Refresh, Search, Clear } from "@mui/icons-material"
import NewsCard from "@/components/NewsCard"
import { articlesApi, categoriesApi, handleApiError } from "@/apiRoutes"

// Skeleton loader component for news cards
const NewsCardSkeleton = () => (
  <Card>
    <Grid container>
      <Grid item xs={4}>
        <Skeleton variant="rectangular" height={150} animation="wave" />
      </Grid>
      <Grid item xs={8}>
        <CardContent>
          <Skeleton variant="text" height={32} width="70%" animation="wave" />
          <Skeleton variant="text" height={20} animation="wave" />
          <Skeleton variant="text" height={20} width="80%" animation="wave" />
        </CardContent>
      </Grid>
    </Grid>
  </Card>
)

export default function NewsListing() {
  const { category: urlCategory, filter: urlFilter } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we're in search mode
  const isSearchMode = urlFilter === "search"
  const searchParams = new URLSearchParams(location.search)
  const queryFromUrl = searchParams.get("query") || ""

  // State for articles and pagination
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("latest")
  const [category, setCategory] = useState(null)
  const [categoryId, setCategoryId] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [prevPath, setPrevPath] = useState("")
  const [searchQuery, setSearchQuery] = useState(queryFromUrl)

  // Track route changes and force refetch when needed
  useEffect(() => {
    console.log("Route changed:", location.pathname, "Previous:", prevPath)

    // Check if we're transitioning from a category to non-category route
    const wasInCategory = prevPath.includes("/news/") && prevPath.split("/").length > 3
    const isInCategory = location.pathname.includes("/news/") && location.pathname.split("/").length > 3

    // If we moved from a category to a non-category route, force a reset and refetch
    if (wasInCategory && !isInCategory) {
      console.log("Transitioning from category to non-category route - resetting state")
      setCategoryId(null)
      setCategory(null)
      setPage(1)

      // Force immediate fetch for non-category routes
      if (location.pathname === "/news/latest") {
        console.log("Forcing fetch of latest articles")
        fetchLatestArticles()
      } else if (location.pathname === "/news/trending") {
        console.log("Forcing fetch of trending articles")
        fetchTrendingArticles()
      }
    }

    // Update previous path
    setPrevPath(location.pathname)
  }, [location.pathname, location.state])

  // Set filter and category from URL params
  useEffect(() => {
    console.log("URL params changed:", { urlCategory, urlFilter })

    if (urlFilter) {
      setFilter(urlFilter.toLowerCase())
    } else {
      setFilter("latest")
    }

    setCategory(urlCategory || null)

    // If we have a category name, we need to find its ID
    if (urlCategory) {
      fetchCategoryId(urlCategory)
    } else {
      setCategoryId(null)
    }

    // Update search query from URL if in search mode
    if (isSearchMode) {
      setSearchQuery(queryFromUrl)
    }
  }, [urlFilter, urlCategory, isSearchMode, queryFromUrl])

  // Fetch category ID by name
  const fetchCategoryId = async (categoryName) => {
    try {
      const response = await categoriesApi.getAll()
      const categories = response.data
      const foundCategory = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase())

      if (foundCategory) {
        setCategoryId(foundCategory.categoryID)
      } else {
        setError(`Category "${categoryName}" not found`)
      }
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch categories:", errorDetails)
      setError("Unable to load category information")
    }
  }

  // Fetch articles when filter, category ID, or page changes
  useEffect(() => {
    console.log("Fetch dependencies changed:", { filter, categoryId, page, isSearchMode, queryFromUrl })

    // Only wait for category ID if we're in a category route
    if (urlCategory && !categoryId && !isSearchMode) {
      console.log("Waiting for category ID...")
      return
    }

    if (isSearchMode && queryFromUrl) {
      console.log("Fetching search results")
      fetchSearchResults()
    } else if (categoryId) {
      console.log("Fetching category articles")
      fetchCategoryArticles()
    } else if (filter === "latest") {
      console.log("Fetching latest articles")
      fetchLatestArticles()
    } else {
      console.log("Fetching trending articles")
      fetchTrendingArticles()
    }
  }, [filter, categoryId, page, isSearchMode, queryFromUrl])

  // Dedicated functions for each type of fetch
  const fetchLatestArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await articlesApi.getLatest({
        params: { page, pageSize },
      })

      setArticles(response.data.items || [])
      setTotalResults(response.data.totalCount || 0)
      setTotalPages(Math.ceil((response.data.totalCount || 0) / pageSize))
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch latest articles:", errorDetails)
      setError("Unable to load latest articles. Please try again later.")
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await articlesApi.getTrending({
        params: { page, pageSize },
      })

      setArticles(response.data.items || [])
      setTotalResults(response.data.totalCount || 0)
      setTotalPages(Math.ceil((response.data.totalCount || 0) / pageSize))
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch trending articles:", errorDetails)
      setError("Unable to load trending articles. Please try again later.")
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      // Map filter to listType (0 for latest, 1 for trending)
      const listType = filter === "latest" ? 0 : 1

      const response = await articlesApi.getByCategory(categoryId, {
        params: {
          listType,
          page,
          pageSize,
        },
      })

      setArticles(response.data.items || [])
      setTotalResults(response.data.totalCount || 0)
      setTotalPages(Math.ceil((response.data.totalCount || 0) / pageSize))
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch category articles:", errorDetails)
      setError("Unable to load category articles. Please try again later.")
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSearchResults = async () => {
    if (!queryFromUrl.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await articlesApi.search({
        params: {
          query: queryFromUrl.trim(),
          page,
          pageSize,
        },
      })

      setArticles(response.data.items || [])
      setTotalResults(response.data.totalCount || 0)
      setTotalPages(Math.ceil((response.data.totalCount || 0) / pageSize))
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch search results:", errorDetails)
      setError("Unable to load search results. Please try again later.")
      setArticles([])
      setTotalResults(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  // Handle filter change
  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value.toLowerCase()
    setFilter(selectedFilter)

    // Reset to page 1 when filter changes
    setPage(1)

    // Update URL
    if (urlCategory) {
      navigate(`/news/${urlCategory}/${selectedFilter}`)
    } else {
      navigate(`/news/${selectedFilter}`)
    }
  }

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    
    // Update URL with page parameter if in search mode
    if (isSearchMode) {
      navigate(`/news/search?query=${encodeURIComponent(queryFromUrl)}&page=${newPage}`)
    }
  }

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setPage(1) // Reset to first page on new search
      navigate(`/news/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    navigate("/news/latest")
  }

  // Close error snackbar
  const handleCloseError = () => setError(null)

  // Handle retry
  const handleRetry = () => {
    if (isSearchMode) {
      fetchSearchResults()
    } else if (categoryId) {
      fetchCategoryArticles()
    } else if (filter === "latest") {
      fetchLatestArticles()
    } else {
      fetchTrendingArticles()
    }
  }

  // Determine if we should show the filter dropdown
  const showFilter = !!urlCategory && !isSearchMode

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} key={`skeleton-${index}`}>
          <NewsCardSkeleton />
        </Grid>
      ))
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 3,
        height: "auto",
        overflow: "visible",
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 100px)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Header Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexShrink: 0 }}>
          <Typography variant="h5" sx={{ color: "black" }}>
            <Box component="span" sx={{ color: "blue", fontWeight: "bold" }}>
              News{category ? " /" : isSearchMode ? " / Search" : ""}
            </Box>
            {category && (
              <Box component="span" sx={{ color: "black" }}>
                {` ${category.charAt(0).toUpperCase() + category.slice(1)}`}
              </Box>
            )}
          </Typography>

          {/* Only show filter dropdown when in a category */}
          {showFilter && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Filter by:
              </Typography>
              <Select value={filter} onChange={handleFilterChange} sx={{ height: "40px", minWidth: "120px" }}>
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="trending">Trending</MenuItem>
              </Select>
            </Box>
          )}
        </Box>

        {/* Search Form - Only show in search mode */}
        {isSearchMode && (
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter keywords to search for articles..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} edge="end">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ ml: 2, bgcolor: "#6145DD" }}
                disabled={!searchQuery.trim() || loading}
              >
                Search
              </Button>
            </Box>
          </Box>
        )}

        {/* Search Results Count - Only show in search mode */}
        {isSearchMode && queryFromUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {loading ? (
                <Skeleton width={300} />
              ) : (
                `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${queryFromUrl}"`
              )}
            </Typography>
          </Box>
        )}

        {/* News List */}
        <Box sx={{ flex: 1, mb: 3, overflow: "visible" }}>
          {loading ? (
            <Grid container spacing={3}>
              {renderSkeletons()}
            </Grid>
          ) : articles.length > 0 ? (
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={12} key={article.articleID}>
                  <NewsCard
                    title={article.title}
                    description={
                      article.description !== "no Description"
                        ? article.description
                        : article.content?.substring(0, 150) || "No description available"
                    }
                    image={article.imageURL || "#"}
                    articleId={article.articleID}
                    slug={article.slug}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              elevation={1}
              sx={{
                textAlign: "center",
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
              }}
            >
              <SearchOff sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isSearchMode ? "No Results Found" : "No Articles Found"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: "600px" }}>
                {isSearchMode
                  ? `We couldn't find any articles matching "${queryFromUrl}". Please try different keywords or check your spelling.`
                  : category
                  ? `We couldn't find any ${filter} articles in the ${category} category.`
                  : `We couldn't find any ${filter} articles at this time.`}
              </Typography>
              <Button variant="outlined" startIcon={<Refresh />} onClick={handleRetry}>
                Try Again
              </Button>
            </Paper>
          )}
        </Box>

        {/* Pagination */}
        {!loading && articles.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

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

