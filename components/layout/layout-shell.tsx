"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  FileSpreadsheet,
  Settings,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface LayoutShellProps {
  children: React.ReactNode
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Invoices", href: "/invoices", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Suppliers", href: "/suppliers", icon: Users },
  { name: "Reports", href: "/reports", icon: FileSpreadsheet },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function LayoutShell({ children }: LayoutShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Handle responsive breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Generate breadcrumb from pathname
  const generateBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumb = [{ name: "Home", href: "/" }]

    segments.forEach((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/")
      const name = segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumb.push({ name, href })
    })

    return breadcrumb
  }

  const breadcrumb = generateBreadcrumb()

  return (
    <div className="min-h-screen flex bg-base-fg">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-primary text-white shadow-card transition-transform duration-300",
          isMobile ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">BakeScan AI</h1>
                <p className="text-xs text-white/70">Invoice Intelligence</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-button text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-white" : "text-white/70 hover:text-white hover:bg-white/10",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>
                  )}
                </a>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 p-2 rounded-button hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Jane Doe</p>
                <p className="text-xs text-white/70 truncate">Finance Manager</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col", !isMobile && "ml-64")}>
        {/* Header */}
        <header className="bg-base-0 border-b border-base-fg shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden"
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                )}

                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm">
                  {breadcrumb.map((item, index) => (
                    <div key={item.href} className="flex items-center">
                      {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
                      <a
                        href={item.href}
                        className={cn(
                          "hover:text-accent transition-colors",
                          index === breadcrumb.length - 1 ? "text-primary font-medium" : "text-muted-foreground",
                        )}
                      >
                        {index === 0 ? <Home className="h-4 w-4" /> : item.name}
                      </a>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">{/* Add any header actions here */}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-white/10 lg:hidden">
          <div className="grid grid-cols-6 h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                    isActive ? "text-accent" : "text-white/70",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="truncate">{item.name}</span>
                </a>
              )
            })}
          </div>
        </nav>
      )}

      {/* Mobile Bottom Padding */}
      {isMobile && <div className="h-16" />}
    </div>
  )
}
