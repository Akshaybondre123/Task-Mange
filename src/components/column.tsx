import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignee: string;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Column({ id, title, tasks, onTaskClick, onDeleteTask }: ColumnProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-md shadow-md min-h-[300px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">{title}</h2>
          <span className="rounded-full bg-gray-300 px-2 py-0.5 text-xs">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 min-h-[200px]">
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                index={index} 
                task={task} 
                onClick={() => onTaskClick(task)} 
                onDelete={() => onDeleteTask(task.id)} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
