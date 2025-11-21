"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Trash2, X } from "lucide-react"

interface BulkActionToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onApprove?: () => void
  onReject?: () => void
  onDelete?: () => void
  approveLabel?: string
  rejectLabel?: string
  deleteLabel?: string
}

export function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onApprove,
  onReject,
  onDelete,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  deleteLabel = "Delete",
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onApprove && (
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={onApprove}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {approveLabel} ({selectedCount})
          </Button>
        )}
        {onReject && (
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
            onClick={onReject}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {rejectLabel} ({selectedCount})
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLabel} ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  )
}
