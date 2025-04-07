import { useState } from "react"
import KanbanColumn from "./KanbanColumn"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type KanbanBoardProps = {
  projectId: string
}

type Task = {
  id: string
  title: string
  description: string
  tags: string[]
}

type Column = {
  id: string
  name: string
  tasks: Task[]
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", name: "À faire", tasks: [] },
    { id: "doing", name: "En cours", tasks: [] },
    { id: "done", name: "Terminé", tasks: [] },
  ])

  const addColumn = () => {
    const name = prompt("Nom de la nouvelle colonne ?")
    if (!name) return
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      name,
      tasks: [],
    }
    setColumns(prev => [...prev, newColumn])
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {columns.map(col => (
        <KanbanColumn key={col.id} column={col} />
      ))}
      <div className="min-w-[250px]">
        <Button onClick={addColumn} variant="outline" className="w-full h-full">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une colonne
        </Button>
      </div>
    </div>
  )
}
