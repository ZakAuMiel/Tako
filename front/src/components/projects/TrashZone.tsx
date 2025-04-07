// src/components/projects/TrashZone.tsx
import { useDroppable } from "@dnd-kit/core"
import { Trash2 } from "lucide-react"

export default function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" })

  return (
    <div
      ref={setNodeRef}
      className={`
        fixed left-0 bottom-0 w-full h-[10vh] z-50 
        flex items-end justify-center pointer-events-none
      `}
    >
      <div
        className={`
          pointer-events-none mb-4 px-6 py-3 rounded-xl border text-sm text-muted-foreground transition-all duration-200
          ${isOver ? "scale-100 opacity-100 bg-destructive text-white border-destructive" : "scale-90 opacity-0"}
        `}
      >
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          <span>Relâche ici pour supprimer</span>
        </div>
      </div>
    </div>
  )
}
