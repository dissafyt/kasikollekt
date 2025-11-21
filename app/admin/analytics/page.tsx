export const dynamic = "force-dynamic"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform performance and insights</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">This is the Analytics Page</p>
        <p className="mt-2 text-sm text-muted-foreground">Charts, metrics, and reports will be displayed here</p>
      </div>
    </div>
  )
}
