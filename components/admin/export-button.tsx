"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps {
  data: any[]
  filename: string
  disabled?: boolean
}

export function ExportButton({ data, filename, disabled }: ExportButtonProps) {
  const exportToCSV = () => {
    if (data.length === 0) return

    // Get all unique keys from all objects
    const keys = Array.from(new Set(data.flatMap((item) => Object.keys(item))))

    // Create CSV header
    const header = keys.join(",")

    // Create CSV rows
    const rows = data.map((item) => {
      return keys
        .map((key) => {
          const value = item[key]
          if (value === null || value === undefined) return ""
          if (typeof value === "object") return JSON.stringify(value).replace(/"/g, '""')
          return `"${String(value).replace(/"/g, '""')}"`
        })
        .join(",")
    })

    // Combine header and rows
    const csv = [header, ...rows].join("\n")

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" size="sm" onClick={exportToCSV} disabled={disabled || data.length === 0}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  )
}
