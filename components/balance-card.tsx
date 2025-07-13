"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const isPositive = balance >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="clean-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Balance</p>
            <motion.p
              key={balance}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              ${Math.abs(balance).toFixed(2)}
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
