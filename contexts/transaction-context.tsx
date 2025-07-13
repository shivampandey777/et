"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Transaction {
  id: string
  amount: number
  category: string
  date: Date
  notes: string
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  addCategory: (category: string) => void // Mock addCategory function for local state
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Sample data
    {
      id: "1",
      amount: 3000,
      category: "Income",
      date: new Date(2024, 11, 1),
      notes: "Monthly salary",

    },
    {
      id: "2",
      amount: 150,
      category: "Food",
      date: new Date(2024, 11, 5),
      notes: "Weekly shopping",

    },
    {
      id: "3",
      amount: 25,
      category: "Entertainment",
      date: new Date(2024, 11, 10),
      notes: "Date night",

    },
    {
      id: "4",
      amount: 5.5,
      category: "Food",
      date: new Date(2024, 11, 12),
      notes: "Morning coffee",

    },
  ])

  // Function to add a transaction
  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev])
  }

  // Mock function to add category (for now, it just logs to console)
  const addCategory = (category: string) => {
    console.log("Adding category:", category)
    // Logic to add category to the backend (e.g., Supabase) goes here
  }

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, addCategory }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}
