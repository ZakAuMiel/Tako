// src/components/kanban/TaskCard.tsx
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


export type Task = {
  id: string
  title: string
  description: string
  tags: string[]
}

export type TaskCardProps = {
  task: Task
  onClick?: () => void
}



export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [hovered, setHovered] = useState(false)

  const {
  setNodeRef,
  attributes,
  listeners,
  transform,
  transition
} = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

  return (
    <Card
  ref={setNodeRef}
  {...attributes}
  {...listeners}
  onClick={onClick}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={style}
  className={cn(
    "p-3 text-sm font-medium cursor-pointer bg-card hover:bg-muted transition-shadow",
    hovered && "shadow-lg"
  )}
>
  <div className="flex flex-col gap-1">
    <span className="font-medium truncate">{task.title}</span>

    {/* Affichage des tags */}
    {task.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {task.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
</Card>
  )
}