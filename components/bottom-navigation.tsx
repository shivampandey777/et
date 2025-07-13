"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, BarChart3 } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/reports", label: "Report", icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex justify-center space-x-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex  items-center gap-3 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                {item.label}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
