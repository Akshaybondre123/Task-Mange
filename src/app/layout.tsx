import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import {Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })
export const metadata: Metadata = {
  title: "Task Management System",
  description: "A modern task management system built with Next.js",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </Providers>
      </body>
</html>
)
}