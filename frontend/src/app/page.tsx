import { getDashboardStats } from "@/lib/api";
import { Activity, Users, Package, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { stats, recentOrders } = await getDashboardStats();

  return (
    <div className="flex flex-1 flex-col gap-4">
      
      {/* 3er Grid für Top Stats */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        
        {/* Wir entfernen 'bg-sidebar' und nutzen Standard 'Card' - das nimmt automatisch bg-card aus globals.css */}
        <Card> 
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Production</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.inProduction}</div>
            <p className="text-xs text-muted-foreground">Active jobs running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-400">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">Waiting for approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Total customer base</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your production line.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent orders.</p>
            ) : (
                recentOrders.map((order: any) => (
                    // Hier bg-muted/30 statt bg-background, damit die Zeilen subtil sichtbar sind
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border">
                                <Package className="h-5 w-5 text-foreground" />
                            </div>
                            <div>
                                <div className="font-semibold">{order.customer_name}</div>
                                <div className="text-xs text-muted-foreground">#{order.id.slice(0,8)}</div>
                            </div>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    let colorClass = "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    if (status === "production") colorClass = "text-orange-500 bg-orange-500/10 border-orange-500/20";
    if (status === "done") colorClass = "text-green-500 bg-green-500/10 border-green-500/20";
    if (status === "confirmed") colorClass = "text-blue-500 bg-blue-500/10 border-blue-500/20";
  
    return (
      <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase border ${colorClass}`}>
        {status}
      </div>
    );
}