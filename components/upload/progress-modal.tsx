"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Upload,
  Zap,
  Search,
  Shield,
  X,
  FileText,
  ImageIcon,
  File,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { UploadFile, UploadProgress } from "./upload-types"

interface ProgressModalProps {
  files: UploadFile[]
  progress: UploadProgress[]
  isUploading: boolean
  onRetry: (fileId: string) => void
  onClose: () => void
  liveUpdates: boolean
}

export function ProgressModal({ files, progress, isUploading, onRetry, onClose, liveUpdates }: ProgressModalProps) {
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type === "application/pdf") return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "uploading":
        return <Upload className="h-4 w-4" />
      case "processing":
        return <Zap className="h-4 w-4" />
      case "extracting":
        return <Search className="h-4 w-4" />
      case "validating":
        return <Shield className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case "uploading":
        return "Uploading file..."
      case "processing":
        return "Processing with AI..."
      case "extracting":
        return "Extracting data..."
      case "validating":
        return "Validating information..."
      default:
        return "Processing..."
    }
  }

  const getOverallProgress = () => {
    if (progress.length === 0) return 0
    const totalProgress = progress.reduce((sum, p) => sum + p.progress, 0)
    return Math.round(totalProgress / progress.length)
  }

  const getStatusCounts = () => {
    const completed = progress.filter((p) => p.status === "completed").length
    const failed = progress.filter((p) => p.status === "failed").length
    const uploading = progress.filter((p) => p.status === "uploading").length
    return { completed, failed, uploading, total: files.length }
  }

  const statusCounts = getStatusCounts()
  const overallProgress = getOverallProgress()
  const allCompleted = statusCounts.completed === files.length
  const hasFailed = statusCounts.failed > 0

  return (
    <Dialog open={true} onOpenChange={() => !isUploading && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-primary">
              {allCompleted ? "Upload Complete!" : "Processing Invoices"}
            </DialogTitle>
            {!isUploading && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {allCompleted ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : hasFailed ? (
                  <AlertTriangle className="h-5 w-5 text-error" />
                ) : (
                  <RefreshCw className="h-5 w-5 text-accent animate-spin" />
                )}
                <span className="font-medium text-primary">
                  {allCompleted
                    ? "All files processed successfully"
                    : `Processing ${statusCounts.uploading} of ${statusCounts.total} files`}
                </span>
              </div>
              <span className="text-sm font-numeric text-muted-foreground">{overallProgress}%</span>
            </div>

            <Progress value={overallProgress} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {statusCounts.completed} Completed
                </Badge>
                {statusCounts.failed > 0 && (
                  <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                    {statusCounts.failed} Failed
                  </Badge>
                )}
                {statusCounts.uploading > 0 && (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {statusCounts.uploading} Processing
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {files.map((file) => {
              const fileProgress = progress.find((p) => p.fileId === file.id)
              const isExpanded = showDetails[file.id]

              return (
                <div key={file.id} className="border border-base-fg rounded-card p-4 space-y-3">
                  {/* File Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="text-accent">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {fileProgress?.status === "completed" && <CheckCircle className="h-5 w-5 text-success" />}
                      {fileProgress?.status === "failed" && (
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-error" />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRetry(file.id)}
                            className="border-accent/20 text-accent hover:bg-accent/5"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      )}
                      {fileProgress?.status === "uploading" && (
                        <RefreshCw className="h-5 w-5 text-accent animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileProgress && fileProgress.status !== "completed" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStageIcon(fileProgress.stage)}
                          <span className="text-sm text-muted-foreground">{getStageLabel(fileProgress.stage)}</span>
                        </div>
                        <span className="text-sm font-numeric text-muted-foreground">
                          {Math.round(fileProgress.progress)}%
                        </span>
                      </div>
                      <Progress value={fileProgress.progress} className="h-1" />
                    </div>
                  )}

                  {/* Quality Check Results */}
                  {file.qualityCheck && (
                    <div className="pt-2 border-t border-base-fg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails((prev) => ({ ...prev, [file.id]: !prev[file.id] }))}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        Quality Check Results {isExpanded ? "▼" : "▶"}
                      </Button>

                      {isExpanded && (
                        <div className="mt-2 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Contrast:</span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "ml-2",
                                  file.qualityCheck.contrast >= 0.7
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-warning/10 text-warning border-warning/20",
                                )}
                              >
                                {file.qualityCheck.contrast >= 0.7 ? "Good" : "Low"}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Resolution:</span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "ml-2",
                                  file.qualityCheck.resolution >= 150
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-warning/10 text-warning border-warning/20",
                                )}
                              >
                                {file.qualityCheck.resolution}dpi
                              </Badge>
                            </div>
                          </div>
                          {file.qualityCheck.suggestions.length > 0 && (
                            <div>
                              <p className="text-muted-foreground mb-1">Suggestions:</p>
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {file.qualityCheck.suggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          {allCompleted && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-base-fg">
              <Button variant="outline" onClick={onClose}>
                Upload More
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-white">View Processed Invoices</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
