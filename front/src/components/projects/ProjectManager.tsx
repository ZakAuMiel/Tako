// Import des outils DnD Kit pour le drag & drop
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

// React & hooks
import { useState } from "react"

// UI components (dialog, input, bouton, etc.)
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

// Le composant ProjectCard
import ProjectCard from "./ProjectCard"

// Type pour un projet
type Project = {
  id: number
  name: string
}

export default function ProjectManager() {
  // Liste des projets
  const [projects, setProjects] = useState<Project[]>([])

  // Valeur temporaire lors de la création d’un projet
  const [projectName, setProjectName] = useState("")

  // Gère l’état du Dialog
  const [open, setOpen] = useState(false)

  // ID du projet en cours de drag
  const [activeId, setActiveId] = useState<number | null>(null)

  // Détection du drag à la souris (distance avant déclenchement)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  // Crée un nouveau projet
  const createProject = () => {
    if (!projectName.trim()) return
    setProjects(prev => [...prev, { id: Date.now(), name: projectName }])
    setProjectName("")
    setOpen(false)
  }

  // Supprime un projet selon son id
  const handleDelete = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  // Renomme un projet
  const handleRename = (id: number, newName: string) => {
    setProjects(prev => prev.map(p => (
      p.id === id ? { ...p, name: newName } : p
    )))
  }

  // Duplique un projet en générant un nouvel id
  const handleDuplicate = (id: number) => {
    const original = projects.find(p => p.id === id)
    if (original) {
      setProjects(prev => [
        ...prev,
        { id: Date.now(), name: `${original.name} (copie)` },
      ])
    }
  }

  // Au début du drag
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  // À la fin du drag → on trie les projets si la position a changé
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      setProjects(arrayMove(projects, oldIndex, newIndex))
    }
    setActiveId(null)
  }

  // Projet en cours de drag (pour l’overlay visuel)
  const activeProject = projects.find(p => p.id === activeId)

  return (
    <div className="space-y-4">
      {/* Formulaire de création d’un projet */}
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

      {/* Liste triable des projets */}
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
                onDelete={handleDelete}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        </SortableContext>

        {/* Carte flottante pendant le drag */}
        <DragOverlay>
          {activeProject ? (
            <Card className="p-4 w-full max-w-sm h-28 rounded-lg bg-muted text-foreground font-semibold shadow-lg flex items-center">
              {activeProject.name}
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
