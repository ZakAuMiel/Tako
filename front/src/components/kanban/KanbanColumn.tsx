import { Button } from "@/components/ui/button"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MoreHorizontal } from "lucide-react"
import TaskCard, { Task } from "./TaskCard"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface ColumnProps {
  id: string
  name: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onRename: () => void
  onDelete: () => void
}

export default function KanbanColumn({
  id,
  name,
  tasks,
  onTaskClick,
  onRename,
  onDelete,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: "column",
      columnId: id,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className="min-w-[280px] w-[280px] flex flex-col gap-3 rounded-md bg-muted/40 border border-border p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold truncate">{name}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>Renommer</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Task list */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onExpand={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
