import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { useState } from "react"
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
import { Plus } from "lucide-react"
import ProjectCard from "./ProjectCard"
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const createProject = () => {
    if (!projectName.trim()) return
    setProjects(prev => [...prev, { id: Date.now(), name: projectName }])
    setProjectName("")
    setOpen(false)
  }

  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over?.id)
      setProjects(arrayMove(projects, oldIndex, newIndex))
    }
    setActiveId(null)
  }

  const activeProject = projects.find(p => p.id === activeId)

  return (
    <div className="space-y-4">
      {/* Ajouter un projet */}
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

      {/* Grille & drag */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                id={p.id}
                name={p.name}
                onDelete={handleDelete}
                isOverlay={false}
              />
            ))}
          </div>
        </SortableContext>

        {/* Carte flottante en overlay */}
        <DragOverlay>
          {activeProject ? (
            <ProjectCard
              id={activeProject.id}
              name={activeProject.name}
              onDelete={() => {}}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
