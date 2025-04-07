// src/components/projects/TrashZone.tsx
import { useDroppable } from "@dnd-kit/core"
import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" })
  const glowRef = useRef<HTMLDivElement>(null)

  // ✨ Rebond / glow quand on survole
  useEffect(() => {
    if (isOver && glowRef.current) {
      gsap.fromTo(
        glowRef.current,
        { scale: 0.9, boxShadow: "0 0 0px rgba(255,0,0,0.3)" },
        {
          scale: 1,
          boxShadow: "0 0 30px rgba(239,68,68,0.8)",
          duration: 0.3,
          ease: "power2.out",
        }
      )
    }
  }, [isOver])

  return (
    <div
      ref={setNodeRef}
      className="fixed left-0 bottom-0 w-full h-[10vh] z-50 flex items-end justify-center pointer-events-none"
    >
      <div
        ref={glowRef}
        className={`pointer-events-none mb-4 px-6 py-3 rounded-xl border text-sm text-muted-foreground transition-all duration-200
        ${isOver ? "bg-destructive text-white border-destructive scale-100" : "scale-90 opacity-0"}
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
