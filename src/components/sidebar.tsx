import { LayoutGrid, BarChart2, Users, Folder, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [{ icon: LayoutGrid, isActive: true }, { icon: BarChart2 }, { icon: Users }, { icon: Folder }]

export function Sidebar() {
  return (
    <div className="w-16 border-r bg-background flex flex-col items-center py-4 gap-4">
      <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">*</div>
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted",
              item.isActive && "bg-muted text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </div>
      <div className="mt-auto">
        <button className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted">
          <Settings className="h-5 w-5" />
        </button>
      </div>
</div>
)
}