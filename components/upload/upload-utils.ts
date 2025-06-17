import type { FileValidation, QualityCheckResult } from "./upload-types"

const ACCEPTED_TYPES = {
  "application/pdf": ["pdf"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/tiff": ["tiff", "tif"],
}

export function validateFile(file: File): FileValidation {
  // Check file size (16MB limit)
  const maxSize = 16 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds 16MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
    }
  }

  // Check file type
  const isValidType = Object.keys(ACCEPTED_TYPES).includes(file.type)
  if (!isValidType) {
    return {
      isValid: false,
      error: `Unsupported file type: ${file.type}`,
    }
  }

  // Check file extension
  const extension = file.name.split(".").pop()?.toLowerCase()
  const validExtensions = ACCEPTED_TYPES[file.type as keyof typeof ACCEPTED_TYPES]
  if (!extension || !validExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File extension doesn't match type: .${extension}`,
    }
  }

  return { isValid: true }
}

export async function checkImageQuality(file: File): Promise<QualityCheckResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"))
      return
    }

    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      if (!ctx) {
        reject(new Error("Canvas context not available"))
        return
      }

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Calculate contrast
        const contrast = calculateContrast(imageData)

        // Calculate resolution (DPI estimation)
        const resolution = estimateResolution(img.width, img.height, file.size)

        // Calculate sharpness
        const sharpness = calculateSharpness(imageData)

        // Generate suggestions
        const suggestions = generateSuggestions(contrast, resolution, sharpness)

        // Determine overall quality
        const overall = determineOverallQuality(contrast, resolution, sharpness)

        resolve({
          contrast,
          resolution,
          sharpness,
          suggestions,
          overall,
        })
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = URL.createObjectURL(file)
  })
}

function calculateContrast(imageData: ImageData): number {
  const data = imageData.data
  let sum = 0
  let sumSquared = 0
  const pixelCount = data.length / 4

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    sum += gray
    sumSquared += gray * gray
  }

  const mean = sum / pixelCount
  const variance = sumSquared / pixelCount - mean * mean
  const standardDeviation = Math.sqrt(variance)

  // Normalize contrast to 0-1 scale
  return Math.min(standardDeviation / 128, 1)
}

function estimateResolution(width: number, height: number, fileSize: number): number {
  // Rough estimation based on image dimensions and file size
  const pixelCount = width * height
  const bytesPerPixel = fileSize / pixelCount

  // Higher bytes per pixel usually indicates higher quality/resolution
  // This is a simplified estimation
  if (bytesPerPixel > 3) return 300
  if (bytesPerPixel > 2) return 200
  if (bytesPerPixel > 1) return 150
  return 100
}

function calculateSharpness(imageData: ImageData): number {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  let sharpness = 0
  let count = 0

  // Sobel edge detection for sharpness estimation
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4

      // Get surrounding pixels
      const tl = data[((y - 1) * width + (x - 1)) * 4]
      const tm = data[((y - 1) * width + x) * 4]
      const tr = data[((y - 1) * width + (x + 1)) * 4]
      const ml = data[(y * width + (x - 1)) * 4]
      const mr = data[(y * width + (x + 1)) * 4]
      const bl = data[((y + 1) * width + (x - 1)) * 4]
      const bm = data[((y + 1) * width + x) * 4]
      const br = data[((y + 1) * width + (x + 1)) * 4]

      // Sobel operators
      const gx = tr + 2 * mr + br - (tl + 2 * ml + bl)
      const gy = bl + 2 * bm + br - (tl + 2 * tm + tr)

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      sharpness += magnitude
      count++
    }
  }

  // Normalize to 0-1 scale
  return Math.min(sharpness / count / 255, 1)
}

function generateSuggestions(contrast: number, resolution: number, sharpness: number): string[] {
  const suggestions: string[] = []

  if (contrast < 0.3) {
    suggestions.push("Increase lighting or adjust contrast for better text recognition")
  }

  if (resolution < 150) {
    suggestions.push("Use higher resolution or move closer to the document")
  }

  if (sharpness < 0.3) {
    suggestions.push("Ensure the camera is focused and the document is flat")
  }

  if (suggestions.length === 0) {
    suggestions.push("Image quality looks good for processing")
  }

  return suggestions
}

function determineOverallQuality(
  contrast: number,
  resolution: number,
  sharpness: number,
): "excellent" | "good" | "fair" | "poor" {
  const score = (contrast + resolution / 300 + sharpness) / 3

  if (score >= 0.8) return "excellent"
  if (score >= 0.6) return "good"
  if (score >= 0.4) return "fair"
  return "poor"
}
