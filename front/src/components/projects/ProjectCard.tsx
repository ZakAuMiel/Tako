import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type ProjectCardProps = {
  id: number
  name: string
  onDelete: (id: number) => void
  isOverlay?: boolean
}

export default function ProjectCard({ id, name, onDelete, isOverlay = false }: ProjectCardProps) {
  const [deleteMode, setDeleteMode] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleMouseEnter = () => {
    if (!isOverlay) {
      timeoutRef.current = setTimeout(() => setDeleteMode(true), 1000)
    }
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDeleteMode(false)
  }

  const cardClasses = `
    p-4 w-full h-28 max-w-sm rounded-lg shadow-md transition
    flex items-center justify-between
    ${deleteMode ? "border border-destructive animate-shake" : "border border-border"}
    ${isOverlay ? "bg-muted scale-105 shadow-2xl opacity-95 transition-transform duration-200 ease-in-out" : "bg-card"}

  `

  const content = (
    <Card
      ref={setNodeRef}
      {...(!isOverlay ? { ...attributes, ...listeners } : {})}
      style={!isOverlay ? style : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group ${cardClasses}`}
    >
      <span className="truncate font-medium">{name}</span>
      {deleteMode && !isOverlay && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(id)}
          className="ml-4 transition-all duration-300 ease-in-out transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      )}
    </Card>
  )

  return content
}
