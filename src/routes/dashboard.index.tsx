import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome back to your homie dashboard.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">Stat {i}</h3>
            <p className="text-2xl font-bold mt-2">$24,500</p>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-8 h-[300px] flex items-center justify-center text-muted-foreground">
         [ Chart Placeholder Area ]
      </div>
    </div>
  )
}
