"use client"

import { useState } from "react"
import { IncomeForm } from "./IncomeForm"
import { ExpenseForm } from "./ExpenseForm"

export function TransactionForm() {
  const [type, setType] = useState<"expense" | "income">("expense")

  return (
    <div>
      <div className="flex bg-gray-100 rounded-md p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${type === "expense" ? "bg-white text-green-600" : "text-gray-600"}`}
        >
          Expenses
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-colors ${type === "income" ? "bg-white text-green-600" : "text-gray-600"}`}
        >
          Income
        </button>
      </div>

      {type === "income" ? <IncomeForm /> : <ExpenseForm />}
    </div>
  )
}
