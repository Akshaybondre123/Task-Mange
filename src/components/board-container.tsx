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

interface Task {
  id: string
  title: string


  description: string
  status: "backlog" | "todo" | "inProgress" | "review" | "done"
  priority: "Low" | "Medium" | "High"


  dueDate: string
  assignee: string
}

type ColumnType = {
  title: string
  items: Task[]
  isDroppable: boolean
}

type Columns = {
  [key: string]: ColumnType
}

const INITIAL_COLUMNS: Columns = {
  backlog: { title: "Backlog", items: [], isDroppable: false },
  todo: { title: "Todo", items: [], isDroppable: true },
  inProgress: { title: "In Progress", items: [], isDroppable: true },


  review: { title: "Review", items: [], isDroppable: false },
  done: { title: "Done", items: [], isDroppable: true },
}


const ASSIGNEES = ["Ann", "Leslie", "Shane", "Victoria", "Philip", "Darren"]

export function BoardContainer() {
  const [columns, setColumns] = useLocalStorage("kanban-columns", INITIAL_COLUMNS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)


  const [sortBy, setSortBy] = useState<"priority" | "dueDate" | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await fetch("https://dummyjson.com/todos?limit=15")
      const data = await res.json()
      return data.todos
    },
  })

  useEffect(() => {
    if (tasks && Object.values(columns).every((col) => col.items.length === 0)) {
      const formattedTasks = tasks.map((task: { id: number; todo: string }) => ({
        id: `DS-${String(task.id).padStart(3, "0")}`,
        title: task.todo,


        description: "",
        status: "todo",


        priority: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        assignee: ASSIGNEES[Math.floor(Math.random() * ASSIGNEES.length)],
      }))

      
      const distributedColumns = { ...INITIAL_COLUMNS }
formattedTasks.forEach((task: Task, index: number) => {
  let targetColumn: Task["status"];
  
  if (index < 3) targetColumn = "backlog";


  else if (index < 6) targetColumn = "todo";

  else if (index < 9) targetColumn = "inProgress";

  else if (index < 12) targetColumn = "review";
  else targetColumn = "done";


  task.status = targetColumn;
  distributedColumns[targetColumn].items.push(task);
});

setColumns(distributedColumns);
    }
  }, [tasks, setColumns, columns])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

   
    if (!columns[source.droppableId].isDroppable || !columns[destination.droppableId].isDroppable) {
      return
    }

    const sourceColumn = columns[source.droppableId]

    const destColumn = columns[destination.droppableId]

    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)

   
    const updatedTask = {

      ...removed,
      status: destination.droppableId as Task["status"],
    }

    if (source.droppableId === destination.droppableId) {

      sourceItems.splice(destination.index, 0, updatedTask)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      })
    } 
    
    else {

      destItems.splice(destination.index, 0, updatedTask)
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

  const handleUpdateTask = (updatedTask: Partial<Task> & { id: string }) => {

    setColumns((prev) => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach((columnId) => {



        newColumns[columnId].items = newColumns[columnId].items.map((task) =>

          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      });

      return newColumns;
    });
    setSelectedTask((prev) => (prev && prev.id === updatedTask.id ? { ...prev, ...updatedTask } : prev));

  };
  
  

  const handleDeleteTask = (taskId: string) => {


    setColumns((prev) => {

      const newColumns = { ...prev }
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].items = newColumns[columnId].items.filter((task) => task.id !== taskId)
      })
      return newColumns
    })
  }

  const handleCreateTask = (task: Task) => {
    setColumns((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, { ...task, status: "todo" }],
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
        <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
          <Column
          key={columnId}
          id={columnId}
          title={column.title}
          tasks={getSortedAndFilteredTasks(column.items)}
          onTaskClick={(task) => setSelectedTask({ ...task, description: task.description || "No description available" })} 

          onDeleteTask={handleDeleteTask}
          isDroppable={column.isDroppable}
        />
        
          
          ))}
        </div>
      </DragDropContext>
      <TaskModal
  task={selectedTask}  
  open={!!selectedTask}
  onOpenChange={(open) => !open && setSelectedTask(null)}
  onUpdate={(updatedTask) => handleUpdateTask(updatedTask)} 
/>




      <CreateTaskDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onCreateTask={handleCreateTask} />
</div>
)
}