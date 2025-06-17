import { InvoiceUploadFlow } from "../../components/upload/invoice-upload-flow"

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Upload Invoices</h1>
        <p className="text-muted-foreground mt-2">Upload your invoices for AI-powered processing and data extraction</p>
      </div>

      <InvoiceUploadFlow
        onComplete={(files) => {
          console.log("Upload completed:", files)
          // Handle successful upload
        }}
        onError={(error) => {
          console.error("Upload error:", error)
          // Handle upload error
        }}
      />
    </div>
  )
}
