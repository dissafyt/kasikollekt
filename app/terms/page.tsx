import Link from "next/link"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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

          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using KasiKollekt ("the Platform"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to these Terms & Conditions, please do not use our
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use of Platform</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                KasiKollekt provides a marketplace platform connecting local brands with customers for print-on-demand
                t-shirt products. You agree to use the Platform only for lawful purposes and in accordance with these
                Terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You must not use the Platform in any way that causes, or may cause, damage to the Platform or impairment
                of the availability or accessibility of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features of the Platform, you may be required to register for an account. You agree to
                provide accurate, current, and complete information during the registration process.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Product Orders & Payments</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All orders placed through the Platform are subject to acceptance and availability. Prices are displayed
                in South African Rand (ZAR) and include applicable taxes unless otherwise stated.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Payment must be made at the time of order placement. We accept various payment methods as displayed
                during checkout. All transactions are processed securely through our payment partners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All designs, logos, and content displayed on the Platform are the property of their respective brand
                owners and are protected by copyright and trademark laws.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You may not reproduce, distribute, or create derivative works from any content on the Platform without
                express written permission from the brand owner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Brand Partner Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Brands partnering with KasiKollekt agree to provide original designs and warrant that they have all
                necessary rights to the designs submitted.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Commission rates and payout terms are outlined in separate Brand Partnership Agreements. Brands are
                responsible for ensuring their designs comply with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                KasiKollekt shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of or inability to use the Platform or any products purchased through
                the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective
                immediately upon posting to the Platform. Your continued use of the Platform after changes are posted
                constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms & Conditions are governed by and construed in accordance with the laws of South Africa. Any
                disputes arising from these terms shall be subject to the exclusive jurisdiction of the South African
                courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at legal@kasikollekt.com
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
