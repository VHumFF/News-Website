"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Container,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  Skeleton,
  Alert,
  Snackbar,
  Paper,
  TextField,
  List,
  ListItem,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import {
  Favorite,
  FavoriteBorder,
  Visibility,
  CalendarToday,
  Person,
  Category as CategoryIcon,
  ArrowBack,
  Share,
  Send,
  ThumbUp,
  ThumbUpOutlined,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  Close,
} from "@mui/icons-material"
import { format, parseISO, formatDistanceToNow } from "date-fns"
import { articlesApi, commentsApi, likesApi, handleApiError } from "@/apiRoutes"
import "react-quill/dist/quill.snow.css"

// Update the decodeToken function to properly extract the user ID
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

// Update the Comment component to correctly compare user IDs
const Comment = ({ comment, isReply, currentUserId, onReply, onDelete, onLike, replies = [] }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)

  // Format date as relative time
  const formatCommentDate = (dateString) => {
    try {
      const date = parseISO(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  // Check if comment belongs to current user - convert both to strings for comparison
  const isOwnComment = currentUserId && String(comment.userID) === String(currentUserId)

  return (
    <Box sx={{ mb: isReply ? 1 : 3 }}>
      <Card
        elevation={0}
        sx={{
          bgcolor: isReply ? "#f5f5f5" : "white",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Comment header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 1,
                bgcolor: "#6145DD",
                fontSize: "0.875rem",
              }}
            >
              {comment.authorName.charAt(0)}
            </Avatar>
            <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: "bold" }}>
              {comment.authorName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {formatCommentDate(comment.createdAt)}
            </Typography>
          </Box>

          {/* Comment content */}
          <Typography variant="body2" color="text.primary" sx={{ ml: 5, mb: 1 }}>
            {comment.content}
          </Typography>

          {/* Comment actions */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 5 }}>
            <IconButton
              size="small"
              onClick={() => onLike(comment.commentID)}
              color={comment.isLiked ? "primary" : "default"}
            >
              {comment.isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
            </IconButton>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
              {comment.likeCount}
            </Typography>

            <Button
              size="small"
              startIcon={<ReplyIcon fontSize="small" />}
              onClick={() => setShowReplyForm(!showReplyForm)}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Reply
            </Button>

            {isOwnComment && (
              <Button
                size="small"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={() => onDelete(comment.commentID)}
                sx={{ color: "error.main", textTransform: "none", ml: 1 }}
              >
                Delete
              </Button>
            )}
          </Box>

          {/* Reply form */}
          {showReplyForm && (
            <Box sx={{ mt: 2, ml: 5 }}>
              <CommentForm
                onSubmit={(content) => {
                  onReply(comment.commentID, content)
                  setShowReplyForm(false)
                }}
                placeholder={`Reply to ${comment.authorName}...`}
                buttonText="Reply"
                autoFocus
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Replies */}
      {replies.length > 0 && (
        <Box sx={{ ml: 5, mt: 1 }}>
          {replies.map((reply) => (
            <Comment
              key={reply.commentID}
              comment={reply}
              isReply={true}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

// Comment form component
const CommentForm = ({ onSubmit, placeholder = "Write a comment...", buttonText = "Comment", autoFocus = false }) => {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef(null)

  const MAX_LENGTH = 200

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Comment cannot be empty")
      return
    }

    if (content.length > MAX_LENGTH) {
      setError(`Comment cannot be longer than ${MAX_LENGTH} characters`)
      return
    }

    setIsSubmitting(true)
    await onSubmit(content.trim())
    setIsSubmitting(false)
    setContent("")
    setError("")
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        multiline
        minRows={2}
        maxRows={4}
        placeholder={placeholder}
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          if (error) setError("")
        }}
        error={!!error}
        helperText={error || `${content.length}/${MAX_LENGTH}`}
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <IconButton
              type="submit"
              disabled={!content.trim() || content.length > MAX_LENGTH || isSubmitting}
              sx={{ alignSelf: "flex-end" }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : <Send />}
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  )
}

// Comments section component
const CommentsSection = ({ articleId, user, onShowLoginPrompt }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch comments
  useEffect(() => {
    if (!articleId) return

    const fetchComments = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await commentsApi.getByArticle(articleId)
        setComments(response.data || [])
      } catch (error) {
        const errorDetails = handleApiError(error)
        console.error("Failed to fetch comments:", errorDetails)
        setError("Unable to load comments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [articleId, refreshTrigger])

  // Refresh comments
  const refreshComments = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Handle post comment
  const handlePostComment = async (content) => {
    if (!user) {
      onShowLoginPrompt("Please log in to post comments")
      return
    }

    try {
      const commentData = {
        articleID: Number(articleId),
        parentCommentID: null,
        content,
      }

      await commentsApi.create(commentData)
      refreshComments()
      return true
    } catch (error) {
      console.error("Failed to post comment:", error)
      onShowLoginPrompt("Failed to post comment")
      return false
    }
  }

  // Handle reply to comment
  const handleReplyComment = async (commentId, content) => {
    if (!user) {
      onShowLoginPrompt("Please log in to reply to comments")
      return
    }

    try {
      // Find the comment to determine the correct parent ID
      const commentToReply = comments.find((c) => c.commentID === commentId)
      // If the comment already has a parent, use that parent's ID instead
      const actualParentId = commentToReply.parentCommentID !== null ? commentToReply.parentCommentID : commentId

      const replyData = {
        articleID: Number(articleId),
        parentCommentID: actualParentId,
        content,
      }

      await commentsApi.create(replyData)
      refreshComments()
      return true
    } catch (error) {
      console.error("Failed to post reply:", error)
      onShowLoginPrompt("Failed to post reply")
      return false
    }
  }

  // Handle like/unlike comment
  const handleLikeComment = async (commentId) => {
    if (!user) {
      onShowLoginPrompt("Please log in to like comments")
      return
    }

    try {
      // Find the comment to determine its current like status
      const comment = comments.find((c) => c.commentID === commentId)

      if (!comment) return

      // Use the appropriate API endpoint based on current like status
      if (comment.isLiked) {
        await likesApi.unlikeComment(commentId)
      } else {
        await likesApi.likeComment(commentId)
      }

      // Update the comments state
      setComments(
        comments.map((comment) => {
          if (comment.commentID === commentId) {
            return {
              ...comment,
              likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
              isLiked: !comment.isLiked,
            }
          }
          return comment
        }),
      )
    } catch (error) {
      console.error("Failed to toggle comment like:", error)
      onShowLoginPrompt("Failed to update comment like status")
    }
  }

  // Handle delete comment dialog
  const handleDeleteCommentClick = (commentId) => {
    setCommentToDelete(commentId)
    setDeleteDialogOpen(true)
  }

  // Handle delete comment confirmation
  const handleDeleteCommentConfirm = async () => {
    if (!commentToDelete) return

    try {
      await commentsApi.delete(commentToDelete)
      refreshComments()
      onShowLoginPrompt("Comment deleted successfully")
    } catch (error) {
      console.error("Failed to delete comment:", error)
      onShowLoginPrompt("Failed to delete comment")
    } finally {
      setDeleteDialogOpen(false)
      setCommentToDelete(null)
    }
  }

  // Handle delete comment cancel
  const handleDeleteCommentCancel = () => {
    setDeleteDialogOpen(false)
    setCommentToDelete(null)
  }

  // Organize comments into a hierarchical structure
  const organizeComments = () => {
    const parentComments = []
    const childComments = {}

    // First, separate parent and child comments
    comments.forEach((comment) => {
      if (comment.parentCommentID === null) {
        parentComments.push(comment)
      } else {
        if (!childComments[comment.parentCommentID]) {
          childComments[comment.parentCommentID] = []
        }
        childComments[comment.parentCommentID].push(comment)
      }
    })

    // Sort parent comments by creation date (newest first)
    parentComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Sort child comments by creation date (oldest first)
    Object.keys(childComments).forEach((parentId) => {
      childComments[parentId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    })

    return { parentComments, childComments }
  }

  const { parentComments, childComments } = organizeComments()

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "text.primary" }}>
        Comments ({comments.length})
      </Typography>

      {/* Comment form */}
      <Box sx={{ mb: 4 }}>
        {user ? (
          <CommentForm onSubmit={handlePostComment} />
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please <Button onClick={() => onShowLoginPrompt("Please log in to post comments", true)}>log in</Button> to
            post a comment.
          </Alert>
        )}
      </Box>

      {/* Comments list */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : parentComments.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: "100%", p: 0 }}>
          {parentComments.map((comment) => (
            <ListItem key={comment.commentID} sx={{ display: "block", p: 0, mb: 3 }}>
              <Comment
                comment={comment}
                currentUserId={user?.id}
                onReply={handleReplyComment}
                onDelete={handleDeleteCommentClick}
                onLike={handleLikeComment}
                replies={childComments[comment.commentID] || []}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Delete comment confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCommentCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCommentCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCommentConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default function ArticleDetailPage() {
  const { articleId, slug } = useParams()
  const navigate = useNavigate()

  // State
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [user, setUser] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [redirectToLogin, setRedirectToLogin] = useState(false)

  // Update the useEffect that gets user info to correctly extract the user ID
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      const decodedToken = decodeToken(token)
      if (decodedToken) {
        setUser({
          username: decodedToken.username || "User",
          role: Number.parseInt(decodedToken.role || "0", 10),
          id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        })
      }
    }
  }, [])

  // Fetch article data
  useEffect(() => {
    if (!articleId) return

    const fetchArticle = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await articlesApi.getById(articleId)
        setArticle(response.data)
        setLiked(response.data.isLiked)
      } catch (error) {
        const errorDetails = handleApiError(error)
        console.error("Failed to fetch article:", errorDetails)
        setError("Unable to load article. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

  // Handle like/unlike article
  const handleLikeToggle = async () => {
    if (!user) {
      // Prompt user to login
      setSnackbarMessage("Please log in to like articles")
      setSnackbarOpen(true)
      return
    }

    try {
      // Use the appropriate API endpoint based on current like status
      if (liked) {
        await articlesApi.unlike(articleId)
      } else {
        await articlesApi.like(articleId)
      }

      // Toggle the state
      setLiked(!liked)
      setArticle((prev) => ({
        ...prev,
        likeCount: liked ? prev.likeCount - 1 : prev.likeCount + 1,
        isLiked: !liked,
      }))

      setSnackbarMessage(liked ? "Article unliked" : "Article liked")
      setSnackbarOpen(true)
    } catch (error) {
      console.error("Failed to toggle like:", error)
      setSnackbarMessage("Failed to update like status")
      setSnackbarOpen(true)
    }
  }

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: article?.description,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      setSnackbarMessage("Link copied to clipboard")
      setSnackbarOpen(true)
    }
  }

  // Handle back
  const handleBack = () => {
    navigate(-1)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      return format(parseISO(dateString), "MMMM d, yyyy • h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Show login prompt
  const handleShowLoginPrompt = (message, redirect = false) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
    setRedirectToLogin(redirect)
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
    if (redirectToLogin) {
      navigate("/login")
      setRedirectToLogin(false)
    }
  }

  // Render loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={120} />
        </Box>

        <Skeleton variant="text" height={60} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} width="60%" sx={{ mb: 3 }} />

        <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 2 }} />

        <Box sx={{ mb: 4 }}>
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              height={24}
              sx={{ mb: 1, width: i % 3 === 0 ? "100%" : i % 3 === 1 ? "90%" : "95%" }}
            />
          ))}
        </Box>
      </Container>
    )
  }

  // Render error
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack}>
          Go Back
        </Button>
      </Container>
    )
  }

  // Render article
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {article && (
        <>
          {/* Back button */}
          <Button variant="text" startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3, color: "text.secondary" }}>
            Back
          </Button>

          {/* Category chip */}
          <Chip
            icon={<CategoryIcon />}
            label={article.categoryName}
            color="primary"
            size="small"
            sx={{ mb: 2, bgcolor: "#6145DD" }}
          />

          {/* Article title */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", lineHeight: 1.2, color: "text.primary" }}
          >
            {article.title}
          </Typography>

          {/* Article metadata */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4, color: "text.secondary" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                {article.authorFirstName} {article.authorLastName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{formatDate(article.publishedAt)}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Visibility sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{article.totalViews} views</Typography>
            </Box>
          </Box>

          {/* Featured image */}
          <Box
            component="img"
            src={article.imageURL || "/placeholder.svg?height=600&width=1200&query=news article"}
            alt={article.title}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "600px",
              objectFit: "cover",
              borderRadius: 2,
              mb: 4,
            }}
          />

          {/* Article content */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 4,
              borderRadius: 2,
              bgcolor: "#f9f9f9",
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 1,
                my: 2,
              },
              "& p": {
                mb: 2,
              },
              "& ul, & ol": {
                pl: 4,
                mb: 2,
              },
            }}
          >
            <div className="ql-container ql-snow" style={{ border: "none" }}>
              <div
                className="ql-editor quill-preview"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{ padding: 0 }}
              />
            </div>
          </Paper>

          {/* Action bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={handleLikeToggle}
                color={liked ? "error" : "default"}
                aria-label={liked ? "Unlike article" : "Like article"}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1, color: "text.primary" }}>
                {article.likeCount} {article.likeCount === 1 ? "like" : "likes"}
              </Typography>
            </Box>

            <Button startIcon={<Share />} onClick={handleShare} variant="outlined" sx={{ color: "text.primary" }}>
              Share
            </Button>
          </Box>

          {/* Author info */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mt: 4,
              mb: 5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#6145DD",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {article.authorFirstName.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {article.authorFirstName} {article.authorLastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Journalist
              </Typography>
            </Box>
          </Paper>

          {/* Comments section */}
          <CommentsSection articleId={articleId} user={user} onShowLoginPrompt={handleShowLoginPrompt} />
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  )
}
