export const dynamic = "force-dynamic"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Monitor and manage all platform orders</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">This is the Orders Page</p>
        <p className="mt-2 text-sm text-muted-foreground">Order monitoring and management will be displayed here</p>
      </div>
    </div>
  )
}
