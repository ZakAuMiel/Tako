
// src/components/projects/ProjectManager.tsx

import { useEffect, useState } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ProjectCard from "./ProjectCard"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api" // Import de notre instance Axios

// Type d’un projet
type Project = {
  id: number
  name: string
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]) // Liste des projets
  const [projectName, setProjectName] = useState("") // Nouveau nom lors de la création
  const [open, setOpen] = useState(false) // Contrôle d'ouverture du dialog de création
  const [activeId, setActiveId] = useState<number | null>(null) // ID du projet en train d'être déplacé
  const navigate = useNavigate() // Navigation vers la page d’un projet

  // Capteurs de drag & drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Récupération des projets depuis json-server
  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error("Erreur lors du chargement des projets:", err))
  }, [])

  // Crée un nouveau projet (et envoie à json-server)
  const createProject = async () => {
    if (!projectName.trim()) return
    const newProject = { name: projectName.trim() }

    const res = await api.post("/projects", newProject)
    setProjects(prev => [...prev, res.data])
    setProjectName("")
    setOpen(false)
  }

  // Supprime un projet
  const handleDelete = async (id: number) => {
    await api.delete(`/projects/${id}`)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  // Renomme un projet
  const handleRename = async (id: number, newName: string) => {
    const updated = { name: newName }
    await api.patch(`/projects/${id}`, updated)
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)))
  }

  // Duplique un projet
  const handleDuplicate = async (id: number) => {
    const original = projects.find(p => p.id === id)
    if (original) {
      const res = await api.post("/projects", { name: `${original.name} (copie)` })
      setProjects(prev => [...prev, res.data])
    }
  }

  // Drag Start
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  // Drag End
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      setProjects(arrayMove(projects, oldIndex, newIndex))
    }
    setActiveId(null)
  }

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
            placeholder="Ex: Portfolio VR"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            id="project-name"
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
                onDelete={handleDelete}
                onRename={handleRename}
                onDuplicate={handleDuplicate}
                onClick={() => navigate(`/project/${p.id}`)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
