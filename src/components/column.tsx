import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface Task {
  id: string;
  title: string;
  status: "backlog" | "todo" | "inProgress" | "review" | "done";
  priority: "Low" | "Medium" | "High"; 
  dueDate: string;
  description: string;
  assignee: string;

}

interface ColumnProps {
  id: string;


  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  isDroppable: boolean;
  onAddTask?: () => void; 
}

export function Column({ id, title, tasks, onTaskClick, onDeleteTask, isDroppable, onAddTask }: ColumnProps) {


  return (
    <div className="flex flex-col gap-4">
     
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <h2 className="font-medium text-sm">{title}</h2>

          <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs">{tasks.length}</span>
        </div>
      
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddTask}>

          <Plus className="h-4 w-4" />
        </Button>
      </div>

     
      <Droppable droppableId={id} isDropDisabled={!isDroppable}>
        {(provided, snapshot) => (

          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 min-h-[calc(100vh-200px)] p-2 rounded-lg transition-colors ${

              snapshot.isDraggingOver ? "bg-muted/50" : "bg-transparent"
            }`}
          >
         
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                index={index}
                task={task}
                onClick={() => onTaskClick(task)}

                onDelete={() => onDeleteTask(task.id)}
                
                isDraggable={isDroppable}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
