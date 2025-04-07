// src/components/projects/ProjectCard.tsx
import { useDraggable } from "@dnd-kit/core"
import { Card } from "@/components/ui/card"

export default function ProjectCard({ id, name }: { id: number; name: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id })

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        cursor-grab transition rounded-lg
        w-full max-w-sm h-28 p-4
        flex items-center justify-between
        ${isDragging ? "opacity-50 scale-95" : ""}
      `}
    >
      <span className="text-base font-medium truncate">{name}</span>
    </Card>
  )
}
