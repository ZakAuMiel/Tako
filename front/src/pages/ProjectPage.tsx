// src/pages/ProjectPage.tsx
import { useParams } from "react-router-dom"
import KanbanBoard from "@/components/kanban/KanbanBoard"

export default function ProjectPage() {
  const { id } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projet ID: {id}</h1>
      <KanbanBoard projectId={id!} />
    </div>
  )
}
