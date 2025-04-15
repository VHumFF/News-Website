"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  FormHelperText,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Save,
  Publish,
  ArrowBack,
  CloudUpload,
  Delete,
  Visibility,
  Edit,
  Image as ImageIcon,
} from "@mui/icons-material"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import DOMPurify from "dompurify"
import { articlesApi, categoriesApi, fileApi, handleApiError } from "@/apiRoutes"

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

export default function ArticleEditorPage() {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const isEditMode = !!articleId
  const fileInputRef = useRef(null)
  const quillRef = useRef(null)

  // User state
  const [user, setUser] = useState(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  // UI state
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [viewMode, setViewMode] = useState("edit") // 'edit' or 'preview'

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    imageUrl: "",
  })

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ]

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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch article data if in edit mode
  useEffect(() => {
    if (isEditMode && articleId) {
      fetchArticle(articleId)
    }
  }, [isEditMode, articleId])

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoriesApi.getAll()
      setCategories(response.data || [])
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch categories:", errorDetails)
      setError("Failed to load categories. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch article data
  const fetchArticle = async (id) => {
    try {
      setLoading(true)
      const response = await articlesApi.getById(id)
      const article = response.data

      setTitle(article.title || "")
      setDescription(article.description || "")
      setContent(article.content || "")
      setCategoryId(article.categoryID || "")
      setImageUrl(article.imageURL || "")
      setImagePreview(article.imageURL || "")
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to fetch article:", errorDetails)
      setError("Failed to load article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: title.trim() ? "" : "Title is required",
      description: description.trim() ? "" : "Description is required",
      content: content.trim() ? "" : "Content is required",
      categoryId: categoryId ? "" : "Category is required",
      imageUrl: imageUrl || imageFile ? "" : "Thumbnail image is required",
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) return null

    try {
      // Request presigned URL
      const fileInfo = {
        fileName: imageFile.name,
        contentType: imageFile.type,
      }
      const presignedUrlResponse = await fileApi.getPresignedUrl(fileInfo)
      const { presignedUrl, fileUrl } = presignedUrlResponse.data

      // Upload to S3
      await fetch(presignedUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      })

      return fileUrl
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to upload image:", errorDetails)
      throw new Error("Failed to upload image. Please try again.")
    }
  }

  // Handle image selection
  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle image removal
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
    setImageUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle content change
  const handleContentChange = (value) => {
    setContent(value)
    if (value && errors.content) {
      setErrors({ ...errors, content: "" })
    }
  }

  // Handle save as draft
  const handleSaveDraft = async () => {
    if (!validateForm()) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // Upload image if new image selected
      let finalImageUrl = imageUrl
      if (imageFile) {
        finalImageUrl = await handleImageUpload()
      }

      const articleData = {
        title,
        description,
        content,
        categoryID: Number(categoryId),
        imageURL: finalImageUrl,
      }

      if (isEditMode) {
        await articlesApi.update(articleId, articleData)
        setSuccess("Article updated successfully!")
      } else {
        const response = await articlesApi.create(articleData)
        setSuccess("Article saved as draft!")
        // Redirect to edit mode with new article ID
        navigate(`/journalist/edit-article/${response.data.articleID}`)
      }
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to save article:", errorDetails)
      setError(errorDetails.message || "Failed to save article. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Handle publish
  const handlePublish = async () => {
    if (!validateForm()) return

    setPublishing(true)
    setError(null)
    setSuccess(null)

    try {
      // Upload image if new image selected
      let finalImageUrl = imageUrl
      if (imageFile) {
        finalImageUrl = await handleImageUpload()
      }

      const articleData = {
        title,
        description,
        content,
        categoryID: Number(categoryId),
        imageURL: finalImageUrl,
      }

      if (isEditMode) {
        await articlesApi.update(articleId, articleData)
        await articlesApi.publish(articleId)
      } else {
        const response = await articlesApi.create(articleData)
        await articlesApi.publish(response.data.articleID)
      }

      setSuccess("Article published successfully!")
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/journalist-dashboard")
      }, 1500)
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to publish article:", errorDetails)
      setError(errorDetails.message || "Failed to publish article. Please try again.")
    } finally {
      setPublishing(false)
    }
  }

  // Handle back button
  const handleBack = () => {
    navigate("/journalist-dashboard")
  }

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue)
  }

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSuccess(null)
    setError(null)
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", pb: 10 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {isEditMode ? "Edit Article" : "Create New Article"}
        </Typography>
      </Box>

      {/* Main content - Vertical layout */}
      <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Article Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Title */}
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title}
            disabled={loading}
            required
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            disabled={loading}
            required
          />

          {/* Category */}
          <FormControl fullWidth margin="normal" error={!!errors.categoryId} required>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
              disabled={loading}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryID} value={category.categoryID}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
          </FormControl>

          {/* Thumbnail Image */}
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Thumbnail Image*
          </Typography>
          <Box
            sx={{
              border: "1px dashed",
              borderColor: errors.imageUrl ? "error.main" : "divider",
              borderRadius: 1,
              p: 2,
              mb: 2,
              textAlign: "center",
            }}
          >
            {imagePreview ? (
              <Box sx={{ position: "relative" }}>
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  }}
                  onClick={handleRemoveImage}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <ImageIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Upload a thumbnail image for your article
                </Typography>
                <Button variant="outlined" component="label" startIcon={<CloudUpload />} disabled={loading}>
                  Select Image
                  <input type="file" hidden accept="image/*" onChange={handleImageSelect} ref={fileInputRef} />
                </Button>
              </Box>
            )}
            {errors.imageUrl && (
              <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                {errors.imageUrl}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Content Editor Card */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Article Content
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Editor/Preview tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={viewMode} onChange={handleViewModeChange} aria-label="editor tabs">
              <Tab icon={<Edit />} iconPosition="start" label="Edit" value="edit" sx={{ textTransform: "none" }} />
              <Tab
                icon={<Visibility />}
                iconPosition="start"
                label="Preview"
                value="preview"
                sx={{ textTransform: "none" }}
              />
            </Tabs>
          </Box>

          {/* Editor */}
          {viewMode === "edit" ? (
            <Box sx={{ height: "500px", mb: 2 }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="Write your article content here..."
                style={{ height: "450px" }}
              />
              {errors.content && (
                <Typography color="error" variant="caption" sx={{ display: "block", mt: 1 }}>
                  {errors.content}
                </Typography>
              )}
            </Box>
          ) : (
            <Paper
              sx={{
                p: 0,
                height: "500px",
                overflow: "auto",
                bgcolor: "#f9f9f9",
              }}
            >
              <div className="ql-container ql-snow">
                {/* <Typography variant="h4" gutterBottom>
                    {title || "Article Title"}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {description || "Article description will appear here"}
                  </Typography> */}
                <div className="ql-editor quill-preview">
                  <Divider sx={{ my: 2 }} />
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
                </div>
              </div>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Fixed action buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          gap: 2,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Save />}
          onClick={handleSaveDraft}
          disabled={saving || publishing || loading}
        >
          {saving ? <CircularProgress size={24} /> : "Save Draft"}
        </Button>
        <Button
          variant="contained"
          startIcon={<Publish />}
          onClick={handlePublish}
          disabled={saving || publishing || loading}
          sx={{ bgcolor: "#6145DD" }}
        >
          {publishing ? <CircularProgress size={24} color="inherit" /> : "Publish"}
        </Button>
      </Box>

      {/* Success/Error Snackbar */}
      <Snackbar open={!!success || !!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
