import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Task {
  id: string;
  title: string;
  status: "backlog" | "todo" | "inProgress" | "review" | "done";
  priority: "Low" | "Medium" | "High"; // Fixed type case
  dueDate: string;
  assignee: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
  onDelete: (id: string) => void;
  isDraggable: boolean;
}

const priorityColors = {
  Low: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  High: "text-red-500 bg-red-500/10",
};

export function TaskCard({ task, index, onClick, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group relative rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">{task.id}</span>
              <Badge variant="secondary" className={cn("font-medium", priorityColors[task.priority])}>
                {task.priority}
              </Badge>
            </div>
            <h3 className="font-medium leading-none cursor-pointer" onClick={onClick}>
              {task.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">{task.assignee.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(task.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </Draggable>
  );
}
