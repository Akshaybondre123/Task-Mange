"use client"

import { Bell, Filter, Search, User2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
    
  return (

    <header className="border-b">

      <div className="flex h-16 items-center px-4 gap-4">

        <div className="font-semibold text-2xl">Design Sprint</div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative w-96">

            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-8 bg-muted/50" />

          </div>
          <Button variant="ghost" size="icon">

            <Filter className="h-4 w-4" />

          </Button>
          <Button variant="ghost" size="icon" className="relative">

            <Bell className="h-4 w-4" />

            <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />

          </Button>

          <Avatar>

            <AvatarFallback>

              <User2 className="h-4 w-4" />

            </AvatarFallback>

          </Avatar>

        </div>
      </div>
</header>
)
}