import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your invoice processing with confidence and precision</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold font-numeric text-primary">247</p>
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
                <p className="text-2xl font-bold font-numeric text-primary">12</p>
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
                <p className="text-2xl font-bold font-numeric text-primary">231</p>
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
                <p className="text-2xl font-bold font-numeric text-primary">4</p>
              </div>
              <div className="w-12 h-12 bg-error/10 rounded-card flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Upload */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-primary">Quick Upload</CardTitle>
          <p className="text-muted-foreground">Drop your invoice files here for immediate processing</p>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-base-fg rounded-card p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-colors">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-card flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Drop files here</h3>
                <p className="text-muted-foreground">Supports JPG, PNG, and PDF files</p>
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-white rounded-button">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
