"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BoardContainer } from "./board-container"

export function MainContent() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4">
        <div className="relative w-[400px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8 bg-muted/50" />
        </div>
        <h1 className="text-2xl font-semibold">Design Sprint</h1>
      </div>
      <BoardContainer />
</div>
)
}