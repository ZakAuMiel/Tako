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
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import ProjectCard from "./ProjectCard"
import { useNavigate } from "react-router-dom"

type Project = {
  id: number
  name: string
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectName, setProjectName] = useState("")
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [renamingId, setRenamingId] = useState<number | null>(null)

  const navigate = useNavigate()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
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

  const handleRename = (id: number, newName: string) => {
    setProjects(prev => prev.map(p => (
      p.id === id ? { ...p, name: newName } : p
    )))
    setRenamingId(null)
  }

  const handleDuplicate = (id: number) => {
    const original = projects.find(p => p.id === id)
    if (original) {
      setProjects(prev => [
        ...prev,
        { id: Date.now(), name: `${original.name} (copie)` },
      ])
    }
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      setProjects(arrayMove(projects, oldIndex, newIndex))
    }
    setActiveId(null)
  }

  const activeProject = projects.find(p => p.id === activeId)

  return (
    <div className="space-y-4">
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
            id="project-name"
            name="projectName"
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
        <SortableContext
          items={projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                id={p.id}
                name={p.name}
                isRenaming={renamingId === p.id}
                onStartRenaming={() => setRenamingId(p.id)}
                onRename={handleRename}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onClick={() => {
                  if (renamingId === null) navigate(`/project/${p.id}`)
                }}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeProject && (
            <Card className="p-4 w-full max-w-sm h-28 rounded-lg bg-muted text-foreground font-semibold shadow-lg flex items-center">
              {activeProject.name}
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
