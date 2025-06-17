"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const spendData = [
  { month: "Jan", amount: 24500, budget: 25000 },
  { month: "Feb", amount: 26800, budget: 25000 },
  { month: "Mar", amount: 23200, budget: 25000 },
  { month: "Apr", amount: 27100, budget: 25000 },
  { month: "May", amount: 25900, budget: 25000 },
  { month: "Jun", amount: 28400, budget: 25000 },
  { month: "Jul", amount: 24700, budget: 25000 },
  { month: "Aug", amount: 26300, budget: 25000 },
  { month: "Sep", amount: 29100, budget: 25000 },
  { month: "Oct", amount: 27800, budget: 25000 },
  { month: "Nov", amount: 25600, budget: 25000 },
  { month: "Dec", amount: 28900, budget: 25000 },
]

export function SpendTrendChart() {
  return (
    <div className="h-80">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Monthly Spend vs Budget</p>
          <p className="text-lg font-semibold text-primary">$28,900 Current Month</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-muted-foreground">Actual Spend</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Budget</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={spendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDEFF3" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EDEFF3",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name === "amount" ? "Actual Spend" : "Budget",
            ]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#4A6EE0"
            strokeWidth={3}
            dot={{ fill: "#4A6EE0", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#4A6EE0", strokeWidth: 2 }}
          />
          <Line type="monotone" dataKey="budget" stroke="#FDBA74" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
