"use client"
import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"

export function ExpandingSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  return (
    <div className="relative flex items-center justify-end">
      {/* Input - positioned absolutely to expand left */}
      <input
        ref={inputRef}
        type="search"
        placeholder="Search products..."
        className={`absolute right-10 transition-all duration-300 ease-in-out bg-background text-foreground placeholder:text-muted-foreground
          ${isOpen ? "w-64 px-4 py-2 opacity-100" : "w-0 px-0 py-0 opacity-0"}
          border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm`}
        onBlur={() => setIsOpen(false)}
      />

      {/* Search Icon Button - stays stationary on the right */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:text-primary-foreground transition-colors rounded-md hover:bg-accent relative z-10"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  )
}
