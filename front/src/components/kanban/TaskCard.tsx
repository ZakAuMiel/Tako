import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GripHorizontal } from "lucide-react"
import { useState } from "react"

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
    data: {
      type: "task",
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative"
    >
      {/* Task content */}
      <Card
        onClick={()=> {
            // Appel de la fonction onExpand pour gérer l'expansion de la tâche  
          onExpand()
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "p-3 text-sm font-medium bg-card relative transition-transform duration-150 ease-in-out cursor-pointer",
          hovered && "shadow-md"
        )}
      >
        {/* Titre */}
        <div className="font-medium truncate">{task.title}</div>

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

      {/* Drag handle rond en bas */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10
        w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center text-white
        cursor-grab active:cursor-grabbing shadow-lg"
        title="Déplacer la tâche"
      >
        <GripHorizontal className="w-4 h-4" />
      </div>
    </div>
  )
}
