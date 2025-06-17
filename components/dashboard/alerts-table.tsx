"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, DollarSign, FileText, Eye } from "lucide-react"

interface Alert {
  id: string
  type: "price_variance" | "duplicate_invoice" | "missing_data" | "approval_needed"
  supplier: string
  description: string
  amount: number
  priority: "high" | "medium" | "low"
  date: string
}

const alertsData: Alert[] = [
  {
    id: "1",
    type: "price_variance",
    supplier: "Flour & Co. Suppliers",
    description: "15% price increase on organic wheat flour",
    amount: 1250,
    priority: "high",
    date: "2024-01-15",
  },
  {
    id: "2",
    type: "duplicate_invoice",
    supplier: "Sweet Ingredients Ltd",
    description: "Potential duplicate invoice detected",
    amount: 890,
    priority: "high",
    date: "2024-01-14",
  },
  {
    id: "3",
    type: "missing_data",
    supplier: "Bakery Equipment Pro",
    description: "Invoice missing purchase order reference",
    amount: 3456,
    priority: "medium",
    date: "2024-01-13",
  },
  {
    id: "4",
    type: "approval_needed",
    supplier: "Organic Dairy Farms",
    description: "Invoice exceeds approval threshold",
    amount: 2100,
    priority: "medium",
    date: "2024-01-12",
  },
  {
    id: "5",
    type: "price_variance",
    supplier: "Premium Vanilla Co.",
    description: "Unexpected price decrease on vanilla extract",
    amount: -180,
    priority: "low",
    date: "2024-01-11",
  },
]

export function AlertsTable() {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "price_variance":
        return <DollarSign className="h-4 w-4" />
      case "duplicate_invoice":
        return <FileText className="h-4 w-4" />
      case "missing_data":
        return <AlertTriangle className="h-4 w-4" />
      case "approval_needed":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getPriorityBadge = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-error/10 text-error border-error/20">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Low
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: Alert["type"]) => {
    switch (type) {
      case "price_variance":
        return "Price Variance"
      case "duplicate_invoice":
        return "Duplicate Invoice"
      case "missing_data":
        return "Missing Data"
      case "approval_needed":
        return "Approval Needed"
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Requires Immediate Attention</p>
          <p className="text-lg font-semibold text-primary">{alertsData.length} Active Alerts</p>
        </div>
        <Button variant="outline" size="sm" className="border-accent/20 text-accent hover:bg-accent/5">
          View All Alerts
        </Button>
      </div>

      <div className="rounded-md border border-base-fg overflow-hidden">
        <Table>
          <TableHeader className="bg-base-fg">
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px]">Priority</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertsData.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-base-fg/50">
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="text-sm font-medium">{getTypeLabel(alert.type)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{alert.supplier}</TableCell>
                <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                <TableCell className="text-right font-numeric">
                  <span className={alert.amount > 0 ? "text-error" : "text-success"}>
                    {alert.amount > 0 ? "+" : ""}${Math.abs(alert.amount).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
