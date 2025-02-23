"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List } from "lucide-react"
import { useEffect } from "react"

interface Task {

  id: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  dueDate: string
}

interface TaskModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updatedTask: Task) => void
}

export function TaskModal({ task, open, onOpenChange, onUpdate }: TaskModalProps) {

  const editor = useEditor({

    extensions: [StarterKit],
    content: task?.description || "",
    onUpdate: ({ editor }) => {
      handleChange("description", editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && task) {

      editor.commands.setContent(task.description || "")
    }
  }, [task, editor])

  const handleChange = (field: keyof Task, value: string | Date) => {

    if (!task) return
    onUpdate({ ...task, [field]: value })
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>{task.id}</DialogTitle>

        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">

            <Label htmlFor="title">Title</Label>

            <Input id="title" value={task.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>
          <div className="grid gap-2">

            <Label>Description</Label>
            <div className="border rounded-md p-2">
              <div className="border-b p-2 flex gap-2">
                <Button
                  variant="ghost"

                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={editor?.isActive("bold") ? "bg-muted" : ""}
                >

                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}

                  className={editor?.isActive("italic") ? "bg-muted" : ""}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}

                  className={editor?.isActive("bulletList") ? "bg-muted" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none p-2" />
            </div>



          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={task.priority} onValueChange={(value) => handleChange("priority", value)}>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
