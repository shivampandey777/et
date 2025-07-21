"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

type Expense = {
  category: string
  amount: number
  // add other fields if needed
}

export function SpendingSummary() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Fetch expenses data from the API
  const fetchExpenses = async () => {
    const response = await fetch('/api/expense/fetch') // Fetch from the correct API endpoint
    const data = await response.json()
    setExpenses(data)
  }

  useEffect(() => {
    fetchExpenses()
  }, []) // Fetch data only once when the component mounts

  // Calculate spending by category
  const categorySpending = expenses
    .reduce<Record<string, number>>((acc, expense) => {
      // Ensure `expense.category` exists and accumulate the amount spent in each category
      if (expense.category && expense.amount) {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      }
      return acc
    }, {})

  // Sort categories by spending amount in descending order
  const sortedCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8) // Show top 8 categories

  const maxAmount = Math.max(...Object.values(categorySpending) as number[])

  // Define custom colors for categories
  const categoryColors: Record<string, string> = {
    "Food": "#FF6347", // Tomato
    "Transport": "#3B82F6", // Blue
    "Entertainment": "#F59E0B", // Amber
    "Shopping": "#10B981", // Green
    "Bills": "#9CA3AF", // Gray
    "Health": "#F43F5E", // Red
    "Education": "#6B21A8", // Purple
    "Miscellaneous": "#3B82F6", // Blue (Default fallback)
  }

  // If no spending data is available
  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses recorded yet.</p>
        <p className="text-sm">Add some expenses to see your spending breakdown!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedCategories.map(([category, amount], index) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="clean-card p-4 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">{category}</h3>
            <span className="font-bold text-gray-900">${amount.toFixed(2)}</span>
          </div>
          <div className="relative bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(amount / maxAmount) * 100}%`,
                backgroundColor: categoryColors[category] || "#3B82F6", // Use custom color or fallback
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{((amount / maxAmount) * 100).toFixed(1)}% of highest</span>
            <span>
              {expenses.filter((e) => e.category === category).length} expenses
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
