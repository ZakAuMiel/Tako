// src/components/kanban/TaskCard.tsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { CornerUpRight, Hand } from "lucide-react"

export type Task = {
  id: string
  title: string
  description: string
  tags: string[]
}

type TaskCardProps = {
  task: Task
  onExpand: () => void
}

export default function TaskCard({ task, onExpand }: TaskCardProps) {
  const [hovered, setHovered] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: { type: "task", task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "p-3 text-sm font-medium bg-card transition-transform duration-150 ease-in-out cursor-default relative",
        hovered && "shadow-lg"
      )}
    >
      <div className="flex justify-between items-start">
        {/* Drag handle avec icône de main */}
        <div
          {...attributes}
          {...listeners}
          title="Déplacer la tâche"
          className="cursor-grab active:cursor-grabbing text-muted-foreground"
        >
          <Hand className="w-4 h-4" />
        </div>

        {/* Bouton pour ouvrir le dialog */}
        <button onClick={onExpand} className="ml-2 text-muted-foreground">
          <CornerUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Titre de la tâche */}
      <div className="mt-2 font-medium truncate">{task.title}</div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag, idx) => {
            const colors = [
              "bg-red-200 text-red-800",
              "bg-green-200 text-green-800",
              "bg-blue-200 text-blue-800",
              "bg-yellow-200 text-yellow-800",
              "bg-purple-200 text-purple-800",
              "bg-pink-200 text-pink-800",
              "bg-orange-200 text-orange-800",
            ]
            const color = colors[idx % colors.length]

            return (
              <span
                key={idx}
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}
              >
                {tag}
              </span>
            )
          })}
        </div>
      )}
    </Card>
  )
}
