"use client"
import { useEffect, useState } from "react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { Column } from "./column"
import { TaskModal } from "./task-modal"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpDown, Filter } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateTaskDialog } from "./create-task-dialog"

type Task = {
  id: string
  title: string
  description: string
  status: string
  priority: "Low" | "Medium" | "High"
  dueDate: string
  assignee: string
}

type ColumnType = {
  title: string
  items: Task[]
}

type Columns = {
  [key: string]: ColumnType
}

const INITIAL_COLUMNS: Columns = {
  backlog: { title: "Backlog", items: [] },
  todo: { title: "Todo", items: [] },
  inProgress: { title: "In Progress", items: [] },
  review: { title: "Review", items: [] },
  done: { title: "Done", items: [] },
}

export function BoardContainer() {
  const [columns, setColumns] = useLocalStorage("kanban-columns", INITIAL_COLUMNS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos?limit=10")
      const data = await res.json()
      return data.todos
    },
  })

  useEffect(() => {
    if (tasks && columns.todo.items.length === 0) {
      const formattedTasks = tasks.map((task: { id: number; todo: string }) => ({
        id: `DS-${String(task.id).padStart(3, "0")}`,
        title: task.todo,
        description: "",
        status: "todo",
        priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        assignee: "User",
      }))

      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: formattedTasks,
        },
      }))
    }
  }, [tasks, columns.todo.items.length, setColumns])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const allowedColumns = ["todo", "inProgress", "done"]
    if (!allowedColumns.includes(source.droppableId) || !allowedColumns.includes(destination.droppableId)) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]

    const [removed] = sourceItems.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      })
    } else {
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    }
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setColumns((prev) => {
      const newColumns = { ...prev }
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].items = newColumns[columnId].items.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      })
      return newColumns
    })
    setSelectedTask(updatedTask)
  }

  const handleDeleteTask = (taskId: string) => {
    setColumns((prev) => {
      const newColumns = Object.keys(prev).reduce((acc, columnId) => {
        acc[columnId] = {
          ...prev[columnId],
          items: prev[columnId].items.filter((task) => task.id !== taskId),
        }
        return acc
      }, {} as Columns)

      return { ...newColumns }
    })
  }

  const handleCreateTask = (task: Task) => {
    setColumns((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, task],
      },
    }))
    setIsCreateModalOpen(false)
  }

  const getSortedAndFilteredTasks = (tasks: Task[]) => {
    const filteredTasks = filterPriority ? tasks.filter((task) => task.priority === filterPriority) : tasks

    if (sortBy === "priority") {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 }
      return [...filteredTasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    if (sortBy === "dueDate") {
      return [...filteredTasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    }

    return filteredTasks
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("priority")}>By Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("dueDate")}>By Due Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPriority("High")}>High Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Medium")}>Medium Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("Low")}>Low Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority(null)}>Clear Filter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              id={columnId}
              title={column.title}
              tasks={getSortedAndFilteredTasks(column.items)}
              onTaskClick={setSelectedTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onUpdate={handleUpdateTask}
      />

      <CreateTaskDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onCreateTask={handleCreateTask} />
    </div>
  )
}
