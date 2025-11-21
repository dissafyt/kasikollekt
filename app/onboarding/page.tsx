"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    gender: "",
    dob: "",
    preferences: [] as string[],
  })

  const categoryPreferences = [
    "Streetwear",
    "Sports & Fitness",
    "Music & Entertainment",
    "Art & Design",
    "Fashion",
    "Sustainability",
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      setError("Please sign in to complete onboarding")
      return
    }

    setLoading(true)
    setError("")

    try {
      await apiClient.onboarding.complete(formData)

      // Success - redirect to homepage
      router.push("/")
    } catch (err: any) {
      console.error("Onboarding error:", err)
      setError(err.message || "Failed to complete onboarding. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handlePreferenceToggle(preference: string) {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter((p) => p !== preference)
        : [...prev.preferences, preference],
    }))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading your profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to complete your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to KasiKollekt!</h1>
          <p className="mt-2 text-lg text-muted-foreground">Let's set up your profile</p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          <div className={`h-2 w-20 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`h-2 w-20 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === 1 ? "Personal Information" : "Your Preferences"}</CardTitle>
            <CardDescription>
              {step === 1 ? "Tell us a bit about yourself" : "Help us personalize your experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="+27 XX XXX XXXX"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main Street, City, Province"
                      required
                      disabled={loading}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        required
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setStep(2)}
                    disabled={
                      !formData.full_name ||
                      !formData.phone_number ||
                      !formData.address ||
                      !formData.gender ||
                      !formData.dob
                    }
                  >
                    Continue
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <Label>What are you interested in? (Select all that apply)</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {categoryPreferences.map((preference) => (
                        <div key={preference} className="flex items-center space-x-2">
                          <Checkbox
                            id={preference}
                            checked={formData.preferences.includes(preference)}
                            onCheckedChange={() => handlePreferenceToggle(preference)}
                            disabled={loading}
                          />
                          <label
                            htmlFor={preference}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {preference}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      disabled={loading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Complete Setup
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By completing onboarding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
