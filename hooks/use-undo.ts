"use client"

import { useState, useCallback } from "react"

interface UndoState<T> {
  item: T
  action: () => Promise<void>
  timestamp: number
}

export function useUndo<T>() {
  const [undoStack, setUndoStack] = useState<UndoState<T>[]>([])

  const addToUndoStack = useCallback((item: T, restoreAction: () => Promise<void>) => {
    setUndoStack((prev) => [
      {
        item,
        action: restoreAction,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 4), // Keep only last 5 items
    ])
  }, [])

  const undo = useCallback(
    async (index = 0) => {
      const state = undoStack[index]
      if (state) {
        await state.action()
        setUndoStack((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [undoStack],
  )

  const clearUndo = useCallback(() => {
    setUndoStack([])
  }, [])

  return {
    undoStack,
    addToUndoStack,
    undo,
    clearUndo,
  }
}
