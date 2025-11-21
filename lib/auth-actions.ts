"use server"

import { cookies } from "next/headers"

export async function createSession(idToken: string) {
  try {
    const cookieStore = await cookies()
    cookieStore.set("session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    })
    return { success: true }
  } catch (error) {
    console.error("Session creation error:", error)
    return { success: false, error: "Failed to create session" }
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    return { success: true }
  } catch (error) {
    console.error("Session deletion error:", error)
    return { success: false, error: "Failed to delete session" }
  }
}
