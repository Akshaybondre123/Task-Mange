"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string

  title: string
  description: string
  status: "todo" | "inProgress" | "review" | "done"
  
  priority: "Low" | "Medium" | "High"

  dueDate: string
  assignee: string
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  onCreateTask: (task: Task) => void
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) {

  const [task, setTask] = useState<Task>({
    id: `DS-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,

    title: "",

    description: "",
    status: "todo",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],

    assignee: "User",
  })

  const handleChange = <K extends keyof Task>(field: K, value: Task[K]) => {

    setTask((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {

    if (task.title.trim()) {


      onCreateTask(task)
      setTask({
        id: `DS-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,

        title: "",
        description: "",
        status: "todo",

        priority: "Medium",
        dueDate: new Date().toISOString().split("T")[0],

        assignee: "User",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-2xl">
        <DialogHeader>


          <DialogTitle>Create New Task</DialogTitle>



        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>

            
            <Input
              id="title"
              value={task.title}
              onChange={(e) => handleChange("title", e.target.value)}


              placeholder="Enter task title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">


            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={task.priority} onValueChange={(value) => handleChange("priority", value as Task["priority"])}>



                <SelectTrigger id="priority">
                  <SelectValue />

                </SelectTrigger>
                <SelectContent>



                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>


                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>



            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
      
                type="date"
                value={task.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            </div>
          </div>


          <Button onClick={handleSubmit}>Create Task</Button>


        </div>
      </DialogContent>
    </Dialog>
  )
}
