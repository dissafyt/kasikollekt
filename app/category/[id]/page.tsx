import { MarketplaceHeader } from "@/components/marketplace-header"
import { ProductCard } from "@/components/product-card"
import { exampleProducts } from "@/lib/example-data"
import { categoriesAPI } from "@/lib/api-client"
import { notFound } from "next/navigation"

const ALLOWED_CATEGORIES = [
  "8Nk5dD0M0Nrvp5KNu2oV", // Tops
  "T4QCOewP0qkCu6GufvSm", // Bottoms
  "RoNzXZflcsncIZoFL6kc", // Shoes
  "1EIWrqLox1AsVKYLwUjt", // Accessories
]

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params

  if (!ALLOWED_CATEGORIES.includes(id)) {
    notFound()
  }

  let category
  try {
    const categories = await categoriesAPI.listPublic()
    category = categories.find((cat: any) => cat.category_id === id)

    if (!category) {
      notFound()
    }
  } catch (error) {
    console.error("Failed to fetch category:", error)
    notFound()
  }

  // TODO: Replace with actual API call when products endpoint supports category filtering
  const categoryProducts = exampleProducts.filter(
    (product) => product.category?.toLowerCase() === category.name.toLowerCase(),
  )

  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
          {category.description && <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>}
          <p className="mt-1 text-sm text-muted-foreground">
            {categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">No products found in this category yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new arrivals!</p>
          </div>
        )}
      </main>
    </div>
  )
}
