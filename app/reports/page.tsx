"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpendingChart } from "@/components/spending-chart"
import { SpendingSummary } from "@/components/spending-summary"

export default function ReportsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-bold text-gray-800 text-center">Financial Reports</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-700">Spending Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="clean-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-700">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingSummary />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
