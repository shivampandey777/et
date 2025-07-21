"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import { format } from "date-fns"

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function SpendingChart() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [timeFrame, setTimeFrame] = useState<"month" | "year" | "day">("month")

  // Fetch transactions data from API based on time frame
  const fetchData = async () => {
    const response = await fetch(`/api/expense/fetch?timeFrame=${timeFrame}`)
    const data = await response.json()

    // Check if data is an array and set transactions
    if (Array.isArray(data)) {
      setTransactions(data)
    } else {
      console.error("Error: Data is not an array", data)
    }
  }

  useEffect(() => {
    fetchData()
  }, [timeFrame]) // Refetch data when the timeFrame changes

  const generateChartData = (timeFrame: string) => {
    if (!Array.isArray(transactions)) {
      console.error("Transactions data is not an array", transactions)
      return []
    }

    const groupedData = transactions.reduce((acc: any[], t: any) => {
      let period: string | undefined;

      // Group by month, year, or day
      if (timeFrame === 'month') {
        period = format(new Date(t.date), "MMM yyyy")
      } else if (timeFrame === 'year') {
        period = format(new Date(t.date), "yyyy")
      } else if (timeFrame === 'day') {
        period = format(new Date(t.date), "dd MMM yyyy")
      }

      if (period) {
        const existing = acc.find((item) => item.period === period)
        if (existing) {
          existing.amount += t.amount
        } else {
          acc.push({ period, amount: t.amount })
        }
      }
      return acc
    }, [])

    return groupedData
  }

  const chartData = generateChartData(timeFrame)

  // Chart.js data structure with green color for the bars
  const data = {
    labels: chartData.map((item) => item.period),
    datasets: [
      {
        label: "Spending Amount",
        data: chartData.map((item) => item.amount),
        backgroundColor: "#34D399", // Green color (Tailwind Green)
        borderColor: "#10B981", // Darker Green (Tailwind Darker Green)
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">
          {timeFrame === "month" ? "Monthly" : timeFrame === "year" ? "Yearly" : "Daily"} Spending Overview
        </h3>
        <Select value={timeFrame} onValueChange={(value: "month" | "year" | "day") => setTimeFrame(value)}>
          <SelectTrigger className="w-32 border-gray-200 focus:border-gray-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-80">
        <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>

      <div className="text-sm text-gray-500 text-center">
        {timeFrame === "month" ? "Showing expenses for the last 12 months" : timeFrame === "year" ? "Showing expenses for the last 5 years" : "Showing expenses for the last 30 days"}
      </div>
    </div>
  )
}
