"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, X } from "lucide-react"
import type { Product } from "@/lib/example-data"

interface ProductCustomizerProps {
  product: Product
}

export function ProductCustomizer({ product }: ProductCustomizerProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState("M")
  const [customDesign, setCustomDesign] = useState<File | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCustomDesign(file)
    }
  }

  const removeCustomDesign = () => {
    setCustomDesign(null)
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div className="space-y-3">
        <Label className="text-base">Color</Label>
        <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <div key={color} className="flex items-center">
                <RadioGroupItem value={color} id={`color-${color}`} className="sr-only" />
                <Label
                  htmlFor={`color-${color}`}
                  className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full ${
                      color === "black" ? "bg-black" : "bg-white border border-muted"
                    }`}
                  />
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <Label className="text-base">Size</Label>
        <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <div key={size}>
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={`flex h-10 min-w-[3rem] cursor-pointer items-center justify-center rounded-md border-2 px-4 text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Custom Design Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Custom Design (Optional)</Label>
          <Badge variant="secondary">Upload your own</Badge>
        </div>
        {!customDesign ? (
          <div className="relative">
            <Input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" id="design-upload" />
            <Label
              htmlFor="design-upload"
              className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary hover:bg-muted"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload your design</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, SVG (Max 5MB)</span>
            </Label>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{customDesign.name}</p>
              <p className="text-xs text-muted-foreground">{(customDesign.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button variant="ghost" size="sm" onClick={removeCustomDesign} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Upload your own design to be printed on this t-shirt. Our team will review it before printing.
        </p>
      </div>

      {/* Quantity Selection */}
      <div className="space-y-3">
        <Label className="text-base">Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            disabled={quantity >= 99}
          >
            +
          </Button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">R{product.price * quantity}</span>
        </div>
        {customDesign && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Custom Design</span>
            <Badge variant="secondary">Free</Badge>
          </div>
        )}
      </div>
    </div>
  )
}
