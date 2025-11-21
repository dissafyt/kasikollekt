export const dynamic = "force-dynamic"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Platform configuration and preferences</p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">This is the Settings Page</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Platform settings and admin preferences will be displayed here
        </p>
      </div>
    </div>
  )
}
