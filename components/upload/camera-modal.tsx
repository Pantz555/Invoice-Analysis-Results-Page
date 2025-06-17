"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  X,
  RotateCw,
  FlashlightIcon as FlashOn,
  FlashlightOffIcon as FlashOff,
  SwitchCamera,
  Check,
  RefreshCw,
} from "lucide-react"

interface CameraModalProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const [isActive, setIsActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsActive(true)
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      console.error("Camera error:", err)
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsActive(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageData)
    stopCamera()
  }, [stopCamera])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }, [capturedImage, onCapture])

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }, [])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  useEffect(() => {
    if (isActive) {
      stopCamera()
      startCamera()
    }
  }, [facingMode, isActive, startCamera, stopCamera])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-primary">Capture Invoice</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-button p-4 text-center">
              <p className="text-error">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={startCamera}
                className="mt-2 border-error/20 text-error hover:bg-error/5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Camera View */}
          <div className="relative bg-black rounded-card overflow-hidden aspect-video">
            {!capturedImage ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

                {/* Camera Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top Controls */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 text-white rounded-full hover:bg-black/70"
                      onClick={() => setFlashEnabled(!flashEnabled)}
                    >
                      {flashEnabled ? <FlashOn className="h-5 w-5" /> : <FlashOff className="h-5 w-5" />}
                    </Button>

                    <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                      Position invoice in frame
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/50 text-white rounded-full hover:bg-black/70"
                      onClick={switchCamera}
                    >
                      <SwitchCamera className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Viewfinder */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-80 h-60 border-2 border-white/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white"></div>
                    </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="flex justify-center">
                    <Button
                      className="bg-white text-black rounded-full w-20 h-20 flex items-center justify-center shadow-lg hover:bg-white/90"
                      onClick={capturePhoto}
                      disabled={!isActive}
                    >
                      <Camera className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured invoice"
                  className="w-full h-full object-cover"
                />

                {/* Preview Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white rounded-card p-4 flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      className="border-accent/20 text-accent hover:bg-accent/5"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    <Button onClick={confirmCapture} className="bg-accent hover:bg-accent/90 text-white">
                      <Check className="h-4 w-4 mr-2" />
                      Use Photo
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Position the invoice within the frame for best results</p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <span>• Ensure good lighting</span>
              <span>• Keep invoice flat</span>
              <span>• Avoid shadows</span>
            </div>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
