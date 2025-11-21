import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

import { Lato as V0_Font_Lato, Roboto_Mono as V0_Font_Roboto_Mono, Roboto_Slab as V0_Font_Roboto_Slab } from 'next/font/google'

// Initialize fonts
const _lato = V0_Font_Lato({ subsets: ['latin'], weight: ["100","300","400","700","900"], variable: '--v0-font-lato' })
const _robotoMono = V0_Font_Roboto_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700"], variable: '--v0-font-roboto-mono' })
const _robotoSlab = V0_Font_Roboto_Slab({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"], variable: '--v0-font-roboto-slab' })
const _v0_fontVariables = `${_lato.variable} ${_robotoMono.variable} ${_robotoSlab.variable}`

export const metadata: Metadata = {
  title: "KasiKollekt - Local Brands, Fresh Designs",
  description:
    "Discover unique t-shirt designs from local South African brands. Print-on-demand streetwear that celebrates Kasi culture.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable} ${_v0_fontVariables}`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
