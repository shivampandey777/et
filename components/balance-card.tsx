"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

// Fetch monthly spending data from the API
const fetchMonthlySpending = async () => {
  const response = await fetch("/api/expense/fetch?timeFrame=month") // Pass "month" as a query parameter
  const data = await response.json()

  const currentMonth = new Date().getMonth()

  interface Expense {
    date: string
    amount: number
  }

  const monthlySpending = (data as Expense[])
    .filter((expense: Expense) => new Date(expense.date).getMonth() === currentMonth)
    .reduce((acc: number, expense: Expense) => acc + expense.amount, 0)

  return monthlySpending
}

export function BalanceCard(balance: { balance: number }) {
  const [monthlySpending, setMonthlySpending] = useState<number>(0)

  // Fetch monthly spending on component mount
  useEffect(() => {
    const getMonthlySpending = async () => {
      const spending = await fetchMonthlySpending()
      setMonthlySpending(spending)
    }

    getMonthlySpending()
  }, []) // Only run on mount

  const isPositive = monthlySpending >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="clean-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Spending</p>
            <motion.p
              key={monthlySpending}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              ${Math.abs(monthlySpending).toFixed(2)}
            </motion.p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Wallet className="h-8 w-8 text-gray-600" />
            </motion.div>
            <TrendIcon className={`h-5 w-5 ${isPositive ? "text-green-600" : "text-red-600"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
