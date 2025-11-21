import Link from "next/link"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft } from "lucide-react"

export default function FAQPage() {
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

          <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about KasiKollekt, orders, and our services.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">General Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is KasiKollekt?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    KasiKollekt is a print-on-demand marketplace that connects local South African brands with
                    customers. We help brands sell their unique t-shirt designs while handling all printing,
                    fulfillment, and delivery logistics.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How does KasiKollekt work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Brands upload their designs to our platform, and we showcase them in our marketplace. When you place
                    an order, we print the design on a high-quality t-shirt, package it, and ship it directly to you.
                    Brands earn a commission on every sale.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What t-shirt colors are available?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Currently, we offer black and white t-shirts as our base products. Designs can be printed in any
                    color on these base colors, giving brands creative flexibility while maintaining quality and
                    consistency.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Are the designs original?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! All designs on KasiKollekt are created by local South African brands and artists. Each design
                    is reviewed and approved by our team to ensure originality and quality. When you buy from
                    KasiKollekt, you're supporting local creativity.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Orders & Payment</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-5">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as instant
                    EFT and other local payment methods through our secure payment partners.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How long does production take?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Production typically takes 2-3 business days after your order is placed. This includes printing,
                    quality checking, and packaging. Shipping time is additional and depends on your location.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Can I track my order?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! Once your order ships, you'll receive a tracking number via email. You can also track your
                    order status by logging into your account and viewing your order history.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Can I cancel or modify my order?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Orders can be cancelled within 2 hours of placement, before production begins. After production
                    starts, orders cannot be cancelled or modified. Please contact us immediately if you need to make
                    changes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Product Quality</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-9">
                  <AccordionTrigger>What printing method do you use?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We use Direct-to-Film (DTF) printing technology, which produces vibrant, durable prints that won't
                    crack or fade easily. This method ensures high-quality results for both simple and complex designs.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>What sizes are available?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We offer sizes from Small (S) to Extra Large (XL). Size charts are available on each product page to
                    help you find the perfect fit.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger>How do I care for my t-shirt?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    For best results, wash your t-shirt inside out in cold water and hang dry or tumble dry on low heat.
                    Avoid ironing directly on the print. Following these care instructions will help your design last
                    longer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">For Brands</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-12">
                  <AccordionTrigger>How can I become a brand partner?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Click on "Become a Brand Partner" in the header or footer to apply. You'll need to provide your
                    brand information, upload sample designs, and agree to our brand partnership terms. Our team reviews
                    all applications within 3-5 business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13">
                  <AccordionTrigger>What commission do brands earn?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Brands earn tiered commissions based on sales volume: 10% (Bronze), 15% (Silver), or 20% (Gold). The
                    more you sell, the higher your commission rate. Payouts are processed monthly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-14">
                  <AccordionTrigger>Do I need to handle inventory or shipping?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    No! KasiKollekt handles everything - printing, quality control, packaging, and shipping. You focus
                    on creating amazing designs, and we take care of the rest.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
