export interface UploadFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: "pending" | "uploading" | "completed" | "failed"
  qualityCheck?: QualityCheckResult
  uploadProgress: number
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: "uploading" | "completed" | "failed"
  stage: "uploading" | "processing" | "extracting" | "validating"
  error?: string
}

export interface QualityCheckResult {
  contrast: number
  resolution: number
  sharpness: number
  suggestions: string[]
  overall: "excellent" | "good" | "fair" | "poor"
}

export interface FileValidation {
  isValid: boolean
  error?: string
}
