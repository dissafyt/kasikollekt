"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

interface DateRangeFilterProps {
  onDateRangeChange: (from: Date | null, to: Date | null) => void
}

export function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

  const handleClear = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    onDateRangeChange(null, null)
  }

  const handleApply = () => {
    onDateRangeChange(dateFrom || null, dateTo || null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <CalendarIcon className="h-4 w-4" />
          {dateFrom || dateTo ? (
            <span>
              {dateFrom ? format(dateFrom, "MMM d") : "Start"} - {dateTo ? format(dateTo, "MMM d") : "End"}
            </span>
          ) : (
            "Date Range"
          )}
          {(dateFrom || dateTo) && (
            <X
              className="h-3 w-3 ml-1"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClear} className="flex-1 bg-transparent">
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
