import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TransactionProvider } from "@/contexts/transaction-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fin Tracker - Money Tracker",
  description: "Track your finances with style!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TransactionProvider>
          <div className="min-h-screen bg-gray-50 pb-20">
            <main className="container mx-auto px-4 py-8">{children}</main>
            <BottomNavigation />
          </div>
        </TransactionProvider>
      </body>
    </html>
  )
}
