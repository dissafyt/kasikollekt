"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, X, ChevronDown, ChevronRight, FolderOpen, Folder } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Subcategory {
  name: string
  description?: string
}

interface Category {
  category_id?: string
  name: string
  description: string
  subcategories?: Subcategory[]
}

type ViewMode = "category" | "subcategory" | "create-category" | "create-subcategory"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Detail panel state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" })
  const [subcategoryForm, setSubcategoryForm] = useState({ name: "", description: "" })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await apiClient.categories.list()
      setCategories(data)
    } catch (error) {
      console.error("[v0] Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const openCategoryDetail = (category: Category) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    setViewMode("category")
    setCategoryForm({ name: category.name, description: category.description })
    setIsEditing(false)
  }

  const openSubcategoryDetail = (category: Category, subcategory: Subcategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    setViewMode("subcategory")
    setSubcategoryForm({ name: subcategory.name, description: subcategory.description || "" })
    setIsEditing(false)
  }

  const openCreateCategory = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setViewMode("create-category")
    setCategoryForm({ name: "", description: "" })
    setIsEditing(true)
  }

  const openCreateSubcategory = () => {
    if (!selectedCategory) return
    setSelectedSubcategory(null)
    setViewMode("create-subcategory")
    setSubcategoryForm({ name: "", description: "" })
    setIsEditing(true)
  }

  const closeDetailPanel = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setViewMode(null)
    setIsEditing(false)
  }

  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) return

    try {
      await apiClient.categories.create(categoryForm)
      await fetchCategories()
      closeDetailPanel()
    } catch (error) {
      console.error("[v0] Failed to create category:", error)
      alert("Failed to create category. Please try again.")
    }
  }

  const handleUpdateCategory = async () => {
    if (!selectedCategory?.category_id || !categoryForm.name.trim()) return

    try {
      await apiClient.categories.update(selectedCategory.category_id, categoryForm)
      await fetchCategories()
      setIsEditing(false)
      closeDetailPanel()
    } catch (error) {
      console.error("[v0] Failed to update category:", error)
      alert("Failed to update category. Please try again.")
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory?.category_id) return
    if (!confirm(`Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`)) return

    try {
      await apiClient.categories.delete(selectedCategory.category_id)
      await fetchCategories()
      closeDetailPanel()
    } catch (error) {
      console.error("[v0] Failed to delete category:", error)
      alert("Failed to delete category. Please try again.")
    }
  }

  const handleCreateSubcategory = async () => {
    if (!selectedCategory?.category_id || !subcategoryForm.name.trim()) return

    try {
      const payload = {
        name: subcategoryForm.name,
        description: subcategoryForm.description || "",
      }
      console.log("[v0] Creating subcategory with payload:", payload)

      await apiClient.categories.addSubcategory(selectedCategory.category_id, payload)
      await fetchCategories()
      closeDetailPanel()
    } catch (error) {
      console.error("[v0] Failed to add subcategory:", error)
      alert("Failed to add subcategory. Please try again.")
    }
  }

  const handleDeleteSubcategory = async () => {
    if (!selectedCategory?.category_id || !selectedSubcategory?.name) return
    if (!confirm(`Are you sure you want to remove "${selectedSubcategory.name}"?`)) return

    try {
      console.log("[v0] Deleting subcategory:", {
        categoryId: selectedCategory.category_id,
        subcategoryName: selectedSubcategory.name,
      })

      await apiClient.categories.removeSubcategory(selectedCategory.category_id, selectedSubcategory.name)
      await fetchCategories()
      closeDetailPanel()
    } catch (error) {
      console.error("[v0] Failed to remove subcategory:", error)
      alert("Failed to remove subcategory. Please try again.")
    }
  }

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.subcategories?.some((sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${viewMode ? "mr-96" : ""}`}>
        {/* Header */}
        <div className="border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-sm text-muted-foreground">Manage product categories and subcategories</p>
            </div>
            <Button onClick={openCreateCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories List */}
        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Folder className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No categories found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Create your first category to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCategories.map((category) => {
                const isExpanded = expandedCategories.has(category.category_id || "")
                const subcategoryCount = category.subcategories?.length || 0

                return (
                  <div key={category.category_id} className="space-y-1">
                    {/* Category Row */}
                    <div
                      className="flex items-center gap-2 rounded-lg border bg-card p-3 hover:bg-accent/50 cursor-pointer"
                      onClick={() => openCategoryDetail(category)}
                    >
                      {subcategoryCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCategory(category.category_id || "")
                          }}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      )}
                      {subcategoryCount === 0 && <div className="w-6" />}

                      <FolderOpen className="h-5 w-5 text-muted-foreground" />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          {subcategoryCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {subcategoryCount} subcategories
                            </Badge>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                        )}
                      </div>

                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>

                    {isExpanded && subcategoryCount > 0 && (
                      <div className="ml-8 space-y-1">
                        {category.subcategories?.map((subcategory) => (
                          <div
                            key={subcategory.name}
                            className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2 hover:bg-accent/50 cursor-pointer"
                            onClick={() => openSubcategoryDetail(category, subcategory)}
                          >
                            <div className="w-6" />
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{subcategory.name}</p>
                              {subcategory.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{subcategory.description}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {viewMode && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 border-l bg-background shadow-lg flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {viewMode === "create-category" && "Create Category"}
                  {viewMode === "create-subcategory" && "Add Subcategory"}
                  {viewMode === "category" && "Category Details"}
                  {viewMode === "subcategory" && "Subcategory Details"}
                </h2>
                {selectedCategory && viewMode !== "create-category" && (
                  <p className="text-sm text-muted-foreground">
                    {viewMode === "subcategory" ? `in ${selectedCategory.name}` : `ID: ${selectedCategory.category_id}`}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeDetailPanel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {viewMode === "category" && !isEditing && (
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={openCreateSubcategory} variant="outline" className="w-full bg-transparent" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {(viewMode === "category" || viewMode === "create-category") && (
                <>
                  {isEditing ? (
                    <>
                      <div>
                        <Label htmlFor="cat-name">Name</Label>
                        <Input
                          id="cat-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cat-description">Description</Label>
                        <Textarea
                          id="cat-description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <p className="mt-1 text-sm">{selectedCategory?.name}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="mt-1 text-sm">{selectedCategory?.description || "No description"}</p>
                      </div>

                      {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Subcategories</Label>
                          <div className="mt-2 space-y-2">
                            {selectedCategory.subcategories.map((sub) => (
                              <div key={sub.name} className="rounded-md border p-2">
                                <p className="text-sm font-medium">{sub.name}</p>
                                {sub.description && <p className="text-xs text-muted-foreground">{sub.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {(viewMode === "subcategory" || viewMode === "create-subcategory") && (
                <>
                  {isEditing || viewMode === "create-subcategory" ? (
                    <>
                      <div>
                        <Label htmlFor="sub-name">Name</Label>
                        <Input
                          id="sub-name"
                          value={subcategoryForm.name}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sub-description">Description</Label>
                        <Textarea
                          id="sub-description"
                          value={subcategoryForm.description}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <p className="mt-1 text-sm">{selectedSubcategory?.name}</p>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="mt-1 text-sm">{selectedSubcategory?.description || "No description"}</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            {viewMode === "create-category" && (
              <div className="flex gap-2">
                <Button onClick={handleCreateCategory} className="flex-1">
                  Create Category
                </Button>
                <Button variant="outline" onClick={closeDetailPanel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            )}

            {viewMode === "create-subcategory" && (
              <div className="flex gap-2">
                <Button onClick={handleCreateSubcategory} className="flex-1">
                  Add Subcategory
                </Button>
                <Button variant="outline" onClick={closeDetailPanel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            )}

            {viewMode === "category" && (
              <>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateCategory} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="flex-1">
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteCategory} className="flex-1">
                      Delete
                    </Button>
                  </div>
                )}
              </>
            )}

            {viewMode === "subcategory" && (
              <div className="flex gap-2">
                <Button variant="destructive" onClick={handleDeleteSubcategory} className="flex-1">
                  Remove
                </Button>
                <Button variant="outline" onClick={closeDetailPanel} className="flex-1 bg-transparent">
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
