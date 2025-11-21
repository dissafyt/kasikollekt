"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export const dynamic = "force-dynamic"

interface Vendor {
  uid: string
  email: string
  brand_name?: string
  status?: string
  created_at?: string
  [key: string]: any
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const data = await apiClient.vendors.list()
      setVendors(data)
    } catch (err) {
      console.error("Failed to fetch vendors:", err)
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (uid: string) => {
    try {
      setActionLoading(uid)
      await apiClient.vendors.approve(uid)
      toast({
        title: "Vendor Approved",
        description: "The vendor has been approved successfully",
      })
      await fetchVendors()
    } catch (err: any) {
      console.error("Failed to approve vendor:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to approve vendor",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (uid: string) => {
    try {
      setActionLoading(uid)
      await apiClient.vendors.reject(uid)
      toast({
        title: "Vendor Rejected",
        description: "The vendor has been rejected",
      })
      await fetchVendors()
    } catch (err: any) {
      console.error("Failed to reject vendor:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to reject vendor",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setViewDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">Manage and approve vendor applications</p>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground">Manage and approve vendor applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors ({vendors.length})</CardTitle>
          <CardDescription>Review and manage vendor accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {vendors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vendors found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.uid}>
                    <TableCell className="font-medium">{vendor.email}</TableCell>
                    <TableCell>{vendor.brand_name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          vendor.status === "approved"
                            ? "default"
                            : vendor.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {vendor.status || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleView(vendor)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {vendor.status !== "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(vendor.uid)}
                            disabled={actionLoading === vendor.uid}
                          >
                            {actionLoading === vendor.uid ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {vendor.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(vendor.uid)}
                            disabled={actionLoading === vendor.uid}
                          >
                            {actionLoading === vendor.uid ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>Complete information about this vendor</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Email:</span> {selectedVendor.email}
              </div>
              <div>
                <span className="font-semibold">UID:</span> {selectedVendor.uid}
              </div>
              <div>
                <span className="font-semibold">Brand Name:</span> {selectedVendor.brand_name || "N/A"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <Badge
                  variant={
                    selectedVendor.status === "approved"
                      ? "default"
                      : selectedVendor.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {selectedVendor.status || "pending"}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {selectedVendor.created_at ? new Date(selectedVendor.created_at).toLocaleString() : "N/A"}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
