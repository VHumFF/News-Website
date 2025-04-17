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
import { articlesApi } from "@/api/articles"
import { categoriesApi } from "@/api/categories"
import { fileApi } from "@/api/files"
import { handleApiError } from "@/api"
import ImageCropper from "@/components/ImageCropper"

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

// Custom Blot for image upload placeholder
const createImageUploadPlaceholder = () => {
  const BlockEmbed = ReactQuill.Quill.import("blots/block/embed")

  class ImageUploadPlaceholder extends BlockEmbed {
    static create(value) {
      const node = super.create()
      node.setAttribute("id", value.id)
      node.setAttribute("contenteditable", false)

      // Create placeholder container
      const placeholderContainer = document.createElement("div")
      placeholderContainer.className = "image-upload-placeholder"
      placeholderContainer.style.width = "100%"
      placeholderContainer.style.height = "200px"
      placeholderContainer.style.backgroundColor = "#f0f0f0"
      placeholderContainer.style.border = "2px dashed #ccc"
      placeholderContainer.style.borderRadius = "4px"
      placeholderContainer.style.display = "flex"
      placeholderContainer.style.flexDirection = "column"
      placeholderContainer.style.alignItems = "center"
      placeholderContainer.style.justifyContent = "center"
      placeholderContainer.style.padding = "20px"
      placeholderContainer.style.boxSizing = "border-box"
      placeholderContainer.style.margin = "10px 0"

      // Add image icon
      const iconContainer = document.createElement("div")
      iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
      iconContainer.style.marginBottom = "10px"
      iconContainer.style.color = "#888"

      // Add status text
      const statusText = document.createElement("div")
      statusText.textContent = "Uploading image..."
      statusText.style.marginBottom = "10px"
      statusText.style.fontWeight = "bold"
      statusText.style.color = "#555"

      // Add progress bar container
      const progressContainer = document.createElement("div")
      progressContainer.style.width = "80%"
      progressContainer.style.height = "8px"
      progressContainer.style.backgroundColor = "#e0e0e0"
      progressContainer.style.borderRadius = "4px"
      progressContainer.style.overflow = "hidden"

      // Add progress bar
      const progressBar = document.createElement("div")
      progressBar.className = "progress-bar"
      progressBar.style.width = "0%"
      progressBar.style.height = "100%"
      progressBar.style.backgroundColor = "#6145DD"
      progressBar.style.transition = "width 0.3s ease"

      progressContainer.appendChild(progressBar)

      // Assemble the placeholder
      placeholderContainer.appendChild(iconContainer)
      placeholderContainer.appendChild(statusText)
      placeholderContainer.appendChild(progressContainer)

      node.appendChild(placeholderContainer)
      return node
    }

    static value(node) {
      return { id: node.getAttribute("id") }
    }
  }

  ImageUploadPlaceholder.blotName = "imageUploadPlaceholder"
  ImageUploadPlaceholder.tagName = "div"
  ImageUploadPlaceholder.className = "image-upload-placeholder-container"

  ReactQuill.Quill.register(ImageUploadPlaceholder)
  return ImageUploadPlaceholder
}

export default function ArticleEditorPage() {
  const navigate = useNavigate()
  const { articleId } = useParams()
  const isEditMode = !!articleId
  const fileInputRef = useRef(null)
  const quillRef = useRef(null)
  const ImageUploadPlaceholder = useRef(null)

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

  // Cropper state
  const [showCropper, setShowCropper] = useState(false)
  const [cropperImage, setCropperImage] = useState("")
  const [originalFile, setOriginalFile] = useState(null)

  // UI state
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [viewMode, setViewMode] = useState("edit") // 'edit' or 'preview'
  // Add a new state variable to track if the article is published
  const [isPublished, setIsPublished] = useState(false)

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    imageUrl: "",
  })

  // Register custom blot when component mounts
  useEffect(() => {
    ImageUploadPlaceholder.current = createImageUploadPlaceholder()
  }, [])

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  }

  const formats = [
    "header",
    "bold",
    "size",
    "italic",
    "underline",
    "color",
    "background",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "imageUploadPlaceholder",
    "align",
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

  // Update the fetchArticle function to set the isPublished state
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
      // Set published status (status 1 means published)
      setIsPublished(article.status === 1)
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
      title: "",
      description: "",
      content: content.trim() ? "" : "Content is required",
      categoryId: categoryId ? "" : "Category is required",
      imageUrl: imageUrl || imageFile ? "" : "Thumbnail image is required",
    }

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length > 150) {
      newErrors.title = `Title is too long (${title.length}/150 characters)`
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required"
    } else if (description.length > 250) {
      newErrors.description = `Description is too long (${description.length}/250 characters)`
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Helper function to upload image to S3 using presigned URL
  const uploadToS3 = async (file, presignedUrl, onProgress) => {
    try {
      // Use XMLHttpRequest for better control over binary uploads
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", presignedUrl, true)
        xhr.setRequestHeader("Content-Type", file.type)

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`))
          }
        }

        xhr.onerror = () => {
          reject(new Error("XHR error occurred during upload"))
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100
            console.log(`Upload progress: ${percentComplete.toFixed(2)}%`)
            if (onProgress) {
              onProgress(percentComplete)
            }
          }
        }

        // Send the file as binary data
        xhr.send(file)
      })
    } catch (error) {
      console.error("Error in uploadToS3:", error)
      throw error
    }
  }

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) return null

    try {
      // Get file extension from the file name
      const fileExtension = imageFile.name.split(".").pop().toLowerCase()

      // Request presigned URL with the file extension
      const presignedUrlResponse = await fileApi.getPresignedUrl(fileExtension)
      const { url: presignedUrl, fileName } = presignedUrlResponse.data

      // Upload to S3 using the presigned URL
      await uploadToS3(imageFile, presignedUrl)

      // Construct the final S3 URL using the base URL (everything before the query string)
      const baseUrl = presignedUrl.split("?")[0]

      return baseUrl
    } catch (error) {
      const errorDetails = handleApiError(error)
      console.error("Failed to upload image:", errorDetails)
      throw new Error("Failed to upload image. Please try again.")
    }
  }

  // Handle image selection - Modified to show cropper
  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setOriginalFile(file)

    // Create a URL for the cropper
    const imageUrl = URL.createObjectURL(file)
    setCropperImage(imageUrl)
    setShowCropper(true)
  }

  // Handle cropped image
  const handleCroppedImage = (blob) => {
    // Create a new file from the blob
    const croppedFile = new File([blob], originalFile.name, {
      type: originalFile.type,
      lastModified: new Date().getTime(),
    })

    setImageFile(croppedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(blob)

    // Close cropper
    setShowCropper(false)

    // Clean up the object URL
    URL.revokeObjectURL(cropperImage)
  }

  // Handle crop cancellation
  const handleCropCancel = () => {
    setShowCropper(false)
    URL.revokeObjectURL(cropperImage)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
        status: 0, // 0 for draft
      }

      if (isEditMode) {
        // Use the articlesApi.update function
        await articlesApi.update(articleId, {
          title,
          description,
          content,
          categoryID: Number(categoryId),
        })
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
        status: 1, // 1 for published
      }

      if (isEditMode) {
        // Use the articlesApi.publish function
        await articlesApi.publish(articleId)
        setSuccess("Article published successfully!")
      } else {
        await articlesApi.create(articleData)
        setSuccess("Article published successfully!")
      }

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

  // Update progress bar in placeholder
  const updatePlaceholderProgress = (placeholderId, progress) => {
    const placeholder = document.getElementById(placeholderId)
    if (placeholder) {
      const progressBar = placeholder.querySelector(".progress-bar")
      if (progressBar) {
        progressBar.style.width = `${progress}%`
      }

      // Update status text if needed
      if (progress >= 100) {
        const statusText = placeholder.querySelector("div:nth-child(2)")
        if (statusText) {
          statusText.textContent = "Processing image..."
        }
      }
    }
  }

  // Update placeholder to show loading state
  const updatePlaceholderToLoading = (placeholderId) => {
    const placeholder = document.getElementById(placeholderId)
    if (placeholder) {
      const statusText = placeholder.querySelector("div:nth-child(2)")
      if (statusText) {
        statusText.textContent = "Loading image..."
      }

      // Update progress bar to show indeterminate state
      const progressBar = placeholder.querySelector(".progress-bar")
      if (progressBar) {
        progressBar.style.width = "100%"
        progressBar.style.opacity = "0.7"
        progressBar.style.animation = "pulse 1.5s infinite"
      }

      // Add pulse animation style if not already present
      if (!document.getElementById("pulse-animation")) {
        const style = document.createElement("style")
        style.id = "pulse-animation"
        style.textContent = `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }
      `
        document.head.appendChild(style)
      }
    }
  }

  // Update placeholder to show error
  const showPlaceholderError = (placeholderId, errorMessage) => {
    const placeholder = document.getElementById(placeholderId)
    if (placeholder) {
      const container = placeholder.querySelector(".image-upload-placeholder")
      if (container) {
        // Change border color to red
        container.style.borderColor = "#f44336"
        container.style.backgroundColor = "#ffebee"

        // Update icon to error icon
        const iconContainer = placeholder.querySelector("div:first-child")
        if (iconContainer) {
          iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
          iconContainer.style.color = "#f44336"
        }

        // Update status text
        const statusText = placeholder.querySelector("div:nth-child(2)")
        if (statusText) {
          statusText.textContent = errorMessage || "Upload failed"
          statusText.style.color = "#f44336"
        }

        // Hide progress bar
        const progressContainer = placeholder.querySelector("div:nth-child(3)")
        if (progressContainer) {
          progressContainer.style.display = "none"
        }
      }
    }
  }

  // Preload image and replace placeholder when fully loaded
  const preloadAndReplaceImage = (quill, placeholderId, imageUrl) => {
    // Update placeholder to loading state
    updatePlaceholderToLoading(placeholderId)

    // Create a new image object to preload the image
    const img = new Image()

    // Set up event handlers
    img.onload = () => {
      // Image is fully loaded, now replace the placeholder
      replacePlaceholderWithImage(quill, placeholderId, imageUrl)
    }

    img.onerror = () => {
      // Show error in placeholder if image fails to load
      showPlaceholderError(placeholderId, "Failed to load image")
    }

    // Start loading the image
    img.src = imageUrl
  }

  // Helper function to replace a placeholder with an image
  const replacePlaceholderWithImage = (quill, placeholderId, imageUrl) => {
    // Find the placeholder element
    const placeholderElement = document.getElementById(placeholderId)
    if (!placeholderElement) return false

    // Get the current selection or default to the end
    const range = quill.getSelection() || { index: quill.getLength() - 1, length: 1 }

    // Insert the image at the current selection
    quill.insertEmbed(range.index, "image", imageUrl)

    // Remove the placeholder from the DOM
    placeholderElement.parentNode.removeChild(placeholderElement)

    // Set selection after the image
    quill.setSelection(range.index + 1)

    return true
  }

  // Add this function to handle image uploads in the editor
  const handleEditorImageUpload = () => {
    // This function will be called when the component mounts
    if (!quillRef.current || !ImageUploadPlaceholder.current) return

    const quill = quillRef.current.getEditor()

    // Override the image handler
    const toolbar = quill.getModule("toolbar")
    toolbar.addHandler("image", () => {
      const input = document.createElement("input")
      input.setAttribute("type", "file")
      input.setAttribute("accept", "image/*")
      input.click()

      input.onchange = async () => {
        const file = input.files[0]
        if (!file) return

        try {
          // Generate a unique ID for this upload
          const placeholderId = `image-upload-${Date.now()}`

          // Insert placeholder at current cursor position
          const range = quill.getSelection(true)
          quill.insertEmbed(range.index, "imageUploadPlaceholder", { id: placeholderId })
          quill.setSelection(range.index + 1)

          // Get file extension
          const fileExtension = file.name.split(".").pop().toLowerCase()

          // Request presigned URL
          const presignedUrlResponse = await fileApi.getPresignedUrl(fileExtension)
          const { url: presignedUrl, fileName } = presignedUrlResponse.data

          // Upload to S3 with progress tracking
          await uploadToS3(file, presignedUrl, (progress) => {
            updatePlaceholderProgress(placeholderId, progress)
          })

          // Get the final image URL (remove query parameters)
          const imageUrl = presignedUrl.split("?")[0]

          // Preload the image and replace placeholder when fully loaded
          preloadAndReplaceImage(quill, placeholderId, imageUrl)
        } catch (error) {
          console.error("Error uploading image:", error)

          // Show error in placeholder
          const placeholderId = document.querySelector(".image-upload-placeholder-container")?.id
          if (placeholderId) {
            showPlaceholderError(placeholderId, "Failed to upload image")
          }
        }
      }
    })
  }

  // Add this useEffect to initialize the editor image upload handler
  useEffect(() => {
    if (quillRef.current && ImageUploadPlaceholder.current) {
      handleEditorImageUpload()
    }
  }, [quillRef.current, ImageUploadPlaceholder.current])

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

      {/* Show loading state when editing and data is being fetched */}
      {isEditMode && loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 10 }}>
          <CircularProgress size={60} sx={{ mb: 4 }} />
          <Typography variant="h6" gutterBottom>
            Loading article data...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we fetch the article information.
          </Typography>
        </Box>
      ) : (
        <>
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
                helperText={errors.title || `${title.length}/150 characters`}
                disabled={loading}
                required
                inputProps={{ maxLength: 150 }}
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
                helperText={errors.description || `${description.length}/200 characters`}
                disabled={loading}
                required
                inputProps={{ maxLength: 250 }}
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
                Thumbnail Image* (21:9 ratio)
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
                      Upload a thumbnail image for your article (21:9 ratio)
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
                <Box sx={{ height: "700px", mb: 2 }}>
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your article content here..."
                    style={{ height: "650px" }}
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
                    height: "700px",
                    overflow: "auto",
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <div className="ql-container ql-snow">
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
              {saving ? <CircularProgress size={24} /> : "Save"}
            </Button>
            {/* Only show Publish button if article is not already published */}
            {!isPublished && (
              <Button
                variant="contained"
                startIcon={<Publish />}
                onClick={handlePublish}
                disabled={saving || publishing || loading}
                sx={{ bgcolor: "#6145DD" }}
              >
                {publishing ? <CircularProgress size={24} color="inherit" /> : "Publish"}
              </Button>
            )}
          </Box>
        </>
      )}

      {/* Image Cropper Dialog */}
      <ImageCropper
        open={showCropper}
        image={cropperImage}
        onComplete={handleCroppedImage}
        onCancel={handleCropCancel}
      />

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
