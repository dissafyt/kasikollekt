"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X, UserX, UserCheck, Trash2, Edit } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface User {
  uid: string
  email: string
  display_name?: string
  role: string
  disabled: boolean
  created_at?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    email: "",
    display_name: "",
    role: "",
  })

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users when role or search changes
  useEffect(() => {
    filterUsers()
  }, [users, selectedRole, searchQuery])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Fetching users")
      const response = await apiClient.users.list()
      console.log("[v0] Users response:", response)
      setUsers(response)
    } catch (error) {
      console.error("[v0] Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.display_name?.toLowerCase().includes(query) ||
          user.uid.toLowerCase().includes(query),
      )
    }

    setFilteredUsers(filtered)
    console.log("[v0] Filtered users:", {
      total: users.length,
      filtered: filtered.length,
      role: selectedRole,
      search: searchQuery,
    })
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsEditing(false)
    setEditForm({
      email: user.email,
      display_name: user.display_name || "",
      role: user.role,
    })
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    try {
      console.log("[v0] Updating user:", selectedUser.uid, editForm)
      await apiClient.users.update(selectedUser.uid, editForm)
      console.log("[v0] User updated successfully")

      // Refresh users list
      await fetchUsers()

      // Update selected user
      const updatedUser = { ...selectedUser, ...editForm }
      setSelectedUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("[v0] Failed to update user:", error)
      alert(`Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleSuspendUser = async (suspend: boolean) => {
    if (!selectedUser) return

    try {
      console.log("[v0] Suspending user:", selectedUser.uid, suspend)
      await apiClient.users.suspend(selectedUser.uid, suspend)
      console.log("[v0] User suspension updated")

      // Refresh users list
      await fetchUsers()

      // Update selected user
      setSelectedUser({ ...selectedUser, disabled: suspend })
    } catch (error) {
      console.error("[v0] Failed to suspend user:", error)
      alert(
        `Failed to ${suspend ? "suspend" : "unsuspend"} user: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    if (!confirm(`Are you sure you want to delete ${selectedUser.email}? This action cannot be undone.`)) {
      return
    }

    try {
      console.log("[v0] Deleting user:", selectedUser.uid)
      await apiClient.users.delete(selectedUser.uid)
      console.log("[v0] User deleted successfully")

      // Refresh users list
      await fetchUsers()

      // Close detail panel
      setSelectedUser(null)
    } catch (error) {
      console.error("[v0] Failed to delete user:", error)
      alert(`Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "vendor":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "investor":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const roleStats = {
    all: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    vendor: users.filter((u) => u.role === "vendor").length,
    investor: users.filter((u) => u.role === "investor").length,
    user: users.filter((u) => u.role === "user").length,
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedUser ? "mr-96" : ""}`}>
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { value: "all", label: "All Users", count: roleStats.all },
            { value: "admin", label: "Admins", count: roleStats.admin },
            { value: "vendor", label: "Vendors", count: roleStats.vendor },
            { value: "investor", label: "Investors", count: roleStats.investor },
            { value: "user", label: "Users", count: roleStats.user },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedRole(tab.value)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                selectedRole === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-1">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-hidden rounded-lg border bg-card">
          <ScrollArea className="h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/50">
                <tr className="border-b">
                  <th className="p-4 text-left text-sm font-medium">User</th>
                  <th className="p-4 text-left text-sm font-medium">Email</th>
                  <th className="p-4 text-left text-sm font-medium">Role</th>
                  <th className="p-4 text-left text-sm font-medium">Status</th>
                  <th className="p-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.uid} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{user.display_name || "No name"}</div>
                        <div className="text-xs text-muted-foreground">{user.uid}</div>
                      </td>
                      <td className="p-4 text-sm">{user.email}</td>
                      <td className="p-4">
                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="p-4">
                        {user.disabled ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedUser && (
        <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 border-l bg-background shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between border-b p-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">User Details</h2>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-b p-4">
            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuspendUser(!selectedUser.disabled)}
                  className="flex-1"
                >
                  {selectedUser.disabled ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Unsuspend
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Suspend
                    </>
                  )}
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" size="sm" onClick={handleEditUser} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="user">User</option>
                      <option value="vendor">Vendor</option>
                      <option value="investor">Investor</option>
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                      <option value="brand">Brand Owner</option>
                      <option value="affiliate">Affiliate</option>
                      <option value="wholesale">Wholesaler</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">User ID</h3>
                    <p className="break-all text-sm">{selectedUser.uid}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Display Name</h3>
                    <p className="text-sm">{selectedUser.display_name || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Role</h3>
                    <Badge className={getRoleBadgeColor(selectedUser.role)}>{selectedUser.role}</Badge>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground">Status</h3>
                    {selectedUser.disabled ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                  {selectedUser.created_at && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Created At</h3>
                      <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
