"use client"

import type React from "react"

import { useState, useCallback } from "react"
import {
  Upload,
  FileText,
  Search,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Settings,
  BarChart3,
  Users,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Invoice {
  id: string
  supplier: string
  date: string
  status: "processing" | "completed" | "discrepancies"
  thumbnail: string
  amount?: string
  invoiceNumber?: string
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    supplier: "Flour & Co. Suppliers",
    date: "2024-01-15",
    status: "completed",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$1,245.50",
    invoiceNumber: "INV-2024-0156",
  },
  {
    id: "2",
    supplier: "Sweet Ingredients Ltd",
    date: "2024-01-14",
    status: "processing",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$892.30",
    invoiceNumber: "INV-2024-0155",
  },
  {
    id: "3",
    supplier: "Bakery Equipment Pro",
    date: "2024-01-13",
    status: "discrepancies",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$3,456.78",
    invoiceNumber: "INV-2024-0154",
  },
  {
    id: "4",
    supplier: "Organic Dairy Farms",
    date: "2024-01-12",
    status: "completed",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$567.90",
    invoiceNumber: "INV-2024-0153",
  },
  {
    id: "5",
    supplier: "Premium Vanilla Co.",
    date: "2024-01-11",
    status: "completed",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$234.15",
    invoiceNumber: "INV-2024-0152",
  },
  {
    id: "6",
    supplier: "Local Egg Suppliers",
    date: "2024-01-10",
    status: "processing",
    thumbnail: "/placeholder.svg?height=120&width=120",
    amount: "$445.67",
    invoiceNumber: "INV-2024-0151",
  },
]

export default function BakeScanDashboard() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchQuery, setSearchQuery] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileUpload = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.includes("image/") || file.type === "application/pdf")

    if (validFiles.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            // Add new invoice to the list
            const newInvoice: Invoice = {
              id: Date.now().toString(),
              supplier: "Processing...",
              date: new Date().toISOString().split("T")[0],
              status: "processing",
              thumbnail: "/placeholder.svg?height=120&width=120",
            }
            setInvoices((prev) => [newInvoice, ...prev])
            return 0
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "discrepancies":
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20"
      case "processing":
        return "bg-warning/10 text-warning border-warning/20"
      case "discrepancies":
        return "bg-error/10 text-error border-error/20"
    }
  }

  const getStatusText = (status: Invoice["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "processing":
        return "Processing"
      case "discrepancies":
        return "Needs Review"
    }
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-base-fg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-base-0 shadow-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-base-fg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary">BakeScan AI</h1>
                <p className="text-xs text-muted-foreground">Invoice Intelligence</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Button variant="default" className="w-full justify-start bg-accent text-white">
              <BarChart3 className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
              <FileText className="h-4 w-4 mr-3" />
              Invoices
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
              <AlertTriangle className="h-4 w-4 mr-3" />
              Discrepancies
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
              <Users className="h-4 w-4 mr-3" />
              Suppliers
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
              <FileSpreadsheet className="h-4 w-4 mr-3" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-base-fg">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-accent text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Finance Manager</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-base-0 border-b border-base-fg shadow-sm">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-primary">Dashboard</h2>
                <p className="text-muted-foreground">Manage your invoice processing with confidence</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold font-numeric text-primary">{invoices.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-card flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold font-numeric text-primary">
                      {invoices.filter((i) => i.status === "processing").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-card flex items-center justify-center">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold font-numeric text-primary">
                      {invoices.filter((i) => i.status === "completed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-card flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Need Review</p>
                    <p className="text-2xl font-bold font-numeric text-primary">
                      {invoices.filter((i) => i.status === "discrepancies").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-error/10 rounded-card flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-error" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-primary">Upload Invoices</CardTitle>
              <p className="text-muted-foreground">
                Drop your invoice files here or click to browse. We'll handle the rest with precision.
              </p>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-card p-8 text-center transition-colors ${
                  isDragOver ? "border-accent bg-accent/5" : "border-base-fg hover:border-accent/50 hover:bg-accent/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-accent rounded-card flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Drop invoice files here</h3>
                    <p className="text-muted-foreground mb-4">or click to browse and select files</p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, and PDF files up to 10MB</p>
                  </div>
                  <Button
                    className="bg-accent hover:bg-accent/90 text-white rounded-button"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = ".jpg,.jpeg,.png,.pdf"
                      input.multiple = true
                      input.onchange = (e) => {
                        const files = Array.from((e.target as HTMLInputElement).files || [])
                        handleFileUpload(files)
                      }
                      input.click()
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">Uploading...</span>
                    <span className="text-sm font-numeric text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-primary">Recent Invoices</CardTitle>
                  <p className="text-muted-foreground">Your latest invoice processing activity</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="rounded-button">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-button">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvoices.map((invoice) => (
                  <Card
                    key={invoice.id}
                    className="shadow-card hover:shadow-lg transition-shadow cursor-pointer border border-base-fg hover:border-accent/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-base-fg rounded-card flex items-center justify-center">
                            <FileText className="h-6 w-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary line-clamp-1">{invoice.supplier}</h3>
                            <p className="text-sm text-muted-foreground">{invoice.date}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(invoice.status)} flex items-center space-x-1 rounded-button`}
                        >
                          {getStatusIcon(invoice.status)}
                          <span className="text-xs font-medium">{getStatusText(invoice.status)}</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {invoice.invoiceNumber && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Invoice #</span>
                            <span className="text-sm font-numeric text-primary">{invoice.invoiceNumber}</span>
                          </div>
                        )}
                        {invoice.amount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="text-sm font-numeric font-semibold text-primary">{invoice.amount}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-base-fg">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-accent hover:text-accent hover:bg-accent/5 rounded-button"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">No invoices found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms" : "Upload your first invoice to get started"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
