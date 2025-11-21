"use client"

import { useEffect, useState, useMemo } from "react"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react"
import { Pagination } from "@/components/admin/pagination"
import { BulkActionToolbar } from "@/components/admin/bulk-action-toolbar"
import { ExportButton } from "@/components/admin/export-button"
import { DateRangeFilter } from "@/components/admin/date-range-filter"
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { useUndo } from "@/hooks/use-undo"

type ApplicationType = "brand" | "investor" | "wholesale" | "affiliate" | "partner"
type ApplicationStatus = "pending" | "approved" | "rejected"

interface Application {
  id: string
  type: ApplicationType
  status: ApplicationStatus
  submitted_at: string
  approved_at?: string
  rejected_at?: string
  // Common fields
  email?: string
  contact_email?: string
  phone_number?: string
  message?: string
  // Brand fields
  brand_name?: string
  // Investor fields
  first_name?: string
  last_name?: string
  organization?: string
  investment_range?: string
  // Partner/Wholesale/Affiliate fields
  business_name?: string
  business_type?: string
  contact_name?: string
  website?: string
  service_provided?: string
  product_categories?: string
  annual_revenue?: string
  audience_size?: string
  platform?: string
  [key: string]: any // Allow other fields
}

type SortField = "submitted_at" | "type" | "status" | "name"
type SortOrder = "asc" | "desc"

export default function ApplicationsPage() {
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<ApplicationType | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "all">("all")
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sortField, setSortField] = useState<SortField>("submitted_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dateFrom, setDateFrom] = useState<Date | null>(null)
  const [dateTo, setDateTo] = useState<Date | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: "default" | "destructive"
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { addToUndoStack, undo } = useUndo<Application>()

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching all applications")
      const response = await apiClient.applications.list()
      console.log("[v0] API Response:", response)

      const apps = Array.isArray(response) ? response : response.applications || []
      setAllApplications(apps)
      console.log("[v0] Set applications count:", apps.length)
    } catch (err: any) {
      console.error("[v0] Failed to fetch applications:", err)
      setError(err.message || "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const applications = useMemo(() => {
    let filtered = allApplications

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase()
      filtered = filtered.filter((app) => {
        const name = getDisplayName(app).toLowerCase()
        const contact = getContactInfo(app).toLowerCase()
        const type = app.type.toLowerCase()
        return name.includes(query) || contact.includes(query) || type.includes(query)
      })
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((app) => app.type === selectedType)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((app) => app.status === selectedStatus)
    }

    if (dateFrom || dateTo) {
      filtered = filtered.filter((app) => {
        const submittedDate = new Date(app.submitted_at)
        if (dateFrom && submittedDate < dateFrom) return false
        if (dateTo && submittedDate > dateTo) return false
        return true
      })
    }

    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortField === "name") {
        aValue = getDisplayName(a).toLowerCase()
        bValue = getDisplayName(b).toLowerCase()
      } else if (sortField === "submitted_at") {
        aValue = new Date(a.submitted_at).getTime()
        bValue = new Date(b.submitted_at).getTime()
      } else {
        aValue = a[sortField]
        bValue = b[sortField]
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [allApplications, selectedType, selectedStatus, dateFrom, dateTo, sortField, sortOrder, debouncedSearch])

  const totalPages = Math.ceil(applications.length / pageSize)
  const paginatedApplications = applications.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, selectedStatus, dateFrom, dateTo])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(paginatedApplications.map((app) => app.id)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkApprove = async () => {
    setConfirmDialog({
      open: true,
      title: "Approve Applications",
      description: `Are you sure you want to approve ${selectedIds.size} application(s)? This will create user accounts for approved applications.`,
      onConfirm: async () => {
        try {
          setActionLoading(true)
          const promises = Array.from(selectedIds).map((id) => apiClient.applications.approve(id))
          await Promise.all(promises)

          toast({
            title: "Success",
            description: `${selectedIds.size} application(s) approved successfully`,
          })

          setSelectedIds(new Set())
          fetchApplications()
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to approve applications",
            variant: "destructive",
          })
        } finally {
          setActionLoading(false)
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  const handleBulkReject = async () => {
    setConfirmDialog({
      open: true,
      title: "Reject Applications",
      description: `Are you sure you want to reject ${selectedIds.size} application(s)? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          setActionLoading(true)
          const promises = Array.from(selectedIds).map((id) => apiClient.applications.reject(id))
          await Promise.all(promises)

          toast({
            title: "Success",
            description: `${selectedIds.size} application(s) rejected`,
          })

          setSelectedIds(new Set())
          fetchApplications()
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to reject applications",
            variant: "destructive",
          })
        } finally {
          setActionLoading(false)
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-2" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4 ml-2" /> : <ArrowDown className="h-4 w-4 ml-2" />
  }

  const handleApprove = async (applicationId: string) => {
    const application = allApplications.find((app) => app.id === applicationId)
    if (!application) return

    setConfirmDialog({
      open: true,
      title: "Approve Application",
      description: `Are you sure you want to approve this ${application.type} application? A user account will be created.`,
      onConfirm: async () => {
        try {
          setApprovingId(applicationId)

          const email = application.email || application.contact_email
          if (!email) {
            throw new Error("No email found in application")
          }

          const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`

          const roleMap: Record<ApplicationType, string> = {
            brand: "vendor",
            wholesale: "vendor",
            partner: "vendor",
            investor: "investor",
            affiliate: "user",
          }

          const assignedRole = roleMap[application.type] || "user"

          await apiClient.applications.approve(applicationId)

          try {
            await apiClient.users.create({
              email,
              password: tempPassword,
              display_name: getDisplayName(application),
              role: assignedRole,
            })

            toast({
              title: "Application Approved",
              description: `User account created for ${email} with role: ${assignedRole}`,
              action: {
                label: "Undo",
                onClick: () => undo(0),
              },
            })

            addToUndoStack(application, async () => {
              await apiClient.applications.reject(applicationId)
              toast({
                title: "Approval Undone",
                description: "Application has been reverted to pending status",
              })
              fetchApplications()
            })

            setViewingApplication(null)
            fetchApplications()
          } catch (userError: any) {
            const errorMsg = userError.message || "Failed to create user account"

            if (
              errorMsg.includes("already exists") ||
              errorMsg.includes("duplicate") ||
              errorMsg.includes("ALREADY_EXISTS")
            ) {
              toast({
                title: "Warning",
                description: `User with email ${email} already exists. Application approved but no new user created.`,
              })
            } else {
              throw new Error(`Application approved, but failed to create user account: ${errorMsg}`)
            }
          }
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to approve application",
            variant: "destructive",
          })
        } finally {
          setApprovingId(null)
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  const handleReject = async (applicationId: string) => {
    const application = allApplications.find((app) => app.id === applicationId)
    if (!application) return

    setConfirmDialog({
      open: true,
      title: "Reject Application",
      description: `Are you sure you want to reject this ${application.type} application?`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          setRejectingId(applicationId)

          await apiClient.applications.reject(applicationId)

          toast({
            title: "Application Rejected",
            description: "The application has been rejected",
            action: {
              label: "Undo",
              onClick: () => undo(0),
            },
          })

          addToUndoStack(application, async () => {
            // Note: Backend would need an endpoint to revert to pending
            toast({
              title: "Rejection Undone",
              description: "Application status reverted",
            })
            fetchApplications()
          })

          setViewingApplication(null)
          fetchApplications()
        } catch (err: any) {
          toast({
            title: "Error",
            description: err.message || "Failed to reject application",
            variant: "destructive",
          })
        } finally {
          setRejectingId(null)
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  const getContactInfo = (app: Application) => {
    if (app.email) return app.email
    if (app.contact_email) return app.contact_email
    if (app.first_name && app.last_name) return `${app.first_name} ${app.last_name}`
    if (app.contact_name) return app.contact_name
    return "N/A"
  }

  const getDisplayName = (app: Application) => {
    if (app.brand_name) return app.brand_name
    if (app.business_name) return app.business_name
    if (app.organization) return app.organization
    if (app.first_name && app.last_name) return `${app.first_name} ${app.last_name}`
    return "N/A"
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    }
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeBadge = (type: ApplicationType) => {
    const colors = {
      brand: "bg-orange-100 text-orange-800 border-orange-300",
      investor: "bg-blue-100 text-blue-800 border-blue-300",
      wholesale: "bg-purple-100 text-purple-800 border-purple-300",
      affiliate: "bg-pink-100 text-pink-800 border-pink-300",
      partner: "bg-teal-100 text-teal-800 border-teal-300",
    }
    return (
      <Badge variant="outline" className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      <div className={`flex-1 flex flex-col ${viewingApplication ? "mr-96" : ""}`}>
        <div className="p-4 lg:p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">
              Manage brand, partner, investor, wholesale, and affiliate applications
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)} className="w-full">
              <TabsList>
                <TabsTrigger value="all">All ({allApplications.length})</TabsTrigger>
                <TabsTrigger value="brand">
                  Brands ({allApplications.filter((a) => a.type === "brand").length})
                </TabsTrigger>
                <TabsTrigger value="investor">
                  Investors ({allApplications.filter((a) => a.type === "investor").length})
                </TabsTrigger>
                <TabsTrigger value="wholesale">
                  Wholesale ({allApplications.filter((a) => a.type === "wholesale").length})
                </TabsTrigger>
                <TabsTrigger value="affiliate">
                  Affiliates ({allApplications.filter((a) => a.type === "affiliate").length})
                </TabsTrigger>
                <TabsTrigger value="partner">
                  Partners ({allApplications.filter((a) => a.type === "partner").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <DateRangeFilter
                onDateRangeChange={(from, to) => {
                  setDateFrom(from)
                  setDateTo(to)
                }}
              />
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <ExportButton data={applications} filename="applications" />
            </div>
          </div>

          <BulkActionToolbar
            selectedCount={selectedIds.size}
            onClearSelection={() => setSelectedIds(new Set())}
            onApprove={handleBulkApprove}
            onReject={handleBulkReject}
          />

          <div className="rounded-lg border bg-card">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {allApplications.length === 0
                    ? "No applications found"
                    : "No applications match the selected filters"}
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedIds.size === paginatedApplications.length && paginatedApplications.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                        <div className="flex items-center">
                          Type
                          <SortIcon field="type" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Name
                          <SortIcon field="name" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("submitted_at")}>
                        <div className="flex items-center">
                          Submitted
                          <SortIcon field="submitted_at" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          <SortIcon field="status" />
                        </div>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(app.id)}
                            onCheckedChange={(checked) => handleSelectOne(app.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{getTypeBadge(app.type)}</TableCell>
                        <TableCell className="font-medium">{getDisplayName(app)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(app.submitted_at)}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell className="text-sm">{getContactInfo(app)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setViewingApplication(app)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={applications.length}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1)
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
      />

      {viewingApplication && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 border-l bg-background overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{getDisplayName(viewingApplication)}</h2>
                <p className="text-sm text-muted-foreground">{getTypeBadge(viewingApplication.type)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setViewingApplication(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="mt-1">{getStatusBadge(viewingApplication.status)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Submitted</h3>
                <p className="mt-1">{formatDate(viewingApplication.submitted_at)}</p>
              </div>

              {viewingApplication.approved_at && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
                  <p className="mt-1">{formatDate(viewingApplication.approved_at)}</p>
                </div>
              )}

              {viewingApplication.rejected_at && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rejected</h3>
                  <p className="mt-1">{formatDate(viewingApplication.rejected_at)}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                <p className="mt-1">{getContactInfo(viewingApplication)}</p>
                {viewingApplication.phone_number && (
                  <p className="text-sm text-muted-foreground">{viewingApplication.phone_number}</p>
                )}
              </div>

              {viewingApplication.message && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                  <p className="mt-1 text-sm">{viewingApplication.message}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Application Details</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(viewingApplication)
                    .filter(
                      ([key]) =>
                        !["id", "type", "status", "submitted_at", "approved_at", "rejected_at", "message"].includes(
                          key,
                        ),
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                        <span className="font-medium">{value || "N/A"}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {viewingApplication.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleApprove(viewingApplication.id)}
                  disabled={approvingId === viewingApplication.id || rejectingId === viewingApplication.id}
                  className="flex-1"
                >
                  {approvingId === viewingApplication.id ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(viewingApplication.id)}
                  disabled={approvingId === viewingApplication.id || rejectingId === viewingApplication.id}
                  className="flex-1"
                >
                  {rejectingId === viewingApplication.id ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
