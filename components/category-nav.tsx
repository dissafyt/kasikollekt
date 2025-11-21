"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { categoriesAPI } from "@/lib/api-client"

const ALLOWED_CATEGORIES = {
  "8Nk5dD0M0Nrvp5KNu2oV": "Tops",
  T4QCOewP0qkCu6GufvSm: "Bottoms",
  RoNzXZflcsncIZoFL6kc: "Shoes",
  "1EIWrqLox1AsVKYLwUjt": "Accessories",
}

interface Category {
  category_id: string
  name: string
  description: string
  subcategories: string[]
}

export function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesAPI.listPublic()
        const filtered = data.filter((cat: Category) => Object.keys(ALLOWED_CATEGORIES).includes(cat.category_id))
        setCategories(filtered)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="border-b bg-muted/30">
        <div className="container">
          <nav className="flex gap-1 overflow-x-auto py-2">
            <Button variant="default" size="sm" asChild className="whitespace-nowrap">
              <Link href="/">All</Link>
            </Button>
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="container">
        <nav className="flex gap-1 overflow-x-auto py-2">
          <Button variant="default" size="sm" asChild className="whitespace-nowrap">
            <Link href="/">All</Link>
          </Button>
          {categories.map((category) => (
            <Button key={category.category_id} variant="ghost" size="sm" asChild className="whitespace-nowrap">
              <Link href={`/category/${category.category_id}`}>{category.name}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
