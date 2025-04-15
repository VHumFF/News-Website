"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
} from "@mui/material"
import {
  Article,
  Drafts,
  Publish,
  Add,
  Edit,
  Delete,
  MoreVert,
  Search,
  FilterList,
  Visibility,
} from "@mui/icons-material"
import { format, parseISO } from "date-fns"
import { articlesApi, handleApiError } from "@/apiRoutes"

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    // Split the token and get the payload part
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    // Decode the base64 string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    // Parse the JSON
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

export default function JournalistDashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [user, setUser] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Pagination state
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  // Get user info from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      // Redirect to login if no token
      navigate("/login")
      return
    }

    const decodedToken = decodeToken(token)
    if (decodedToken) {
      const role = Number.parseInt(decodedToken.role || "0", 10)
      if (role !== 1 && role !== 2) {
        // Redirect if not a journalist or admin
        navigate("/home")
        return
      }

      setUser({
        username: decodedToken.username || "User",
        role: role,
        id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      })
    } else {
      // Redirect to login if token is invalid
      navigate("/login")
    }
  }, [navigate])

  // Fetch articles when tab changes or user changes or page changes
  useEffect(() => {
    if (!user) return

    fetchArticles()
  }, [activeTab, user, page])

  // Fetch articles based on active tab
  const fetchArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      // Determine status based on active tab
      let status
      if (activeTab === "published") {
        status = 1 // Published
      } else if (activeTab === "drafts") {
        status = 0 // Draft
      } else {
        // For "all" tab, we'll make two requests and combine the results
        const draftResponse = await articlesApi.getJournalistArticles(0, page, pageSize)
        const publishedResponse = await articlesApi.getJournalistArticles(1, page, pageSize)

        const combinedArticles = [...(draftResponse.data.items || []), ...(publishedResponse.data.items || [])]

        // Sort by most recent update (publishedAt or last update)
        combinedArticles.sort((a, b) => {
          const dateA = a.publishedAt || a.updatedAt
          const dateB = b.publishedAt || b.updatedAt
          return new Date(dateB) - new Date(dateA)
        })

        setArticles(combinedArticles)
        setTotalCount(draftResponse.data.totalCount + publishedResponse.data.totalCount)
        setLoading(false)
        return
      }

      const response = await articlesApi.getJournalistArticles(status, page, pageSize)
      setArticles(response.data.items || [])
      setTotalCount(response.data.totalCount || 0)
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch articles:", errorDetails)
      setError("Failed to load articles. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchTerm("")
    setPage(1) // Reset to first page when changing tabs
  }

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  // Handle article search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // Filter articles based on search term
  const filteredArticles = articles.filter((article) => article.title.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle article edit
  const handleEditArticle = (articleId) => {
    console.log("Edit article:", articleId)
    // Navigate to edit page
    navigate(`/journalist/edit-article/${articleId}`)
    handleCloseActionMenu()
  }

  // Handle article view
  const handleViewArticle = (articleId, slug) => {
    console.log("View article:", articleId)
    // Navigate to view page
    navigate(`/news/${articleId}/${slug}`)
    handleCloseActionMenu()
  }

  // Handle article delete
  const handleDeleteClick = (article) => {
    setArticleToDelete(article)
    setDeleteDialogOpen(true)
    handleCloseActionMenu()
  }

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return

    setLoading(true)
    try {
      await articlesApi.delete(articleToDelete.articleID)

      // Remove the article from the state
      setArticles(articles.filter((article) => article.articleID !== articleToDelete.articleID))

      // Refresh the list if we deleted the last item on the page
      if (articles.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchArticles()
      }
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to delete article:", errorDetails)
      setError("Failed to delete article. Please try again.")
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setArticleToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setArticleToDelete(null)
  }

  // Handle article publish
  const handlePublishArticle = async (articleId) => {
    setLoading(true)
    try {
      await articlesApi.publish(articleId)
      // Refresh the articles list after publishing
      fetchArticles()
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to publish article:", errorDetails)
      setError("Failed to publish article. Please try again.")
    } finally {
      setLoading(false)
    }
    handleCloseActionMenu()
  }

  // Handle create new article
  const handleCreateArticle = () => {
    console.log("Create new article")
    // Navigate to create page
    navigate("/journalist/create-article")
  }

  // Handle action menu
  const handleOpenActionMenu = (event, article) => {
    setActionMenuAnchor(event.currentTarget)
    setSelectedArticle(article)
  }

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null)
    setSelectedArticle(null)
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "—"
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <Box sx={{ display: "flex", width: "100%", maxWidth: 1200, mx: "auto" }}>
      {/* Left sidebar with tabs */}
      <Paper sx={{ width: 240, flexShrink: 0, mr: 3, borderRadius: 2 }}>
        <List component="nav" aria-label="dashboard navigation">
          <ListItem disablePadding>
            <ListItemButton selected={activeTab === "all"} onClick={() => handleTabChange("all")} sx={{ py: 2 }}>
              <ListItemIcon>
                <Article />
              </ListItemIcon>
              <ListItemText primary="All Articles" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              selected={activeTab === "published"}
              onClick={() => handleTabChange("published")}
              sx={{ py: 2 }}
            >
              <ListItemIcon>
                <Publish />
              </ListItemIcon>
              <ListItemText primary="Published" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton selected={activeTab === "drafts"} onClick={() => handleTabChange("drafts")} sx={{ py: 2 }}>
              <ListItemIcon>
                <Drafts />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>

      {/* Right content area */}
      <Card sx={{ flexGrow: 1, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              {activeTab === "all"
                ? "All Articles"
                : activeTab === "published"
                  ? "Published Articles"
                  : "Draft Articles"}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateArticle}
              sx={{ bgcolor: "#6145DD" }}
            >
              New Article
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Search and filter bar */}
          <Box sx={{ display: "flex", mb: 3 }}>
            <TextField
              placeholder="Search articles..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2 }}
            />
            <Button variant="outlined" startIcon={<FilterList />}>
              Filter
            </Button>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Articles table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredArticles.length === 0 ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No articles found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchTerm
                  ? "Try adjusting your search terms"
                  : activeTab === "drafts"
                    ? "You don't have any draft articles"
                    : activeTab === "published"
                      ? "You don't have any published articles"
                      : "You don't have any articles yet"}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table sx={{ minWidth: 650 }} aria-label="articles table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow key={article.articleID} hover>
                        <TableCell component="th" scope="row">
                          {article.title}
                        </TableCell>
                        <TableCell>{article.categoryName}</TableCell>
                        <TableCell>
                          <Chip
                            label={article.status === 1 ? "Published" : "Draft"}
                            color={article.status === 1 ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {article.status === 1 ? formatDate(article.publishedAt) : formatDate(article.updatedAt)}
                        </TableCell>
                        <TableCell>{article.status === 1 ? article.totalViews : "—"}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="article actions"
                            onClick={(event) => handleOpenActionMenu(event, article)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => selectedArticle && handleViewArticle(selectedArticle.articleID, selectedArticle.slug)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          View
        </MenuItem>
        <MenuItem onClick={() => selectedArticle && handleEditArticle(selectedArticle.articleID)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        {selectedArticle && selectedArticle.status === 0 && (
          <MenuItem onClick={() => handlePublishArticle(selectedArticle.articleID)}>
            <ListItemIcon>
              <Publish fontSize="small" />
            </ListItemIcon>
            Publish
          </MenuItem>
        )}
        <MenuItem onClick={() => selectedArticle && handleDeleteClick(selectedArticle)}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the article "{articleToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
