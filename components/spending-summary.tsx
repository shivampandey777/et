"use client"

import { motion } from "framer-motion"
import { useTransactions } from "@/contexts/transaction-context"

export function SpendingSummary() {
  const { transactions } = useTransactions()

  // Calculate spending by category
  const categorySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  // Sort categories by spending amount
  const sortedCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8) // Show top 8 categories

  const maxAmount = Math.max(...Object.values(categorySpending))

  const grayShades = [
    "bg-gray-800",
    "bg-gray-700",
    "bg-gray-600",
    "bg-gray-500",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
  ]

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses recorded yet.</p>
        <p className="text-sm">Add some transactions to see your spending breakdown!</p>
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
              className={`${grayShades[index % grayShades.length]} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${(amount / maxAmount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{((amount / maxAmount) * 100).toFixed(1)}% of highest</span>
            <span>
              {transactions.filter((t) => t.category === category && t.type === "expense").length} transactions
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
