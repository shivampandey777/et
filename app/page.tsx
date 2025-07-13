"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionForm } from "@/components/transaction-form"
import { BalanceCard } from "@/components/balance-card"
import { useTransactions } from "@/contexts/transaction-context"

export default function HomePage() {
  const { transactions } = useTransactions()
  const balance = 2222


  return (
    <div className="max-w-md mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <BalanceCard balance={balance} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="clean-card shadow-sm">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-base font-semibold text-gray-800 text-center">Add Transaction</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 pb-4">
            <TransactionForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
