import Link from "next/link"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, RefreshCw, Truck } from "lucide-react"

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen">
      <MarketplaceHeader />

      <main className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-4xl font-bold tracking-tight mb-4">Shipping & Returns</h1>
          <p className="text-muted-foreground mb-8">
            Everything you need to know about delivery and our return policy.
          </p>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Shipping Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Delivery Areas</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We currently deliver to all major cities and towns across South Africa. Delivery times may vary
                    depending on your location.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Shipping Costs</h3>
                  <div className="rounded-lg border bg-muted/30 p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Standard Delivery (5-7 business days)</span>
                      <span className="text-primary font-semibold">R60</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Express Delivery (2-3 business days)</span>
                      <span className="text-primary font-semibold">R120</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Free Shipping</span>
                      <span className="text-primary font-semibold">Orders over R500</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Processing Time</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    All orders are made-to-order. Production typically takes 2-3 business days, which includes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Printing your design on a high-quality t-shirt</li>
                    <li>Quality control inspection</li>
                    <li>Professional packaging</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Shipping time is additional and depends on your selected delivery method and location.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Order Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Once your order ships, you'll receive a tracking number via email and SMS. You can track your
                    package in real-time through our courier partner's website or by logging into your KasiKollekt
                    account.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Returns & Exchanges</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We want you to love your KasiKollekt purchase! If you're not completely satisfied, you can return
                    your item within 14 days of delivery for a refund or exchange.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    To be eligible for a return, items must be unworn, unwashed, and in their original condition with
                    all tags attached.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Defective or Damaged Items</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you receive a defective or damaged item, please contact us within 48 hours of delivery with
                    photos of the issue. We'll arrange for a replacement or full refund at no cost to you.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Quality is our priority. All items go through rigorous quality control, but if something slips
                    through, we'll make it right immediately.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">How to Return an Item</h3>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                    <li>Log into your account and go to your order history</li>
                    <li>Select the order and click "Request Return"</li>
                    <li>Choose your reason for return and upload photos if applicable</li>
                    <li>Our team will review your request within 24 hours</li>
                    <li>Once approved, you'll receive return shipping instructions</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Refund Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Refunds are processed within 5-7 business days after we receive your returned item. The refund will
                    be issued to your original payment method. Please note that shipping costs are non-refundable unless
                    the return is due to our error or a defective product.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Exchanges</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    If you need a different size or have received the wrong item, we'll expedite an exchange at no
                    additional cost. Contact us as soon as possible, and we'll arrange for the correct item to be sent
                    to you.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Packaging</h2>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  All KasiKollekt orders are carefully packaged to ensure your t-shirt arrives in perfect condition.
                  Each item is individually folded, wrapped in tissue paper, and placed in a branded mailer bag.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We're committed to sustainability and use eco-friendly packaging materials wherever possible.
                </p>
              </div>
            </section>

            <section className="rounded-lg border bg-muted/30 p-6">
              <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about shipping or returns that aren't answered here, our support team is ready to
                help.
              </p>
              <p className="text-muted-foreground">
                Email us at <span className="text-primary font-medium">support@kasikollekt.com</span> or check our FAQ
                page for more information.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
