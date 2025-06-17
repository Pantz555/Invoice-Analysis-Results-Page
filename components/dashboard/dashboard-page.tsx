"use client"

import type React from "react"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit3, Save, FileText, AlertTriangle, Target, Zap, GripVertical } from "lucide-react"
import { HeroStats } from "./hero-stats"
import { SpendTrendChart } from "./spend-trend-chart"
import { TopVariancesChart } from "./top-variances-chart"
import { AlertsTable } from "./alerts-table"

interface Widget {
  id: string
  type: "lineChart" | "barChart" | "table"
  title: string
  component: React.ComponentType<any>
  gridCols: number
  gridRows: number
}

const initialWidgets: Widget[] = [
  {
    id: "spend-trend",
    type: "lineChart",
    title: "Spend Trend",
    component: SpendTrendChart,
    gridCols: 2,
    gridRows: 1,
  },
  {
    id: "top-variances",
    type: "barChart",
    title: "Top Variances",
    component: TopVariancesChart,
    gridCols: 1,
    gridRows: 1,
  },
  {
    id: "alerts-table",
    type: "table",
    title: "Alerts Needing Action",
    component: AlertsTable,
    gridCols: 3,
    gridRows: 1,
  },
]

export default function DashboardPage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [widgets, setWidgets] = useState(initialWidgets)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setWidgets(items)
  }

  const saveLayout = () => {
    setIsEditMode(false)
    // In a real app, you'd save the layout to localStorage or API
    console.log("Layout saved:", widgets)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time insights into your invoice processing performance</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Edit Layout</span>
            <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
          </div>
          {isEditMode && (
            <Button onClick={saveLayout} className="bg-accent hover:bg-accent/90 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          )}
        </div>
      </div>

      {/* Hero Stats */}
      <HeroStats />

      {/* Widgets Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Analytics Overview</h2>
          {isEditMode && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              <Edit3 className="h-3 w-3 mr-1" />
              Edit Mode Active
            </Badge>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="widgets" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {widgets.map((widget, index) => {
                  const WidgetComponent = widget.component
                  return (
                    <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditMode}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            ${widget.gridCols === 2 ? "lg:col-span-2" : "lg:col-span-1"}
                            ${widget.gridCols === 3 ? "lg:col-span-3" : ""}
                            ${snapshot.isDragging ? "z-50" : ""}
                            ${isEditMode ? "ring-2 ring-accent/20 ring-offset-2" : ""}
                          `}
                        >
                          <Card className="shadow-card h-full">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-primary">{widget.title}</CardTitle>
                                {isEditMode && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-base-fg"
                                  >
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <WidgetComponent />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <p className="text-muted-foreground">Common tasks and shortcuts for efficient workflow</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 border-accent/20 hover:bg-accent/5">
              <FileText className="h-6 w-6 text-accent" />
              <span className="text-sm">Upload Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-accent/20 hover:bg-accent/5">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <span className="text-sm">Review Alerts</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-accent/20 hover:bg-accent/5">
              <Target className="h-6 w-6 text-success" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 border-accent/20 hover:bg-accent/5">
              <Zap className="h-6 w-6 text-accent" />
              <span className="text-sm">Bulk Process</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
