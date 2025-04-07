// src/components/projects/ProjectManager.tsx
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core"
import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ProjectCard from "./ProjectCard"
import TrashZone from "./TrashZone"
import { Plus } from "lucide-react"
import gsap from "gsap"
import { Card } from "@/components/ui/card"

type Project = {
  id: number
  name: string
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectName, setProjectName] = useState("")
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [showTrash, setShowTrash] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
        distance: 10, // pixels à déplacer avant d’activer le drag
        },
    })
    )

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
      })
    }
  }, [projects])

  const createProject = () => {
    if (!projectName.trim()) return
    setProjects([...projects, { id: Date.now(), name: projectName }])
    setProjectName("")
    setOpen(false)
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    setShowTrash(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
  const over = event.over
  setShowTrash(false)

  // ❌ NE supprime QUE si le drop est terminé dans la trash zone
  if (over && over.id === "trash" && activeId) {
    setProjects(prev => prev.filter(p => p.id !== activeId))
  }

  setActiveId(null)
}


  return (
    <div className="relative space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Nouveau projet
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nom du projet</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Ex: Portfolio VR"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={createProject}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px]"
          ref={containerRef}
        >
          {projects.map(project => (
            <ProjectCard key={project.id} id={project.id} name={project.name} />
          ))}
        </div>

        <DragOverlay>
         {activeId && (
         <Card className="p-4 w-full max-w-sm h-28 rounded-lg bg-muted text-foreground font-semibold shadow-lg flex items-center">
          {projects.find(p => p.id === activeId)?.name}
          </Card>
        )}
        </DragOverlay>


        {showTrash && <TrashZone />}
      </DndContext>
    </div>
  )
}
