// src/components/projects/ProjectCard.tsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ProjectCardProps = {
  id: number
  name: string
  onRename: (id: number, newName: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onDuplicate: (id: number) => Promise<void>
  onClick?: () => void | Promise<void>
}

export default function ProjectCard({
  id,
  name,
  onRename,
  onDelete,
  onDuplicate,
  onClick,
}: ProjectCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(name)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleRename = async () => {
    if (newName.trim() && newName !== name) {
      await onRename(id, newName.trim())
    }
    setRenameDialogOpen(false)
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      style={style}
      className="relative cursor-pointer hover:shadow-lg transition"
    >
      {/* Menu contextuel */} 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
            💬 Renommer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(id)}>
            📄 Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(id)}>
            🗑 Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Nom du projet */} 
      <span className="truncate font-medium">{name}</span>

      {/* Dialog de renommage */} 
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold mb-2">Renommer le projet</h2>
          <Input
            id={`rename-input-${id}`}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleRename()
            }}
          />
          <DialogFooter className="mt-4">
            <Button onClick={handleRename}>Renommer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
