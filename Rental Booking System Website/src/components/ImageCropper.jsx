import { useState, useRef, useEffect } from "react"
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import "react-image-crop/dist/ReactCrop.css"

// Function to center and create an initial crop with 21:9 aspect ratio
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

export default function ImageCropper({ open, image, onComplete, onCancel }) {
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const aspect = 21 / 9 // 21:9 aspect ratio

  // When the image loads, set up the initial crop
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  // Update the preview canvas whenever the crop changes
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const crop = completedCrop

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext("2d")

    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = "high"

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
  }, [completedCrop])

  // Handle crop completion
  const handleComplete = () => {
    if (!completedCrop || !previewCanvasRef.current) {
      return
    }

    // Convert canvas to blob and pass it to the parent component
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty")
        return
      }
      onComplete(blob)
    }, "image/jpeg")
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onCancel}>
      <DialogTitle>Crop Image (21:9)</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Drag to reposition. Resize using the corners.
          </Typography>
          
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minWidth={100}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={image || "/placeholder.svg"}
              style={{ maxHeight: "70vh", maxWidth: "100%" }}
              onLoad={onImageLoad}
              crossOrigin="anonymous"
            />
          </ReactCrop>

          {/* Hidden preview canvas */}
          <div style={{ display: "none" }}>
            <canvas
              ref={previewCanvasRef}
              style={{
                width: completedCrop?.width ?? 0,
                height: completedCrop?.height ?? 0
              }}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleComplete} 
          variant="contained" 
          color="primary"
          disabled={!completedCrop?.width || !completedCrop?.height}
        >
          Apply Crop
        </Button>
      </DialogActions>
    </Dialog>
  )
}
