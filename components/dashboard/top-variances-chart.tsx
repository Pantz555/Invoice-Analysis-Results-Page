"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const varianceData = [
  { supplier: "Flour & Co.", variance: 1250, type: "increase" },
  { supplier: "Sweet Ingredients", variance: -890, type: "decrease" },
  { supplier: "Dairy Farms", variance: 650, type: "increase" },
  { supplier: "Equipment Pro", variance: -420, type: "decrease" },
  { supplier: "Vanilla Co.", variance: 380, type: "increase" },
]

export function TopVariancesChart() {
  return (
    <div className="h-80">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Price Variances This Month</p>
        <p className="text-lg font-semibold text-primary">5 Suppliers with Notable Changes</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={varianceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDEFF3" />
          <XAxis
            dataKey="supplier"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${Math.abs(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDEFF3",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
            }}
            formatter={(value: number) => [`${value > 0 ? "+" : ""}$${value.toLocaleString()}`, "Price Variance"]}
          />
          <Bar dataKey="variance" fill={(entry) => (entry.variance > 0 ? "#EF4444" : "#17B890")} radius={[4, 4, 0, 0]}>
            {varianceData.map((entry, index) => (
              <Bar key={`cell-${index}`} fill={entry.variance > 0 ? "#EF4444" : "#17B890"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
