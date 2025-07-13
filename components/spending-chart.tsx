"use client"

import { useState } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransactions } from "@/contexts/transaction-context"
import {
  format,
  subMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachYearOfInterval,
} from "date-fns"

export function SpendingChart() {
  const { transactions } = useTransactions()
  const [timeFrame, setTimeFrame] = useState<"month" | "year">("month")

  const generateMonthlyData = () => {
    const endDate = new Date()
    const startDate = subMonths(endDate, 11) // Last 12 months
    const months = eachMonthOfInterval({ start: startDate, end: endDate })

    return months.map((month) => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)

      const monthTransactions = transactions.filter(
        (t) => t.date >= monthStart && t.date <= monthEnd && t.type === "expense",
      )

      const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        period: format(month, "MMM yyyy"),
        amount: totalSpent,
      }
    })
  }

  const generateYearlyData = () => {
    const endDate = new Date()
    const startDate = subYears(endDate, 4) // Last 5 years
    const years = eachYearOfInterval({ start: startDate, end: endDate })

    return years.map((year) => {
      const yearStart = startOfYear(year)
      const yearEnd = endOfYear(year)

      const yearTransactions = transactions.filter(
        (t) => t.date >= yearStart && t.date <= yearEnd && t.type === "expense",
      )

      const totalSpent = yearTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        period: format(year, "yyyy"),
        amount: totalSpent,
      }
    })
  }

  const chartData = timeFrame === "month" ? generateMonthlyData() : generateYearlyData()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          {timeFrame === "month" ? "Monthly" : "Yearly"} Spending Overview
        </h3>
        <Select value={timeFrame} onValueChange={(value: "month" | "year") => setTimeFrame(value)}>
          <SelectTrigger className="w-32 border-gray-200 focus:border-gray-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              fontSize={12}
              angle={timeFrame === "month" ? -45 : 0}
              textAnchor={timeFrame === "month" ? "end" : "middle"}
              height={timeFrame === "month" ? 80 : 60}
            />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6b7280"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-500 text-center">
        {timeFrame === "month" ? "Showing expenses for the last 12 months" : "Showing expenses for the last 5 years"}
      </div>
    </div>
  )
}
