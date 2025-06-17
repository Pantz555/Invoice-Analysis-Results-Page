"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, FileText, ImageIcon, File, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  onCameraClick: () => void
  accepts: string[]
  dragHint: string
  maxFileSizeMB: number
  className?: string
}

export function Dropzone({
  onFilesSelected,
  onCameraClick,
  accepts,
  dragHint,
  maxFileSizeMB,
  className,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptString = useCallback(() => {
    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      tiff: "image/tiff",
      tif: "image/tiff",
    }
    return accepts
      .map((ext) => mimeTypes[ext.toLowerCase() as keyof typeof mimeTypes])
      .filter(Boolean)
      .join(",")
  }, [accepts])

  const validateFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const validFiles: File[] = []
      const errors: string[] = []

      fileArray.forEach((file) => {
        // Check file size
        if (file.size > maxFileSizeMB * 1024 * 1024) {
          errors.push(`${file.name} exceeds ${maxFileSizeMB}MB limit`)
          return
        }

        // Check file type
        const extension = file.name.split(".").pop()?.toLowerCase()
        if (!extension || !accepts.includes(extension)) {
          errors.push(`${file.name} is not a supported file type`)
          return
        }

        validFiles.push(file)
      })

      return { validFiles, errors }
    },
    [accepts, maxFileSizeMB],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
    setDragError(null)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = e.dataTransfer.files
      if (files.length === 0) return

      const { validFiles, errors } = validateFiles(files)

      if (errors.length > 0) {
        setDragError(errors[0])
        setTimeout(() => setDragError(null), 5000)
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    },
    [validateFiles, onFilesSelected],
  )

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      const { validFiles, errors } = validateFiles(files)

      if (errors.length > 0) {
        setDragError(errors[0])
        setTimeout(() => setDragError(null), 5000)
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles)
      }

      // Reset input
      e.target.value = ""
    },
    [validateFiles, onFilesSelected],
  )

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "jpg":
      case "jpeg":
      case "png":
      case "tiff":
      case "tif":
        return <ImageIcon className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <Card className={cn("shadow-card", className)}>
      <CardContent className="p-8">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-card p-12 text-center transition-all duration-200",
            isDragOver
              ? "border-accent bg-accent/5 scale-[1.02]"
              : "border-base-fg hover:border-accent/50 hover:bg-accent/5",
            dragError && "border-error bg-error/5",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Error State */}
          {dragError && (
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-error/10 border border-error/20 rounded-button p-3 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-error" />
                <span className="text-sm text-error">{dragError}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center space-y-6">
            {/* Upload Icon */}
            <div
              className={cn(
                "w-20 h-20 rounded-card flex items-center justify-center transition-colors",
                isDragOver ? "bg-accent text-white" : "bg-accent/10 text-accent",
              )}
            >
              <Upload className="h-10 w-10" />
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">{dragHint}</h3>
                <p className="text-muted-foreground">
                  Upload invoices for instant processing with AI-powered data extraction
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleFileSelect} className="bg-accent hover:bg-accent/90 text-white rounded-button">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <Button
                  onClick={onCameraClick}
                  variant="outline"
                  className="border-accent/20 text-accent hover:bg-accent/5 rounded-button"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>
            </div>

            {/* File Type Support */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Supported file types:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {accepts.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="bg-base-0 border-base-fg text-muted-foreground flex items-center space-x-1"
                  >
                    {getFileTypeIcon(type)}
                    <span className="uppercase">{type}</span>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Maximum file size: {maxFileSizeMB}MB per file</p>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={getAcceptString()}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  )
}
