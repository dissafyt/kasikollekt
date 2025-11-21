"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  FileText,
  Package,
  FolderTree,
  Users,
  ShoppingCart,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { authAPI } from "@/lib/api-client"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Applications", href: "/admin/applications" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Wallet, label: "Payouts", href: "/admin/payouts" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      console.log("[KasiKollekt-API] Logout successful")
      router.push("/admin/login")
    } catch (error) {
      console.error("[KasiKollekt-API] Logout error:", error)
      router.push("/admin/login")
    }
  }

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b transition-all duration-300",
          collapsed ? "justify-center px-2" : "gap-2 px-6",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
          <ShoppingBag className="h-6 w-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold">KasiKollekt</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              const buttonContent = (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full gap-3 transition-all duration-300",
                    collapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              )

              return (
                <div key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>{buttonContent}</Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={item.href}>{buttonContent}</Link>
                  )}
                </div>
              )
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t p-3">
        <TooltipProvider delayDuration={0}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-300",
                    collapsed ? "justify-center px-2" : "justify-start",
                  )}
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Logout
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </Button>
          )}
        </TooltipProvider>
      </div>

      {!collapsed && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Collapse</span>
          </Button>
        </div>
      )}
      {collapsed && (
        <div className="border-t p-3">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center px-2"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Expand
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 hidden h-screen border-r bg-background transition-all duration-300 lg:block",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  )
}
