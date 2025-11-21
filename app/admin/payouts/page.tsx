export const dynamic = "force-dynamic"

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground">Process brand commission payouts</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">This is the Payouts Page</p>
        <p className="mt-2 text-sm text-muted-foreground">Payout processing and history will be displayed here</p>
      </div>
    </div>
  )
}
