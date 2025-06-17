"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, DollarSign, Target, TrendingUp, TrendingDown } from "lucide-react"

interface StatMetric {
  key: string
  metric: string
  value: string
  change: number
  changeType: "increase" | "decrease"
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const statsData: StatMetric[] = [
  {
    key: "invoicesProcessed",
    metric: "Invoices Processed",
    value: "1,247",
    change: 12.5,
    changeType: "increase",
    icon: FileText,
    color: "accent",
  },
  {
    key: "discrepanciesFound",
    metric: "Discrepancies Detected",
    value: "23",
    change: -8.2,
    changeType: "decrease",
    icon: AlertTriangle,
    color: "warning",
  },
  {
    key: "costSavings",
    metric: "Cost Savings",
    value: "$12,450",
    change: 18.7,
    changeType: "increase",
    icon: DollarSign,
    color: "success",
  },
  {
    key: "ocrAccuracy",
    metric: "Processing Accuracy",
    value: "98.7%",
    change: 2.1,
    changeType: "increase",
    icon: Target,
    color: "accent",
  },
]

export function HeroStats() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "accent":
        return "bg-accent/10 text-accent"
      case "warning":
        return "bg-warning/10 text-warning"
      case "success":
        return "bg-success/10 text-success"
      case "error":
        return "bg-error/10 text-error"
      default:
        return "bg-accent/10 text-accent"
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.changeType === "increase"
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <Card key={stat.key} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-card flex items-center justify-center ${getColorClasses(stat.color)}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    isPositive
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-error/10 text-error border-error/20"
                  } flex items-center space-x-1`}
                >
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs font-medium">{Math.abs(stat.change)}%</span>
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.metric}</p>
                <p className="text-2xl font-bold font-numeric text-primary">{stat.value}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-base-fg">
                <p className="text-xs text-muted-foreground">
                  {isPositive ? "↗" : "↘"} {stat.change > 0 ? "+" : ""}
                  {stat.change}% from last month
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
