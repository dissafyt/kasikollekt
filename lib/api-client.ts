// Centralized API client for all backend endpoints
import { auth } from "./firebase-config"

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  const defaultUrl = "https://kasikollekt-api-947374471143.europe-west1.run.app"

  let url = envUrl || defaultUrl

  // Force HTTPS for any kasikollekt-api URLs (production)
  // Only allow HTTP for localhost (development)
  if (url.includes("kasikollekt-api") && url.startsWith("http://")) {
    console.warn("[v0] Upgrading API URL from HTTP to HTTPS")
    url = url.replace("http://", "https://")
  }

  return url
}

const API_BASE_URL = getApiBaseUrl()

console.log("[v0] API Base URL:", API_BASE_URL)

async function parseErrorResponse(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") || ""
  
  try {
    const text = await response.text()
    
    // If it's JSON, parse it
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text)
        return json.detail || json.error || json.message || text
      } catch {
        return text || `Request failed with status ${response.status}`
      }
    }
    
    // If it's HTML (error page), extract useful info
    if (contentType.includes("text/html")) {
      console.error("[v0] Received HTML error page instead of JSON:", text.substring(0, 200))
      return `API returned HTML error page (status ${response.status}). Check if the endpoint exists.`
    }
    
    return text || `Request failed with status ${response.status}`
  } catch {
    return `Request failed with status ${response.status}`
  }
}

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
  try {
    if (!auth) return null

    const user = auth.currentUser
    if (!user) return null
    return await user.getIdToken()
  } catch (error) {
    console.error("[v0] Error getting auth token:", error)
    return null
  }
}

// Helper that throws error if token is missing
async function requireAuthToken(): Promise<string> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Authentication required. Please log in again.")
  }
  return token
}

// Helper for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getAuthToken()
  const baseUrl = getApiBaseUrl() // Get URL on every request

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const fullUrl = `${baseUrl}${endpoint}`
  console.log("[v0] API Request:", fullUrl)

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorMessage = await parseErrorResponse(response)
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    const text = await response.text()
    console.error("[v0] Expected JSON but received:", contentType, text.substring(0, 200))
    throw new Error("API returned non-JSON response")
  }

  return response.json()
}

// ==================== AUTHENTICATION ====================

export const authAPI = {
  async login(email: string, password: string) {
    // Use Firebase client SDK to sign in
    const { signInWithEmailAndPassword } = await import("firebase/auth")
    if (!auth) throw new Error("Firebase auth not initialized")

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()
    return { user: userCredential.user, token: idToken }
  },

  async logout() {
    const { signOut } = await import("firebase/auth")
    if (auth) {
      await signOut(auth)
    }
    await apiRequest("/admin/admin_auth/logout", { method: "POST" })
  },

  async verifyToken() {
    return apiRequest("/admin/admin_auth/verify", { method: "POST" })
  },

  async getCurrentUser() {
    return auth?.currentUser || null
  },
}

// ==================== APPLICATIONS ====================

export const applicationsAPI = {
  async list(type?: string, status?: string) {
    const token = await requireAuthToken()
    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (status) params.append("status", status)
    const queryString = params.toString()
    const endpoint = queryString ? `/api/admin/applications?${queryString}` : `/api/admin/applications`
    
    console.log("[v0] Calling applications list endpoint:", endpoint)
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("[v0] Applications API response status:", response.status)

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      console.error("[v0] Failed to fetch applications:", errorMessage)
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Expected JSON but got:", contentType, text.substring(0, 200))
      throw new Error("API returned non-JSON response")
    }

    const data = await response.json()
    console.log("[v0] Applications fetched successfully:", Array.isArray(data) ? data.length : 'non-array response')
    return data
  },

  async approve(applicationId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/applications/${applicationId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async reject(applicationId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/applications/${applicationId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async submitBrand(data: any) {
    const response = await fetch("/api/admin/applications/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async submitInvestor(data: any) {
    const response = await fetch("/api/admin/applications/investor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async submitWholesale(data: any) {
    const response = await fetch("/api/admin/applications/wholesale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async submitAffiliate(data: any) {
    const response = await fetch("/api/admin/applications/affiliate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async submitPartner(data: any) {
    const response = await fetch("/api/admin/applications/partner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== CATEGORIES ====================

export const categoriesAPI = {
  async listPublic() {
    const response = await fetch("/api/admin/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async list() {
    const token = await requireAuthToken()
    const response = await fetch("/api/admin/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async create(data: { name: string; description?: string; subcategories?: any[] }) {
    const token = await requireAuthToken()
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async update(categoryId: string, data: { name?: string; description?: string; subcategories?: any[] }) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async delete(categoryId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async addSubcategory(categoryId: string, data: { name: string; description?: string }) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/categories/${categoryId}/subcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async removeSubcategory(categoryId: string, subcategoryName: string) {
    const token = await requireAuthToken()
    const response = await fetch(
      `/api/admin/categories/${categoryId}/subcategories/${encodeURIComponent(subcategoryName)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async getSubcategories(categoryId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/categories/${categoryId}/subcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== PRODUCTS ====================

export const productsAPI = {
  async list(status?: string) {
    try {
      const token = await getAuthToken()
      const params = status ? `?status=${status}` : ""
      const response = await fetch(`/api/admin/products${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response)
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      throw error
    }
  },

  async listPending() {
    return this.list("pending")
  },

  async create(data: any) {
    const token = await requireAuthToken()
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async update(productId: string, data: any) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async delete(productId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async approve(productId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/products/${productId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async suspend(productId: string) {
    return this.update(productId, { status: "suspended" })
  },

  async reject(productId: string) {
    return this.update(productId, { status: "rejected" })
  },

  async requestFixes(productId: string) {
    return this.update(productId, { status: "fixes_required" })
  },

  async assign(productId: string, userId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/products/${productId}/assign?user_id=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async listByUser(userId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/products/by-user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== USERS ====================

export const usersAPI = {
  async list(role?: string) {
    try {
      const token = await requireAuthToken()
      const params = role ? `?role=${role}` : ""
      console.log("[v0] Fetching users with role:", role || "all")
      
      const response = await fetch(`/api/admin/users${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("[v0] Users API response status:", response.status)

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response)
        console.error("[v0] Failed to fetch users:", errorMessage)
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Expected JSON but got:", contentType, text.substring(0, 200))
        throw new Error("API returned non-JSON response. Check if the endpoint exists.")
      }

      const data = await response.json()
      console.log("[v0] Users fetched successfully:", data.length || 0, "users")
      return data
    } catch (error) {
      console.error("[v0] Error in usersAPI.list:", error)
      throw error
    }
  },

  async get(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/admin/users/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async create(data: {
    email: string
    password: string
    display_name?: string
    role?: string
  }) {
    const token = await requireAuthToken()
    const response = await fetch("/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async update(
    uid: string,
    data: {
      email?: string
      display_name?: string
      role?: string
      disabled?: boolean
    },
  ) {
    const token = await requireAuthToken()
    const response = await fetch(`/admin/users/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async delete(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/admin/users/${uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async suspend(uid: string, disable: boolean) {
    const token = await requireAuthToken()
    const response = await fetch(`/admin/users/${uid}/suspend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ disable }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== VENDORS ====================

export const vendorsAPI = {
  async list(status?: string) {
    const token = await requireAuthToken()
    const params = status ? `?status=${status}` : ""
    const response = await fetch(`/api/admin/vendors${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async get(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/vendors/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async create(data: {
    email: string
    password: string
    display_name: string
    status?: string
  }) {
    const token = await requireAuthToken()
    const response = await fetch("/api/admin/vendors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async update(
    uid: string,
    data: {
      email?: string
      display_name?: string
      status?: string
    },
  ) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/vendors/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async delete(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/vendors/${uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async approve(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/vendors/${uid}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async reject(uid: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/admin/vendors/${uid}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== PAYMENTS ====================

export const paymentsAPI = {
  async list(status?: string) {
    const token = await requireAuthToken()
    const params = status ? `?status=${status}` : ""
    const response = await fetch(`/api/admin/payments${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async getPayment(paymentId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/api/user/payments/${paymentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async webhook(data: any) {
    const response = await fetch("/api/user/payments/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== ROLES ====================

export const rolesAPI = {
  async updateRole(uid: string, role: string) {
    const token = await requireAuthToken()
    const response = await fetch("/admin/roles/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, role }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== HEALTH ====================

export const healthAPI = {
  async check() {
    const token = await getAuthToken()
    const response = await fetch("/api/admin/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Health check failed" }))
      throw new Error(error.error || `Health check failed: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== CUSTOMER CART ====================

export const cartAPI = {
  async get() {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async add(item: { product_id: string; quantity: number; title?: string; price?: number }) {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async remove(productId: string) {
    const token = await requireAuthToken()
    const response = await fetch("/user/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async submit() {
    const token = await requireAuthToken()
    const response = await fetch("/user/cart/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async convert() {
    const token = await requireAuthToken()
    const response = await fetch("/user/cart/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== CUSTOMER CHECKOUT ====================

export const checkoutAPI = {
  async process(data?: any) {
    const token = await requireAuthToken()
    const response = await fetch("/user/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data || {}),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== CUSTOMER ORDERS ====================

export const ordersAPI = {
  async list() {
    const token = await requireAuthToken()
    const response = await fetch("/user/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async get(orderId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/user/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },

  async uploadProof(orderId: string, file: File) {
    const token = await requireAuthToken()
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`/user/orders/${orderId}/upload-pop`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(error.error || `Upload Error: ${response.status}`)
    }

    return response.json()
  },

  async cancel(orderId: string) {
    const token = await requireAuthToken()
    const response = await fetch(`/user/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== CUSTOMER PROFILE ====================

export const profileAPI = {
  async get() {
    const token = await requireAuthToken()
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async update(data: any) {
    const token = await requireAuthToken()
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== CUSTOMER ONBOARDING ====================

export const onboardingAPI = {
  async getStatus() {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/onboarding", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },

  async completeOnboarding(data: any) {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/onboarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorMessage = await parseErrorResponse(response)
      throw new Error(errorMessage)
    }

    return response.json()
  },
}

// ==================== CUSTOMER AUTH ====================

export const customerAuthAPI = {
  async signup(idToken: string) {
    const response = await fetch("/api/user/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Signup failed" }))
      throw new Error(error.detail || `Signup Error: ${response.status}`)
    }

    return response.json()
  },

  async verify() {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Verification failed" }))
      throw new Error(error.detail || `Verification Error: ${response.status}`)
    }

    return response.json()
  },

  async me() {
    const token = await requireAuthToken()
    const response = await fetch("/api/user/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      throw new Error(error.detail || `API Error: ${response.status}`)
    }

    return response.json()
  },
}

// ==================== API CLIENT ====================

export const apiClient = {
  auth: authAPI,
  customerAuth: customerAuthAPI,
  applications: applicationsAPI,
  categories: categoriesAPI,
  products: productsAPI,
  users: usersAPI,
  vendors: vendorsAPI,
  payments: paymentsAPI,
  roles: rolesAPI,
  health: healthAPI,
  cart: cartAPI,
  checkout: checkoutAPI,
  orders: ordersAPI,
  profile: profileAPI,
  onboarding: onboardingAPI,
  // Convenience methods for public form submissions
  submitBrand: applicationsAPI.submitBrand,
  submitInvestor: applicationsAPI.submitInvestor,
  submitWholesale: applicationsAPI.submitWholesale,
  submitAffiliate: applicationsAPI.submitAffiliate,
  submitPartner: applicationsAPI.submitPartner,
}

// Default export for convenience
export default apiClient
