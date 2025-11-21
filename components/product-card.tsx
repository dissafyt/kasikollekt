"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

interface ProductCardProps {
  id: string
  title: string
  brand: string
  price: number
  image: string
  category: string
}

export function ProductCard({ id, title, brand, price, image, category }: ProductCardProps) {
  const [adding, setAdding] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault() // Prevent navigation to product detail
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    try {
      setAdding(true)
      await apiClient.cart.add({
        product_id: id,
        quantity: 1,
        title: title,
        price: price,
      })

      toast({
        title: "Added to cart",
        description: `${title} has been added to your cart`,
      })

      // Trigger cart refresh in header by dispatching event
      window.dispatchEvent(new Event("cartUpdated"))
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3 bg-background/90 text-foreground">{category}</Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <p className="text-sm text-muted-foreground">{brand}</p>
          <h3 className="font-semibold text-balance line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-bold">R{price}</p>
        <Button size="sm" className="gap-2" onClick={handleAddToCart} disabled={adding}>
          <ShoppingCart className="h-4 w-4" />
          {adding ? "Adding..." : "Add"}
        </Button>
      </CardFooter>
    </Card>
  )
}
