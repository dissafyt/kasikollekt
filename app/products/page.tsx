"use client"

import { MarketplaceHeader } from "@/components/marketplace-header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { categories, brands } from "@/lib/example-data"
import { useState, useMemo, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [selectedAudience, setSelectedAudience] = useState("all")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.products.list()
      setProducts(data)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brandId === selectedBrand)
    }

    if (selectedAudience !== "all") {
      filtered = filtered.filter((product) =>
        product.tags?.some((tag: string) => tag.toLowerCase() === selectedAudience.toLowerCase()),
      )
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // Assuming products are already in newest-first order
        break
      case "featured":
      default:
        // Keep original order
        break
    }

    return filtered
  }, [products, selectedCategory, selectedBrand, sortBy, selectedAudience])

  const clearFilters = () => {
    setSelectedCategory("All")
    setSelectedBrand("all")
    setSortBy("featured")
    setSelectedAudience("all")
  }

  const activeFiltersCount = [
    selectedCategory !== "All",
    selectedBrand !== "all",
    selectedAudience !== "all",
    sortBy !== "featured",
  ].filter(Boolean).length

  return (
    <div className="flex min-h-screen flex-col items-stretch justify-center">
      <MarketplaceHeader />
      <div className="flex flex-col items-center">
        <main className="flex container py-8 flex-col items-stretch">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-center">All Products</h1>
            <p className="mt-2 text-muted-foreground text-center">Discover unique South African designer brands</p>
          </div>

          <div className="mb-8 flex flex-col gap-4">
            {/* Mobile Filter Button */}
            <div className="flex md:hidden items-center gap-3">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters & Sort
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters & Sort</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Audience Filter */}
                    <div>
                      <h3 className="mb-3 font-semibold">Shop For</h3>
                      <div className="flex flex-wrap gap-2">
                        {["all", "men", "women", "kids"].map((audience) => (
                          <Badge
                            key={audience}
                            variant={audience === selectedAudience ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm capitalize"
                            onClick={() => setSelectedAudience(audience)}
                          >
                            {audience === "all" ? "All" : audience}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <h3 className="mb-3 font-semibold">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={category === selectedCategory ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <h3 className="mb-3 font-semibold">Brand</h3>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <h3 className="mb-3 font-semibold">Sort By</h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                      <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    )}

                    <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                      Show {filteredAndSortedProducts.length} Products
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center justify-between gap-4">
              {/* Audience Tabs */}
              <div className="flex gap-2">
                {["all", "men", "women", "kids"].map((audience) => (
                  <Badge
                    key={audience}
                    variant={audience === selectedAudience ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm capitalize"
                    onClick={() => setSelectedAudience(audience)}
                  >
                    {audience === "all" ? "All" : audience}
                  </Badge>
                ))}
              </div>

              {/* Desktop Filter Panel Trigger */}
              <Sheet open={desktopFiltersOpen} onOpenChange={setDesktopFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="bg-transparent">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters & Sort
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters & Sort</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="mb-3 font-semibold">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={category === selectedCategory ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                      <h3 className="mb-3 font-semibold">Brand</h3>
                      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Brands</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort */}
                    <div>
                      <h3 className="mb-3 font-semibold">Sort By</h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    {activeFiltersCount > 0 && (
                      <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    )}

                    <Button className="w-full" onClick={() => setDesktopFiltersOpen(false)}>
                      Show {filteredAndSortedProducts.length} Products
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading products...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-lg text-destructive">{error}</p>
              <Button onClick={fetchProducts} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredAndSortedProducts.length}{" "}
                {filteredAndSortedProducts.length === 1 ? "product" : "products"}
              </div>

              {/* Products Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {filteredAndSortedProducts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">No products found matching your filters.</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Load More */}
              {filteredAndSortedProducts.length > 0 && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg">
                    Load More Products
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {/* Footer - Same as homepage */}
      <footer className="flex items-center border-t bg-secondary py-12 text-secondary-foreground mx-0 px-12 justify-center mt-16">
        <div className="container">
          <div className="mt-8 border-t border-secondary-foreground/10 pt-8 text-center text-sm text-secondary-foreground/70">
            <p>&copy; 2025 KasiKollekt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
