"use client"

import { MarketplaceHeader } from "@/components/marketplace-header"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { ShoppingCart, Heart, Share2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<any | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id)
    })
  }, [params])

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    }
  }, [productId])

  async function fetchProduct(id: string) {
    try {
      setLoading(true)
      const [productData, allProducts] = await Promise.all([apiClient.products.get(id), apiClient.products.list()])

      setProduct(productData)

      // Get related products from same brand or category
      const related = allProducts
        .filter((p: any) => p.id !== id && (p.brandId === productData.brandId || p.category === productData.category))
        .slice(0, 4)

      setRelatedProducts(related)
    } catch (error) {
      console.error("Error fetching product:", error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  async function handleAddToCart() {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    if (!product) return

    try {
      setAdding(true)
      await apiClient.cart.add({
        product_id: product.id,
        quantity: 1,
        title: product.title,
        price: product.price,
      })

      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      })

      // Trigger cart refresh in header
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MarketplaceHeader />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="center-items min-h-screen bg-background flex-col justify-center items-center">
      <MarketplaceHeader />
      {/* Breadcrumb Navigation */}
      <div className="flex border-b justify-evenly">
        <div className="container py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* ... existing image gallery code ... */}

            {/* Right Column - Product Info & Customizer */}
            <div className="space-y-6">
              {/* ... existing product header code ... */}

              <Separator />

              {/* Product Description */}
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={!product.inStock || adding}
                  onClick={handleAddToCart}
                >
                  {adding ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* ... existing product features and tabs code ... */}
            </div>
          </div>

          {/* ... existing tabs code ... */}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">You May Also Like</h2>
                <Button variant="ghost" asChild>
                  <Link href="/products">View All</Link>
                </Button>
              </div>
              <div className="flex center-items grid gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-end items-stretch flex-row">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    title={relatedProduct.title}
                    brand={relatedProduct.brand}
                    price={relatedProduct.price}
                    image={relatedProduct.image}
                    category={relatedProduct.category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
