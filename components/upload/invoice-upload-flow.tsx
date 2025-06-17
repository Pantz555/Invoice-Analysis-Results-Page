"use client"

import { useState, useCallback } from "react"
import { Dropzone } from "./dropzone"
import { ProgressModal } from "./progress-modal"
import { CameraModal } from "./camera-modal"
import { validateFile, checkImageQuality } from "./upload-utils"
import type { UploadFile, UploadProgress, QualityCheckResult } from "./upload-types"

interface InvoiceUploadFlowProps {
  onComplete?: (files: UploadFile[]) => void
  onError?: (error: string) => void
  className?: string
}

export function InvoiceUploadFlow({ onComplete, onError, className }: InvoiceUploadFlowProps) {
  const [currentStep, setCurrentStep] = useState<"dropzone" | "progress" | "camera">("dropzone")
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const validatedFiles: UploadFile[] = []
      const errors: string[] = []

      for (const file of files) {
        // Validate file
        const validation = validateFile(file)
        if (!validation.isValid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        // Check image quality for image files
        let qualityCheck: QualityCheckResult | undefined
        if (file.type.startsWith("image/")) {
          try {
            qualityCheck = await checkImageQuality(file)
          } catch (error) {
            console.warn("Quality check failed:", error)
          }
        }

        validatedFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "pending",
          qualityCheck,
          uploadProgress: 0,
        })
      }

      if (errors.length > 0) {
        onError?.(errors.join("\n"))
      }

      if (validatedFiles.length > 0) {
        setUploadFiles(validatedFiles)
        setCurrentStep("progress")
        startUpload(validatedFiles)
      }
    },
    [onError],
  )

  const startUpload = useCallback(
    async (files: UploadFile[]) => {
      setIsUploading(true)
      const progressArray: UploadProgress[] = files.map((file) => ({
        fileId: file.id,
        progress: 0,
        status: "uploading",
        stage: "uploading",
      }))
      setUploadProgress(progressArray)

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          await uploadSingleFile(file, (progress) => {
            setUploadProgress((prev) =>
              prev.map((p) =>
                p.fileId === file.id
                  ? { ...p, progress: progress.progress, stage: progress.stage, status: progress.status }
                  : p,
              ),
            )
          })
        }

        // All files uploaded successfully
        setIsUploading(false)
        setTimeout(() => {
          onComplete?.(files)
          resetFlow()
        }, 1500)
      } catch (error) {
        setIsUploading(false)
        onError?.(error instanceof Error ? error.message : "Upload failed")
      }
    },
    [onComplete, onError],
  )

  const uploadSingleFile = async (file: UploadFile, onProgress: (progress: UploadProgress) => void): Promise<void> => {
    const stages = [
      { stage: "uploading", duration: 2000 },
      { stage: "processing", duration: 3000 },
      { stage: "extracting", duration: 2500 },
      { stage: "validating", duration: 1500 },
    ]

    for (const { stage, duration } of stages) {
      onProgress({
        fileId: file.id,
        progress: 0,
        status: "uploading",
        stage: stage as any,
      })

      // Simulate progress within each stage
      const steps = 20
      const stepDuration = duration / steps

      for (let step = 0; step <= steps; step++) {
        await new Promise((resolve) => setTimeout(resolve, stepDuration))
        const stageProgress = (step / steps) * 100
        const overallProgress = stages.findIndex((s) => s.stage === stage) * 25 + stageProgress * 0.25

        onProgress({
          fileId: file.id,
          progress: Math.min(overallProgress, 100),
          status: step === steps && stage === "validating" ? "completed" : "uploading",
          stage: stage as any,
        })
      }
    }
  }

  const retryUpload = useCallback(
    (fileId: string) => {
      const file = uploadFiles.find((f) => f.id === fileId)
      if (file) {
        startUpload([file])
      }
    },
    [uploadFiles, startUpload],
  )

  const resetFlow = useCallback(() => {
    setCurrentStep("dropzone")
    setUploadFiles([])
    setUploadProgress([])
    setIsUploading(false)
  }, [])

  const handleCameraCapture = useCallback(
    (imageData: string) => {
      // Convert base64 to File
      fetch(imageData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `invoice-${Date.now()}.jpg`, { type: "image/jpeg" })
          handleFilesSelected([file])
        })
      setShowCameraModal(false)
    },
    [handleFilesSelected],
  )

  return (
    <div className={className}>
      {currentStep === "dropzone" && (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          onCameraClick={() => setShowCameraModal(true)}
          accepts={["pdf", "jpg", "png", "tiff"]}
          dragHint="Drag files or snap a photo"
          maxFileSizeMB={16}
        />
      )}

      {currentStep === "progress" && (
        <ProgressModal
          files={uploadFiles}
          progress={uploadProgress}
          isUploading={isUploading}
          onRetry={retryUpload}
          onClose={resetFlow}
          liveUpdates={true}
        />
      )}

      {showCameraModal && <CameraModal onCapture={handleCameraCapture} onClose={() => setShowCameraModal(false)} />}
    </div>
  )
}
