"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, Package, AlertCircle, CheckCircle, XCircle, Ban, Wrench, UserPlus, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  product_id: string
  title: string
  brand_id: string
  brand_name?: string
  description?: string
  status: "draft" | "pending" | "approved" | "rejected" | "suspended" | "fixes_required"
  user_id?: string
}

interface User {
  uid: string
  email: string
  display_name?: string
  role: string
}

type StatusFilter = "all" | "pending" | "fixes_required" | "rejected" | "suspended" | "approved"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    brand_id: "",
    description: "",
  })

  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [createForm, setCreateForm] = useState({
    title: "",
    brand_id: "",
    description: "",
    status: "draft" as Product["status"],
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [selectedStatus, searchQuery, allProducts])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching all products...")
      const data = await apiClient.products.list()
      console.log("[v0] Products fetched:", data)
      setAllProducts(data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch products:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      console.log("[v0] Fetching users for assignment...")
      const data = await apiClient.users.list()
      console.log("[v0] Users fetched:", data)
      setUsers(data)
    } catch (error: any) {
      console.error("[v0] Failed to fetch users:", error.message)
    } finally {
      setLoadingUsers(false)
    }
  }

  const filterProducts = () => {
    let filtered = allProducts

    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setProducts(filtered)
  }

  const handleApprove = async (productId: string) => {
    try {
      console.log("[v0] Approving product:", productId)
      await apiClient.products.approve(productId)
      await fetchProducts()
      if (selectedProduct?.product_id === productId) {
        setSelectedProduct(null)
      }
    } catch (error: any) {
      console.error("[v0] Failed to approve product:", error.message)
      alert(`Failed to approve product: ${error.message}`)
    }
  }

  const handleReject = async (productId: string) => {
    try {
      console.log("[v0] Rejecting product:", productId)
      await apiClient.products.reject(productId)
      await fetchProducts()
      if (selectedProduct?.product_id === productId) {
        setSelectedProduct(null)
      }
    } catch (error: any) {
      console.error("[v0] Failed to reject product:", error.message)
      alert(`Failed to reject product: ${error.message}`)
    }
  }

  const handleRequestFixes = async (productId: string) => {
    try {
      console.log("[v0] Requesting fixes for product:", productId)
      await apiClient.products.requestFixes(productId)
      await fetchProducts()
      if (selectedProduct?.product_id === productId) {
        setSelectedProduct(null)
      }
    } catch (error: any) {
      console.error("[v0] Failed to request fixes:", error.message)
      alert(`Failed to request fixes: ${error.message}`)
    }
  }

  const handleSuspend = async (productId: string) => {
    try {
      console.log("[v0] Suspending product:", productId)
      await apiClient.products.suspend(productId)
      await fetchProducts()
      if (selectedProduct?.product_id === productId) {
        setSelectedProduct(null)
      }
    } catch (error: any) {
      console.error("[v0] Failed to suspend product:", error.message)
      alert(`Failed to suspend product: ${error.message}`)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[v0] Deleting product:", productId)
      await apiClient.products.delete(productId)
      await fetchProducts()
      setSelectedProduct(null)
    } catch (error: any) {
      console.error("[v0] Failed to delete product:", error.message)
      alert(`Failed to delete product: ${error.message}`)
    }
  }

  const handleUpdate = async () => {
    if (!selectedProduct) return

    try {
      console.log("[v0] Updating product:", selectedProduct.product_id, editForm)
      await apiClient.products.update(selectedProduct.product_id, editForm)
      await fetchProducts()
      setIsEditing(false)
      setSelectedProduct(null)
    } catch (error: any) {
      console.error("[v0] Failed to update product:", error.message)
      alert(`Failed to update product: ${error.message}`)
    }
  }

  const handleAssign = async () => {
    if (!selectedProduct || !selectedUserId) return

    try {
      console.log("[v0] Assigning product to user:", selectedProduct.product_id, selectedUserId)
      await apiClient.products.assign(selectedProduct.product_id, selectedUserId)
      await fetchProducts()
      setShowAssignDialog(false)
      setSelectedUserId("")
      const updatedProduct = { ...selectedProduct, user_id: selectedUserId }
      setSelectedProduct(updatedProduct)
    } catch (error: any) {
      console.error("[v0] Failed to assign product:", error.message)
      alert(`Failed to assign product: ${error.message}`)
    }
  }

  const handleCreate = async () => {
    if (!createForm.title || !createForm.brand_id) {
      alert("Please fill in all required fields (Title and Brand ID)")
      return
    }

    try {
      console.log("[v0] Creating product:", createForm)
      await apiClient.products.create(createForm)
      await fetchProducts()
      setIsCreating(false)
      setSelectedProduct(null)
      setCreateForm({
        title: "",
        brand_id: "",
        description: "",
        status: "draft",
      })
    } catch (error: any) {
      console.error("[v0] Failed to create product:", error.message)
      alert(`Failed to create product: ${error.message}`)
    }
  }

  const openAssignDialog = () => {
    setShowAssignDialog(true)
    fetchUsers()
  }

  const openDetailPanel = (product: Product) => {
    setSelectedProduct(product)
    setEditForm({
      title: product.title,
      brand_id: product.brand_id,
      description: product.description || "",
    })
    setIsEditing(false)
  }

  const openCreatePanel = () => {
    setIsCreating(true)
    setSelectedProduct(null)
    setIsEditing(false)
    setCreateForm({
      title: "",
      brand_id: "",
      description: "",
      status: "draft",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: "secondary", icon: AlertCircle, label: "Pending" },
      approved: { variant: "default", icon: CheckCircle, label: "Approved" },
      rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
      suspended: { variant: "destructive", icon: Ban, label: "Suspended" },
      fixes_required: { variant: "secondary", icon: Wrench, label: "Fixes Required" },
      draft: { variant: "outline", icon: Package, label: "Draft" },
    }

    const config = variants[status] || variants.draft
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const statusCounts = {
    all: allProducts.length,
    pending: allProducts.filter((p) => p.status === "pending").length,
    fixes_required: allProducts.filter((p) => p.status === "fixes_required").length,
    rejected: allProducts.filter((p) => p.status === "rejected").length,
    suspended: allProducts.filter((p) => p.status === "suspended").length,
    approved: allProducts.filter((p) => p.status === "approved").length,
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedProduct || isCreating ? "mr-96" : ""}`}>
        {/* Header */}
        <div className="border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-sm text-muted-foreground">Manage product approvals and status</p>
            </div>
            <Button onClick={openCreatePanel}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {(["all", "pending", "fixes_required", "rejected", "suspended", "approved"] as StatusFilter[]).map(
              (status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className="whitespace-nowrap"
                >
                  {status === "all"
                    ? "All"
                    : status === "fixes_required"
                      ? "Fixes Required"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">{statusCounts[status]}</span>
                </Button>
              ),
            )}
          </div>
        </div>

        {/* Products List */}
        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : selectedStatus !== "all"
                    ? `No ${selectedStatus} products`
                    : "No products available"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.product_id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-accent/50 cursor-pointer"
                  onClick={() => openDetailPanel(product)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{product.title}</h3>
                      {getStatusBadge(product.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Brand: {product.brand_id}</p>
                    {product.brand_name && (
                      <p className="mt-1 text-sm text-muted-foreground">Brand Name: {product.brand_name}</p>
                    )}
                    {product.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      {(selectedProduct || isCreating) && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 border-l bg-background shadow-lg flex flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{isCreating ? "Create Product" : "Product Details"}</h2>
                <p className="text-sm text-muted-foreground">
                  {isCreating ? "Add a new product to the system" : `ID: ${selectedProduct?.product_id}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedProduct(null)
                  setIsCreating(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons - Only show for existing products */}
            {!isEditing && !isCreating && selectedProduct && (
              <div className="mt-4 flex flex-col gap-2">
                {selectedProduct.status === "pending" && (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.product_id)} className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Product
                    </Button>
                    <Button
                      onClick={() => handleRequestFixes(selectedProduct.product_id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Request Fixes
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProduct.product_id)}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Product
                    </Button>
                  </>
                )}
                {selectedProduct.status === "approved" && (
                  <Button
                    onClick={() => handleSuspend(selectedProduct.product_id)}
                    variant="destructive"
                    className="w-full"
                    size="sm"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Suspend Product
                  </Button>
                )}
                {selectedProduct.status === "fixes_required" && (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.product_id)} className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Product
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProduct.product_id)}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Product
                    </Button>
                  </>
                )}
                {selectedProduct.status === "rejected" && (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.product_id)} className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Product
                    </Button>
                    <Button
                      onClick={() => handleRequestFixes(selectedProduct.product_id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Request Fixes
                    </Button>
                  </>
                )}
                {selectedProduct.status === "suspended" && (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.product_id)} className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Product
                    </Button>
                    <Button
                      onClick={() => handleRequestFixes(selectedProduct.product_id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Request Fixes
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProduct.product_id)}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Product
                    </Button>
                  </>
                )}
                {selectedProduct.status === "draft" && (
                  <>
                    <Button onClick={() => handleApprove(selectedProduct.product_id)} className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Product
                    </Button>
                    <Button
                      onClick={() => handleRequestFixes(selectedProduct.product_id)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Request Fixes
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProduct.product_id)}
                      variant="destructive"
                      className="w-full"
                      size="sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Product
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {isCreating ? (
                <>
                  <div>
                    <Label htmlFor="create-title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="create-title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      placeholder="Enter product title"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-brand">
                      Brand ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="create-brand"
                      value={createForm.brand_id}
                      onChange={(e) => setCreateForm({ ...createForm, brand_id: e.target.value })}
                      placeholder="Enter brand ID"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-description">Description</Label>
                    <Textarea
                      id="create-description"
                      value={createForm.description}
                      onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                      placeholder="Enter product description (optional)"
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="create-status">Initial Status</Label>
                    <Select
                      value={createForm.status}
                      onValueChange={(value) => setCreateForm({ ...createForm, status: value as Product["status"] })}
                    >
                      <SelectTrigger id="create-status" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : selectedProduct ? (
                <>
                  {/* Status */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
                  </div>

                  {/* Owner */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Owner</Label>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm">{selectedProduct.user_id || "Not assigned"}</p>
                      <Button variant="outline" size="sm" onClick={openAssignDialog}>
                        <UserPlus className="mr-2 h-3 w-3" />
                        Assign
                      </Button>
                    </div>
                  </div>

                  {/* Brand Name */}
                  {selectedProduct.brand_name && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Brand Name</Label>
                      <p className="mt-1 text-sm">{selectedProduct.brand_name}</p>
                    </div>
                  )}

                  {/* View Mode */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Title</Label>
                    <p className="mt-1 text-sm">{selectedProduct.title}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Brand ID</Label>
                    <p className="mt-1 text-sm">{selectedProduct.brand_id}</p>
                  </div>

                  {selectedProduct.description && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="mt-1 text-sm">{selectedProduct.description}</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            {isCreating ? (
              <div className="flex gap-2">
                <Button onClick={handleCreate} className="flex-1" disabled={!createForm.title || !createForm.brand_id}>
                  Create Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false)
                    setSelectedProduct(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            ) : isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdate} className="flex-1">
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
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedProduct?.product_id || "")}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Product to User</DialogTitle>
            <DialogDescription>
              Select a user to assign this product to. The user will become the owner of this product.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select" className="mt-1">
                  <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a user"} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.uid} value={user.uid}>
                      {user.display_name || user.email} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedUserId || loadingUsers}>
              Assign Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
